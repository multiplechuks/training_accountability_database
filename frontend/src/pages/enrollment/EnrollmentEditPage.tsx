import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, ConfirmationModal } from "@/components/ui";
import { EnrollmentForm } from "@/components/forms";
import { getEnrollment, updateEnrollment } from "@/api/enrollment";
import { NavigationRoutes } from "@/constants";
import type { ParticipantEnrollmentDto, ParticipantEnrollmentResponseDto } from "@/types";

export default function EnrollmentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [enrollment, setEnrollment] = useState<ParticipantEnrollmentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Fetch enrollment data for editing
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) {
        setError("No enrollment ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getEnrollment(parseInt(id));
        setEnrollment(data);
      } catch (err: any) {
        console.error("Error fetching enrollment:", err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          "Failed to load enrollment details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  const handleEnrollmentSubmit = async (data: ParticipantEnrollmentDto) => {
    if (!enrollment?.pk) {
      setError("No enrollment ID available for update");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Updating enrollment data:", data);
      
      // Format the data for the backend - ensure proper date formats and nullable fields
      const submissionData = {
        ...data,
        // Ensure required fields have valid values
        participantFK: data.participantFK || enrollment.participantFK,
        trainingFK: data.trainingFK || enrollment.trainingFK,
        duration: data.duration || enrollment.duration,
        // Dates - ensure proper ISO format or null
        startDate: data.startDate ? new Date(data.startDate).toISOString() : enrollment.startDate,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : enrollment.endDate,
        registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString() : enrollment.registrationDate,
        payrollDate: data.payrollDate ? new Date(data.payrollDate).toISOString() : null,
        studyLeaveDate: data.studyLeaveDate ? new Date(data.studyLeaveDate).toISOString() : null,
        allowanceStoppageDate: data.allowanceStoppageDate ? new Date(data.allowanceStoppageDate).toISOString() : null,
        departureDate: data.departureDate ? new Date(data.departureDate).toISOString() : null,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate).toISOString() : null,
        dateBondSigned: data.dateBondSigned ? new Date(data.dateBondSigned).toISOString() : null,
        // Ensure string fields have values
        modeOfStudy: data.modeOfStudy || enrollment.modeOfStudy || "FULL_TIME",
        trainingStatus: data.trainingStatus || enrollment.trainingStatus || "PENDING",
        financialYear: data.financialYear || enrollment.financialYear || new Date().getFullYear().toString(),
        campusType: data.campusType || enrollment.campusType || "MAIN"
      };
      
      console.log("Formatted submission data:", submissionData);
      
      // Submit to API
      const response = await updateEnrollment(enrollment.pk, submissionData as ParticipantEnrollmentDto);
      console.log("Enrollment updated successfully:", response);
      
      setNotificationType("success");
      setNotificationTitle("Update Successful");
      setNotificationMessage("The enrollment has been updated successfully!");
      setShowNotification(true);
      
    } catch (error: any) {
      console.error("Failed to update enrollment:", error);
      
      let errorMessage = "An error occurred while updating the enrollment";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errors = error.response.data.errors;
        errorMessage = Array.isArray(errors) ? errors.join(", ") : errors;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setNotificationType("error");
      setNotificationTitle("Update Failed");
      setNotificationMessage(errorMessage);
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollmentCancel = () => {
    console.log("Enrollment edit cancelled");
    if (enrollment?.pk) {
      navigate(NavigationRoutes.ENROLLMENT_DETAILS(enrollment.pk));
    } else {
      navigate(NavigationRoutes.ENROLLMENTS);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    // If successful update, navigate to view page
    if (notificationType === "success" && enrollment?.pk) {
      navigate(NavigationRoutes.ENROLLMENT_DETAILS(enrollment.pk));
    }
  };



  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Edit Enrollment</h1>
          <p className="page-subtitle">Modify enrollment information</p>
        </div>
        <div className="d-flex justify-content-center align-items-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading enrollment details...</span>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Edit Enrollment</h1>
          <p className="page-subtitle">Modify enrollment information</p>
        </div>
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error || "Enrollment not found"}
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(NavigationRoutes.ENROLLMENTS)}
        >
          ← Back to Enrollments
        </button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="page-title">Edit Enrollment</h1>
            <p className="page-subtitle">
              Modify enrollment for {enrollment.participant?.fullName} - {enrollment.training?.program}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => enrollment.pk && navigate(NavigationRoutes.ENROLLMENT_DETAILS(enrollment.pk))}
            >
              👁️ View Details
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate(NavigationRoutes.ENROLLMENTS)}
            >
              ← Back to List
            </button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader 
          title="Edit Enrollment Details" 
          subtitle="Update the enrollment information below"
        />
        <CardBody>
          <EnrollmentForm 
            onSubmit={handleEnrollmentSubmit}
            onCancel={handleEnrollmentCancel}
            loading={isSubmitting}
          />
        </CardBody>
      </Card>

      <ConfirmationModal
        show={showNotification}
        title={notificationTitle}
        message={notificationMessage}
        confirmVariant={notificationType as "success" | "danger" | "warning" | "info"}
        confirmText="OK"
        showCancel={false}
        onConfirm={handleNotificationClose}
      />
    </div>
  );
}