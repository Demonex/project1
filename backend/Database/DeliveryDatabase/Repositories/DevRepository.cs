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
    public class DevRepository: IDeliveryRepository<DevDto, FilterDevDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public DevRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(DevDto devDto)
        {
            Dev dev = _mapper.Map<DevDto, Dev>(devDto);
            dev.IsActual = true;
            
            await _deliveryDbContext.Devs.AddAsync(dev);
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

        public async Task<List<DevDto>> GetAsync(FilterDevDto filters)
        {
            var devList = await _deliveryDbContext.Devs
                .ToListAsync();

            var devSequence = devList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) && 
                    (filters.StartTimes == null || filters.StartTimes.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.StartTime);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.StartTime);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.StartTimes.Any(str => x.StartTime.ToLower().Contains(str.ToLower()))) &&
                    
                    (filters.Durations == null || filters.Durations.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Duration);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Duration);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Durations.Any(str => x.Duration.ToLower().Contains(str.ToLower()))) && 
                    
                    (filters.Watts == null || filters.Watts.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Watt);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.Watt);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Watts.Any(str => x.Watt.ToLower().Contains(str.ToLower()))))
                .OrderBy(x => x.Id);

            return devSequence.Select(d => _mapper.Map<Dev, DevDto>(d)).ToList();
        } 
        
        public async Task<DevDto> GetAsync(int id)
        {
            try
            {
                var dev = await _deliveryDbContext.Devs.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Dev with such id {id}");
                return _mapper.Map<Dev, DevDto>(dev);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a dev with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, DevDto devDto)
        {
            try
            {
                var update = await _deliveryDbContext.Devs
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Dev with such id {id}");

                if (update.IsActual)
                {
                    var dev = _mapper.Map<DevDto, Dev>(devDto);
                
                    update.Name = dev.Name;
                    update.StartTime = dev.StartTime;
                    update.Duration = dev.Duration;
                    update.Watt = dev.Watt;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Devs.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a dev with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Devs
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Dev with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Devs.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Devs.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a dev with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}