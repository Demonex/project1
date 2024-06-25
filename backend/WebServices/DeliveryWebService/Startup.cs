using DeliveryDatabase;
using DeliveryDatabase.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using DeliveryDbAutoMapper;
using Dto;
using Dto.filters;
using Microsoft.AspNetCore.Http;

namespace DeliveryWebService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            
            services.AddMvc();
            
            services.AddAutoMapper(c => c.AddProfile<DeliveryDbAutoMapperProfile>(), typeof(Startup));
            
            var connectionString = Configuration.GetConnectionString("DeliveryDb");
            services.AddDbContext<DeliveryDbContext>(options =>
                options.UseNpgsql(connectionString, x => x
                    .MigrationsAssembly("DeliveryWebService")));
            
            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            services.AddControllers();
            
            services.AddTransient<IDeliveryRepository<ClientDto, FilterClientDto>, ClientRepository>();
            services.AddTransient<IDeliveryRepository<ContractDto, FilterContractDto>, ContractRepository>();
            services.AddTransient<IDeliveryRepository<DeviceDto, FilterDeviceDto>, DeviceRepository>();
            services.AddTransient<IDeliveryRepository<DeviceTypeDto, FilterDeviceTypeDto>, DeviceTypeRepository>();
            services.AddTransient<IDeliveryRepository<StatusDto, FilterStatusDto>, StatusRepository>();
            services.AddTransient<IDeliveryRepository<SupplierDto, FilterSupplierDto>, SupplierRepository>();
            services.AddTransient<IDeliveryRepository<SupplyDto, FilterSupplyDto>, SupplyRepository>();
            services.AddTransient<IDeliveryRepository<SystemDto, FilterSystemDto>, SystemRepository>();
            services.AddTransient<IDeliveryRepository<ClientSupplyDto, FilterClientSupplyDto>, ClientSupplyRepository>();
            services.AddTransient<IDeliveryRepository<DevDto, FilterDevDto>, DevRepository>();
            services.AddTransient<IDeliveryRepository<PanelDto, FilterPanelDto>, PanelRepository>();
            services.AddTransient<IDeliveryRepository<InvertorDto, FilterInvertorDto>, InvertorRepository>();
            services.AddTransient<IDeliveryRepository<BatteryDto, FilterBatteryDto>, BatteryRepository>();
            services.AddTransient<IDeliveryRepository<ControllerDto, FilterControllerDto>, ControllerRepository>();
            
            services.AddSwaggerGen(c =>
            {                
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "DeliveryDatabase", Version = "v1"});
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            UpdateDatabase(app);
            
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                });
            }

            app.UseCors("CorsPolicy");
            
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

        private static void UpdateDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DeliveryDbContext>())
                {
                    context?.Database.Migrate();
                }
            }
        }
    }
}