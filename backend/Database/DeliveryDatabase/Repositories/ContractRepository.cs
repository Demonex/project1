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
    public class ContractRepository : IDeliveryRepository<ContractDto, FilterContractDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public ContractRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(ContractDto contractDto)
        {
            Contract contract = _mapper.Map<ContractDto, Contract>(contractDto);
            contract.IsActual = true;
            
            await _deliveryDbContext.Contracts.AddAsync(contract);
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

        public async Task<List<ContractDto>> GetAsync(FilterContractDto filters)
        {
            var contractList = await _deliveryDbContext.Contracts
                .Include(s => s.System)
                .ToListAsync();

            var contractSequence = contractList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))) &&
                    (filters.StartDates == null || filters.StartDates.Contains(x.StartDate.ToString("dd.MM.yyyy"))) &&
                    (filters.EndDates == null || filters.EndDates.Contains(x.EndDate.ToString("dd.MM.yyyy"))) &&
                    (filters.Codes == null || filters.Codes.Any(str => x.Code.ToLower().Contains(str.ToLower()))) &&
                    (filters.Systems == null || filters.Systems.Contains(x.SystemId.ToString())))
                .OrderBy(x => x.Id);

            return contractSequence.Select(d => _mapper.Map<Contract, ContractDto>(d)).ToList();
        } 
        
        public async Task<ContractDto> GetAsync(int id)
        {
            try
            {
                var contract = await _deliveryDbContext.Contracts.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Contract with such id {id}");
                return _mapper.Map<Contract, ContractDto>(contract);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a contract with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, ContractDto contractDto)
        {
            try
            {
                var update = await _deliveryDbContext.Contracts
                    .FirstOrDefaultAsync(x => x.Id == contractDto.Id)
                    ?? throw new DeliveryNotFoundException($"No Contract with such id {contractDto.Id}");

                if (update.IsActual)
                {
                    var contract = _mapper.Map<ContractDto, Contract>(contractDto);
                
                    update.Name = contract.Name;
                    update.Code = contract.Code;
                    update.StartDate = contract.StartDate;
                    update.EndDate = contract.EndDate;
                    update.SystemId = contract.SystemId;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Contracts.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a contract with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Contracts
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Contract with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Contracts.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Contracts.Remove(remove);
                }
                
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a contract with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}