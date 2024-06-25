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
    public class InvertorController : BaseController<InvertorController>
    {
        private readonly IDeliveryRepository<InvertorDto, FilterInvertorDto> _deliveryRepository;

        public InvertorController(ILogger<InvertorController> logger,
            IDeliveryRepository<InvertorDto, FilterInvertorDto> deliveryRepository)
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }

        /// <summary>
        /// Method to get all invertors from database
        /// </summary>
        /// <returns>invertorList</returns>
        /// <response code="200">Returns information about all invertors.</response>
        /// <response code="500">Internal error in getting invertors. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetInvertorList([FromQuery] FilterInvertorDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<InvertorDto> invertorDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation(
                    $"invertors were successfully received: {JsonConvert.SerializeObject(invertorDtoList)}");

                response = Ok(invertorDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of invertors");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Method to get a invertor by {id} from database
        /// </summary>
        /// <returns>invertor</returns>
        /// <response code="200">Returns information about a invertor by {id}.</response>
        /// <response code="404">Invertor with such id wasn't found</response>
        /// <response code="500">Internal error in getting a invertor. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetInvertor(int id)
        {
            IActionResult response;
            try
            {
                var invertorDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Invertor with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(invertorDto)}");
                response = Ok(invertorDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving invertor with id {id}" +
                                    $"No invertor in invertor with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving invertor with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Create a single invertor
        /// </summary>
        /// <param name="invertorDto">json object invertor from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about invertor creation.</response>
        /// <response code="500">Internal error in creating a invertor. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateInvertor([FromBody] InvertorDto invertorDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(invertorDto);
                _logger.LogInformation($"Invertor was successfully created with id {invertorDto.Id}");
                response = StatusCode(201, $"{invertorDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new invertor");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }


        /// <summary>
        /// Update Invertors
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="invertorDto">json object invertor from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Invertor with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted invertors. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateInvertor(int id, [FromBody] InvertorDto invertorDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, invertorDto);
                _logger.LogInformation($"Invertor with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating invertor with id {id}" +
                                    $"No invertor in invertor with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating invertor with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Delete a invertor
        /// </summary>
        /// <param name="id">id of invertor which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Invertor with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted invertors. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteInvertor(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Invertor with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting invertor with id {id}" +
                                    $"No invertor in invertor with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting invertor with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}