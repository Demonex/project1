using System;
using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class Supply
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ContractId { get; set; }
        public bool IsActual { get; set; }
        public virtual Contract Contract { get; set; }
        public virtual ICollection<ClientSupply> ClientSupplies { get; set; }
        public virtual ICollection<Device> Devices { get; set; }
        
        public Supply()
        {
            ClientSupplies = new HashSet<ClientSupply>();
            Devices = new HashSet<Device>();
        }
    }
}