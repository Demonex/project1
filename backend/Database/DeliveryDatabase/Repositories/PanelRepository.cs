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
    public class PanelRepository: IDeliveryRepository<PanelDto, FilterPanelDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public PanelRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(PanelDto panelDto)
        {
            Panel panel = _mapper.Map<PanelDto, Panel>(panelDto);
            panel.IsActual = true;
            
            await _deliveryDbContext.Panels.AddAsync(panel);
            await _deliveryDbContext.SaveChangesAsync();
        }
        
        public async Task UploadFile(IFormFile file)
        {
            // Panelice panelice = _mapper.Map<PaneliceDto, Panelice>(paneliceDto);
            // panelice.IsActual = true;
            //
            // await _deliveryDbContext.Panelices.AddAsync(panelice);
            // await _deliveryDbContext.SaveChangesAsync();
        }

        public async Task<List<PanelDto>> GetAsync(FilterPanelDto filters)
        {
            var panelList = await _deliveryDbContext.Panels
                .ToListAsync();

            var panelSequence = panelList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) && 
                    (filters.Types == null || filters.Types.Any(str => x.Type.ToLower().Contains(str.ToLower()))) && 
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

            return panelSequence.Select(d => _mapper.Map<Panel, PanelDto>(d)).ToList();
        } 
        
        public async Task<PanelDto> GetAsync(int id)
        {
            try
            {
                var panel = await _deliveryDbContext.Panels.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Panel with such id {id}");
                return _mapper.Map<Panel, PanelDto>(panel);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a panel with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, PanelDto panelDto)
        {
            try
            {
                var update = await _deliveryDbContext.Panels
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Panel with such id {id}");

                if (update.IsActual)
                {
                    var panel = _mapper.Map<PanelDto, Panel>(panelDto);
                
                    update.Name = panel.Name;
                    update.Type = panel.Type;
                    update.Volt = panel.Volt;
                    update.Watt = panel.Watt;
                    update.Voltoc = panel.Voltoc;
                    update.Amper = panel.Amper;
                    update.Eff = panel.Eff;
                    update.Size = panel.Size;
                    update.Price = panel.Price;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Panels.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a panel with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Panels
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Panel with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Panels.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Panels.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a panel with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}