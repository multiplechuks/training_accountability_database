import { useState } from "react";
import { FormSectionProps } from "../../types/interfaces";

export default function FormSection({ 
  title, 
  children, 
  collapsible = false, 
  defaultCollapsed = false 
}: FormSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`form-section ${isCollapsed ? "collapsed" : ""}`}>
      <div 
        className={`section-header ${collapsible ? "clickable" : ""}`}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <h3 className="section-title">{title}</h3>
        {collapsible && (
          <span className={`collapse-icon ${isCollapsed ? "collapsed" : ""}`}>
            {isCollapsed ? "▼" : "▲"}
          </span>
        )}
      </div>
      
      <div className={`section-content ${isCollapsed ? "hidden" : ""}`}>
        {children}
      </div>
    </div>
  );
}
