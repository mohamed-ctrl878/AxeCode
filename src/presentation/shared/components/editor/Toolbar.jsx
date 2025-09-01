import React, { memo } from 'react';

const Toolbar = memo(({ 
  styles, 
  activeFormats, 
  headingOptions,
  onHeadingChange,
  onFormatText,
  onInsertList,
  onInsertCode,
  onOpenLinkDialog 
}) => {
  return (
    <div className={styles.toolbar}>
      <select
        className={styles.toolbarSelect}
        onChange={(e) => onHeadingChange(e.target.value)}
        defaultValue=""
      >
        {headingOptions.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <button
        type="button"
        className={`${styles.toolbarButton} ${
          activeFormats.bold ? styles.toolbarButtonActive : ""
        }`}
        onClick={() => onFormatText("bold")}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <button
        type="button"
        className={`${styles.toolbarButton} ${
          activeFormats.italic ? styles.toolbarButtonActive : ""
        }`}
        onClick={() => onFormatText("italic")}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <button
        type="button"
        className={`${styles.toolbarButton} ${
          activeFormats.underline ? styles.toolbarButtonActive : ""
        }`}
        onClick={() => onFormatText("underline")}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <button
        type="button"
        className={styles.toolbarButton}
        onClick={() => onInsertList("unordered")}
        title="Unordered List"
      >
        • List
      </button>

      <button
        type="button"
        className={styles.toolbarButton}
        onClick={() => onInsertList("ordered")}
        title="Ordered List"
      >
        1. List
      </button>

      <button
        type="button"
        className={styles.toolbarButton}
        onClick={onInsertCode}
        title="Code Block"
      >
        &lt;/&gt; Code
      </button>

      <button
        type="button"
        className={styles.toolbarButton}
        onClick={onOpenLinkDialog}
        title="Add Link (Ctrl+K)"
      >
        🔗 Link
      </button>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
