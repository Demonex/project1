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
    public class InvertorRepository: IDeliveryRepository<InvertorDto, FilterInvertorDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public InvertorRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(InvertorDto invertorDto)
        {
            Invertor invertor = _mapper.Map<InvertorDto, Invertor>(invertorDto);
            invertor.IsActual = true;
            
            await _deliveryDbContext.Invertors.AddAsync(invertor);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            // Invertorice invertorice = _mapper.Map<InvertoriceDto, Invertorice>(invertoriceDto);
            // invertorice.IsActual = true;
            //
            // await _deliveryDbContext.Invertorices.AddAsync(invertorice);
            // await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<InvertorDto>> GetAsync(FilterInvertorDto filters)
        {
            var invertorList = await _deliveryDbContext.Invertors
                .ToListAsync();

            var invertorSequence = invertorList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
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
                    }) || filters.Watts.Any(str => x.Watt.ToLower().Contains(str.ToLower()))) &&
                    
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

            return invertorSequence.Select(d => _mapper.Map<Invertor, InvertorDto>(d)).ToList();
        } 
        
        public async Task<InvertorDto> GetAsync(int id)
        {
            try
            {
                var invertor = await _deliveryDbContext.Invertors.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Invertor with such id {id}");
                return _mapper.Map<Invertor, InvertorDto>(invertor);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a invertor with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, InvertorDto invertorDto)
        {
            try
            {
                var update = await _deliveryDbContext.Invertors
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Invertor with such id {id}");

                if (update.IsActual)
                {
                    var invertor = _mapper.Map<InvertorDto, Invertor>(invertorDto);
                
                    update.Name = invertor.Name;
                    update.Volt = invertor.Volt;
                    update.Watt = invertor.Watt;
                    update.Price = invertor.Price;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Invertors.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a invertor with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Invertors
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Invertor with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Invertors.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Invertors.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a invertor with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}