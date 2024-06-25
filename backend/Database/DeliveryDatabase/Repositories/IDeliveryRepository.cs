using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using DeliveryDatabase.Models;
using Microsoft.AspNetCore.Http;

namespace DeliveryDatabase.Repositories
{
    public interface IDeliveryRepository<T, S>
        where T : class
        where S : class
    {
    Task CreateAsync(T instance);
    Task UploadFile(IFormFile file);
    Task<List<T>> GetAsync(S _);
    Task<T> GetAsync(int id);
    Task UpdateAsync(int id, T instance);
    Task DeleteAsync(int id);
    Task DeleteManyAsync(int[] ids);
    }
}