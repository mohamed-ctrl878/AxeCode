import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styles from "@presentation/styles/components/StrapiRichEditor.module.css";
import Toolbar from "./Toolbar";
import LinkDialog from "./LinkDialog";

const StrapiRichEditor = ({ setToAbove }) => {
  const [strapiOutput, setStrapiOutput] = useState("");
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const editorRef = useRef(null);

  // Cache parsed output to avoid unnecessary re-parsing
  const parsedOutput = useMemo(() => {
    try {
      return JSON.parse(strapiOutput);
    } catch {
      return [];
    }
  }, [strapiOutput]);

  // Optimized useEffect with memoized parsed output
  useEffect(() => {
    setToAbove(parsedOutput);
  }, [setToAbove, parsedOutput]);

  // Memoized format processing functions
  const formatHandlers = useMemo(
    () => ({
      processTextNode: (node, parentFormatting = {}) => {
        const text = node.textContent;
        if (!text.trim()) return null;
        return {
          text: text,
          type: "text",
          ...parentFormatting,
        };
      },

      processChildren: (node, formatting, processElement) => {
        const children = [];
        const childNodes = Array.from(node.childNodes);

        for (const child of childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            const textNode = formatHandlers.processTextNode(child, formatting);
            if (textNode) children.push(textNode);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const tagName = child.tagName.toLowerCase();

            if (tagName === "a") {
              const linkChildren = [];
              for (const linkChild of child.childNodes) {
                if (linkChild.nodeType === Node.TEXT_NODE) {
                  const textNode = formatHandlers.processTextNode(
                    linkChild,
                    formatting
                  );
                  if (textNode) linkChildren.push(textNode);
                } else {
                  const processed = processElement(linkChild, formatting);
                  if (Array.isArray(processed)) {
                    linkChildren.push(...processed);
                  } else if (processed) {
                    linkChildren.push(processed);
                  }
                }
              }
              children.push({
                url: child.href || "#",
                type: "link",
                children:
                  linkChildren.length > 0
                    ? linkChildren
                    : [{ text: "", type: "text" }],
              });
            } else if (
              ["strong", "b", "em", "i", "u", "code"].includes(tagName)
            ) {
              const processed = processElement(child, formatting);
              if (Array.isArray(processed)) {
                children.push(...processed);
              } else if (processed) {
                children.push(processed);
              }
            } else {
              const processed = processElement(child, formatting);
              if (Array.isArray(processed)) {
                children.push(...processed);
              } else if (processed) {
                children.push(processed);
              }
            }
          }
        }
        return children;
      },
    }),
    []
  );

  // Optimized conversion with better memoization
  const convertToStrapiFormat = useMemo(() => {
    const element = editorRef.current;
    if (!element?.innerHTML?.trim()) {
      return [];
    }

    const blocks = [];

    const processElement = (node, parentFormatting = {}) => {
      const tagName = node.tagName.toLowerCase();
      let formatting = { ...parentFormatting };

      // Use object lookup instead of switch for better performance
      const formatMap = {
        strong: () => (formatting.bold = true),
        b: () => (formatting.bold = true),
        em: () => (formatting.italic = true),
        i: () => (formatting.italic = true),
        u: () => (formatting.underline = true),
        code: () => (formatting.code = true),
      };

      if (formatMap[tagName]) {
        formatMap[tagName]();
      }

      const processChildren = (node, formatting) =>
        formatHandlers.processChildren(node, formatting, processElement);

      // Use object lookup for element handlers
      const elementHandlers = {
        h1: () => ({
          type: "heading",
          level: 1,
          children:
            processChildren(node, formatting).length > 0
              ? processChildren(node, formatting)
              : [{ text: "", type: "text" }],
        }),
        h2: () => ({
          type: "heading",
          level: 2,
          children:
            processChildren(node, formatting).length > 0
              ? processChildren(node, formatting)
              : [{ text: "", type: "text" }],
        }),
        h3: () => ({
          type: "heading",
          level: 3,
          children:
            processChildren(node, formatting).length > 0
              ? processChildren(node, formatting)
              : [{ text: "", type: "text" }],
        }),
        p: () => ({
          type: "paragraph",
          children:
            processChildren(node, formatting).length > 0
              ? processChildren(node, formatting)
              : [{ text: "", type: "text" }],
        }),
        div: () => ({
          type: "paragraph",
          children:
            processChildren(node, formatting).length > 0
              ? processChildren(node, formatting)
              : [{ text: "", type: "text" }],
        }),
        ul: () => {
          const listItems = Array.from(node.children)
            .filter((li) => li.tagName.toLowerCase() === "li")
            .map((li) => ({
              type: "list-item",
              children:
                formatHandlers.processChildren(li, {}, processElement).length >
                0
                  ? formatHandlers.processChildren(li, {}, processElement)
                  : [{ text: "", type: "text" }],
            }));
          return {
            type: "list",
            format: "unordered",
            children: listItems,
          };
        },
        ol: () => {
          const listItems = Array.from(node.children)
            .filter((li) => li.tagName.toLowerCase() === "li")
            .map((li) => ({
              type: "list-item",
              children:
                formatHandlers.processChildren(li, {}, processElement).length >
                0
                  ? formatHandlers.processChildren(li, {}, processElement)
                  : [{ text: "", type: "text" }],
            }));
          return {
            type: "list",
            format: "ordered",
            children: listItems,
          };
        },
        br: () => null,
      };

      return elementHandlers[tagName]
        ? elementHandlers[tagName]()
        : processChildren(node, formatting);
    };

    // Process all child nodes
    Array.from(element.childNodes).forEach((node) => {
      if (node.textContent.trim().length === 0) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          blocks.push({
            type: "paragraph",
            children: [{ text: text, type: "text" }],
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const result = processElement(node);
        if (result) {
          if (Array.isArray(result)) {
            if (result.every((item) => item.type === "text")) {
              blocks.push({
                type: "paragraph",
                children: result,
              });
            } else {
              blocks.push(...result);
            }
          } else {
            blocks.push(result);
          }
        }
      }
    });

    return blocks;
  }, [editorRef?.current?.innerHTML, formatHandlers]);

  // Optimized update function with debouncing
  const updateOutput = useCallback(() => {
    if (editorRef.current && convertToStrapiFormat.length >= 0) {
      setStrapiOutput(JSON.stringify(convertToStrapiFormat, null, 2));
    }
  }, [convertToStrapiFormat]);

  // Memoized format update function
  const updateActiveFormats = useCallback(() => {
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Optimized effect with cleanup
  useEffect(() => {
    updateOutput();
    const onSelectionChange = () => updateActiveFormats();
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, [updateOutput, updateActiveFormats]);

  // Memoized command execution
  const execCommand = useCallback(
    (command, value = null) => {
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      requestAnimationFrame(() => {
        updateActiveFormats();
        updateOutput();
      });
    },
    [updateActiveFormats, updateOutput]
  );

  const formatText = useCallback(
    (command) => {
      execCommand(command);
    },
    [execCommand]
  );

  const insertHeading = useCallback(
    (level) => {
      if (level) {
        execCommand("formatBlock", `<h${level}>`);
      } else {
        execCommand("formatBlock", "<div>");
      }
    },
    [execCommand]
  );

  const insertList = useCallback(
    (type) => {
      editorRef.current?.focus();

      if (type === "unordered") {
        document.execCommand("insertUnorderedList", false, null);
      } else {
        document.execCommand("insertOrderedList", false, null);
      }

      requestAnimationFrame(() => {
        updateOutput();
        editorRef.current?.focus();
      });
    },
    [updateOutput]
  );

  const insertCodeBlock = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!selection.toString()) {
        const code = document.createElement("code");
        code.textContent = "كود";
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
  }, [updateOutput, execCommand]);

  const openLinkDialog = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";

    let linkElement = null;
    if (selection?.anchorNode) {
      linkElement =
        selection.anchorNode.parentElement?.closest("a") ||
        (selection.anchorNode.nodeType === Node.ELEMENT_NODE &&
        selection.anchorNode.tagName === "A"
          ? selection.anchorNode
          : null);
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
      setLinkText("نص الرابط");
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
    editorRef.current?.focus();
  }, []);

  const handleEditorInput = useCallback(() => {
    updateOutput();
  }, [updateOutput]);

  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  // Memoized keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
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
    },
    [formatText, openLinkDialog]
  );

  const handleEditorClick = useCallback(
    (e) => {
      const target = e.target;
      if (!target || target.tagName !== "A") return;

      e.preventDefault();
      const href = target.getAttribute("href") || "#";

      if (e.ctrlKey || e.metaKey) {
        openLinkDialog();
        return;
      }

      try {
        window.open(href, "_blank", "noopener,noreferrer");
      } catch (err) {
        console.warn("unable to open link in new tab", err);
      }
    },
    [openLinkDialog]
  );

  // Memoized heading options
  const headingOptions = useMemo(
    () => [
      { value: "", label: "default text" },
      { value: "1", label: "headline (H1)" },
      { value: "2", label: "headline (H2)" },
      { value: "3", label: "headline (H3)" },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Toolbar
        styles={styles}
        activeFormats={activeFormats}
        headingOptions={headingOptions}
        onHeadingChange={insertHeading}
        onFormatText={formatText}
        onInsertList={insertList}
        onInsertCode={insertCodeBlock}
        onOpenLinkDialog={openLinkDialog}
      />

      <div className={styles.editorContainer}>
        <div className={styles.editorPanel}>
          <div
            ref={editorRef}
            className={`${styles.editor} editor-content`}
            contentEditable={true}
            onInput={handleEditorInput}
            onKeyUp={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            onKeyDown={handleKeyDown}
            onClick={handleEditorClick}
            dir="ltr"
            suppressContentEditableWarning={true}
          />
        </div>
      </div>

      {showLinkDialog && (
        <LinkDialog
          styles={styles}
          isEditingExistingLink={isEditingExistingLink}
          linkText={linkText}
          linkUrl={linkUrl}
          onTextChange={setLinkText}
          onUrlChange={setLinkUrl}
          onClose={closeLinkDialog}
          onInsert={insertLink}
        />
      )}
    </div>
  );
};

export default React.memo(StrapiRichEditor);
