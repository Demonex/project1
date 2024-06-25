namespace DeliveryDatabase.Models
{
    public class ClientSupply
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public int SupplyId { get; set; }
        public virtual Client Client { get; set; }
        public virtual Supply Supply { get; set; }
    }
}