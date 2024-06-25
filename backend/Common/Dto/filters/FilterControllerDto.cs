using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto
{
    public class FilterControllerDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("types")]
        public IEnumerable<string> Types { get; set; }
        
        [JsonProperty("voltmods")]
        public IEnumerable<string> Voltmods { get; set; }

        [JsonProperty("prices")]
        public IEnumerable<string> Prices { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}