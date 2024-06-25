using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DeliveryDatabase.Exceptions;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DeliveryDatabase.Repositories
{
    public class SystemRepository : IDeliveryRepository<SystemDto, FilterSystemDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public SystemRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(SystemDto systemDto)
        {
            Models.System system = _mapper.Map<SystemDto, Models.System>(systemDto);
            system.IsActual = true;
            
            await _deliveryDbContext.Systems.AddAsync(system);
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

        public async Task<List<SystemDto>> GetAsync(FilterSystemDto filters)
        {
            var systemList = await _deliveryDbContext.Systems
                .Include(s => s.Supplier)
                .ToListAsync();

            var systemSequence = systemList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
                    (filters.Descriptions == null || filters.Descriptions.Any(str => x.Description.ToLower().Contains(str.ToLower()))) &&
                    (filters.Suppliers == null || filters.Suppliers.Contains(x.SupplierId.ToString())))
                .OrderBy(x => x.Id);

            return systemSequence.Select(d => _mapper.Map<Models.System, SystemDto>(d)).ToList();
        }
        
        public async Task<SystemDto> GetAsync(int id)
        {
            try
            {
                var system = await _deliveryDbContext.Systems.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No System with such id {id}");
                return _mapper.Map<Models.System, SystemDto>(system);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a system with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, SystemDto systemDto)
        {
            try
            {
                var update = await _deliveryDbContext.Systems
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No System with such id {id}");

                if (update.IsActual)
                {
                    var system = _mapper.Map<SystemDto, Models.System>(systemDto);
                
                    update.Name = system.Name;
                    update.Description = system.Description;
                    update.SupplierId = system.SupplierId;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Systems.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a system with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Systems
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No System with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Systems.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Systems.Remove(remove);    
                }

                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a system with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}