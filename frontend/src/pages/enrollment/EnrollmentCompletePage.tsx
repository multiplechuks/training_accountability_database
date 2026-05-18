import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Enrollment complete page: redirect to admissions list
export default function EnrollmentCompletePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/enrollments", { replace: true });
  }, [navigate]);
  return null;
}
