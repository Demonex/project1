using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class DeviceType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SupplyCodeName { get; set; }
        public int SystemId { get; set; }
        public bool IsActual { get; set; }
        public virtual System System { get; set; }
        
        public virtual ICollection<Device> Devices { get; set; }

        public DeviceType()
        {
            Devices = new HashSet<Device>();
        }
    }
}