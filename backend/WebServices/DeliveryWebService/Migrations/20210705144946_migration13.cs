using Microsoft.EntityFrameworkCore.Migrations;

namespace DeliveryWebService.Migrations
{
    public partial class migration13 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActual",
                schema: "delivery-db",
                table: "Systems",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActual",
                schema: "delivery-db",
                table: "Systems");
        }
    }
}
