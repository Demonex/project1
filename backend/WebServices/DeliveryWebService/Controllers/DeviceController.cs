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
    public class DeviceController : BaseController<DeviceController>
    {
        private readonly IDeliveryRepository<DeviceDto, FilterDeviceDto> _deliveryRepository;

        public DeviceController(ILogger<DeviceController> logger, IDeliveryRepository<DeviceDto, FilterDeviceDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all devices from database
        /// </summary>
        /// <returns>deviceList</returns>
        /// <response code="200">Returns information about all devices.</response>
        /// <response code="500">Internal error in getting devices. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDeviceList([FromQuery] FilterDeviceDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<DeviceDto> deviceDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"devices were successfully received: {JsonConvert.SerializeObject(deviceDtoList)}");
                
                response = Ok(deviceDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of devices");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a device by {id} from database
        /// </summary>
        /// <returns>device</returns>
        /// <response code="200">Returns information about a device by {id}.</response>
        /// <response code="404">Device with such id wasn't found</response>
        /// <response code="500">Internal error in getting a device. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDevice(int id)
        {
            IActionResult response;
            try
            {
                var deviceDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Device with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(deviceDto)}");
                response = Ok(deviceDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving device with id {id}" +
                                    $"No device in device with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving device with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single device
        /// </summary>
        /// <param name="deviceDto">json object device from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about device creation.</response>
        /// <response code="500">Internal error in creating a device. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateDevice([FromBody] DeviceDto deviceDto)
        {
            IActionResult response;
            
            try
            {
                await _deliveryRepository.CreateAsync(deviceDto);
                _logger.LogInformation($"Device was successfully created with id {deviceDto.Id}");
                response = StatusCode(201, $"{deviceDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new device");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }
        
        
        /// <summary>
        /// Create devices from the file
        /// </summary>
        /// <param name="file">.xlsx file with data from form</param>
        /// <returns></returns>
        /// <response code="201">Returns information about device creation.</response>
        /// <response code="500">Internal error in creating a device. Check logs.</response>
        [HttpPost("file")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UploadFile([FromForm(Name = "File")] IFormFile file)
        {
            IActionResult response;
            
            try
            {
                await _deliveryRepository.UploadFile(file);
                _logger.LogInformation($"Devices from file was successfully created");
                response = StatusCode(201);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new device");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Devices
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="deviceDto">json object device from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Device with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted devices. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateDevice(int id, [FromBody] DeviceDto deviceDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, deviceDto);
                _logger.LogInformation($"Device with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating device with id {id}" +
                                    $"No device in device with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating device with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a device
        /// </summary>
        /// <param name="id">id of device which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Device with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted devices. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Device with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting device with id {id}" +
                                    $"No device in device with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting device with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete devices specified in the list
        /// </summary>
        /// <param name="ids">list of id-s of devices which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Device with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted devices. Check logs.</response>
        [HttpDelete("deleteSome")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDevices([FromQuery] int[] ids)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteManyAsync(ids);
                _logger.LogInformation($"Devices were successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting device {e}" +
                                    $"No device in device with id");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting device");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}