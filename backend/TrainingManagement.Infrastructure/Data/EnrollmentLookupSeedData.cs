using TrainingManagement.Core.Entities;

namespace TrainingManagement.Infrastructure.Data;

public static class EnrollmentLookupSeedData
{
    public static async Task SeedEnrollmentLookupsAsync(TrainingDbContext context)
    {
        // Seed Extension Reasons
        if (!context.ExtensionReasons.Any())
        {
            var extensionReasons = new List<ExtensionReason>
            {
                new() { Name = "Academic Requirements", Description = "Additional time needed to complete academic requirements", IsActive = true },
                new() { Name = "Research Delays", Description = "Delays in research or thesis completion", IsActive = true },
                new() { Name = "Health Issues", Description = "Medical or health-related issues", IsActive = true },
                new() { Name = "Family Emergency", Description = "Family emergency or personal reasons", IsActive = true },
                new() { Name = "Program Change", Description = "Change in program or specialization", IsActive = true },
                new() { Name = "Institution Delays", Description = "Delays caused by the institution", IsActive = true },
                new() { Name = "Other", Description = "Other reasons (specify in details)", IsActive = true }
            };
            context.ExtensionReasons.AddRange(extensionReasons);
        }

        // Seed Nomination Statuses
        if (!context.NominationStatuses.Any())
        {
            var nominationStatuses = new List<NominationStatus>
            {
                new() { Name = "Pending", Description = "Nomination submitted and awaiting review", IsActive = true },
                new() { Name = "Under Review", Description = "Nomination is being reviewed", IsActive = true },
                new() { Name = "Accepted", Description = "Nomination has been accepted", IsActive = true },
                new() { Name = "Deferred", Description = "Nomination deferred to next cycle", IsActive = true },
                new() { Name = "Rejected", Description = "Nomination has been rejected", IsActive = true },
                new() { Name = "Withdrawn", Description = "Nomination withdrawn by applicant", IsActive = true }
            };
            context.NominationStatuses.AddRange(nominationStatuses);
        }

        // Seed Travel Modes
        if (!context.TravelModes.Any())
        {
            var travelModes = new List<TravelMode>
            {
                new() { Name = "Air", Description = "Air travel", IsActive = true },
                new() { Name = "Road", Description = "Road transport", IsActive = true },
                new() { Name = "Rail", Description = "Rail transport", IsActive = true },
                new() { Name = "Sea", Description = "Sea transport", IsActive = true },
                new() { Name = "Not Applicable", Description = "No travel required (local)", IsActive = true }
            };
            context.TravelModes.AddRange(travelModes);
        }

        // Seed Study Modes
        if (!context.StudyModes.Any())
        {
            var studyModes = new List<StudyMode>
            {
                new() { Name = "Full-time", Description = "Full-time on-campus study", IsActive = true },
                new() { Name = "Part-time", Description = "Part-time study", IsActive = true },
                new() { Name = "Online", Description = "Online/virtual learning", IsActive = true },
                new() { Name = "Distance Learning", Description = "Distance/correspondence learning", IsActive = true },
                new() { Name = "Hybrid", Description = "Combination of online and on-campus", IsActive = true },
                new() { Name = "Block Release", Description = "Block release/intensive sessions", IsActive = true }
            };
            context.StudyModes.AddRange(studyModes);
        }

        // Seed Specialties (Medical/Health focus)
        if (!context.Specialties.Any())
        {
            var specialties = new List<Specialty>
            {
                new() { Name = "General Medicine", Description = "General practice and internal medicine", IsActive = true },
                new() { Name = "Surgery", Description = "Surgical specialization", IsActive = true },
                new() { Name = "Pediatrics", Description = "Child health and pediatrics", IsActive = true },
                new() { Name = "Obstetrics & Gynecology", Description = "Women's health and obstetrics", IsActive = true },
                new() { Name = "Anesthesiology", Description = "Anesthesia and critical care", IsActive = true },
                new() { Name = "Radiology", Description = "Medical imaging and radiology", IsActive = true },
                new() { Name = "Pathology", Description = "Laboratory medicine and pathology", IsActive = true },
                new() { Name = "Public Health", Description = "Public health and epidemiology", IsActive = true },
                new() { Name = "Nursing", Description = "Nursing specializations", IsActive = true },
                new() { Name = "Pharmacy", Description = "Pharmaceutical sciences", IsActive = true },
                new() { Name = "Dentistry", Description = "Dental medicine", IsActive = true },
                new() { Name = "Psychiatry", Description = "Mental health and psychiatry", IsActive = true },
                new() { Name = "Emergency Medicine", Description = "Emergency and trauma care", IsActive = true },
                new() { Name = "Cardiology", Description = "Heart and cardiovascular diseases", IsActive = true },
                new() { Name = "Oncology", Description = "Cancer treatment and research", IsActive = true },
                new() { Name = "Health Administration", Description = "Healthcare management and administration", IsActive = true },
                new() { Name = "Biomedical Sciences", Description = "Biomedical research and sciences", IsActive = true },
                new() { Name = "Other", Description = "Other specializations", IsActive = true }
            };
            context.Specialties.AddRange(specialties);
        }

        // Seed Qualifications
        if (!context.Qualifications.Any())
        {
            var qualifications = new List<Qualification>
            {
                new() { Name = "Certificate", Level = "UG", Description = "Certificate level qualification", IsActive = true },
                new() { Name = "Diploma", Level = "UG", Description = "Diploma level qualification", IsActive = true },
                new() { Name = "Bachelor's Degree", Level = "UG", Description = "Undergraduate degree (BSc, BA, etc.)", IsActive = true },
                new() { Name = "Postgraduate Diploma", Level = "PG", Description = "Postgraduate diploma", IsActive = true },
                new() { Name = "Master's Degree", Level = "PG", Description = "Master's level degree (MSc, MA, MBA, etc.)", IsActive = true },
                new() { Name = "MPhil", Level = "PG", Description = "Master of Philosophy", IsActive = true },
                new() { Name = "PhD/Doctorate", Level = "Doctoral", Description = "Doctoral degree (PhD, MD, etc.)", IsActive = true },
                new() { Name = "Professional Certificate", Level = "PG", Description = "Professional certification or license", IsActive = true },
                new() { Name = "Fellowship", Level = "PG", Description = "Medical fellowship or specialist training", IsActive = true }
            };
            context.Qualifications.AddRange(qualifications);
        }

        // Seed Allowance Types
        if (!context.AllowanceTypes.Any())
        {
            var allowanceTypes = new List<AllowanceType>
            {
                new() { Name = "Monthly Stipend", Description = "Monthly allowance for living expenses", Frequency = "Monthly" },
                new() { Name = "Book Allowance", Description = "Annual allowance for books and learning materials", Frequency = "Annual" },
                new() { Name = "Settling/Arrival", Description = "One-time allowance for settling in", Frequency = "Once Off" },
                new() { Name = "Incidental", Description = "One-time allowance for incidental expenses", Frequency = "Once Off" },
                new() { Name = "Warm Clothing", Description = "Annual allowance for warm clothing", Frequency = "Annual" },
                new() { Name = "Departure/Return", Description = "One-time allowance for departure and return travel", Frequency = "Once Off" },
                new() { Name = "Excess Baggage", Description = "One-time allowance for excess baggage", Frequency = "Once Off" },
                new() { Name = "Internal Travel", Description = "One-time allowance for internal travel", Frequency = "Once Off" },
                new() { Name = "Medical Insurance", Description = "Annual medical insurance coverage", Frequency = "Annual" },
                new() { Name = "Eye Care/Dental", Description = "Annual allowance for eye care and dental expenses", Frequency = "Annual" },
                new() { Name = "Seminars/Trips", Description = "Annual allowance for seminars and educational trips", Frequency = "Annual" },
                new() { Name = "Special Equipment", Description = "Annual allowance for special equipment", Frequency = "Annual" },
                new() { Name = "Projects/Research", Description = "Annual allowance for projects and research", Frequency = "Annual" },
                new() { Name = "Tutoring", Description = "Annual allowance for tutoring expenses", Frequency = "Annual" },
                new() { Name = "Registration", Description = "Annual registration fees", Frequency = "Annual" },
                new() { Name = "VISA Fees", Description = "Annual visa application fees", Frequency = "Annual" },
                new() { Name = "VISA Renewal", Description = "Annual visa renewal fees", Frequency = "Annual" },
                new() { Name = "Stationery", Description = "Annual allowance for stationery and supplies", Frequency = "Annual" },
                new() { Name = "Uniform", Description = "Annual allowance for uniforms", Frequency = "Annual" },
                new() { Name = "Protective Clothing", Description = "Annual allowance for protective clothing", Frequency = "Annual" },
                new() { Name = "Attachment Allowance", Description = "Annual allowance for attachments/internships", Frequency = "Annual" },
                new() { Name = "Accommodation", Description = "Monthly accommodation allowance", Frequency = "Monthly" }
            };
            context.AllowanceTypes.AddRange(allowanceTypes);
        }

        // Seed Allowance Statuses
        if (!context.AllowanceStatuses.Any())
        {
            var allowanceStatuses = new List<AllowanceStatus>
            {
                new() { Name = "Pending", Description = "Allowance request pending approval" },
                new() { Name = "Approved", Description = "Allowance approved for payment" },
                new() { Name = "Paid", Description = "Allowance has been paid" },
                new() { Name = "Rejected", Description = "Allowance request rejected" },
                new() { Name = "On Hold", Description = "Allowance payment on hold" },
                new() { Name = "Cancelled", Description = "Allowance request cancelled" }
            };
            context.AllowanceStatuses.AddRange(allowanceStatuses);
        }

        await context.SaveChangesAsync();
    }
}
