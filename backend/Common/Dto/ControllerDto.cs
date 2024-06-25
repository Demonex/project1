using Newtonsoft.Json;

namespace Dto
{
    public class ControllerDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("voltmod")]
        public string Voltmod { get; set; }
        
        [JsonProperty("mwatt")]
        public string Mwatt { get; set; }
        
        [JsonProperty("mvolt")]
        public string Mvolt { get; set; }

        [JsonProperty("mamper")]
        public string Mamper { get; set; }

        [JsonProperty("price")]
        public string Price { get; set; }
    }
}