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
    public class SystemController : BaseController<SystemController>
    {
        private readonly IDeliveryRepository<SystemDto, FilterSystemDto> _deliveryRepository;

        public SystemController(ILogger<SystemController> logger, IDeliveryRepository<SystemDto, FilterSystemDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all systems from database
        /// </summary>
        /// <returns>systemList</returns>
        /// <response code="200">Returns information about all systems.</response>
        /// <response code="500">Internal error in getting systems. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSystemList([FromQuery] FilterSystemDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<SystemDto> systemDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"systems were successfully received: {JsonConvert.SerializeObject(systemDtoList)}");
                
                response = Ok(systemDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of systems");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a system by {id} from database
        /// </summary>
        /// <returns>system</returns>
        /// <response code="200">Returns information about a system by {id}.</response>
        /// <response code="404">System with such id wasn't found</response>
        /// <response code="500">Internal error in getting a system. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSystem(int id)
        {
            IActionResult response;
            try
            {
                var systemDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"System with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(systemDto)}");
                response = Ok(systemDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving system with id {id}" +
                                    $"No system in system with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving system with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single system
        /// </summary>
        /// <param name="systemDto">json object system from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about system creation.</response>
        /// <response code="500">Internal error in creating a system. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateSystem([FromBody] SystemDto systemDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(systemDto);
                _logger.LogInformation($"System was successfully created with id {systemDto.Id}");
                response = StatusCode(201, $"{systemDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new system");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Systems
        /// </summary>
        /// <param name="id">Integer number</param>
        /// <param name="systemDto">json object system from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">System with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted systems. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateSystem(int id, [FromBody] SystemDto systemDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, systemDto);
                _logger.LogInformation($"System with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating system with id {id}" +
                                    $"No system in system with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating system with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a system
        /// </summary>
        /// <param name="id">id of system which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">System with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted systems. Check logs.</response>
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
                _logger.LogInformation($"System with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting system with id {id}" +
                                    $"No system in system with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting system with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}