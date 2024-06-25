using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto
{
    public class FilterPanelDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("types")]
        public IEnumerable<string> Types { get; set; }
        
        [JsonProperty("watts")]
        public IEnumerable<string> Watts { get; set; }

        [JsonProperty("prices")]
        public IEnumerable<string> Prices { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}