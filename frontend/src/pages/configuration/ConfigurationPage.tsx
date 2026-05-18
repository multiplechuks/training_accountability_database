import { useNavigate } from "react-router-dom";
import { Configuration } from "@/components/ui";
import type { ConfigurationItem } from "@/types";

export default function ConfigurationPage() {
  const navigate = useNavigate();

  const handleConfigurationSave = (item: ConfigurationItem) => {
    alert(`Configuration "${item.key}" saved successfully!`);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">System Configuration</h1>
        <p className="page-subtitle">Manage system settings and configurations</p>
      </div>

      <Configuration onSave={handleConfigurationSave} onNavigate={navigate} />
    </div>
  );
}

