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
    public class ControllerRepository: IDeliveryRepository<ControllerDto, FilterControllerDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public ControllerRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(ControllerDto controllerDto)
        {
            Controller controller = _mapper.Map<ControllerDto, Controller>(controllerDto);
            controller.IsActual = true;
            
            await _deliveryDbContext.Controllers.AddAsync(controller);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            // Controllerice controllerice = _mapper.Map<ControllericeDto, Controllerice>(controllericeDto);
            // controllerice.IsActual = true;
            //
            // await _deliveryDbContext.Controllerices.AddAsync(controllerice);
            // await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<ControllerDto>> GetAsync(FilterControllerDto filters)
        {
            var controllerList = await _deliveryDbContext.Controllers
                .ToListAsync();

            var controllerSequence = controllerList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) && 
                    (filters.Types == null || filters.Types.Any(str => x.Type.ToLower().Contains(str.ToLower()))) && 
                    (filters.Voltmods == null || filters.Voltmods.Any(str =>
                    {
                        if (str[0] == '>')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.VoltMod);

                            return target >= num;
                        } else if (str[0] == '<')
                        {
                            float num = float.Parse(str[1..]);
                            float target = float.Parse(x.VoltMod);

                            return target <= num;
                        }
                        else
                        {
                            return false;
                        }
                    }) || filters.Voltmods.Any(str => x.VoltMod.ToLower().Contains(str.ToLower()))) &&
                    
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

            return controllerSequence.Select(d => _mapper.Map<Controller, ControllerDto>(d)).ToList();
        } 
        
        public async Task<ControllerDto> GetAsync(int id)
        {
            try
            {
                var controller = await _deliveryDbContext.Controllers.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Controller with such id {id}");
                return _mapper.Map<Controller, ControllerDto>(controller);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a controller with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, ControllerDto controllerDto)
        {
            try
            {
                var update = await _deliveryDbContext.Controllers
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Controller with such id {id}");

                if (update.IsActual)
                {
                    var controller = _mapper.Map<ControllerDto, Controller>(controllerDto);
                
                    update.Name = controller.Name;
                    update.Type = controller.Type;
                    update.Volt = controller.Volt;
                    update.Watt = controller.Watt;
                    update.VoltMod = controller.VoltMod;
                    update.Amper = controller.Amper;
                    update.Price = controller.Price;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Controllers.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a controller with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Controllers
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Controller with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Controllers.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Controllers.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a controller with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}