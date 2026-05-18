import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrainingCreatePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/nomination/start", { replace: true });
  }, [navigate]);
  return null;
}
