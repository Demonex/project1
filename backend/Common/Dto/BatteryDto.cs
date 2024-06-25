using Newtonsoft.Json;

namespace Dto
{
    public class BatteryDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("volt")]
        public string Volt { get; set; }
        
        [JsonProperty("cap")]
        public string Cap { get; set; }
        
        [JsonProperty("bound")]
        public string Bound { get; set; }

        [JsonProperty("price")]
        public string Price { get; set; }
    }
}