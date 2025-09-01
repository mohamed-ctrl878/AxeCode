import React, { memo } from 'react';

const LinkDialog = memo(({
  styles,
  isEditingExistingLink,
  linkText,
  linkUrl,
  onTextChange,
  onUrlChange,
  onClose,
  onInsert,
}) => {
  return (
    <>
      <div className={styles.linkDialogOverlay} onClick={onClose} />
      <div className={styles.linkDialog}>
        <h3 className={styles.linkDialogTitle}>
          {isEditingExistingLink ? "Edit Link" : "Insert Link"}
        </h3>

        <label className={styles.inputLabel}>Display Text</label>
        <input
          type="text"
          className={styles.linkDialogInput}
          placeholder="Link display text"
          value={linkText}
          onChange={(e) => onTextChange(e.target.value)}
        />

        <label className={styles.inputLabel}>URL</label>
        <input
          type="text"
          className={styles.linkDialogInput}
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onInsert();
            }
          }}
          autoFocus
        />

        <div className={styles.linkDialogButtons}>
          <button
            type="button"
            className={`${styles.linkDialogButton} ${styles.linkDialogButtonSecondary}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.linkDialogButton} ${styles.linkDialogButtonPrimary}`}
            onClick={onInsert}
          >
            {isEditingExistingLink ? "Update" : "Insert"}
          </button>
        </div>
      </div>
    </>
  );
});

LinkDialog.displayName = 'LinkDialog';

export default LinkDialog;
