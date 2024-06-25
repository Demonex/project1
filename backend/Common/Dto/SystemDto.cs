using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class SystemDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("description")]
        public string Description { get; set; }
        
        [JsonProperty("supplierId")]
        public int SupplierId { get; set; }
        
        [JsonProperty("supplierName")]
        public string SupplierName { get; set; }
    }
}