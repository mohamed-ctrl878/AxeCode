import { useCallback, useEffect, useState } from 'react';

export const useEditorCommands = (editorRef, updateOutput, updateActiveFormats) => {
  const execCommand = useCallback((command, value = null) => {
    try {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      requestAnimationFrame(() => {
        updateActiveFormats();
        updateOutput();
      });
    } catch (error) {
      console.error(`Error executing command: ${command}`, error);
    }
  }, [editorRef, updateActiveFormats, updateOutput]);

  const formatText = useCallback((command) => {
    execCommand(command);
  }, [execCommand]);

  const insertHeading = useCallback((level) => {
    if (level) {
      execCommand("formatBlock", `<h${level}>`);
    } else {
      execCommand("formatBlock", "<div>");
    }
  }, [execCommand]);

  const insertList = useCallback((type) => {
    editorRef.current?.focus();
    execCommand(type === "unordered" ? "insertUnorderedList" : "insertOrderedList");
  }, [editorRef, execCommand]);

  const insertCodeBlock = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!selection.toString()) {
        const code = document.createElement("code");
        code.textContent = "code";
        range.insertNode(code);

        const newRange = document.createRange();
        newRange.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        try {
          const contents = range.extractContents();
          const code = document.createElement("code");
          code.appendChild(contents);
          range.insertNode(code);
        } catch (e) {
          execCommand("insertHTML", `<code>${selection.toString()}</code>`);
        }
      }
      requestAnimationFrame(() => {
        updateOutput();
        editorRef.current?.focus();
      });
    }
  }, [editorRef, updateOutput, execCommand]);

  return {
    execCommand,
    formatText,
    insertHeading,
    insertList,
    insertCodeBlock,
  };
};

export const useEditorKeyboard = (formatText, openLinkDialog) => {
  return useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      const keyHandlers = {
        b: () => formatText("bold"),
        i: () => formatText("italic"),
        u: () => formatText("underline"),
        k: () => openLinkDialog(),
      };

      if (keyHandlers[e.key]) {
        e.preventDefault();
        keyHandlers[e.key]();
      }
    }
  }, [formatText, openLinkDialog]);
};

export const useLinkDialog = (execCommand) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  const openLinkDialog = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";

    let linkElement = null;
    if (selection?.anchorNode) {
      linkElement = selection.anchorNode.parentElement?.closest("a") ||
        (selection.anchorNode.nodeType === Node.ELEMENT_NODE &&
        selection.anchorNode.tagName === "A" ? selection.anchorNode : null);
    }

    if (linkElement) {
      setLinkText(linkElement.textContent);
      setLinkUrl(linkElement.href);
      setIsEditingExistingLink(true);

      const range = document.createRange();
      range.selectNode(linkElement);
      selection.removeAllRanges();
      selection.addRange(range);
      setCurrentSelection(range.cloneRange());
    } else if (selectedText) {
      setLinkText(selectedText);
      setLinkUrl("https://");
      setIsEditingExistingLink(false);
      setCurrentSelection(selection.getRangeAt(0).cloneRange());
    } else {
      setLinkText("Link text");
      setLinkUrl("https://");
      setIsEditingExistingLink(false);
      if (selection?.rangeCount > 0) {
        setCurrentSelection(selection.getRangeAt(0).cloneRange());
      } else {
        setCurrentSelection(null);
      }
    }

    setShowLinkDialog(true);
  }, []);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText && currentSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(currentSelection);

      const safeUrl = /^(http|https):\/\//i.test(linkUrl)
        ? linkUrl
        : `https://${linkUrl.replace(/^\/+/, "")}`;

      const linkHtml = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      execCommand("insertHTML", linkHtml);

      closeLinkDialog();
    }
  }, [linkUrl, linkText, currentSelection, execCommand]);

  const closeLinkDialog = useCallback(() => {
    setShowLinkDialog(false);
    setLinkText("");
    setLinkUrl("");
    setIsEditingExistingLink(false);
    setCurrentSelection(null);
  }, []);

  return {
    showLinkDialog,
    linkText,
    linkUrl,
    isEditingExistingLink,
    openLinkDialog,
    insertLink,
    closeLinkDialog,
    setLinkText,
    setLinkUrl,
  };
};
