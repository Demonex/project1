using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    public class FilterDevDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("startTimes")]
        public IEnumerable<string> StartTimes { get; set; }
        
        [JsonProperty("durations")]
        public IEnumerable<string> Durations { get; set; }
        
        [JsonProperty("watts")]
        public IEnumerable<string> Watts { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}