using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class ClientSupplyDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("clientId")]
        public int ClientId { get; set; }
        
        [JsonProperty("clientName")]
        public string ClientName { get; set; }
        
        [JsonProperty("supplyId")]
        public int SupplyId { get; set; }
        
        [JsonProperty("supplyName")]
        public string SupplyName { get; set; }
    }
}