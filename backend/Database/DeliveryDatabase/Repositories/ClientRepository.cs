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
    public class ClientRepository : IDeliveryRepository<ClientDto, FilterClientDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public ClientRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(ClientDto clientDto)
        {
            Client client = _mapper.Map<ClientDto, Client>(clientDto);
            client.IsActual = true;
            
            await _deliveryDbContext.Clients.AddAsync(client);
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

        public async Task<List<ClientDto>> GetAsync(FilterClientDto filters)
        {
            var clientList = await _deliveryDbContext.Clients
                .ToListAsync();

            var clientSequence = clientList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))))
                .OrderBy(x => x.Id);

            return clientSequence.Select(d => _mapper.Map<Client, ClientDto>(d)).ToList();
        } 
        
        public async Task<ClientDto> GetAsync(int id)
        {
            try
            {
                var client = await _deliveryDbContext.Clients.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Client with such id {id}");
                return _mapper.Map<Client, ClientDto>(client);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a client with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, ClientDto clientDto)
        {
            try
            {
                var update = await _deliveryDbContext.Clients
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Client with such id {id}");

                if (update.IsActual)
                {
                    var client = _mapper.Map<ClientDto, Client>(clientDto);
                
                    update.Name = client.Name;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Clients.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a client with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Clients
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Client with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Clients.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Clients.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a client with such id... \n", e);
            }
        }

        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}