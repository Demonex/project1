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
    public class DevController : BaseController<DevController>
    {
        private readonly IDeliveryRepository<DevDto, FilterDevDto> _deliveryRepository;

        public DevController(ILogger<DevController> logger,
            IDeliveryRepository<DevDto, FilterDevDto> deliveryRepository)
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }

        /// <summary>
        /// Method to get all devs from database
        /// </summary>
        /// <returns>devList</returns>
        /// <response code="200">Returns information about all devs.</response>
        /// <response code="500">Internal error in getting devs. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDevList([FromQuery] FilterDevDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<DevDto> devDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation(
                    $"devs were successfully received: {JsonConvert.SerializeObject(devDtoList)}");

                response = Ok(devDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of devs");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Method to get a dev by {id} from database
        /// </summary>
        /// <returns>dev</returns>
        /// <response code="200">Returns information about a dev by {id}.</response>
        /// <response code="404">Dev with such id wasn't found</response>
        /// <response code="500">Internal error in getting a dev. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetDev(int id)
        {
            IActionResult response;
            try
            {
                var devDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Dev with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(devDto)}");
                response = Ok(devDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving dev with id {id}" +
                                    $"No dev in dev with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving dev with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Create a single dev
        /// </summary>
        /// <param name="devDto">json object dev from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about dev creation.</response>
        /// <response code="500">Internal error in creating a dev. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateDev([FromBody] DevDto devDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(devDto);
                _logger.LogInformation($"Dev was successfully created with id {devDto.Id}");
                response = StatusCode(201, $"{devDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new dev");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }


        /// <summary>
        /// Update Devs
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="devDto">json object dev from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Dev with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted devs. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateDev(int id, [FromBody] DevDto devDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, devDto);
                _logger.LogInformation($"Dev with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating dev with id {id}" +
                                    $"No dev in dev with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating dev with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Delete a dev
        /// </summary>
        /// <param name="id">id of dev which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Dev with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted devs. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteDev(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Dev with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting dev with id {id}" +
                                    $"No dev in dev with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting dev with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}