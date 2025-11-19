import React from "react";

// Types for different card variants
export interface BaseCardProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface CardBodyProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Stat Card specific props
export interface StatCardProps extends BaseCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
  icon?: React.ReactNode;
}

// Icon Card specific props
export interface IconCardProps extends BaseCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconColor?: "primary" | "success" | "warning" | "danger" | "info";
  value?: string | number;
  action?: React.ReactNode;
}

// Main Card Component
export const Card: React.FC<BaseCardProps> = ({ 
  className = "", 
  children, 
  onClick, 
  hover = true 
}) => {
  const baseClasses = `card ${hover ? "card-hover" : ""} ${className}`.trim();
  
  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  children, 
  actions 
}) => {
  return (
    <div className="card-header d-flex justify-content-between">
      <div className="card-header-content">
        {(title || subtitle) && (
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
      {actions && (
        <div className="card-header-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

// Card Body Component
export const CardBody: React.FC<CardBodyProps> = ({ 
  children, 
  padding = "md" 
}) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "card-body",
    lg: "p-4"
  };

  return (
    <div className={paddingClasses[padding]}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`card-footer ${className}`.trim()}>
      {children}
    </div>
  );
};

// Stat Card Component (for dashboard statistics)
export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  color = "primary", 
  icon, 
  className = "", 
  onClick,
  hover = true 
}) => {
  const colorClasses = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info"
  };

  return (
    <Card className={`stat-card ${className}`} onClick={onClick} hover={hover}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          <div className="stat-content">
            <h3 className="stat-title">{title}</h3>
            <div className={`stat-number ${colorClasses[color]}`}>
              {value}
            </div>
            {subtitle && <p className="text-secondary stat-subtitle">{subtitle}</p>}
            {trend && (
              <div className={`stat-trend ${trend.isPositive ? "text-success" : "text-danger"}`}>
                <span className="trend-icon">
                  {trend.isPositive ? "↗" : "↘"}
                </span>
                <span className="trend-value">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`stat-icon ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// Icon Card Component (for feature cards with icons)
export const IconCard: React.FC<IconCardProps> = ({ 
  title, 
  description, 
  icon, 
  iconColor = "primary", 
  value, 
  action, 
  className = "", 
  onClick,
  hover = true 
}) => {
  const iconColorClasses = {
    primary: "primary",
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "info"
  };

  return (
    <Card className={`icon-card-wrapper ${className}`} onClick={onClick} hover={hover}>
      <CardBody>
        <div className="icon-card">
          <div className={`icon ${iconColorClasses[iconColor]}`}>
            {icon}
          </div>
          <div className="content">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {value && <div className="icon-card-value">{value}</div>}
          </div>
        </div>
        {action && (
          <div className="icon-card-action mt-3">
            {action}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// Export all components as named exports
export default Card;
