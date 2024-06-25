using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Models;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace DeliveryDatabase.Repositories
{
    public class DeviceRepository : IDeliveryRepository<DeviceDto, FilterDeviceDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public DeviceRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(DeviceDto deviceDto)
        {
            Device device = _mapper.Map<DeviceDto, Device>(deviceDto);
            device.IsActual = true;
            
            await _deliveryDbContext.Devices.AddAsync(device);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            string folderName = "Upload";
            string newPath = Path.Combine(Guid.NewGuid().ToString() +'_'+ folderName);

            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }            
            
            string sFileExtension = Path.GetExtension(file.FileName).ToLower();
            string fullPath = Path.Combine(newPath, file.FileName);

            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                ISheet sheet;
                if (sFileExtension == ".xls")
                {
                    HSSFWorkbook hssfwb = new HSSFWorkbook(stream); 
                    sheet = hssfwb.GetSheetAt(0); 
                }
                else
                {
                    XSSFWorkbook hssfwb = new XSSFWorkbook(stream); 
                    sheet = hssfwb.GetSheetAt(0); 
                }
                
                IRow headerRow = sheet.GetRow(0); 
                int cellCount = headerRow.LastCellNum;

                for (var i = sheet.FirstRowNum + 1; i <= sheet.LastRowNum; i++)
                {
                    try
                    {
                        IRow row = sheet.GetRow(i);
                    
                        Device device = new Device();

                        device.IsActual = true;
                        device.Name = row.GetCell(0).ToString();
                        device.OrderCode = row.GetCell(1).ToString();

                        if (row.Cells.Count == 5)
                        {
                            device.Comment = row.GetCell(2).ToString();
                            device.SupplyId = (int) row.Cells[3].NumericCellValue;
                            device.DeviceTypeId = (int) row.Cells[4].NumericCellValue;
                        }
                        else
                        {
                            device.Comment = "";
                            device.SupplyId = (int) row.Cells[2].NumericCellValue;
                            device.DeviceTypeId = (int) row.Cells[3].NumericCellValue;
                        }
                        
                        await _deliveryDbContext.Devices.AddAsync(device);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                }
            }
            
            await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<DeviceDto>> GetAsync(FilterDeviceDto filters)
        {
            var deviceList = await _deliveryDbContext.Devices
                .Include(s => s.Supply)
                .Include(s => s.DeviceType)
                .ToListAsync();

            var deviceSequence = deviceList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
                    (filters.Comments == null || filters.Comments.Any(str => x.Comment.ToLower().Contains(str.ToLower()))) &&
                    (filters.OrderCodes == null || filters.OrderCodes.Any(str => x.OrderCode.ToLower().Contains(str.ToLower()))) &&
                    (filters.Supplies == null || filters.Supplies.Contains(x.SupplyId.ToString())) &&
                    (filters.DeviceTypes == null || filters.DeviceTypes.Contains(x.DeviceTypeId.ToString())))
                .OrderBy(x => x.Id);
            
            return deviceSequence.Select(d => _mapper.Map<Device, DeviceDto>(d)).ToList();
        } 
        
        public async Task<DeviceDto> GetAsync(int id)
        {
            try
            {
                var device = await _deliveryDbContext.Devices.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Device with such id {id}");
                return _mapper.Map<Device, DeviceDto>(device);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a device with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, DeviceDto deviceDto)
        {
            try
            {
                var update = await _deliveryDbContext.Devices
                    .FirstOrDefaultAsync(x => x.Id == deviceDto.Id)
                    ?? throw new DeliveryNotFoundException($"No Device with such id {deviceDto.Id}");

                if (update.IsActual)
                {
                    var device = _mapper.Map<DeviceDto, Device>(deviceDto);
                
                    update.Name = device.Name;
                    update.Comment = device.Comment;
                    update.OrderCode = device.OrderCode;
                    update.SupplyId = device.SupplyId;
                    update.DeviceTypeId = device.DeviceTypeId;
                }
                else
                {
                    update.IsActual = true;
                }
                
                _deliveryDbContext.Devices.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a device with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Devices
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Device with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Devices.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Devices.Remove(remove);    
                }

                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a device with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            try
            {
                foreach (var id in ids)
                {
                    var remove = await _deliveryDbContext.Devices
                                     .FirstOrDefaultAsync(x => x.Id == id)
                                 ?? throw new DeliveryNotFoundException($"No Device with such id {id}");

                    if (remove.IsActual)
                    {
                        remove.IsActual = false;
                        _deliveryDbContext.Devices.Update(remove);
                    }
                    else
                    {
                        _deliveryDbContext.Devices.Remove(remove);    
                    }
                }

                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a device with such id... \n", e);
            }
        }
    }
}