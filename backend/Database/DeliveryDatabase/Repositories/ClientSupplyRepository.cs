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
    public class ClientSupplyRepository : IDeliveryRepository<ClientSupplyDto, FilterClientSupplyDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public ClientSupplyRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(ClientSupplyDto clientSupplyDto)
        {
            ClientSupply clientSupply = _mapper.Map<ClientSupplyDto, ClientSupply>(clientSupplyDto);
            
            await _deliveryDbContext.ClientSupplies.AddAsync(clientSupply);
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

        public async Task<List<ClientSupplyDto>> GetAsync(FilterClientSupplyDto filters)
        {
            var clientSupplyList = await _deliveryDbContext.ClientSupplies
                .Include(s => s.Client)
                .Include(s => s.Supply)
                .ToListAsync();

            var clientSupplySequence = clientSupplyList
                .Where(x =>
                    // (filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Clients == null || filters.Clients.Contains(x.ClientId.ToString())) &&
                    (filters.Supplies == null || filters.Supplies.Contains(x.SupplyId.ToString())))
                .OrderBy(x => x.Id);

            return clientSupplySequence.Select(d => _mapper.Map<ClientSupply, ClientSupplyDto>(d)).ToList();
        } 
        
        public async Task<ClientSupplyDto> GetAsync(int id)
        {
            try
            {
                var clientSupply = await _deliveryDbContext.ClientSupplies.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No ClientSupply with such id {id}");
                return _mapper.Map<ClientSupply, ClientSupplyDto>(clientSupply);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a clientSupply with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, ClientSupplyDto clientSupplyDto)
        {
            try
            {
                var update = await _deliveryDbContext.ClientSupplies
                    .FirstOrDefaultAsync(x => x.Id == clientSupplyDto.Id)
                    ?? throw new DeliveryNotFoundException($"No ClientSupply with such id {clientSupplyDto.Id}");
                
                var clientSupply = _mapper.Map<ClientSupplyDto, ClientSupply>(clientSupplyDto);
                
                update.ClientId = clientSupply.ClientId;
                update.SupplyId = clientSupply.SupplyId;

                _deliveryDbContext.ClientSupplies.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a clientSupply with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.ClientSupplies
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No ClientSupply with such id {id}");
                
                _deliveryDbContext.ClientSupplies.Remove(remove);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a clientSupply with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}