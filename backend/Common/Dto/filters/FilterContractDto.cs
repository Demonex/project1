using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterContractDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("startDates")]
        public IEnumerable<string> StartDates { get; set; }
        
        [JsonProperty("endDates")]
        public IEnumerable<string> EndDates { get; set; }
        
        [JsonProperty("codes")]
        public IEnumerable<string> Codes { get; set; }
        
        [JsonProperty("systems")]
        public IEnumerable<string> Systems { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}