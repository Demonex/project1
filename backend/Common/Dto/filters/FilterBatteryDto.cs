using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto
{
    public class FilterBatteryDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("types")]
        public IEnumerable<string> Types { get; set; }
        
        [JsonProperty("volts")]
        public IEnumerable<string> Volts { get; set; }
        
        [JsonProperty("caps")]
        public IEnumerable<string> Caps { get; set; }
        
        [JsonProperty("bounds")]
        public IEnumerable<string> Bounds { get; set; }
        
        [JsonProperty("prices")]
        public IEnumerable<string> Prices { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}