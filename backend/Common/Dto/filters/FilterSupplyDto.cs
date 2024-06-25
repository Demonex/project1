using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterSupplyDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("startDates")]
        public IEnumerable<string> StartDates { get; set; }
        
        [JsonProperty("endDates")]
        public IEnumerable<string> EndDates { get; set; }

        [JsonProperty("contracts")]
        public IEnumerable<string> Contracts { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}