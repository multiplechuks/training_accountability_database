import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// The enrollment wizard has been superseded by the Nomination wizard.
export default function EnrollmentWizardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get("participantId");

  useEffect(() => {
    const target = participantId
      ? `/nomination/start?participantId=${participantId}`
      : "/nomination/start";
    navigate(target, { replace: true });
  }, [navigate, participantId]);

  return null;
}
