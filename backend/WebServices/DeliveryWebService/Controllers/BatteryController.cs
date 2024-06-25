using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BaseController;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Models;
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
    public class BatteryController : BaseController<BatteryController>
    {
        private readonly IDeliveryRepository<BatteryDto, FilterBatteryDto> _deliveryRepository;

        public BatteryController(ILogger<BatteryController> logger,
            IDeliveryRepository<BatteryDto, FilterBatteryDto> deliveryRepository)
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }

        /// <summary>
        /// Method to get all batteries from database
        /// </summary>
        /// <returns>batteryList</returns>
        /// <response code="200">Returns information about all batteries.</response>
        /// <response code="500">Internal error in getting batteries. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetBatteryList([FromQuery] FilterBatteryDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<BatteryDto> batteryDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation(
                    $"batteries were successfully received: {JsonConvert.SerializeObject(batteryDtoList)}");

                response = Ok(batteryDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of batteries");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Method to get a battery by {id} from database
        /// </summary>
        /// <returns>battery</returns>
        /// <response code="200">Returns information about a battery by {id}.</response>
        /// <response code="404">Battery with such id wasn't found</response>
        /// <response code="500">Internal error in getting a battery. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetBattery(int id)
        {
            IActionResult response;
            try
            {
                var batteryDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Battery with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(batteryDto)}");
                response = Ok(batteryDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving battery with id {id}" +
                                    $"No battery in battery with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving battery with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Create a single battery
        /// </summary>
        /// <param name="batteryDto">json object battery from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about battery creation.</response>
        /// <response code="500">Internal error in creating a battery. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateBattery([FromBody] BatteryDto batteryDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(batteryDto);
                _logger.LogInformation($"Battery was successfully created with id {batteryDto.Id}");
                response = StatusCode(201, $"{batteryDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new battery");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }


        /// <summary>
        /// Update Batteries
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="batteryDto">json object battery from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Battery with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted batteries. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateBattery(int id, [FromBody] BatteryDto batteryDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, batteryDto);
                _logger.LogInformation($"Battery with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating battery with id {id}" +
                                    $"No battery in battery with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating battery with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Delete a battery
        /// </summary>
        /// <param name="id">id of battery which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Battery with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted batteries. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteBattery(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Battery with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting battery with id {id}" +
                                    $"No battery in battery with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting battery with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}