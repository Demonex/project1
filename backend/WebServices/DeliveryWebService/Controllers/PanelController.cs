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
    public class PanelController : BaseController<PanelController>
    {
        private readonly IDeliveryRepository<PanelDto, FilterPanelDto> _deliveryRepository;

        public PanelController(ILogger<PanelController> logger,
            IDeliveryRepository<PanelDto, FilterPanelDto> deliveryRepository)
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }

        /// <summary>
        /// Method to get all panels from database
        /// </summary>
        /// <returns>panelList</returns>
        /// <response code="200">Returns information about all panels.</response>
        /// <response code="500">Internal error in getting panels. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPanelList([FromQuery] FilterPanelDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<PanelDto> panelDtoList = await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation(
                    $"panels were successfully received: {JsonConvert.SerializeObject(panelDtoList)}");

                response = Ok(panelDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of panels");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Method to get a panel by {id} from database
        /// </summary>
        /// <returns>panel</returns>
        /// <response code="200">Returns information about a panel by {id}.</response>
        /// <response code="404">Panel with such id wasn't found</response>
        /// <response code="500">Internal error in getting a panel. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPanel(int id)
        {
            IActionResult response;
            try
            {
                var panelDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Panel with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(panelDto)}");
                response = Ok(panelDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving panel with id {id}" +
                                    $"No panel in panel with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving panel with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Create a single panel
        /// </summary>
        /// <param name="panelDto">json object panel from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about panel creation.</response>
        /// <response code="500">Internal error in creating a panel. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreatePanel([FromBody] PanelDto panelDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(panelDto);
                _logger.LogInformation($"Panel was successfully created with id {panelDto.Id}");
                response = StatusCode(201, $"{panelDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new panel");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }


        /// <summary>
        /// Update Panels
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="panelDto">json object panel from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Panel with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted panels. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdatePanel(int id, [FromBody] PanelDto panelDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, panelDto);
                _logger.LogInformation($"Panel with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating panel with id {id}" +
                                    $"No panel in panel with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating panel with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }



        /// <summary>
        /// Delete a panel
        /// </summary>
        /// <param name="id">id of panel which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Panel with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted panels. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePanel(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Panel with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting panel with id {id}" +
                                    $"No panel in panel with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting panel with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}