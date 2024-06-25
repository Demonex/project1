using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterStatusDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("devices")]
        public IEnumerable<string> Devices { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}