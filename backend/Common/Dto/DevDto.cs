using Newtonsoft.Json;

namespace Dto
{
    public class DevDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("startTime")]
        public string StartTime { get; set; }
        
        [JsonProperty("duration")]
        public string Duration { get; set; }
        
        [JsonProperty("watt")]
        public string Watt { get; set; }
    }
    
    
}