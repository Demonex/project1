using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class DeviceTypeDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("supplyCodeName")]
        public string SupplyCodeName { get; set; }
        
        [JsonProperty("systemId")]
        public int SystemId { get; set; }
        
        [JsonProperty("systemName")]
        public string SystemName { get; set; }
    }
}