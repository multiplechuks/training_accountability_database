import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getNomination } from "../../api/training";
import { LoadingSpinner } from "../../components/ui";
import NominationWizard from "../../components/nomination/NominationWizard";
import type { NominationResponseDto } from "../../types";

const getErrorMessage = (err: unknown) => {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    return res?.data?.message;
  }
  return err instanceof Error ? err.message : undefined;
};

export default function NominationProgressPage() {
  const { progressId } = useParams<{ progressId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [nomination, setNomination] = useState<NominationResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isNew = progressId === "new";
  const participantId = searchParams.get("participantId")
    ? parseInt(searchParams.get("participantId")!, 10)
    : undefined;

  const loadNomination = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNomination(id);
      setNomination(data);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load nomination");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isNew && progressId) {
      loadNomination(parseInt(progressId, 10));
    } else {
      setLoading(false);
    }
  }, [isNew, progressId, loadNomination]);

  if (loading) {
    return (
      <div className="container mt-4">
        <LoadingSpinner centered />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate("/nomination/list")}>Back to List</button>
      </div>
    );
  }

  return (
    <NominationWizard
      nominationId={isNew ? undefined : parseInt(progressId!, 10)}
      initialParticipantId={isNew ? participantId : nomination?.participantFK}
      initialNomination={nomination ?? undefined}
      onComplete={() => navigate("/nomination/list")}
      onCancel={() => navigate("/nomination/list")}
    />
  );
}
