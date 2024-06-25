using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BaseController;
using DeliveryDatabase.Exceptions;
using DeliveryDatabase.Repositories;
using Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DeliveryWebService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChargeController : BaseController<ChargeController>
    {
        private readonly IDeliveryRepository<ControllerDto, FilterControllerDto> _deliveryRepository;

        public ChargeController(ILogger<ChargeController> logger,
            IDeliveryRepository<ControllerDto, FilterControllerDto> deliveryRepository)
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }

        /// <summary>
        /// Method to get all charges from database
        /// </summary>
        /// <returns>chargeList</returns>
        /// <response code="200">Returns information about all charges.</response>
        /// <response code="500">Internal error in getting charges. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetChargeList([FromQuery] FilterControllerDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<ControllerDto> chargeDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation(
                    $"charges were successfully received: {JsonConvert.SerializeObject(chargeDtoList)}");

                response = Ok(chargeDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of charges");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Method to get a charge by {id} from database
        /// </summary>
        /// <returns>charge</returns>
        /// <response code="200">Returns information about a charge by {id}.</response>
        /// <response code="404">Charge with such id wasn't found</response>
        /// <response code="500">Internal error in getting a charge. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCharge(int id)
        {
            IActionResult response;
            try
            {
                var chargeDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Charge with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(chargeDto)}");
                response = Ok(chargeDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving charge with id {id}" +
                                    $"No charge in charge with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving charge with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Create a single charge
        /// </summary>
        /// <param name="chargeDto">json object charge from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about charge creation.</response>
        /// <response code="500">Internal error in creating a charge. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCharge([FromBody] ControllerDto chargeDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(chargeDto);
                _logger.LogInformation($"Charge was successfully created with id {chargeDto.Id}");
                response = StatusCode(201, $"{chargeDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new charge");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }


        /// <summary>
        /// Update Charges
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="chargeDto">json object charge from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Charge with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted charges. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCharge(int id, [FromBody] ControllerDto chargeDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, chargeDto);
                _logger.LogInformation($"Charge with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating charge with id {id}" +
                                    $"No charge in charge with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating charge with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Delete a charge
        /// </summary>
        /// <param name="id">id of charge which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Charge with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted charges. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCharge(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Charge with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting charge with id {id}" +
                                    $"No charge in charge with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting charge with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}