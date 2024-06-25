using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class StatusDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("deviceId")]
        public int DeviceId { get; set; }
        
        [JsonProperty("deviceName")]
        public string DeviceName { get; set; }
    }
}