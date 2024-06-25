using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterClientDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}