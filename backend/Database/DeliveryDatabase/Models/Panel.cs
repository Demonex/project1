namespace DeliveryDatabase.Models
{
    public class Panel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Watt { get; set; }
        public string Volt { get; set; }
        public string Voltoc { get; set; }
        public string Amper { get; set; }
        public string Eff { get; set; }
        public string Size { get; set; }
        public string Price { get; set; }
        public bool IsActual { get; set; }
        
        public Panel()
        {
            
        }   
    }
}