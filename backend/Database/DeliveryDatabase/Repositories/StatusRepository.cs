using System;
using System.Collections.Generic;
using System.Linq;
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
    public class StatusRepository : IDeliveryRepository<StatusDto, FilterStatusDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public StatusRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(StatusDto statusDto)
        {
            Status status = _mapper.Map<StatusDto, Status>(statusDto);
            status.IsActual = true;
            
            await _deliveryDbContext.Statuses.AddAsync(status);
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

        public async Task<List<StatusDto>> GetAsync(FilterStatusDto filters)
        {
            var statusList = await _deliveryDbContext.Statuses
                .Include(s => s.Device)
                .ToListAsync();

            var statusSequence = statusList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
                    (filters.Devices == null || filters.Devices.Contains(x.DeviceId.ToString())))
                .OrderBy(x => x.Id);

            return statusSequence.Select(d => _mapper.Map<Status, StatusDto>(d)).ToList();
        } 
        
        public async Task<StatusDto> GetAsync(int id)
        {
            try
            {
                var status = await _deliveryDbContext.Statuses.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Status with such id {id}");
                return _mapper.Map<Status, StatusDto>(status);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a status with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, StatusDto statusDto)
        {
            try
            {
                var update = await _deliveryDbContext.Statuses
                    .FirstOrDefaultAsync(x => x.Id == statusDto.Id)
                    ?? throw new DeliveryNotFoundException($"No Status with such id {statusDto.Id}");

                if (update.IsActual)
                {
                    var status = _mapper.Map<StatusDto, Status>(statusDto);
                
                    update.Name = status.Name;
                    update.DeviceId = status.DeviceId;
                }
                else
                {
                    update.IsActual = true;
                }
                
                _deliveryDbContext.Statuses.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a status with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Statuses
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Status with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Statuses.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Statuses.Remove(remove);    
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a status with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}