using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActual { get; set; }
        public virtual ICollection<System> Systems { get; set; }

        public Supplier()
        {
            Systems = new HashSet<System>();
        }   
    }
}