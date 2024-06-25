using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class System
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SupplierId { get; set; }
        public bool IsActual { get; set; }
        public virtual Supplier Supplier { get; set; }
        public virtual ICollection<Contract> Contracts { get; set; }
        public virtual ICollection<DeviceType> DeviceTypes { get; set; }

        public System()
        {
            Contracts = new HashSet<Contract>();
            DeviceTypes = new HashSet<DeviceType>();
        }
    }
}