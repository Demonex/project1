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
    public class ClientController : BaseController<ClientController>
    {
        private readonly IDeliveryRepository<ClientDto, FilterClientDto> _deliveryRepository;

        public ClientController(ILogger<ClientController> logger, IDeliveryRepository<ClientDto, FilterClientDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all clients from database
        /// </summary>
        /// <returns>clientList</returns>
        /// <response code="200">Returns information about all clients.</response>
        /// <response code="500">Internal error in getting clients. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetClientList([FromQuery] FilterClientDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<ClientDto> clientDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"clients were successfully received: {JsonConvert.SerializeObject(clientDtoList)}");
                
                response = Ok(clientDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of clients");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a client by {id} from database
        /// </summary>
        /// <returns>client</returns>
        /// <response code="200">Returns information about a client by {id}.</response>
        /// <response code="404">Client with such id wasn't found</response>
        /// <response code="500">Internal error in getting a client. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetClient(int id)
        {
            IActionResult response;
            try
            {
                var clientDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Client with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(clientDto)}");
                response = Ok(clientDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving client with id {id}" +
                                    $"No client in client with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving client with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single client
        /// </summary>
        /// <param name="clientDto">json object client from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about client creation.</response>
        /// <response code="500">Internal error in creating a client. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateClient([FromBody] ClientDto clientDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(clientDto);
                _logger.LogInformation($"Client was successfully created with id {clientDto.Id}");
                response = StatusCode(201, $"{clientDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new client");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Clients
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="clientDto">json object client from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Client with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted clients. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] ClientDto clientDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, clientDto);
                _logger.LogInformation($"Client with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating client with id {id}" +
                                    $"No client in client with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating client with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a client
        /// </summary>
        /// <param name="id">id of client which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Client with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted clients. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteClient(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Client with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting client with id {id}" +
                                    $"No client in client with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting client with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}