using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DeliveryWebService.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "delivery-db");

            migrationBuilder.CreateTable(
                name: "Clients",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Systems",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SupplierId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Systems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Systems_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalSchema: "delivery-db",
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contracts",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false),
                    EndDate = table.Column<DateTime>(type: "date", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: true),
                    SystemId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Systems_SystemId",
                        column: x => x.SystemId,
                        principalSchema: "delivery-db",
                        principalTable: "Systems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeviceTypes",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    SupplyCodeName = table.Column<string>(type: "text", nullable: true),
                    SystemId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceTypes_Systems_SystemId",
                        column: x => x.SystemId,
                        principalSchema: "delivery-db",
                        principalTable: "Systems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplies",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Year = table.Column<DateTime>(type: "date", nullable: false),
                    ContractId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Supplies_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalSchema: "delivery-db",
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientSupply",
                schema: "delivery-db",
                columns: table => new
                {
                    ClientsId = table.Column<int>(type: "integer", nullable: false),
                    SuppliesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientSupply", x => new { x.ClientsId, x.SuppliesId });
                    table.ForeignKey(
                        name: "FK_ClientSupply_Clients_ClientsId",
                        column: x => x.ClientsId,
                        principalSchema: "delivery-db",
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientSupply_Supplies_SuppliesId",
                        column: x => x.SuppliesId,
                        principalSchema: "delivery-db",
                        principalTable: "Supplies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Devices",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    OrderCode = table.Column<string>(type: "text", nullable: true),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    SupplyId = table.Column<int>(type: "integer", nullable: false),
                    DeviceTypeId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Devices_DeviceTypes_DeviceTypeId",
                        column: x => x.DeviceTypeId,
                        principalSchema: "delivery-db",
                        principalTable: "DeviceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Devices_Supplies_SupplyId",
                        column: x => x.SupplyId,
                        principalSchema: "delivery-db",
                        principalTable: "Supplies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Statuses",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    DeviceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Statuses_Devices_DeviceId",
                        column: x => x.DeviceId,
                        principalSchema: "delivery-db",
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientSupply_SuppliesId",
                schema: "delivery-db",
                table: "ClientSupply",
                column: "SuppliesId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_SystemId",
                schema: "delivery-db",
                table: "Contracts",
                column: "SystemId");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_DeviceTypeId",
                schema: "delivery-db",
                table: "Devices",
                column: "DeviceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_SupplyId",
                schema: "delivery-db",
                table: "Devices",
                column: "SupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceTypes_SystemId",
                schema: "delivery-db",
                table: "DeviceTypes",
                column: "SystemId");

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_DeviceId",
                schema: "delivery-db",
                table: "Statuses",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Supplies_ContractId",
                schema: "delivery-db",
                table: "Supplies",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_SupplierId",
                schema: "delivery-db",
                table: "Systems",
                column: "SupplierId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientSupply",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Statuses",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Clients",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Devices",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "DeviceTypes",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Supplies",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Contracts",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Systems",
                schema: "delivery-db");

            migrationBuilder.DropTable(
                name: "Suppliers",
                schema: "delivery-db");
        }
    }
}
