using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BaseController
{
    public abstract class BaseController<T> : ControllerBase
    {
        protected readonly ILogger<T> _logger;

        protected BaseController(ILogger<T> logger)
        {
            _logger = logger;
        }
    }
}