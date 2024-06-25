using Newtonsoft.Json;

namespace Dto
{
    [JsonObject]
    public class ClientDto
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}