import { useState } from "react";
import { ConfigurationCategory, ConfigurationItem } from "../../types/interfaces";
import FormSection from "../forms/FormSection";
import LookupManagementModal from "../configuration/LookupManagementModal";
import { getAllowanceTypes, createAllowanceType, updateAllowanceType, deleteAllowanceType } from "@/api/allowanceType";
import { getAllowanceStatuses, createAllowanceStatus, updateAllowanceStatus, deleteAllowanceStatus } from "@/api/allowanceStatus";

interface ConfigurationProps {
  onSave: (item: ConfigurationItem) => void;
}

export default function Configuration({ onSave: _onSave }: ConfigurationProps) {
  const [activeCategory, setActiveCategory] = useState("lookups");
  const [editingItem, setEditingItem] = useState<ConfigurationItem | null>(null);
  const [isAllowanceTypeModalOpen, setIsAllowanceTypeModalOpen] = useState(false);
  const [isAllowanceStatusModalOpen, setIsAllowanceStatusModalOpen] = useState(false);

  // Mock configuration data - replace with actual API calls
  const [configCategories] = useState<ConfigurationCategory[]>([
    {
      name: "lookups",
      description: "Manage system lookup values",
      items: [
        { key: "departments.enabled", value: "true", description: "Enable department management", category: "lookups", isEditable: true },
        { key: "facilities.enabled", value: "true", description: "Enable facility management", category: "lookups", isEditable: true },
        { key: "designations.enabled", value: "true", description: "Enable designation management", category: "lookups", isEditable: true },
        { key: "salary_scales.enabled", value: "true", description: "Enable salary scale management", category: "lookups", isEditable: true },
        { key: "sponsors.enabled", value: "true", description: "Enable sponsor management", category: "lookups", isEditable: true }
      ]
    },
    {
      name: "enrollment",
      description: "Enrollment form configuration",
      items: [
        { key: "enrollment.require_travel_info", value: "false", description: "Require travel information for all enrollments", category: "enrollment", isEditable: true },
        { key: "enrollment.require_bond_info", value: "true", description: "Require bond information", category: "enrollment", isEditable: true },
        { key: "enrollment.default_financial_year", value: "2024", description: "Default financial year for new enrollments", category: "enrollment", isEditable: true },
        { key: "enrollment.auto_calculate_duration", value: "true", description: "Auto-calculate duration from dates", category: "enrollment", isEditable: true }
      ]
    },
    {
      name: "system",
      description: "System-wide settings",
      items: [
        { key: "system.app_name", value: "Training Management System", description: "Application name", category: "system", isEditable: true },
        { key: "system.organization", value: "Ministry of Health, Botswana", description: "Organization name", category: "system", isEditable: true },
        { key: "system.timezone", value: "Africa/Gaborone", description: "System timezone", category: "system", isEditable: false },
        { key: "system.version", value: "1.0.0", description: "Application version", category: "system", isEditable: false }
      ]
    }
  ]);

  const activeConfig = configCategories.find(cat => cat.name === activeCategory);

  const handleEdit = (item: ConfigurationItem) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (editingItem) {
      _onSave(editingItem);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleInputChange = (value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, value });
    }
  };

  return (
    <div className="configuration-page">
      <div className="config-layout">
        {/* Category Navigation */}
        <div className="config-sidebar">
          <h3>Configuration Categories</h3>
          <nav className="config-nav">
            {configCategories.map((category) => (
              <button
                key={category.name}
                className={`nav-button ${activeCategory === category.name ? "active" : ""}`}
                onClick={() => setActiveCategory(category.name)}
              >
                <span className="nav-icon">
                  {category.name === "lookups" && "📋"}
                  {category.name === "enrollment" && "📝"}
                  {category.name === "system" && "⚙️"}
                </span>
                <div className="nav-content">
                  <div className="nav-title">{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</div>
                  <div className="nav-description">{category.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Configuration Content */}
        <div className="config-content">
          {/* Lookup Management Section */}
          {activeCategory === "lookups" && (
            <FormSection title="Lookup Data Management">
              <div className="lookup-actions">
                <div className="lookup-grid">
                  <div className="lookup-card">
                    <h4>Allowance Types</h4>
                    <p>Manage allowance types</p>
                    <div className="lookup-stats">
                      <span className="stat">Manage items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => {
                          setIsAllowanceTypeModalOpen(true);
                        }}
                      >
                        Manage
                      </button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Allowance Statuses</h4>
                    <p>Manage allowance statuses</p>
                    <div className="lookup-stats">
                      <span className="stat">Manage items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => setIsAllowanceStatusModalOpen(true)}
                      >
                        Manage
                      </button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Departments</h4>
                    <p>Manage organizational departments</p>
                    <div className="lookup-stats">
                      <span className="stat">4 items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button className="btn btn-primary btn-small">Manage</button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Facilities</h4>
                    <p>Manage healthcare facilities</p>
                    <div className="lookup-stats">
                      <span className="stat">3 items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button className="btn btn-primary btn-small">Manage</button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Designations</h4>
                    <p>Manage job designations</p>
                    <div className="lookup-stats">
                      <span className="stat">4 items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button className="btn btn-primary btn-small">Manage</button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Salary Scales</h4>
                    <p>Manage salary grade scales</p>
                    <div className="lookup-stats">
                      <span className="stat">4 items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button className="btn btn-primary btn-small">Manage</button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>

                  <div className="lookup-card">
                    <h4>Sponsors</h4>
                    <p>Manage training sponsors</p>
                    <div className="lookup-stats">
                      <span className="stat">4 items</span>
                    </div>
                    <div className="lookup-card-actions">
                      <button className="btn btn-primary btn-small">Manage</button>
                      <button className="btn btn-secondary btn-small">Export</button>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {activeConfig && (
            <FormSection title={`${activeConfig.name.charAt(0).toUpperCase() + activeConfig.name.slice(1)} Configuration`}>
              <div className="config-items">
                {activeConfig.items.map((item) => (
                  <div key={item.key} className={`config-item ${!item.isEditable ? "readonly" : ""}`}>
                    <div className="item-header">
                      <div className="item-info">
                        <h4 className="item-key">{item.key}</h4>
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                      </div>
                      <div className="item-actions">
                        {item.isEditable && (
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                        )}
                        {!item.isEditable && (
                          <span className="readonly-badge">Read Only</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-value">
                      <code>{item.value}</code>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>
          )}
        </div>
      </div>

      {/* Allowance Type Management Modal */}
      <LookupManagementModal
        title="Allowance Types"
        isOpen={isAllowanceTypeModalOpen}
        onClose={() => setIsAllowanceTypeModalOpen(false)}
        onFetch={async (page, pageSize, searchTerm) => {
          const response = await getAllowanceTypes(page, pageSize, searchTerm);
          return { data: response.data, totalCount: response.totalCount };
        }}
        onCreate={async (data) => {
          return await createAllowanceType(data);
        }}
        onUpdate={async (id, data) => {
          return await updateAllowanceType(id, data);
        }}
        onDelete={async (id) => {
          await deleteAllowanceType(id);
        }}
      />

      {/* Allowance Status Management Modal */}
      <LookupManagementModal
        title="Allowance Statuses"
        isOpen={isAllowanceStatusModalOpen}
        onClose={() => setIsAllowanceStatusModalOpen(false)}
        onFetch={async (page, pageSize, searchTerm) => {
          const response = await getAllowanceStatuses(page, pageSize, searchTerm);
          return { data: response.data, totalCount: response.totalCount };
        }}
        onCreate={async (data) => {
          return await createAllowanceStatus(data);
        }}
        onUpdate={async (id, data) => {
          return await updateAllowanceStatus(id, data);
        }}
        onDelete={async (id) => {
          await deleteAllowanceStatus(id);
        }}
      />

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Configuration</h3>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Key</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.key}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingItem.description || ""}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Value</label>
                {editingItem.key.includes("enabled") || editingItem.key.includes("require") || editingItem.key.includes("auto") ? (
                  <select
                    className="form-input"
                    value={editingItem.value}
                    onChange={(e) => handleInputChange(e.target.value)}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    value={editingItem.value}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

