using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Models;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DeliveryDatabase.Repositories
{
    public class BatteryRepository: IDeliveryRepository<BatteryDto, FilterBatteryDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public BatteryRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(BatteryDto batteryDto)
        {
            Battery battery = _mapper.Map<BatteryDto, Battery>(batteryDto);
            battery.IsActual = true;
            
            await _deliveryDbContext.Batteries.AddAsync(battery);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            // Batteryice batteryice = _mapper.Map<BatteryiceDto, Batteryice>(batteryiceDto);
            // batteryice.IsActual = true;
            //
            // await _deliveryDbContext.Batteryices.AddAsync(batteryice);
            // await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<BatteryDto>> GetAsync(FilterBatteryDto filters)
        {
            var batteryList = await _deliveryDbContext.Batteries
                .ToListAsync();

            var batterySequence = batteryList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) && 
                    (filters.Types == null || filters.Types.Any(str => x.Type.ToLower().Contains(str.ToLower()))) && 
                    (filters.Caps == null || filters.Caps.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Capacity);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Capacity);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Caps.Any(str => x.Capacity.ToLower().Contains(str.ToLower()))) &&
                    
                    (filters.Volts == null || filters.Volts.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Volt);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Volt);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Volts.Any(str => x.Volt.ToLower().Contains(str.ToLower()))) &&
                    
                    (filters.Prices == null || filters.Prices.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Price);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Price);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Prices.Any(str => x.Price.ToLower().Contains(str.ToLower()))))
                .OrderBy(x => x.Id);

            return batterySequence.Select(d => _mapper.Map<Battery, BatteryDto>(d)).ToList();
        } 
        
        public async Task<BatteryDto> GetAsync(int id)
        {
            try
            {
                var battery = await _deliveryDbContext.Batteries.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Battery with such id {id}");
                return _mapper.Map<Battery, BatteryDto>(battery);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a battery with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, BatteryDto batteryDto)
        {
            try
            {
                var update = await _deliveryDbContext.Batteries
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Battery with such id {id}");

                if (update.IsActual)
                {
                    var battery = _mapper.Map<BatteryDto, Battery>(batteryDto);
                
                    update.Name = battery.Name;
                    update.Type = battery.Type;
                    update.Volt = battery.Volt;
                    update.Capacity = battery.Capacity;
                    update.Bound = battery.Bound;
                    update.Price = battery.Price;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Batteries.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a battery with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Batteries
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Battery with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Batteries.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Batteries.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a battery with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}