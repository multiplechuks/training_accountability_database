import { useState } from "react";
import { Card, CardHeader, CardBody, ConfirmationModal } from "@/components/ui";
import { EnrollmentForm } from "@/components/forms";
import { createEnrollment } from "@/api/enrollment";
import type { ParticipantEnrollmentDto } from "@/types";

export default function EnrollmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleEnrollmentSubmit = async (data: ParticipantEnrollmentDto) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting enrollment data:", data);
      
      // Format the data for the backend - ensure proper date formats and nullable fields
      const submissionData = {
        ...data,
        // Ensure required fields have valid values
        participantFK: data.participantFK || 0,
        trainingFK: data.trainingFK || 0,
        duration: data.duration || 0,
        // Dates - ensure proper ISO format or null
        startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : new Date().toISOString(),
        registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString() : new Date().toISOString(),
        payrollDate: data.payrollDate ? new Date(data.payrollDate).toISOString() : null,
        studyLeaveDate: data.studyLeaveDate ? new Date(data.studyLeaveDate).toISOString() : null,
        allowanceStoppageDate: data.allowanceStoppageDate ? new Date(data.allowanceStoppageDate).toISOString() : null,
        departureDate: data.departureDate ? new Date(data.departureDate).toISOString() : null,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate).toISOString() : null,
        dateBondSigned: data.dateBondSigned ? new Date(data.dateBondSigned).toISOString() : null,
        // Ensure string fields have values
        modeOfStudy: data.modeOfStudy || "FULL_TIME",
        trainingStatus: data.trainingStatus || "PENDING",
        financialYear: data.financialYear || new Date().getFullYear().toString(),
        campusType: data.campusType || "MAIN"
      };
      
      console.log("Formatted submission data:", submissionData);
      
      // Submit to API
      const response = await createEnrollment(submissionData as ParticipantEnrollmentDto);
      console.log("Enrollment created successfully:", response);
      
      setNotificationType("success");
      setNotificationTitle("Enrollment Successful");
      setNotificationMessage("The enrollment has been submitted successfully!");
      setShowNotification(true);
      
      // Optionally redirect or reset form here
      // navigate('/enrollments'); // if using react-router
      
    } catch (error: any) {
      console.error("Failed to submit enrollment:", error);
      
      let errorMessage = "An error occurred while submitting the enrollment";
      
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
      setNotificationTitle("Enrollment Failed");
      setNotificationMessage(errorMessage);
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollmentCancel = () => {
    console.log("Enrollment cancelled");
    // Optionally navigate back or reset form
    // navigate(-1); // Go back
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Training Enrollment</h1>
        <p className="page-subtitle">Enroll participants in trainings</p>
      </div>
      
      <Card>
        <CardHeader 
          title="New Enrollment" 
          subtitle="Complete the form below to enroll a participant"
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
