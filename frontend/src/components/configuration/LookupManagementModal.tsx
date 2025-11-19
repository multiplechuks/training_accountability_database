import { useState, useEffect } from "react";
import type { LookupDto } from "@/types";

interface LookupManagementModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onFetch: (page: number, pageSize: number, searchTerm?: string) => Promise<{ data: LookupDto[]; totalCount: number }>;
    onCreate: (data: { name: string; description?: string }) => Promise<LookupDto>;
    onUpdate: (id: number, data: { name?: string; description?: string }) => Promise<LookupDto>;
    onDelete: (id: number) => Promise<void>;
}

export default function LookupManagementModal({
    title,
    isOpen,
    onClose,
    onFetch,
    onCreate,
    onUpdate,
    onDelete
}: LookupManagementModalProps) {
    const [items, setItems] = useState<LookupDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<LookupDto | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            fetchItems();
            // Reset form state when modal opens
            setIsCreating(false);
            setEditingItem(null);
            setFormData({ name: "", description: "" });
            setSearchTerm("");
            setPage(1);
        }
    }, [isOpen]);

    // Fetch items when page or search term changes
    useEffect(() => {
        if (isOpen) {
            fetchItems();
        }
    }, [page, searchTerm]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const result = await onFetch(page, pageSize, searchTerm || undefined);
            setItems(result.data);
            setTotalCount(result.totalCount);
        } catch (error) {
            console.error("Error fetching items:", error);
            alert("Error loading data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            alert("Name is required");
            return;
        }

        setLoading(true);
        try {
            await onCreate(formData);
            setFormData({ name: "", description: "" });
            setIsCreating(false);
            fetchItems();
        } catch (error: any) {
            console.error("Error creating item:", error);
            alert(error.response?.data?.message || error.response?.data || "Error creating item");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingItem || !formData.name.trim()) {
            alert("Name is required");
            return;
        }

        setLoading(true);
        try {
            await onUpdate(editingItem.pk, formData);
            setEditingItem(null);
            setFormData({ name: "", description: "" });
            fetchItems();
        } catch (error: any) {
            console.error("Error updating item:", error);
            alert(error.response?.data?.message || error.response?.data || "Error updating item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        setLoading(true);
        try {
            await onDelete(id);
            fetchItems();
        } catch (error: any) {
            console.error("Error deleting item:", error);
            alert(error.response?.data?.message || error.response?.data || "Error deleting item");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: LookupDto) => {
        setEditingItem(item);
        setFormData({ name: item.name, description: item.description || "" });
        setIsCreating(false);
    };

    const handleCancel = () => {
        setEditingItem(null);
        setIsCreating(false);
        setFormData({ name: "", description: "" });
    };

    const handleAddNew = () => {
        setIsCreating(true);
        setEditingItem(null);
        setFormData({ name: "", description: "" });
    };

    if (!isOpen) return null;

    console.log("Rendering LookupManagementModal for:", title, "isOpen:", isOpen);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div 
            className="modal-overlay" 
            onClick={onClose} 
            style={{ 
                zIndex: 1100,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div 
                className="modal modal-large" 
                onClick={(e) => e.stopPropagation()} 
                style={{ 
                    backgroundColor: "white",
                    minWidth: "600px",
                    maxWidth: "900px",
                    borderRadius: "8px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "90vh"
                }}
            >
                <div className="modal-header" style={{ padding: "0.75rem 1rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Manage {title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-content" style={{ padding: "0.75rem 1rem", overflowY: "auto", overflowX: "auto", maxHeight: "calc(90vh - 150px)" }}>
                    {/* Search and Add New */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            style={{ maxWidth: "300px" }}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleAddNew}
                            disabled={loading || isCreating || !!editingItem}
                        >
                            ➕ Add New
                        </button>
                    </div>

                    {/* Create/Edit Form */}
                    {(isCreating || editingItem) && (
                        <div className="card mb-2" style={{ backgroundColor: "#f8f9fa", maxHeight: "200px", overflowY: "auto" }}>
                            <div className="card-body" style={{ padding: "0.75rem" }}>
                                <h6 style={{ margin: "0 0 0.5rem 0", fontWeight: 600 }}>{isCreating ? "Create New" : "Edit"}</h6>
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" style={{ marginBottom: "0.25rem", fontSize: "0.875rem" }}>Name *</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label" style={{ marginBottom: "0.25rem", fontSize: "0.875rem" }}>Description</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter description (optional)"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2" style={{ marginTop: "0.5rem" }}>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={isCreating ? handleCreate : handleUpdate}
                                        disabled={loading || !formData.name.trim()}
                                    >
                                        {loading ? "Saving..." : (isCreating ? "Create" : "Update")}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="table-responsive">
                        {loading && items.length === 0 ? (
                            <div className="text-center py-3">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-3 text-muted">
                                <p style={{ margin: 0 }}>No items found.</p>
                            </div>
                        ) : (
                            <table className="table table-hover table-sm" style={{ marginBottom: "0.5rem" }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ padding: "0.5rem" }}>ID</th>
                                        <th style={{ padding: "0.5rem" }}>Name</th>
                                        <th style={{ padding: "0.5rem" }}>Description</th>
                                        <th style={{ width: "120px", padding: "0.5rem" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.pk}>
                                            <td style={{ padding: "0.5rem" }}>{item.pk}</td>
                                            <td style={{ padding: "0.5rem" }}><strong>{item.name}</strong></td>
                                            <td style={{ padding: "0.5rem" }}>{item.description || "—"}</td>
                                            <td style={{ padding: "0.5rem" }}>
                                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        disabled={loading || isCreating || !!editingItem}
                                                        title="Edit"
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: loading || isCreating || !!editingItem ? "not-allowed" : "pointer",
                                                            padding: "0.25rem",
                                                            fontSize: "1.1rem",
                                                            opacity: loading || isCreating || !!editingItem ? 0.5 : 1
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.pk, item.name)}
                                                        disabled={loading || isCreating || !!editingItem}
                                                        title="Delete"
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: loading || isCreating || !!editingItem ? "not-allowed" : "pointer",
                                                            padding: "0.25rem",
                                                            fontSize: "1.1rem",
                                                            opacity: loading || isCreating || !!editingItem ? 0.5 : 1
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} items
                            </div>
                            <div className="btn-group btn-group-sm">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                >
                                    Previous
                                </button>
                                <button className="btn btn-outline-secondary" disabled>
                                    Page {page} of {totalPages}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || loading}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{ padding: "0.5rem 1rem", borderTop: "1px solid #dee2e6", marginTop: "auto" }}>
                    <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
