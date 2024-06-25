using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class SupplierDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}