import { useState } from "react";
import type { Stage1ParticipantDto } from "@/types";
import { LoadingSpinner } from "@/components/ui";

interface Props {
  onComplete: (data: Stage1ParticipantDto) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Stage1ParticipantDto>;
}

export default function Stage1Participant({ onComplete, onCancel, loading, initialData }: Props) {
  const [formData, setFormData] = useState<Stage1ParticipantDto>({
    title: initialData?.title || "",
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    middlename: initialData?.middlename || "",
    idNo: initialData?.idNo || "",
    sex: initialData?.sex || "",
    dob: initialData?.dob || "",
    idType: initialData?.idType || "National ID",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    workTelephone: initialData?.workTelephone || "",
    designationFK: initialData?.designationFK,
    departmentOrFacility: initialData?.departmentOrFacility || "",
    dutyStation: initialData?.dutyStation || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "designationFK" ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Personal Information */}
        <div className="col-12">
          <h5 className="border-bottom pb-2">Personal Information</h5>
        </div>

        <div className="col-md-2">
          <label htmlFor="title" className="form-label">Title *</label>
          <select
            id="title"
            name="title"
            className="form-select"
            value={formData.title}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Miss">Miss</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="firstname" className="form-label">First Name *</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className="form-control"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="middlename" className="form-label">Middle Name</label>
          <input
            type="text"
            id="middlename"
            name="middlename"
            className="form-control"
            value={formData.middlename}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="lastname" className="form-label">Last Name *</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            className="form-control"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="sex" className="form-label">Sex *</label>
          <select
            id="sex"
            name="sex"
            className="form-select"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="dob" className="form-label">Date of Birth *</label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="form-control"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="idType" className="form-label">ID Type *</label>
          <select
            id="idType"
            name="idType"
            className="form-select"
            value={formData.idType}
            onChange={handleChange}
            required
          >
            <option value="National ID">National ID</option>
            <option value="Passport">Passport</option>
            <option value="Driver's License">Driver's License</option>
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="idNo" className="form-label">ID Number *</label>
          <input
            type="text"
            id="idNo"
            name="idNo"
            className="form-control"
            value={formData.idNo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Information */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Contact Information</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            placeholder="+265991234567"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="workTelephone" className="form-label">Work Telephone</label>
          <input
            type="tel"
            id="workTelephone"
            name="workTelephone"
            className="form-control"
            placeholder="+265881234567"
            value={formData.workTelephone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-12">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Employment Information */}
        <div className="col-12 mt-4">
          <h5 className="border-bottom pb-2">Employment Information (Optional)</h5>
        </div>

        <div className="col-md-6">
          <label htmlFor="departmentOrFacility" className="form-label">Department/Facility</label>
          <input
            type="text"
            id="departmentOrFacility"
            name="departmentOrFacility"
            className="form-control"
            value={formData.departmentOrFacility}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="dutyStation" className="form-label">Duty Station</label>
          <input
            type="text"
            id="dutyStation"
            name="dutyStation"
            className="form-control"
            value={formData.dutyStation}
            onChange={handleChange}
          />
        </div>

        {/* Form Actions */}
        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Next: Next of Kin →"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
