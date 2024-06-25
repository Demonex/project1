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
    public class SupplierRepository : IDeliveryRepository<SupplierDto, FilterSupplierDto>
    {
        private readonly DeliveryDbContext _deliveryDbContext;
        private readonly IMapper _mapper;

        public SupplierRepository(DeliveryDbContext deliveryDbContext, IMapper mapper)
        {
            _deliveryDbContext = deliveryDbContext ?? throw new ArgumentNullException(nameof(deliveryDbContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }
        
        public async Task CreateAsync(SupplierDto supplierDto)
        {
            Supplier supplier = _mapper.Map<SupplierDto, Supplier>(supplierDto);
            supplier.IsActual = true;
            
            await _deliveryDbContext.Suppliers.AddAsync(supplier);
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

        public async Task<List<SupplierDto>> GetAsync(FilterSupplierDto filters)
        {
            var supplierList = await _deliveryDbContext.Suppliers
                .ToListAsync();

            var supplierSequence = supplierList
                .Where(x =>
                    (filters.State == null || filters.State == "2" || Convert.ToInt32(x.IsActual).ToString() == filters.State) &&
                    (filters.Names == null || filters.Names.Any(str => x.Name.ToLower().Contains(str.ToLower()))))
                .OrderBy(x => x.Id);

            return supplierSequence.Select(d => _mapper.Map<Supplier, SupplierDto>(d)).ToList();
        } 
        
        public async Task<SupplierDto> GetAsync(int id)
        {
            try
            {
                var supplier = await _deliveryDbContext.Suppliers.FirstOrDefaultAsync(x => x.Id == id)
                       ?? throw new DeliveryNotFoundException($"No Supplier with such id {id}");
                return _mapper.Map<Supplier, SupplierDto>(supplier);
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supplier with such id... \n", e);
            }
        }

        public async Task UpdateAsync(int id, SupplierDto supplierDto)
        {
            try
            {
                var update = await _deliveryDbContext.Suppliers
                    .FirstOrDefaultAsync(x => x.Id == supplierDto.Id)
                    ?? throw new DeliveryNotFoundException($"No Supplier with such id {supplierDto.Id}");

                if (update.IsActual)
                {
                    var supplier = _mapper.Map<SupplierDto, Supplier>(supplierDto);
                
                    update.Name = supplier.Name;
                }
                else
                {
                    update.IsActual = true;
                }

                _deliveryDbContext.Suppliers.Update(update);
                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supplier with such id... \n", e);
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var remove = await _deliveryDbContext.Suppliers
                    .FirstOrDefaultAsync(x => x.Id == id)
                    ?? throw new DeliveryNotFoundException($"No Supplier with such id {id}");

                if (remove.IsActual)
                {
                    remove.IsActual = false;
                    _deliveryDbContext.Suppliers.Update(remove);
                }
                else
                {
                    _deliveryDbContext.Suppliers.Remove(remove);    
                }

                await _deliveryDbContext.SaveChangesAsync();
            }
            catch (DeliveryNotFoundException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new DeliveryRepositoryException($"Unable to get a supplier with such id... \n", e);
            }
        }
        
        public async Task DeleteManyAsync(int[] ids)
        {
            
        }
    }
}