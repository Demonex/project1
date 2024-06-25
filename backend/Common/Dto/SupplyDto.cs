using System;
using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class SupplyDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("startDate")]
        public DateTime StartDate { get; set; }
        
        [JsonProperty("endDate")]
        public DateTime EndDate { get; set; }
        
        [JsonProperty("contractId")]
        public int ContractId { get; set; }
        
        [JsonProperty("contractName")]
        public string ContractName { get; set; }
    }
}