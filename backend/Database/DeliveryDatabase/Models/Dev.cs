namespace DeliveryDatabase.Models
{
    public class Dev
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string StartTime { get; set; }
        public string Duration { get; set; }
        public string Watt { get; set; }
        public bool IsActual { get; set; }
        
        public Dev()
        {
            
        }   
    }
}