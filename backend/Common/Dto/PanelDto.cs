using Newtonsoft.Json;

namespace Dto
{
    public class PanelDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("type")]
        public string Type { get; set; }
        
        [JsonProperty("watt")]
        public string Watt { get; set; }
        
        [JsonProperty("volt")]
        public string Volt { get; set; }
        
        [JsonProperty("voltoc")]
        public string Voltoc { get; set; }
        
        [JsonProperty("amper")]
        public string Amper { get; set; }
        
        [JsonProperty("eff")]
        public string Eff { get; set; }
        
        [JsonProperty("size")]
        public string Size { get; set; }
        
        [JsonProperty("price")]
        public string Price { get; set; }
    }
}