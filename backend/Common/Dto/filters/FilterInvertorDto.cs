using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto
{
    public class FilterInvertorDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("watts")]
        public IEnumerable<string> Watts { get; set; }
        
        [JsonProperty("volts")]
        public IEnumerable<string> Volts { get; set; }

        [JsonProperty("prices")]
        public IEnumerable<string> Prices { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}