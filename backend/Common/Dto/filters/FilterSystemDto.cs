using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterSystemDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("descriptions")]
        public IEnumerable<string> Descriptions { get; set; }

        [JsonProperty("suppliers")]
        public IEnumerable<string> Suppliers { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}