import { Configuration } from "@/components/ui";
import type { ConfigurationItem } from "@/types";

export default function ConfigurationPage() {
  const handleConfigurationSave = (item: ConfigurationItem) => {
    // Here you would typically send to API
    alert(`Configuration "${item.key}" saved successfully!`);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">System Configuration</h1>
        <p className="page-subtitle">Manage system settings and configurations</p>
      </div>
      
      <Configuration onSave={handleConfigurationSave} />
    </div>
  );
}

