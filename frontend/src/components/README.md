# Component Organization

This document describes the organized component structure for the Training Management System.

## Folder Structure

```
src/components/
├── layout/           # Layout and navigation components
│   ├── Layout.tsx    # Main application layout
│   ├── Layout.css
│   ├── Sidebar.tsx   # Navigation sidebar
│   ├── Sidebar.css
│   └── index.ts      # Export file
├── ui/               # Reusable UI components
│   ├── SearchableSelect.tsx  # Dropdown with search
│   ├── SearchableSelect.css
│   ├── Configuration.tsx     # System configuration UI
│   ├── Configuration.css
│   └── index.ts              # Export file
├── forms/            # Form-related components
│   ├── FormSection.tsx       # Collapsible form sections
│   ├── FormSection.css
│   ├── EnrollmentForm.tsx    # Training enrollment form
│   ├── EnrollmentForm.css
│   └── index.ts              # Export file
└── index.ts          # Main export file
```

## Component Categories

### Layout Components (`/layout`)
Components responsible for page structure and navigation:
- **Layout**: Main application wrapper with sidebar and content area
- **Sidebar**: Navigation menu with Botswana flag colors

### UI Components (`/ui`)
Reusable interface components:
- **SearchableSelect**: Dropdown with search functionality
- **Configuration**: System settings and lookup management

### Form Components (`/forms`)
Form-specific components:
- **FormSection**: Collapsible form sections with consistent styling
- **EnrollmentForm**: Complete training enrollment form with all sections

## Import Examples

```typescript
// Direct imports (recommended for specific components)
import Layout from "./components/layout/Layout";
import EnrollmentForm from "./components/forms/EnrollmentForm";
import SearchableSelect from "./components/ui/SearchableSelect";

// Category imports (using index files)
import { Layout, Sidebar } from "./components/layout";
import { FormSection, EnrollmentForm } from "./components/forms";
import { SearchableSelect, Configuration } from "./components/ui";

// All components
import { Layout, EnrollmentForm, SearchableSelect } from "./components";
```

## Benefits

1. **Better Organization**: Components are grouped by their purpose
2. **Easier Maintenance**: Related components are located together
3. **Improved Reusability**: Clear separation between UI and form components
4. **Scalability**: Easy to add new components to the appropriate category
5. **Cleaner Imports**: Use category-based imports for better readability

## Adding New Components

When adding new components, follow this structure:

1. **Layout components**: Add to `/layout` if they're structural (headers, footers, navigation)
2. **UI components**: Add to `/ui` if they're reusable interface elements (buttons, modals, inputs)
3. **Form components**: Add to `/forms` if they're form-specific (validators, input groups, form layouts)

Remember to:
- Update the appropriate `index.ts` file
- Include both `.tsx` and `.css` files in the same folder
- Use relative imports within the same category
- Update this README when adding new categories
