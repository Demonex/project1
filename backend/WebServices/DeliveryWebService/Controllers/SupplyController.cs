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
    public class SupplyController : BaseController<SupplyController>
    {
        private readonly IDeliveryRepository<SupplyDto, FilterSupplyDto> _deliveryRepository;

        public SupplyController(ILogger<SupplyController> logger, IDeliveryRepository<SupplyDto, FilterSupplyDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all supplies from database
        /// </summary>
        /// <returns>supplyList</returns>
        /// <response code="200">Returns information about all supplies.</response>
        /// <response code="500">Internal error in getting supplies. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSupplyList([FromQuery] FilterSupplyDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<SupplyDto> supplyDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"supplies were successfully received: {JsonConvert.SerializeObject(supplyDtoList)}");
                
                response = Ok(supplyDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of supplies");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a supply by {id} from database
        /// </summary>
        /// <returns>supply</returns>
        /// <response code="200">Returns information about a supply by {id}.</response>
        /// <response code="404">Supply with such id wasn't found</response>
        /// <response code="500">Internal error in getting a supply. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSystem(int id)
        {
            IActionResult response;
            try
            {
                var supplyDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Supply with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(supplyDto)}");
                response = Ok(supplyDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving supply with id {id}" +
                                    $"No supply in supply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving supply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single supply
        /// </summary>
        /// <param name="supplyDto">json object supply from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about supply creation.</response>
        /// <response code="500">Internal error in creating a supply. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateSystem([FromBody] SupplyDto supplyDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(supplyDto);
                _logger.LogInformation($"Supply was successfully created with id {supplyDto.Id}");
                response = StatusCode(201, $"{supplyDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new supply");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Supplies
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="supplyDto">json object supply from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Supply with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted supplies. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateSystem(int id, [FromBody] SupplyDto supplyDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, supplyDto);
                _logger.LogInformation($"Supply with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating supply with id {id}" +
                                    $"No supply in supply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating supply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a supply
        /// </summary>
        /// <param name="id">id of supply which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Supply with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted supplies. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteSystem(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Supply with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting supply with id {id}" +
                                    $"No supply in supply with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting supply with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}