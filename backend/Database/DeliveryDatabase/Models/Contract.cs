using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace DeliveryDatabase.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Code { get; set; }
        public int SystemId { get; set; } 
        public bool IsActual { get; set; }
        public virtual System System { get; set; }
        
        public virtual ICollection<Supply> Supplies { get; set; }

        public Contract()
        {
            Supplies = new HashSet<Supply>();
        }
    }
}