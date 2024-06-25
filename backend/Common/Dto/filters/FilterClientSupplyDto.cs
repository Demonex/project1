using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterClientSupplyDto
    {
        [JsonProperty("clients")]
        public IEnumerable<string> Clients { get; set; }

        [JsonProperty("supplies")]
        public IEnumerable<string> Supplies { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}