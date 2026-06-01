import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, ConfirmationModal } from "@/components/ui";
import { getNomination, deleteNomination } from "@/api/training";
import { formatTableDate } from "@/utils";
import { LoadingSpinner } from "@/components/ui";
import { NavigationRoutes } from "@/constants";
import type { NominationResponseDto } from "@/types";

export default function TrainingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nomination, setNomination] = useState<NominationResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError("Invalid ID"); setLoading(false); return; }
    getNomination(parseInt(id))
      .then(setNomination)
      .catch(() => setError("Failed to load nomination."))
      .finally(() => setLoading(false));
  }, [id]);

  const confirmDelete = async () => {
    if (!nomination) return;
    setDeleteLoading(true);
    try {
      await deleteNomination(nomination.pk);
      navigate(NavigationRoutes.TRAININGS, { replace: true, state: { message: "Nomination deleted successfully." } });
    } catch {
      setError("Failed to delete nomination.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !nomination) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">{error ?? "Nomination not found."}</div>
        <button className="btn btn-secondary" onClick={() => navigate(NavigationRoutes.TRAININGS)}>← Back</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Nomination Details</h1>
        <p className="page-subtitle">Nomination #{nomination.pk}</p>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary" onClick={() => navigate(`/nomination/progress/${nomination.pk}`)}>✏️ Edit</button>
        <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>🗑️ Delete</button>
        <button className="btn btn-secondary" onClick={() => navigate(NavigationRoutes.TRAININGS)}>← Back</button>
      </div>

      <Card>
        <CardHeader title={`Nomination #${nomination.pk}`} subtitle={`Status: ${nomination.nominationStatus}`} />
        <CardBody>
          <div className="row g-3">
            <div className="col-md-6"><strong>Participant:</strong> {nomination.participantName ?? `#${nomination.participantFK}`}</div>
            <div className="col-md-6"><strong>Nominated Program:</strong> {nomination.nominatedProgramName ?? "-"}</div>
            <div className="col-md-6"><strong>Qualification:</strong> {nomination.qualificationName ?? "-"}</div>
            <div className="col-md-6"><strong>Sponsor Type:</strong> {nomination.sponsorTypeName ?? "-"}</div>
            <div className="col-md-6"><strong>Year of Nomination:</strong> {nomination.yearOfNomination ?? "-"}</div>
            <div className="col-md-6"><strong>Status:</strong> {nomination.nominationStatus}</div>
            {nomination.estimatedBudget != null && (
              <div className="col-md-6"><strong>Estimated Budget:</strong> {nomination.currency ?? ""} {nomination.estimatedBudget.toLocaleString()}</div>
            )}
            {nomination.professionalBody && (
              <div className="col-md-6"><strong>Professional Body:</strong> {nomination.professionalBody}</div>
            )}
            <div className="col-md-6"><strong>Nomination Date:</strong> {formatTableDate(nomination.nominationDate)}</div>
            {nomination.approvalDate && (
              <div className="col-md-6"><strong>Approval Date:</strong> {formatTableDate(nomination.approvalDate)}</div>
            )}
            {nomination.approvedBy && (
              <div className="col-md-6"><strong>Approved By:</strong> {nomination.approvedBy}</div>
            )}
            {nomination.statusReason && (
              <div className="col-12"><strong>Status Reason:</strong> {nomination.statusReason}</div>
            )}
            {nomination.notes && (
              <div className="col-12"><strong>Notes:</strong> {nomination.notes}</div>
            )}
            <div className="col-md-6"><strong>Created:</strong> {formatTableDate(nomination.createdAt)}</div>
            <div className="col-md-6"><strong>Last Updated:</strong> {formatTableDate(nomination.updatedAt)}</div>
          </div>
        </CardBody>
      </Card>

      <ConfirmationModal
        show={showDeleteModal}
        title="Delete Nomination"
        message="Are you sure you want to delete this nomination? This action cannot be undone."
        confirmVariant="danger"
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
