using System;
using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class ContractDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("startDate")]
        public DateTime StartDate { get; set; }
        
        [JsonProperty("endDate")]
        public DateTime EndDate { get; set; }
        
        [JsonProperty("code")]
        public string Code { get; set; }
        
        [JsonProperty("systemId")]
        public int SystemId { get; set; }
        
        [JsonProperty("systemName")]
        public string SystemName { get; set; }
    }
}