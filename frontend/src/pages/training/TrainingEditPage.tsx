import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TrainingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/nomination/progress/${id}`, { replace: true });
  }, [id, navigate]);
  return null;
}
