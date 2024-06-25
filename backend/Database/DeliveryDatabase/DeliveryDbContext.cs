using Microsoft.EntityFrameworkCore;
using DeliveryDatabase.Models;

namespace DeliveryDatabase
{
    public class DeliveryDbContext : DbContext
    {
        public DeliveryDbContext(DbContextOptions<DeliveryDbContext> options) : base(options) { }
        
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Models.System> Systems { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<Supply> Supplies { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<ClientSupply> ClientSupplies { get; set; }
        public DbSet<Dev> Devs { get; set; }
        public DbSet<Panel> Panels { get; set; }
        public DbSet<Battery> Batteries { get; set; }
        public DbSet<Invertor> Invertors { get; set; }
        public DbSet<Controller> Controllers { get; set; }


        public DeliveryDbContext()
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("delivery-db");

            // primary keys
            modelBuilder.Entity<Supplier>().HasKey(s => s.Id);
            modelBuilder.Entity<Models.System>().HasKey(s => s.Id);
            modelBuilder.Entity<Contract>().HasKey(c => c.Id);
            modelBuilder.Entity<DeviceType>().HasKey(d => d.Id);
            modelBuilder.Entity<Supply>().HasKey(s => s.Id);
            modelBuilder.Entity<Client>().HasKey(c => c.Id);
            modelBuilder.Entity<Device>().HasKey(d => d.Id);
            modelBuilder.Entity<Status>().HasKey(s => s.Id);
            modelBuilder.Entity<ClientSupply>().HasKey(cs => cs.Id);
            modelBuilder.Entity<Dev>().HasKey(d => d.Id);
            modelBuilder.Entity<Panel>().HasKey(p => p.Id);
            modelBuilder.Entity<Battery>().HasKey(p => p.Id);
            modelBuilder.Entity<Invertor>().HasKey(p => p.Id);
            modelBuilder.Entity<Controller>().HasKey(p => p.Id);

            
            //data types
            modelBuilder.Entity<Contract>()
                .Property(c => c.StartDate).HasColumnType("date");
            modelBuilder.Entity<Contract>()
                .Property(c => c.EndDate).HasColumnType("date");
            modelBuilder.Entity<Supply>()
                .Property(s => s.StartDate).HasColumnType("date");
            modelBuilder.Entity<Supply>()
                .Property(s => s.EndDate).HasColumnType("date");
            
            //relations
            modelBuilder.Entity<Supplier>()
                .HasMany(s => s.Systems)
                .WithOne(s => s.Supplier)
                .IsRequired();

            modelBuilder.Entity<Models.System>()
                .HasMany(s => s.Contracts)
                .WithOne(c => c.System)
                .IsRequired();

            modelBuilder.Entity<Models.System>()
                .HasMany(s => s.DeviceTypes)
                .WithOne(d => d.System)
                .IsRequired();

            modelBuilder.Entity<Contract>()
                .HasMany(c => c.Supplies)
                .WithOne(s => s.Contract)
                .IsRequired();

            modelBuilder.Entity<ClientSupply>()
                .HasOne(c => c.Client)
                .WithMany(cs => cs.ClientSupplies)
                .HasForeignKey(c => c.ClientId)
                .IsRequired();

            modelBuilder.Entity<ClientSupply>()
                .HasOne(c => c.Supply)
                .WithMany(cs => cs.ClientSupplies)
                .HasForeignKey(c => c.SupplyId)
                .IsRequired();
            
            modelBuilder.Entity<Supply>()
                .HasMany(s => s.Devices)
                .WithOne(d => d.Supply)
                .IsRequired();

            modelBuilder.Entity<DeviceType>()
                .HasMany(d => d.Devices)
                .WithOne(d => d.DeviceType)
                .IsRequired();

            modelBuilder.Entity<Device>()
                .HasMany(d => d.Statuses)
                .WithOne(s => s.Device)
                .IsRequired();
        }
    }
}