using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DeliveryWebService.Migrations
{
    public partial class migration3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientSupply",
                schema: "delivery-db");

            migrationBuilder.CreateTable(
                name: "ClientSupplies",
                schema: "delivery-db",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientId = table.Column<int>(type: "integer", nullable: false),
                    SupplyId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientSupplies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientSupplies_Clients_ClientId",
                        column: x => x.ClientId,
                        principalSchema: "delivery-db",
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientSupplies_Supplies_SupplyId",
                        column: x => x.SupplyId,
                        principalSchema: "delivery-db",
                        principalTable: "Supplies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientSupplies_ClientId",
                schema: "delivery-db",
                table: "ClientSupplies",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientSupplies_SupplyId",
                schema: "delivery-db",
                table: "ClientSupplies",
                column: "SupplyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientSupplies",
                schema: "delivery-db");

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

            migrationBuilder.CreateIndex(
                name: "IX_ClientSupply_SuppliesId",
                schema: "delivery-db",
                table: "ClientSupply",
                column: "SuppliesId");
        }
    }
}
