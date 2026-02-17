using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrainingManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFrequencyToAllowanceType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "AllowanceTypes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "AllowanceTypes");
        }
    }
}
