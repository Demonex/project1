using System;

namespace DeliveryDatabase.Exceptions
{
    public class DeliveryRepositoryException : Exception
    {
        public DeliveryRepositoryException()
            : base()
        {
        }

        public DeliveryRepositoryException(string message) 
            : base(message)
        {
        }

        public DeliveryRepositoryException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
    }
}