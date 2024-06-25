using AutoMapper;
using DeliveryDatabase.Models;
using Dto;

namespace DeliveryDbAutoMapper
{
    public class DeliveryDbAutoMapperProfile : Profile
    {
        public DeliveryDbAutoMapperProfile()
        {
            CreateMap<ClientDto, Client>();
            CreateMap<SupplierDto, Supplier>();
            CreateMap<ContractDto, Contract>();
            CreateMap<DeviceDto, Device>();
            CreateMap<DeviceTypeDto, DeviceType>();
            CreateMap<SupplyDto, Supply>();
            CreateMap<SystemDto, DeliveryDatabase.Models.System>();
            CreateMap<ClientSupplyDto, ClientSupply>();
            CreateMap<StatusDto, Status>();
            CreateMap<DevDto, Dev>();
            CreateMap<PanelDto, Panel>();
            CreateMap<BatteryDto, Battery>()
                .ForMember(dist => dist.Capacity, opt =>
                    opt.MapFrom(src => src.Cap));
            
            CreateMap<InvertorDto, Invertor>();
            CreateMap<ControllerDto, Controller>()
                .ForMember(dist => dist.Watt, opt =>
                    opt.MapFrom(src => src.Mwatt))
                .ForMember(dist => dist.Volt, opt =>
                    opt.MapFrom(src => src.Mvolt))
                .ForMember(dist => dist.Amper, opt =>
                    opt.MapFrom(src => src.Mamper))
                .ForMember(dist => dist.VoltMod, opt =>
                    opt.MapFrom(src => src.Voltmod));
            
            CreateMap<Client, ClientDto>();
            CreateMap<Supplier, SupplierDto>();
            CreateMap<Dev, DevDto>();
            CreateMap<Panel, PanelDto>();
            CreateMap<Battery, BatteryDto>()
                .ForMember(dist => dist.Cap, opt =>
                    opt.MapFrom(src => src.Capacity));
            
            CreateMap<Invertor, InvertorDto>();
            CreateMap<Controller, ControllerDto>()
                .ForMember(dist => dist.Mwatt, opt =>
                    opt.MapFrom(src => src.Watt))
                .ForMember(dist => dist.Mvolt, opt =>
                    opt.MapFrom(src => src.Volt))
                .ForMember(dist => dist.Mamper, opt =>
                    opt.MapFrom(src => src.Amper))
                .ForMember(dist => dist.Voltmod, opt =>
                    opt.MapFrom(src => src.VoltMod));

            CreateMap<Contract, ContractDto>()
                .ForMember(dist => dist.SystemName, opt => 
                    opt.MapFrom(src => src.System.Name));

            CreateMap<Device, DeviceDto>()
                .ForMember(dist => dist.SupplyName, opt =>
                    opt.MapFrom(src => src.Supply.Name))
                .ForMember(dist => dist.DeviceTypeName, opt =>
                    opt.MapFrom(src => src.DeviceType.Name));

            CreateMap<DeviceType, DeviceTypeDto>()
                .ForMember(dist => dist.SystemName, opt =>
                    opt.MapFrom(src => src.System.Name));

            CreateMap<Status, StatusDto>()
                .ForMember(dist => dist.DeviceName, opt =>
                    opt.MapFrom(src => src.Device.Name));

            CreateMap<Supply, SupplyDto>()
                .ForMember(dist => dist.ContractName, opt =>
                    opt.MapFrom(src => src.Contract.Name));

            CreateMap<DeliveryDatabase.Models.System, SystemDto>()
                .ForMember(dist => dist.SupplierName, opt =>
                    opt.MapFrom(src => src.Supplier.Name));

            CreateMap<ClientSupply, ClientSupplyDto>()
                .ForMember(dist => dist.ClientName, opt =>
                    opt.MapFrom(src => src.Client.Name))
                .ForMember(dist => dist.SupplyName, opt =>
                    opt.MapFrom(src => src.Supply.Name));
            
        }
    }
}