using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class SupplyRepository : IDeliveryRepository<SupplyDto, FilterSupplyDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public SupplyRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(SupplyDto supplyDto)
        {
            Supply supply = _mapper.Map<SupplyDto, Supply>(supplyDto);
            supply.IsActual = true;
            
            await _deliveryDbContext.Supplies.AddAsync(supply);
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

        public async Task<List<SupplyDto>> GetAsync(FilterSupplyDto filters)
        {
            var supplyList = await _deliveryDbContext.Supplies
                .Include(s => s.Contract)
                .ToListAsync();

            var supplySequence = supplyList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
                    (filters.StartDates == null || filters.StartDates.Contains(x.StartDate.ToString("dd.MM.yyyy"))) &&
                    (filters.EndDates == null || filters.EndDates.Contains(x.EndDate.ToString("dd.MM.yyyy"))) &&
                    (filters.Contracts == null || filters.Contracts.Contains(x.ContractId.ToString())))
                .OrderBy(x => x.Id);

            return supplySequence.Select(d => _mapper.Map<Supply, SupplyDto>(d)).ToList();
        } 
        
        public async Task<SupplyDto> GetAsync(int id)
        {
            try
            {
                var supply = await _deliveryDbContext.Supplies.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Supply with such id {id}");
                return _mapper.Map<Supply, SupplyDto>(supply);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supply with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, SupplyDto supplyDto)
        {
            try
            {
                var update = await _deliveryDbContext.Supplies
                    .FirstOrDefaultAsync(x => x.Id == supplyDto.Id)
                    ?? throw new DeliveryNotFoundException($"No Supply with such id {supplyDto.Id}");

                if (update.IsActual)
                {
                    var supply = _mapper.Map<SupplyDto, Supply>(supplyDto);
                
                    update.Name = supply.Name;
                    update.StartDate = supply.StartDate;
                    update.EndDate = supply.EndDate;
                    update.ContractId = supply.ContractId;    
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Supplies.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supply with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Supplies
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Supply with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Supplies.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Supplies.Remove(remove);    
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supply with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}