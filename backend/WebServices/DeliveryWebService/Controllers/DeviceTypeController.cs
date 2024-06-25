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
    public class DeviceTypeController : BaseController<DeviceTypeController>
    {
        private readonly IDeliveryRepository<DeviceTypeDto, FilterDeviceTypeDto> _deliveryRepository;

        public DeviceTypeController(ILogger<DeviceTypeController> logger, IDeliveryRepository<DeviceTypeDto, FilterDeviceTypeDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all deviceTypes from database
        /// </summary>
        /// <returns>deviceTypeList</returns>
        /// <response code="200">Returns information about all deviceTypes.</response>
        /// <response code="500">Internal error in getting deviceTypes. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDeviceTypeList([FromQuery] FilterDeviceTypeDto filters)
        {
            IActionResult response;
            try
            {
                ICollection<DeviceTypeDto> deviceTypeDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"deviceTypes were successfully received: {JsonConvert.SerializeObject(deviceTypeDtoList)}");
                
                response = Ok(deviceTypeDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of deviceTypes");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a deviceType by {id} from database
        /// </summary>
        /// <returns>deviceType</returns>
        /// <response code="200">Returns information about a deviceType by {id}.</response>
        /// <response code="404">DeviceType with such id wasn't found</response>
        /// <response code="500">Internal error in getting a deviceType. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDeviceType(int id)
        {
            IActionResult response;
            try
            {
                var deviceTypeDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"DeviceType with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(deviceTypeDto)}");
                response = Ok(deviceTypeDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving deviceType with id {id}" +
                                    $"No deviceType in deviceType with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving deviceType with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single deviceType
        /// </summary>
        /// <param name="deviceTypeDto">json object deviceType from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about deviceType creation.</response>
        /// <response code="500">Internal error in creating a deviceType. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateDeviceType([FromBody] DeviceTypeDto deviceTypeDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(deviceTypeDto);
                _logger.LogInformation($"DeviceType was successfully created with id {deviceTypeDto.Id}");
                response = StatusCode(201, $"{deviceTypeDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new deviceType");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update DeviceTypes
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="deviceTypeDto">json object deviceType from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">DeviceType with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted deviceTypes. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateDeviceType(int id, [FromBody] DeviceTypeDto deviceTypeDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, deviceTypeDto);
                _logger.LogInformation($"DeviceType with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating deviceType with id {id}" +
                                    $"No deviceType in deviceType with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating deviceType with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a deviceType
        /// </summary>
        /// <param name="id">id of deviceType which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">DeviceType with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted deviceTypes. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDeviceType(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"DeviceType with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting deviceType with id {id}" +
                                    $"No deviceType in deviceType with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting deviceType with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}