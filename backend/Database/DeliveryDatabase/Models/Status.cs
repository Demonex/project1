namespace DeliveryDatabase.Models
{
    public class Status
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DeviceId { get; set; }
        public bool IsActual { get; set; }
        public virtual Device Device { get; set; }
    }
}