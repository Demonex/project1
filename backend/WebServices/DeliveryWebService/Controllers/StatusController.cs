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
    public class StatusController : BaseController<StatusController>
    {
        private readonly IDeliveryRepository<StatusDto, FilterStatusDto> _deliveryRepository;

        public StatusController(ILogger<StatusController> logger, IDeliveryRepository<StatusDto, FilterStatusDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all statuses from database
        /// </summary>
        /// <returns>statusList</returns>
        /// <response code="200">Returns information about all statuses.</response>
        /// <response code="500">Internal error in getting statuses. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetStatusList([FromQuery] FilterStatusDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<StatusDto> statusDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"statuses were successfully received: {JsonConvert.SerializeObject(statusDtoList)}");
                
                response = Ok(statusDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of statuses");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a status by {id} from database
        /// </summary>
        /// <returns>status</returns>
        /// <response code="200">Returns information about a status by {id}.</response>
        /// <response code="404">Status with such id wasn't found</response>
        /// <response code="500">Internal error in getting a status. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetStatus(int id)
        {
            IActionResult response;
            try
            {
                var statusDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Status with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(statusDto)}");
                response = Ok(statusDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving status with id {id}" +
                                    $"No status in status with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving status with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single status
        /// </summary>
        /// <param name="statusDto">json object status from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about status creation.</response>
        /// <response code="500">Internal error in creating a status. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateStatus([FromBody] StatusDto statusDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(statusDto);
                _logger.LogInformation($"Status was successfully created with id {statusDto.Id}");
                response = StatusCode(201, $"{statusDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new status");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Statuses
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="statusDto">json object status from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Status with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted statuses. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusDto statusDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, statusDto);
                _logger.LogInformation($"Status with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating status with id {id}" +
                                    $"No status in status with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating status with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a status
        /// </summary>
        /// <param name="id">id of status which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Status with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted statuses. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Status with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting status with id {id}" +
                                    $"No status in status with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting status with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}