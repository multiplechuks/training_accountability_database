using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrainingManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEnrollmentProgress7Stages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AllowanceStatuses",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllowanceStatuses", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "AllowanceTypes",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllowanceTypes", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Designations",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designations", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "ExtensionReasons",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtensionReasons", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Facilities",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facilities", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "NominationStatuses",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NominationStatuses", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Qualifications",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Level = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifications", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SalaryScales",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Scale = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Grade = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MinSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxSalary = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalaryScales", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Specialties",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialties", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Sponsors",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ContactPerson = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sponsors", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "StudyModes",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudyModes", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "TravelModes",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelModes", x => x.PK);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Participants",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Firstname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Middlename = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IdNo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Sex = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Dob = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    WorkTelephone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    DesignationFK = table.Column<int>(type: "int", nullable: true),
                    DepartmentOrFacility = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DutyStation = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participants", x => x.PK);
                    table.ForeignKey(
                        name: "FK_Participants_Designations_DesignationFK",
                        column: x => x.DesignationFK,
                        principalTable: "Designations",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Institution = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Program = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CountryOfStudy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    ModeOfStudy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CampusType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SponsorPK = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.PK);
                    table.ForeignKey(
                        name: "FK_Trainings_Sponsors_SponsorPK",
                        column: x => x.SponsorPK,
                        principalTable: "Sponsors",
                        principalColumn: "PK");
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NextOfKins",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Firstname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Lastname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Relationship = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdNo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NextOfKins", x => x.PK);
                    table.ForeignKey(
                        name: "FK_NextOfKins_Participants_ParticipantFK",
                        column: x => x.ParticipantFK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nominations",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    CurrentQualifications = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    NominatedProgram = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SponsorType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SponsorFK = table.Column<int>(type: "int", nullable: true),
                    YearOfNomination = table.Column<int>(type: "int", nullable: false),
                    EstimatedBudget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    ProfessionalBody = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NominationStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StatusReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NominationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    NextOfKinName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NextOfKinRelationship = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NextOfKinPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    NextOfKinEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NextOfKinAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NextOfKinOccupation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nominations", x => x.PK);
                    table.ForeignKey(
                        name: "FK_Nominations_Participants_ParticipantFK",
                        column: x => x.ParticipantFK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nominations_Sponsors_SponsorFK",
                        column: x => x.SponsorFK,
                        principalTable: "Sponsors",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Allowances",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AllowanceStoppageDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    StatusFK = table.Column<int>(type: "int", nullable: false),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    AllowanceTypeFK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allowances", x => x.PK);
                    table.ForeignKey(
                        name: "FK_Allowances_AllowanceStatuses_StatusFK",
                        column: x => x.StatusFK,
                        principalTable: "AllowanceStatuses",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Allowances_AllowanceTypes_AllowanceTypeFK",
                        column: x => x.AllowanceTypeFK,
                        principalTable: "AllowanceTypes",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Allowances_Participants_ParticipantFK",
                        column: x => x.ParticipantFK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Allowances_Trainings_TrainingFK",
                        column: x => x.TrainingFK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParticipantTrainings",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ParticipantPK = table.Column<int>(type: "int", nullable: false),
                    TrainingPK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParticipantTrainings", x => x.PK);
                    table.ForeignKey(
                        name: "FK_ParticipantTrainings_Participants_ParticipantPK",
                        column: x => x.ParticipantPK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ParticipantTrainings_Trainings_TrainingPK",
                        column: x => x.TrainingPK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingBudgets",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AllocatedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FinancialYear = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BudgetCategory = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingBudgets", x => x.PK);
                    table.ForeignKey(
                        name: "FK_TrainingBudgets_Trainings_TrainingFK",
                        column: x => x.TrainingFK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingReports",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ReportType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ReportDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReportContent = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReportStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingReports", x => x.PK);
                    table.ForeignKey(
                        name: "FK_TrainingReports_Trainings_TrainingFK",
                        column: x => x.TrainingFK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParticipantEnrollments",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DesignationFK = table.Column<int>(type: "int", nullable: true),
                    SalaryScaleFK = table.Column<int>(type: "int", nullable: true),
                    DepartmentFK = table.Column<int>(type: "int", nullable: true),
                    FacilityFK = table.Column<int>(type: "int", nullable: true),
                    PayrollDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StudyLeaveDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AllowanceStoppageDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    NeedingTravel = table.Column<bool>(type: "bit", nullable: false),
                    DepartureDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ArrivalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateBondSigned = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BondServingPeriod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SponsorFK = table.Column<int>(type: "int", nullable: true),
                    ModeOfStudy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrainingStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FinancialYear = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CampusType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StudyCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WorkResumptionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletionSuccessful = table.Column<bool>(type: "bit", nullable: false),
                    CompletionFailureReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TravelMode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DepartureDate_Travel = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    NominationFK = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParticipantEnrollments", x => x.PK);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Departments_DepartmentFK",
                        column: x => x.DepartmentFK,
                        principalTable: "Departments",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Designations_DesignationFK",
                        column: x => x.DesignationFK,
                        principalTable: "Designations",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Facilities_FacilityFK",
                        column: x => x.FacilityFK,
                        principalTable: "Facilities",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Nominations_NominationFK",
                        column: x => x.NominationFK,
                        principalTable: "Nominations",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Participants_ParticipantFK",
                        column: x => x.ParticipantFK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_SalaryScales_SalaryScaleFK",
                        column: x => x.SalaryScaleFK,
                        principalTable: "SalaryScales",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Sponsors_SponsorFK",
                        column: x => x.SponsorFK,
                        principalTable: "Sponsors",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ParticipantEnrollments_Trainings_TrainingFK",
                        column: x => x.TrainingFK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrainingTransfers",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantFK = table.Column<int>(type: "int", nullable: false),
                    TrainingFK = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TransferReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TransferStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ParticipantPK = table.Column<int>(type: "int", nullable: false),
                    TrainingPK = table.Column<int>(type: "int", nullable: false),
                    ParticipantTrainingPK = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingTransfers", x => x.PK);
                    table.ForeignKey(
                        name: "FK_TrainingTransfers_ParticipantTrainings_ParticipantTrainingPK",
                        column: x => x.ParticipantTrainingPK,
                        principalTable: "ParticipantTrainings",
                        principalColumn: "PK");
                    table.ForeignKey(
                        name: "FK_TrainingTransfers_Participants_ParticipantPK",
                        column: x => x.ParticipantPK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrainingTransfers_Trainings_TrainingPK",
                        column: x => x.TrainingPK,
                        principalTable: "Trainings",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bonds",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BondStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BondEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BondPeriodMonths = table.Column<int>(type: "int", nullable: false),
                    BondSigned = table.Column<bool>(type: "bit", nullable: false),
                    DateSigned = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BondStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BondAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BondConditions = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InductionCompleted = table.Column<bool>(type: "bit", nullable: false),
                    InductionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ParticipantEnrollmentFK = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bonds", x => x.PK);
                    table.ForeignKey(
                        name: "FK_Bonds_ParticipantEnrollments_ParticipantEnrollmentFK",
                        column: x => x.ParticipantEnrollmentFK,
                        principalTable: "ParticipantEnrollments",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingExtensions",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantEnrollmentFK = table.Column<int>(type: "int", nullable: false),
                    ExtensionStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExtensionEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExtensionDurationMonths = table.Column<int>(type: "int", nullable: false),
                    ExtensionReasonCategory = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ExtensionReasonDetails = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    EstimatedExtensionCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    UpdatedBondPeriodMonths = table.Column<int>(type: "int", nullable: false),
                    UpdatedBondEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingExtensions", x => x.PK);
                    table.ForeignKey(
                        name: "FK_TrainingExtensions_ParticipantEnrollments_ParticipantEnrollmentFK",
                        column: x => x.ParticipantEnrollmentFK,
                        principalTable: "ParticipantEnrollments",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EnrollmentProgresses",
                columns: table => new
                {
                    PK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantFK = table.Column<int>(type: "int", nullable: true),
                    Form1_ParticipantProfile = table.Column<bool>(type: "bit", nullable: false),
                    Form2_Nomination = table.Column<bool>(type: "bit", nullable: false),
                    Form3_Admission = table.Column<bool>(type: "bit", nullable: false),
                    Form4_TrainingCosts = table.Column<bool>(type: "bit", nullable: false),
                    Form5_Extension = table.Column<bool>(type: "bit", nullable: false),
                    Form6_Completion = table.Column<bool>(type: "bit", nullable: false),
                    EnrollmentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CurrentStep = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextOfKinFK = table.Column<int>(type: "int", nullable: true),
                    NominationFK = table.Column<int>(type: "int", nullable: true),
                    ParticipantEnrollmentFK = table.Column<int>(type: "int", nullable: true),
                    BondFK = table.Column<int>(type: "int", nullable: true),
                    Stage2_NextOfKinData = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Stage3_NominationData = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Stage4_AdmissionData = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Stage5_BondingData = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Stage6_TrainingCostsData = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    NextOfKinPK = table.Column<int>(type: "int", nullable: true),
                    BondPK = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnrollmentProgresses", x => x.PK);
                    table.ForeignKey(
                        name: "FK_EnrollmentProgresses_Bonds_BondPK",
                        column: x => x.BondPK,
                        principalTable: "Bonds",
                        principalColumn: "PK");
                    table.ForeignKey(
                        name: "FK_EnrollmentProgresses_NextOfKins_NextOfKinPK",
                        column: x => x.NextOfKinPK,
                        principalTable: "NextOfKins",
                        principalColumn: "PK");
                    table.ForeignKey(
                        name: "FK_EnrollmentProgresses_Nominations_NominationFK",
                        column: x => x.NominationFK,
                        principalTable: "Nominations",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_EnrollmentProgresses_ParticipantEnrollments_ParticipantEnrollmentFK",
                        column: x => x.ParticipantEnrollmentFK,
                        principalTable: "ParticipantEnrollments",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_EnrollmentProgresses_Participants_ParticipantFK",
                        column: x => x.ParticipantFK,
                        principalTable: "Participants",
                        principalColumn: "PK",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Allowances_AllowanceTypeFK",
                table: "Allowances",
                column: "AllowanceTypeFK");

            migrationBuilder.CreateIndex(
                name: "IX_Allowances_ParticipantFK",
                table: "Allowances",
                column: "ParticipantFK");

            migrationBuilder.CreateIndex(
                name: "IX_Allowances_StatusFK",
                table: "Allowances",
                column: "StatusFK");

            migrationBuilder.CreateIndex(
                name: "IX_Allowances_TrainingFK",
                table: "Allowances",
                column: "TrainingFK");

            migrationBuilder.CreateIndex(
                name: "IX_AllowanceStatuses_Name",
                table: "AllowanceStatuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AllowanceTypes_Name",
                table: "AllowanceTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bonds_ParticipantEnrollmentFK",
                table: "Bonds",
                column: "ParticipantEnrollmentFK",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Code",
                table: "Departments",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Name",
                table: "Departments",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Designations_Code",
                table: "Designations",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Designations_Title",
                table: "Designations",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_BondPK",
                table: "EnrollmentProgresses",
                column: "BondPK");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_CurrentStep",
                table: "EnrollmentProgresses",
                column: "CurrentStep");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_NextOfKinPK",
                table: "EnrollmentProgresses",
                column: "NextOfKinPK");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_NominationFK",
                table: "EnrollmentProgresses",
                column: "NominationFK");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_ParticipantEnrollmentFK",
                table: "EnrollmentProgresses",
                column: "ParticipantEnrollmentFK");

            migrationBuilder.CreateIndex(
                name: "IX_EnrollmentProgresses_ParticipantFK_EnrollmentStatus",
                table: "EnrollmentProgresses",
                columns: new[] { "ParticipantFK", "EnrollmentStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_ExtensionReasons_Name",
                table: "ExtensionReasons",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_Code",
                table: "Facilities",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Facilities_Name",
                table: "Facilities",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_NextOfKins_ParticipantFK",
                table: "NextOfKins",
                column: "ParticipantFK");

            migrationBuilder.CreateIndex(
                name: "IX_Nominations_NominationStatus",
                table: "Nominations",
                column: "NominationStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Nominations_ParticipantFK",
                table: "Nominations",
                column: "ParticipantFK");

            migrationBuilder.CreateIndex(
                name: "IX_Nominations_SponsorFK",
                table: "Nominations",
                column: "SponsorFK");

            migrationBuilder.CreateIndex(
                name: "IX_Nominations_YearOfNomination",
                table: "Nominations",
                column: "YearOfNomination");

            migrationBuilder.CreateIndex(
                name: "IX_NominationStatuses_Name",
                table: "NominationStatuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_DepartmentFK",
                table: "ParticipantEnrollments",
                column: "DepartmentFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_DesignationFK",
                table: "ParticipantEnrollments",
                column: "DesignationFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_FacilityFK",
                table: "ParticipantEnrollments",
                column: "FacilityFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_NominationFK",
                table: "ParticipantEnrollments",
                column: "NominationFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_ParticipantFK_TrainingFK",
                table: "ParticipantEnrollments",
                columns: new[] { "ParticipantFK", "TrainingFK" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_SalaryScaleFK",
                table: "ParticipantEnrollments",
                column: "SalaryScaleFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_SponsorFK",
                table: "ParticipantEnrollments",
                column: "SponsorFK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantEnrollments_TrainingFK",
                table: "ParticipantEnrollments",
                column: "TrainingFK");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_DesignationFK",
                table: "Participants",
                column: "DesignationFK");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_Email",
                table: "Participants",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Participants_IdNo",
                table: "Participants",
                column: "IdNo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantTrainings_ParticipantPK",
                table: "ParticipantTrainings",
                column: "ParticipantPK");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantTrainings_TrainingPK",
                table: "ParticipantTrainings",
                column: "TrainingPK");

            migrationBuilder.CreateIndex(
                name: "IX_Qualifications_Level",
                table: "Qualifications",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "IX_Qualifications_Name",
                table: "Qualifications",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SalaryScales_Scale",
                table: "SalaryScales",
                column: "Scale",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Specialties_Name",
                table: "Specialties",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_Email",
                table: "Sponsors",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_Name",
                table: "Sponsors",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_StudyModes_Name",
                table: "StudyModes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingBudgets_TrainingFK",
                table: "TrainingBudgets",
                column: "TrainingFK");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingExtensions_ExtensionStartDate",
                table: "TrainingExtensions",
                column: "ExtensionStartDate");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingExtensions_ParticipantEnrollmentFK",
                table: "TrainingExtensions",
                column: "ParticipantEnrollmentFK");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingReports_ReportDate",
                table: "TrainingReports",
                column: "ReportDate");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingReports_TrainingFK",
                table: "TrainingReports",
                column: "TrainingFK");

            migrationBuilder.CreateIndex(
                name: "IX_Trainings_Institution",
                table: "Trainings",
                column: "Institution");

            migrationBuilder.CreateIndex(
                name: "IX_Trainings_Program",
                table: "Trainings",
                column: "Program");

            migrationBuilder.CreateIndex(
                name: "IX_Trainings_SponsorPK",
                table: "Trainings",
                column: "SponsorPK");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingTransfers_ParticipantPK",
                table: "TrainingTransfers",
                column: "ParticipantPK");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingTransfers_ParticipantTrainingPK",
                table: "TrainingTransfers",
                column: "ParticipantTrainingPK");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingTransfers_TrainingPK",
                table: "TrainingTransfers",
                column: "TrainingPK");

            migrationBuilder.CreateIndex(
                name: "IX_TravelModes_Name",
                table: "TravelModes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Allowances");

            migrationBuilder.DropTable(
                name: "EnrollmentProgresses");

            migrationBuilder.DropTable(
                name: "ExtensionReasons");

            migrationBuilder.DropTable(
                name: "NominationStatuses");

            migrationBuilder.DropTable(
                name: "Qualifications");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "Specialties");

            migrationBuilder.DropTable(
                name: "StudyModes");

            migrationBuilder.DropTable(
                name: "TrainingBudgets");

            migrationBuilder.DropTable(
                name: "TrainingExtensions");

            migrationBuilder.DropTable(
                name: "TrainingReports");

            migrationBuilder.DropTable(
                name: "TrainingTransfers");

            migrationBuilder.DropTable(
                name: "TravelModes");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "AllowanceStatuses");

            migrationBuilder.DropTable(
                name: "AllowanceTypes");

            migrationBuilder.DropTable(
                name: "Bonds");

            migrationBuilder.DropTable(
                name: "NextOfKins");

            migrationBuilder.DropTable(
                name: "ParticipantTrainings");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "ParticipantEnrollments");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Facilities");

            migrationBuilder.DropTable(
                name: "Nominations");

            migrationBuilder.DropTable(
                name: "SalaryScales");

            migrationBuilder.DropTable(
                name: "Trainings");

            migrationBuilder.DropTable(
                name: "Participants");

            migrationBuilder.DropTable(
                name: "Sponsors");

            migrationBuilder.DropTable(
                name: "Designations");
        }
    }
}
