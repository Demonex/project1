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
    public class ClientSupplyController : BaseController<ClientSupplyController>
    {
        private readonly IDeliveryRepository<ClientSupplyDto, FilterClientSupplyDto> _deliveryRepository;

        public ClientSupplyController(ILogger<ClientSupplyController> logger, IDeliveryRepository<ClientSupplyDto, FilterClientSupplyDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all clientSupplies from database
        /// </summary>
        /// <returns>clientSupplyList</returns>
        /// <response code="200">Returns information about all clientSupplies.</response>
        /// <response code="500">Internal error in getting clientSupplies. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetClientSupplyList([FromQuery] FilterClientSupplyDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<ClientSupplyDto> clientSupplyDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"clientSupplies were successfully received: {JsonConvert.SerializeObject(clientSupplyDtoList)}");
                
                response = Ok(clientSupplyDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of clientSupplies");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a clientSupply by {id} from database
        /// </summary>
        /// <returns>clientSupply</returns>
        /// <response code="200">Returns information about a clientSupply by {id}.</response>
        /// <response code="404">ClientSupply with such id wasn't found</response>
        /// <response code="500">Internal error in getting a clientSupply. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetClientSupply(int id)
        {
            IActionResult response;
            try
            {
                var clientSupplyDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"ClientSupply with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(clientSupplyDto)}");
                response = Ok(clientSupplyDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving clientSupply with id {id}" +
                                    $"No clientSupply in clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single clientSupply
        /// </summary>
        /// <param name="clientSupplyDto">json object clientSupply from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about clientSupply creation.</response>
        /// <response code="500">Internal error in creating a clientSupply. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateClientSupply([FromBody] ClientSupplyDto clientSupplyDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(clientSupplyDto);
                _logger.LogInformation($"ClientSupply was successfully created with id {clientSupplyDto.Id}");
                response = StatusCode(201, $"{clientSupplyDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new clientSupply");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update ClientSupplies
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="clientSupplyDto">json object clientSupply from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">ClientSupply with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted clientSupplies. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateClientSupply(int id, [FromBody] ClientSupplyDto clientSupplyDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, clientSupplyDto);
                _logger.LogInformation($"ClientSupply with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating clientSupply with id {id}" +
                                    $"No clientSupply in clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a clientSupply
        /// </summary>
        /// <param name="id">id of clientSupply which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">ClientSupply with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted clientSupplies. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteClientSupply(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"ClientSupply with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting clientSupply with id {id}" +
                                    $"No clientSupply in clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting clientSupply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}