namespace DeliveryDatabase.Models
{
    public class Invertor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Watt { get; set; }
        public string Volt { get; set; }
        public string Price { get; set; }
        public bool IsActual { get; set; }
        
        public Invertor()
        {
            
        }   
    }
}