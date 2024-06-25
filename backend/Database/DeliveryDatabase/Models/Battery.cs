namespace DeliveryDatabase.Models
{
    public class Battery
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Capacity { get; set; }
        public string Volt { get; set; }
        public string Bound { get; set; }
        public string Price { get; set; }
        public bool IsActual { get; set; }
        
        public Battery()
        {
            
        }   
    }
}