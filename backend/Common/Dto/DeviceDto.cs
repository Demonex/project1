using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class DeviceDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("orderCode")]
        public string OrderCode { get; set; }
        
        [JsonProperty("comment")]
        public string Comment { get; set; }
        
        [JsonProperty("supplyId")]
        public int SupplyId { get; set; }
        
        [JsonProperty("supplyName")]
        public string SupplyName { get; set; }
        
        [JsonProperty("deviceTypeId")]
        public int DeviceTypeId { get; set; }
        
        [JsonProperty("deviceTypeName")]
        public string DeviceTypeName { get; set; }
    }
}