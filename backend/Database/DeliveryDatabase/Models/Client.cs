using System.Collections;
using System.Collections.Generic;

namespace DeliveryDatabase.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActual { get; set; }
        
        public virtual ICollection<ClientSupply> ClientSupplies { get; set; }

        public Client()
        {
            ClientSupplies = new HashSet<ClientSupply>();
        }
    }
}