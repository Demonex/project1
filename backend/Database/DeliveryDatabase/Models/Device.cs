using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class Device
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string OrderCode { get; set; }
        public string Comment { get; set; }
        public int SupplyId { get; set; }
        public int DeviceTypeId { get; set; }
        public bool IsActual { get; set; }
        public virtual Supply Supply { get; set; }
        public virtual DeviceType DeviceType { get; set; }
        
        public virtual ICollection<Status> Statuses { get; set; }

        public Device()
        {
            Statuses = new HashSet<Status>();
        }
    }
}