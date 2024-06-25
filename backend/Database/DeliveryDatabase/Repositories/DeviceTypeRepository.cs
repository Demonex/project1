using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Models;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DeliveryDatabase.Repositories
{
    public class DeviceTypeRepository : IDeliveryRepository<DeviceTypeDto, FilterDeviceTypeDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public DeviceTypeRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(DeviceTypeDto deviceTypeDto)
        {
            DeviceType deviceType = _mapper.Map<DeviceTypeDto, DeviceType>(deviceTypeDto);
            deviceType.IsActual = true;
            
            await _deliveryDbContext.DeviceTypes.AddAsync(deviceType);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            // Device device = _mapper.Map<DeviceDto, Device>(deviceDto);
            // device.IsActual = true;
            //
            // await _deliveryDbContext.Devices.AddAsync(device);
            // await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<DeviceTypeDto>> GetAsync(FilterDeviceTypeDto filters)
        {
            var deviceTypeList = await _deliveryDbContext.DeviceTypes
                .Include(s => s.System)
                .ToListAsync();

            var deviceTypeSequence = deviceTypeList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.SupplyCodeNames == null || filters.SupplyCodeNames.Any(str => x.SupplyCodeName.ToLower().Contains(str.ToLower()))) &&
                    (filters.Systems == null || filters.Systems.Contains(x.SystemId.ToString())) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))))
                .OrderBy(x => x.Id);

            return deviceTypeSequence.Select(d => _mapper.Map<DeviceType, DeviceTypeDto>(d)).ToList();
        } 
        
        public async Task<DeviceTypeDto> GetAsync(int id)
        {
            try
            {
                var deviceType = await _deliveryDbContext.DeviceTypes.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No DeviceType with such id {id}");
                return _mapper.Map<DeviceType, DeviceTypeDto>(deviceType);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a deviceType with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, DeviceTypeDto deviceTypeDto)
        {
            try
            {
                var update = await _deliveryDbContext.DeviceTypes
                                 .FirstOrDefaultAsync(x => x.Id == deviceTypeDto.Id)
                             ?? throw new DeliveryNotFoundException($"No DeviceType with such id {deviceTypeDto.Id}");
                
                if (update.IsActual)
                {
                    var deviceType = _mapper.Map<DeviceTypeDto, DeviceType>(deviceTypeDto);
                    
                    update.Name = deviceType.Name;
                    update.SupplyCodeName = deviceType.SupplyCodeName;
                    update.SystemId = deviceType.SystemId;
                }
                else
                {
                    update.IsActual = true;
                }
                
                _deliveryDbContext.DeviceTypes.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
 
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a deviceType with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.DeviceTypes
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No DeviceType with such id {id}");
                
                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.DeviceTypes.Update(remove);
                }
                else
                {
                    _deliveryDbContext.DeviceTypes.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a deviceType with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}