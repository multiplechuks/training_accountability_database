import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { MenuItem } from "@/types";

interface SidebarProps {
  activeItem: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "🏠",
    path: "/dashboard"
  },
  {
    id: "participant",
    label: "Participants",
    icon: "👥",
    path: "/participants"
  },
  {
    id: "training",
    label: "Training",
    icon: "📚",
    path: "/training"
  },
  {
    id: "enrollment",
    label: "Enrollment",
    icon: "📝",
    path: "/enrollment"
  },
  {
    id: "allowance",
    label: "Allowances",
    icon: "💰",
    path: "/allowances"
  },
  {
    id: "report",
    label: "Reports",
    icon: "📊",
    path: "/reports"
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: "⚙️",
    path: "/configuration"
  }
];

export default function Sidebar({ activeItem }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="d-md-none btn btn-primary mobile-menu-toggle position-fixed"
        onClick={toggleMobile}
        style={{ top: "1rem", left: "1rem", zIndex: 1051 }}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay d-md-none position-fixed w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1049, top: 0, left: 0 }}
          onClick={closeMobile}
        />
      )}

      <aside className={`sidebar d-flex flex-column ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "show" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="d-flex align-items-center flex-grow-1">
              <div className="sidebar-brand d-flex align-items-center">
                <div className="brand-icon bg-white rounded-circle d-flex align-items-center justify-content-center me-2"
                     style={{ width: "32px", height: "32px", fontSize: "1rem" }}>
                  🇧🇼
                </div>
                <div className="text-white">
                  <h5 className="mb-0 fw-bold">Learning</h5>
                  <small className="text-white-50">and Development</small>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Collapse Toggle */}
          <button 
            className="btn btn-outline-light btn-sm d-none d-md-block"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={isCollapsed ? { margin: "0 auto" } : {}}
          >
            <i className={`fas fa-angle-${isCollapsed ? "right" : "left"}`}></i>
          </button>

          {/* Mobile Close Button */}
          <button 
            className="btn btn-outline-light btn-sm d-md-none"
            onClick={closeMobile}
            title="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-grow-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-link d-flex align-items-center ${activeItem === item.id ? "active" : ""}`}
              title={isCollapsed ? item.label : ""}
              onClick={closeMobile}
            >
              <span className="nav-icon me-3" style={{ minWidth: "20px", textAlign: "center" }}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="nav-text">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="sidebar-footer p-3 border-top border-white-10">
          {user && (
            <div className="user-profile">
              {!isCollapsed ? (
                <div className="d-flex align-items-center mb-3">
                  <div className="user-avatar bg-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: "40px", height: "40px", fontSize: "0.85rem", fontWeight: "bold", color: "#1e40af", minWidth: "40px" }}>
                    {user.firstName?.[0] || "U"}{user.lastName?.[0] || "U"}
                  </div>
                  <div className="user-info flex-grow-1 text-white">
                    <div className="fw-semibold small text-truncate" style={{ maxWidth: "140px" }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-white-50 small text-truncate" style={{ maxWidth: "140px" }}>
                      {user.roles?.[0] || "User"}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm ms-2"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <div className="text-center mb-3">
                  <div className="user-avatar bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
                       style={{ width: "40px", height: "40px", fontSize: "0.85rem", fontWeight: "bold", color: "#1e40af" }}>
                    {user.firstName?.[0] || "U"}{user.lastName?.[0] || "U"}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm w-100"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Footer Brand */}
          <div className="text-center">
            <small className="text-white-50">
              {!isCollapsed ? "Ministry of Health" : "MoH"}
            </small>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        show={showLogoutConfirm}
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

