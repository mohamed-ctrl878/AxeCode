# ✅ Upload Problem Page Styling - Brutalist Update

## 🎨 Design Overhaul
The `add-problem` (UploadProblem) page has been updated to fully comply with the **Brutalist/Clean Design System**.

### 🔧 Key Changes

1.  **CSS Module Rewrite** (`upload-problem.module.css`):
    -   Replaced soft gradients and shadows with **solid borders** and **hard shadows**.
    -   Used core design tokens:
        -   `var(--border-dark)` (3px solid black)
        -   `var(--shadow-solid)` (3px 3px 0px black)
        -   `var(--main-bg-color)`
        -   `var(--text-primary)` / `var(--white)`
    -   Redesigned **Stepper** to be cleaner and more architectural.
    -   Updated **Form Inputs** to have thick borders and clear focus states.
    -   Updated **Buttons** to use the standard `btnPrimary` / `btnSecondary` styles.

2.  **Component Updates**:
    -   **UploadProblem.jsx**: Removed legacy theme classes (`lightTheme`, `darkTheme`) in favor of global CSS variable support.

### 📱 Responsive Design
-   **Desktop**: Centered card layout (max 800px).
-   **Mobile**: Full width, adjusted padding, vertical button layout.

### 🧩 Components Covered
The styling now supports all steps of the wizard:
-   `StepFunNamInForm`
-   `StepDificulty` (Radio buttons + option cards)
-   `StepTstCases` (Test case items)
-   `SwitchersBtnsMForm` (Navigation buttons)

## 🛠️ Usage
No implementation changes needed. The components effectively import the updated CSS module and classes map 1:1.

## ⚠️ Notes
-   Classes like `.active`, `.error`, `.formControl` were preserved to ensure seamless integration with existing logic in Step components.
-   The previous "modern" look (gradients, rounded corners) is completely replaced by the "raw" brutalist aesthetic.

**Status**: ✅ Complete & Verified
