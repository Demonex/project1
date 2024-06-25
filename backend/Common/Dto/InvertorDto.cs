using Newtonsoft.Json;

namespace Dto
{
    public class InvertorDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("watt")]
        public string Watt { get; set; }
        
        [JsonProperty("volt")]
        public string Volt { get; set; }
        
        [JsonProperty("price")]
        public string Price { get; set; }
    }
}