import { useState } from "react";
import type { Stage2NextOfKinDto } from "@/types";

interface Props {
  onComplete: (data: Stage2NextOfKinDto) => void;
  onBack: () => void;
  loading?: boolean;
  initialData?: Partial<Stage2NextOfKinDto>;
}

export default function Stage2NextOfKin({ onComplete, onBack, loading, initialData }: Props) {
  const [formData, setFormData] = useState<Stage2NextOfKinDto>({
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    relationship: initialData?.relationship || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    idNo: initialData?.idNo || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <div className="alert alert-info">
            <strong>Note:</strong> Even if this participant already exists, we need to capture/update their next of kin information as it may have changed.
          </div>
        </div>

        <div className="col-md-6">
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

        <div className="col-md-6">
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

        <div className="col-md-6">
          <label htmlFor="relationship" className="form-label">Relationship *</label>
          <select
            id="relationship"
            name="relationship"
            className="form-select"
            value={formData.relationship}
            onChange={handleChange}
            required
          >
            <option value="">Select Relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Child">Child</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-md-6">
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

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            placeholder="+265997654321"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
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

        <div className="col-12 mt-4">
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                "Next: Nomination →"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
