namespace DeliveryDatabase.Models
{
    public class Controller
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Watt { get; set; }
        public string Volt { get; set; }
        public string VoltMod { get; set; }
        public string Amper { get; set; }
        public string Price { get; set; }
        public bool IsActual { get; set; }
        
        public Controller()
        {
            
        }   
    }
}