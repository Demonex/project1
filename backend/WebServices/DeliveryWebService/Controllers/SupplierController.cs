using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BaseController;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Repositories;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DeliveryWebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : BaseController<SupplierController>
    {
        private readonly IDeliveryRepository<SupplierDto, FilterSupplierDto> _deliveryRepository;

        public SupplierController(ILogger<SupplierController> logger, IDeliveryRepository<SupplierDto, FilterSupplierDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all suppliers from database
        /// </summary>
        /// <returns>supplierList</returns>
        /// <response code="200">Returns information about all suppliers.</response>
        /// <response code="500">Internal error in getting suppliers. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSupplierList([FromQuery] FilterSupplierDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<SupplierDto> supplierDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"suppliers were successfully received: {JsonConvert.SerializeObject(supplierDtoList)}");
                
                response = Ok(supplierDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of suppliers");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a supplier by {id} from database
        /// </summary>
        /// <returns>supplier</returns>
        /// <response code="200">Returns information about a supplier by {id}.</response>
        /// <response code="404">Supplier with such id wasn't found</response>
        /// <response code="500">Internal error in getting a supplier. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSupplier(int id)
        {
            IActionResult response;
            try
            {
                var supplierDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Supplier with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(supplierDto)}");
                response = Ok(supplierDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving supplier with id {id}" +
                                    $"No supplier in supplier with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving supplier with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single supplier
        /// </summary>
        /// <param name="supplierDto">json object supplier from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about supplier creation.</response>
        /// <response code="500">Internal error in creating a supplier. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateSupplier([FromBody] SupplierDto supplierDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(supplierDto);
                _logger.LogInformation($"Supplier was successfully created with id {supplierDto.Id}");
                response = StatusCode(201, $"{supplierDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new supplier");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Suppliers
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="supplierDto">json object supplier from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Supplier with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted suppliers. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateSupplier(int id, [FromBody] SupplierDto supplierDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, supplierDto);
                _logger.LogInformation($"Supplier with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating supplier with id {id}" +
                                    $"No supplier in supplier with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating supplier with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a supplier
        /// </summary>
        /// <param name="id">id of supplier which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Supplier with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted suppliers. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Supplier with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting supplier with id {id}" +
                                    $"No supplier in supplier with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting supplier with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}