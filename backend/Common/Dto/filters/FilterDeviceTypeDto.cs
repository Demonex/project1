using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterDeviceTypeDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("supplyCodeNames")]
        public IEnumerable<string> SupplyCodeNames { get; set; }

        [JsonProperty("systems")]
        public IEnumerable<string> Systems { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}