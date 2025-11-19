using Microsoft.EntityFrameworkCore;
using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedLookupDataAsync(TrainingDbContext context)
    {
        // Seed Departments
        if (!await context.Departments.AnyAsync())
        {
            var departments = new[]
            {
                new Department { Name = "Ministry of Health", Code = "MOH", Description = "Ministry of Health and Wellness" },
                new Department { Name = "Ministry of Education", Code = "MOE", Description = "Ministry of Education and Skills Development" },
                new Department { Name = "Ministry of Finance", Code = "MOF", Description = "Ministry of Finance and Economic Development" },
                new Department { Name = "Ministry of Agriculture", Code = "MOA", Description = "Ministry of Agriculture and Food Security" },
                new Department { Name = "Ministry of Transport", Code = "MOT", Description = "Ministry of Transport and Public Works" },
                new Department { Name = "Ministry of Local Government", Code = "MLG", Description = "Ministry of Local Government and Rural Development" },
                new Department { Name = "Ministry of Defence", Code = "MOD", Description = "Ministry of Defence, Justice and Security" },
                new Department { Name = "Ministry of Environment", Code = "MEWT", Description = "Ministry of Environment, Wildlife and Tourism" },
                new Department { Name = "Ministry of Trade", Code = "MITI", Description = "Ministry of Trade and Industry" },
                new Department { Name = "Ministry of Youth", Code = "MYS", Description = "Ministry of Youth Empowerment, Sport and Culture Development" }
            };

            foreach (var dept in departments)
            {
                dept.CreatedAt = DateTime.UtcNow;
                dept.CreatedBy = "System";
                dept.UpdatedAt = DateTime.UtcNow;
                dept.UpdatedBy = "System";
            }

            context.Departments.AddRange(departments);
        }

        // Seed Facilities
        if (!await context.Facilities.AnyAsync())
        {
            var facilities = new[]
            {
                new Facility { Name = "Princess Marina Hospital", Code = "PMH", Location = "Gaborone", Description = "Referral Hospital - Gaborone" },
                new Facility { Name = "Nyangabgwe Referral Hospital", Code = "NRH", Location = "Francistown", Description = "Referral Hospital - Francistown" },
                new Facility { Name = "Scottish Livingstone Hospital", Code = "SLH", Location = "Molepolole", Description = "Referral Hospital - Molepolole" },
                new Facility { Name = "Sekgoma Memorial Hospital", Code = "SMH", Location = "Serowe", Description = "District Hospital - Serowe" },
                new Facility { Name = "Mahalapye District Hospital", Code = "MDH", Location = "Mahalapye", Description = "District Hospital - Mahalapye" },
                new Facility { Name = "Maun General Hospital", Code = "MGH", Location = "Maun", Description = "District Hospital - Maun" },
                new Facility { Name = "Kanye Seventh Day Adventist Hospital", Code = "KSDAH", Location = "Kanye", Description = "Private Hospital - Kanye" },
                new Facility { Name = "Bokamoso Private Hospital", Code = "BPH", Location = "Gaborone", Description = "Private Hospital - Gaborone" },
                new Facility { Name = "Deborah Retief Memorial Hospital", Code = "DRMH", Location = "Mochudi", Description = "District Hospital - Mochudi" },
                new Facility { Name = "Letsholathebe II Memorial Hospital", Code = "LMH", Location = "Maun", Description = "District Hospital - Maun" }
            };

            foreach (var facility in facilities)
            {
                facility.CreatedAt = DateTime.UtcNow;
                facility.CreatedBy = "System";
                facility.UpdatedAt = DateTime.UtcNow;
                facility.UpdatedBy = "System";
            }

            context.Facilities.AddRange(facilities);
        }

        // Seed Designations
        if (!await context.Designations.AnyAsync())
        {
            var designations = new[]
            {
                new Designation { Title = "Medical Officer", Code = "MO", Level = "Senior", Description = "Qualified medical doctor" },
                new Designation { Title = "Senior Medical Officer", Code = "SMO", Level = "Senior", Description = "Senior qualified medical doctor" },
                new Designation { Title = "Consultant", Code = "CONS", Level = "Principal", Description = "Medical specialist consultant" },
                new Designation { Title = "Registered Nurse", Code = "RN", Level = "Junior", Description = "Registered professional nurse" },
                new Designation { Title = "Senior Registered Nurse", Code = "SRN", Level = "Senior", Description = "Senior registered professional nurse" },
                new Designation { Title = "Principal Registered Nurse", Code = "PRN", Level = "Principal", Description = "Principal registered professional nurse" },
                new Designation { Title = "Pharmacist", Code = "PHARM", Level = "Senior", Description = "Qualified pharmacist" },
                new Designation { Title = "Senior Pharmacist", Code = "SPHARM", Level = "Principal", Description = "Senior qualified pharmacist" },
                new Designation { Title = "Pharmacy Technician", Code = "PTECH", Level = "Junior", Description = "Pharmacy technician" },
                new Designation { Title = "Laboratory Technologist", Code = "LABTECH", Level = "Senior", Description = "Medical laboratory technologist" },
                new Designation { Title = "Radiographer", Code = "RAD", Level = "Senior", Description = "Medical radiographer" },
                new Designation { Title = "Physiotherapist", Code = "PHYSIO", Level = "Senior", Description = "Qualified physiotherapist" },
                new Designation { Title = "Dental Officer", Code = "DO", Level = "Senior", Description = "Qualified dental officer" },
                new Designation { Title = "Health Education Assistant", Code = "HEA", Level = "Junior", Description = "Health education specialist" },
                new Designation { Title = "Administrative Officer", Code = "AO", Level = "Junior", Description = "Administrative support officer" }
            };

            foreach (var designation in designations)
            {
                designation.CreatedAt = DateTime.UtcNow;
                designation.CreatedBy = "System";
                designation.UpdatedAt = DateTime.UtcNow;
                designation.UpdatedBy = "System";
            }

            context.Designations.AddRange(designations);
        }

        // Seed Salary Scales
        if (!await context.SalaryScales.AnyAsync())
        {
            var salaryScales = new[]
            {
                new SalaryScale { Scale = "Scale A", Grade = "A", MinSalary = 2000, MaxSalary = 4000, Description = "Entry level positions - BWP 2,000 - BWP 4,000" },
                new SalaryScale { Scale = "Scale B", Grade = "B", MinSalary = 4000, MaxSalary = 6000, Description = "Junior positions - BWP 4,000 - BWP 6,000" },
                new SalaryScale { Scale = "Scale C", Grade = "C", MinSalary = 6000, MaxSalary = 10000, Description = "Mid-level positions - BWP 6,000 - BWP 10,000" },
                new SalaryScale { Scale = "Scale D", Grade = "D", MinSalary = 10000, MaxSalary = 15000, Description = "Senior positions - BWP 10,000 - BWP 15,000" },
                new SalaryScale { Scale = "Scale E", Grade = "E", MinSalary = 15000, MaxSalary = 25000, Description = "Principal positions - BWP 15,000 - BWP 25,000" },
                new SalaryScale { Scale = "Scale F", Grade = "F", MinSalary = 25000, MaxSalary = 35000, Description = "Director positions - BWP 25,000 - BWP 35,000" },
                new SalaryScale { Scale = "Scale G", Grade = "G", MinSalary = 35000, MaxSalary = 50000, Description = "Senior director positions - BWP 35,000 - BWP 50,000" },
                new SalaryScale { Scale = "Specialist Scale", Grade = "SPEC", MinSalary = 20000, MaxSalary = 60000, Description = "Medical specialists - BWP 20,000 - BWP 60,000" },
                new SalaryScale { Scale = "Consultant Scale", Grade = "CONS", MinSalary = 40000, MaxSalary = 80000, Description = "Medical consultants - BWP 40,000 - BWP 80,000" },
                new SalaryScale { Scale = "Contract Scale", Grade = "CONTRACT", MinSalary = 0, MaxSalary = 0, Description = "Contract positions - Variable rates" }
            };

            foreach (var scale in salaryScales)
            {
                scale.CreatedAt = DateTime.UtcNow;
                scale.CreatedBy = "System";
                scale.UpdatedAt = DateTime.UtcNow;
                scale.UpdatedBy = "System";
            }

            context.SalaryScales.AddRange(salaryScales);
        }

        // Seed Sponsors
        if (!await context.Sponsors.AnyAsync())
        {
            var sponsors = new[]
            {
                new Sponsor { Name = "Government of Botswana", Type = "Government", ContactPerson = "Ministry of Health", Email = "training@gov.bw", Phone = "+267 3914464", Description = "Government funded training" },
                new Sponsor { Name = "World Health Organization", Type = "International", ContactPerson = "WHO Representative", Email = "training@who.int", Phone = "+267 3900000", Description = "WHO sponsored programs" },
                new Sponsor { Name = "PEPFAR", Type = "International", ContactPerson = "PEPFAR Coordinator", Email = "pepfar@usaid.gov", Phone = "+267 3950000", Description = "President's Emergency Plan for AIDS Relief" },
                new Sponsor { Name = "European Union", Type = "International", ContactPerson = "EU Delegation", Email = "training@eeas.europa.eu", Phone = "+267 3940000", Description = "European Union development programs" },
                new Sponsor { Name = "African Development Bank", Type = "International", ContactPerson = "AfDB Representative", Email = "training@afdb.org", Phone = "+267 3960000", Description = "AfDB capacity building programs" },
                new Sponsor { Name = "World Bank", Type = "International", ContactPerson = "World Bank Office", Email = "training@worldbank.org", Phone = "+267 3970000", Description = "World Bank development programs" },
                new Sponsor { Name = "UNICEF", Type = "International", ContactPerson = "UNICEF Representative", Email = "training@unicef.org", Phone = "+267 3930000", Description = "United Nations Children's Fund" },
                new Sponsor { Name = "UNDP", Type = "International", ContactPerson = "UNDP Representative", Email = "training@undp.org", Phone = "+267 3950000", Description = "United Nations Development Programme" },
                new Sponsor { Name = "CDC Foundation", Type = "International", ContactPerson = "CDC Representative", Email = "training@cdc.gov", Phone = "+267 3910000", Description = "Centers for Disease Control Foundation" },
                new Sponsor { Name = "Private Sponsorship", Type = "Private", ContactPerson = "Private Sponsor", Email = "private@sponsor.com", Phone = "+267 0000000", Description = "Privately funded training" },
                new Sponsor { Name = "Self Sponsored", Type = "Private", ContactPerson = "Self", Email = "self@funded.com", Phone = "+267 0000000", Description = "Self-funded training" },
                new Sponsor { Name = "Scholarship Programme", Type = "Government", ContactPerson = "Scholarship Office", Email = "scholarships@gov.bw", Phone = "+267 3914464", Description = "Merit-based scholarship programs" }
            };

            foreach (var sponsor in sponsors)
            {
                sponsor.CreatedAt = DateTime.UtcNow;
                sponsor.CreatedBy = "System";
                sponsor.UpdatedAt = DateTime.UtcNow;
                sponsor.UpdatedBy = "System";
            }

            context.Sponsors.AddRange(sponsors);
        }

        await context.SaveChangesAsync();
    }

    public static async Task SeedSampleDataAsync(TrainingDbContext context)
    {
        // Seed some sample participants
        if (!await context.Participants.AnyAsync())
        {
            var participants = new[]
            {
                new Participant
                {
                    Title = "Dr.",
                    Firstname = "Keabetswe",
                    Lastname = "Mogae",
                    Middlename = "John",
                    IdNo = "123456789",
                    Email = "k.mogae@gov.bw",
                    Phone = "+267 71234567",
                    Dob = new DateTime(1985, 5, 15),
                    Sex = "Female",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                },
                new Participant
                {
                    Title = "Mr.",
                    Firstname = "Thabo",
                    Lastname = "Seretse",
                    Middlename = "Patrick",
                    IdNo = "987654321",
                    Email = "t.seretse@gov.bw",
                    Phone = "+267 72345678",
                    Dob = new DateTime(1990, 8, 22),
                    Sex = "Male",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                },
                new Participant
                {
                    Title = "Ms.",
                    Firstname = "Boitumelo",
                    Lastname = "Kgosana",
                    IdNo = "456789123",
                    Email = "b.kgosana@gov.bw",
                    Phone = "+267 73456789",
                    Dob = new DateTime(1988, 3, 10),
                    Sex = "Female",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                }
            };

            context.Participants.AddRange(participants);
        }

        // Seed some sample trainings
        if (!await context.Trainings.AnyAsync())
        {
            var trainings = new[]
            {
                new Training
                {
                    Institution = "University of Cape Town",
                    Program = "Master of Public Health",
                    CountryOfStudy = "South Africa",
                    StartDate = new DateTime(2025, 9, 1),
                    EndDate = new DateTime(2027, 8, 31),
                    Duration = 24,
                    FinancialYear = "2025/2026",
                    SponsorFK = 1, // Government of Botswana
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                },
                new Training
                {
                    Institution = "University of the Witwatersrand",
                    Program = "Bachelor of Medicine and Surgery",
                    CountryOfStudy = "South Africa",
                    StartDate = new DateTime(2026, 1, 15),
                    EndDate = new DateTime(2031, 12, 15),
                    Duration = 72,
                    FinancialYear = "2025/2026",
                    SponsorFK = 1, // Government of Botswana
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                },
                new Training
                {
                    Institution = "Royal College of Nursing",
                    Program = "Advanced Nursing Practice Certificate",
                    CountryOfStudy = "United Kingdom",
                    StartDate = new DateTime(2025, 10, 1),
                    EndDate = new DateTime(2026, 9, 30),
                    Duration = 12,
                    FinancialYear = "2025/2026",
                    SponsorFK = 2, // WHO
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System",
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedBy = "System"
                }
            };

            context.Trainings.AddRange(trainings);
        }

        await context.SaveChangesAsync();
    }
}
