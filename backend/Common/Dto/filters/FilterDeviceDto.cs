using System.Collections.Generic;
using Newtonsoft.Json;

namespace Dto.filters
{
    [JsonObject]
    public class FilterDeviceDto
    {
        [JsonProperty("names")]
        public IEnumerable<string> Names { get; set; }
        
        [JsonProperty("orderCodes")]
        public IEnumerable<string> OrderCodes { get; set; }
        
        [JsonProperty("comments")]
        public IEnumerable<string> Comments { get; set; }
        
        [JsonProperty("supplies")]
        public IEnumerable<string> Supplies { get; set; }

        [JsonProperty("deviceTypes")]
        public IEnumerable<string> DeviceTypes { get; set; }
        
        [JsonProperty("state")]
        public string State { get; set; }
    }
}