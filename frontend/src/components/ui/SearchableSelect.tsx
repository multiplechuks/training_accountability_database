import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Select from "react-select";
import { SearchableSelectProps } from "../../types/interfaces";

interface SelectOption {
  value: number;
  label: string;
  description?: string;
}

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  loading = false,
  error,
  onSearch,
  minSearchLength = 2,
  searchDelay = 300,
  preloadOptions = true // Default to true for better UX
}: SearchableSelectProps) {
  const [searchOptions, setSearchOptions] = useState<SelectOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number>();

  // Convert LookupDto options to react-select format
  const staticOptions: SelectOption[] = useMemo(() => 
    options?.map(option => ({
      value: option.pk,
      label: option.name,
      description: option.description
    })) || [], [options]);

  // Use either search results or static options
  const selectOptions = onSearch ? searchOptions : staticOptions;

  // Search function
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!onSearch) {
      setSearchOptions([]);
      setIsSearching(false);
      return;
    }

    // Only apply minSearchLength restriction for non-empty search terms
    // Allow empty search term for preloading initial options
    if (searchTerm.length > 0 && searchTerm.length < minSearchLength) {
      setSearchOptions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await onSearch(searchTerm);
      const formattedResults = results.map(option => ({
        value: option.pk,
        label: option.name,
        description: option.description
      }));
      setSearchOptions(formattedResults);
    } catch {
      setSearchOptions([]);
    } finally {
      setIsSearching(false);
    }
  }, [onSearch, minSearchLength]);

  // Debounced search using setTimeout
  const handleSearch = useCallback((searchTerm: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(searchTerm);
    }, searchDelay);
  }, [performSearch, searchDelay]);

  // Handle input change for search
  const handleInputChange = (inputValue: string, { action }: { action: string }) => {
    if (action === "input-change" && onSearch) {
      handleSearch(inputValue);
    }
  };

  // Find the selected option
  const selectedOption = selectOptions.find(option => option.value === value) || null;

  const handleChange = (selectedOption: SelectOption | null) => {
    onChange(selectedOption?.value);
  };

  // Load initial options for async mode when component mounts
  useEffect(() => {
    if (onSearch && preloadOptions && selectOptions.length === 0) {
      performSearch("");
    }
  }, [onSearch, preloadOptions, selectOptions.length, performSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      padding: "0.25rem 0.5rem",
      border: `2px solid ${error ? "#ef4444" : state.isFocused ? "var(--bs-botswana-blue, #0066cc)" : "var(--form-control-border, #d1d5db)"}`,
      borderRadius: "8px",
      backgroundColor: "var(--form-control-bg, white)",
      minHeight: "48px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(0, 102, 204, 0.1)" : "none",
      "&:hover": {
        borderColor: "var(--bs-botswana-blue, #0066cc)"
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--form-control-placeholder, #9ca3af)"
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#374151",
      fontWeight: "500"
    }),
    menu: (provided: any) => ({
      ...provided,
      border: "2px solid var(--bs-botswana-blue, #0066cc)",
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      zIndex: 9999
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "var(--bs-botswana-blue, #0066cc)" 
        : state.isFocused 
        ? "#f8fafc" 
        : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "0.75rem",
      cursor: "pointer",
      borderLeft: state.isSelected ? "3px solid var(--bs-botswana-blue, #0066cc)" : "none"
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#374151"
    }),
    loadingMessage: (provided: any) => ({
      ...provided,
      color: "#6b7280"
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: "#6b7280"
    })
  };

  // Custom option component to show description
  const formatOptionLabel = (option: SelectOption) => (
    <div>
      <div style={{ fontWeight: "500", color: "#374151" }}>
        {option.label}
      </div>
      {option.description && (
        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
          {option.description}
        </div>
      )}
    </div>
  );

  return (
    <div className="searchable-select-wrapper">
      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isLoading={loading || isSearching}
        isSearchable={true}
        isClearable={true}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={({ inputValue }) => 
          onSearch 
            ? inputValue 
              ? `No results found for "${inputValue}"`
              : "Start typing to search or scroll through options..."
            : "No options found"
        }
        loadingMessage={() => "Searching..."}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        filterOption={onSearch ? () => true : undefined} // Disable built-in filtering when using async search
      />
      {error && (
        <div style={{ 
          marginTop: "0.5rem", 
          fontSize: "0.75rem", 
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem"
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
