using System;

namespace DeliveryDatabase.Exceptions
{
    public class DeliveryNotFoundException : Exception
    {
        public DeliveryNotFoundException()
            : base()
        {
        }

        public DeliveryNotFoundException(string message) 
            : base(message)
        {
        }

        public DeliveryNotFoundException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }
}