using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DeliveryWebService.Migrations
{
    public partial class migration14 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Year",
                schema: "delivery-db",
                table: "Supplies",
                newName: "StartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                schema: "delivery-db",
                table: "Supplies",
                type: "date",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Supplies",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Suppliers",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Statuses",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "DeviceTypes",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Devices",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Contracts",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Clients",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                schema: "delivery-db",
                table: "Supplies");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Supplies");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "DeviceTypes");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                schema: "delivery-db",
                table: "Supplies",
                newName: "Year");
        }
    }
}
