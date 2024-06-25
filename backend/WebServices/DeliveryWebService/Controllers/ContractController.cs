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
    public class ContractController : BaseController<ContractController>
    {
        private readonly IDeliveryRepository<ContractDto, FilterContractDto> _deliveryRepository;

        public ContractController(ILogger<ContractController> logger, IDeliveryRepository<ContractDto, FilterContractDto> deliveryRepository) 
            : base(logger)
        {
            _deliveryRepository = deliveryRepository ?? throw new ArgumentNullException(nameof(deliveryRepository));
        }
        
        /// <summary>
        /// Method to get all contracts from database
        /// </summary>
        /// <returns>contractList</returns>
        /// <response code="200">Returns information about all contracts.</response>
        /// <response code="500">Internal error in getting contracts. Check logs.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetContractList([FromQuery] FilterContractDto filters = null)
        {
            IActionResult response;
            try
            {
                ICollection<ContractDto> contractDtoList =  await _deliveryRepository.GetAsync(filters);
                _logger.LogInformation($"contracts were successfully received: {JsonConvert.SerializeObject(contractDtoList)}");
                
                response = Ok(contractDtoList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving list of contracts");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Method to get a contract by {id} from database
        /// </summary>
        /// <returns>contract</returns>
        /// <response code="200">Returns information about a contract by {id}.</response>
        /// <response code="404">Contract with such id wasn't found</response>
        /// <response code="500">Internal error in getting a contract. Check logs.</response>
        [HttpGet("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetContract(int id)
        {
            IActionResult response;
            try
            {
                var contractDto = await _deliveryRepository.GetAsync(id);
                _logger.LogInformation($"Contract with id {id} was successfully received: " +
                                       $"{JsonConvert.SerializeObject(contractDto)}");
                response = Ok(contractDto);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in receiving contract with id {id}" +
                                    $"No contract in contract with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in receiving contract with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        

        
        /// <summary>
        /// Create a single contract
        /// </summary>
        /// <param name="contractDto">json object contract from body</param>
        /// <returns></returns>
        /// <response code="201">Returns information about contract creation.</response>
        /// <response code="500">Internal error in creating a contract. Check logs.</response>
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateContract([FromBody] ContractDto contractDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.CreateAsync(contractDto);
                _logger.LogInformation($"Contract was successfully created with id {contractDto.Id}");
                response = StatusCode(201, $"{contractDto.Id}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in creating a new contract");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }
        
            return response;
        }


        /// <summary>
        /// Update Contracts
        /// </summary>
        /// <param name="id">integer number</param>
        /// <param name="contractDto">json object contract from body</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Contract with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted contracts. Check logs.</response>
        [HttpPut("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateContract(int id, [FromBody] ContractDto contractDto)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.UpdateAsync(id, contractDto);
                _logger.LogInformation($"Contract with id {id} was successfully updated");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in updating contract with id {id}" +
                                    $"No contract in contract with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in updating contract with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
        
        
        
        /// <summary>
        /// Delete a contract
        /// </summary>
        /// <param name="id">id of contract which should be deleted</param>
        /// <response code="204">Returns No content in success case.</response>
        /// <response code="404">Contract with such id wasn't found</response>
        /// <response code="500">Internal error in getting wanted contracts. Check logs.</response>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteContract(int id)
        {
            IActionResult response;
            try
            {
                await _deliveryRepository.DeleteAsync(id);
                _logger.LogInformation($"Contract with id {id} was successfully deleted");
                response = StatusCode(StatusCodes.Status204NoContent);
            }
            catch (DeliveryNotFoundException e)
            {
                _logger.LogError(e, $"Error has occured in deleting contract with id {id}" +
                                    $"No contract in contract with id {id}");
                response = StatusCode(StatusCodes.Status404NotFound);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error has occured in deleting contract with id {id}");
                response = StatusCode(StatusCodes.Status500InternalServerError);
            }

            return response;
        }
    }
}