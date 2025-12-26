import React from "react";

const RichTextRenderer = ({ content }) => {
  if (!content || !Array.isArray(content)) return null;

  const renderNode = (node, index) => {
    const { type, children, text, attributes } = node;

    switch (type) {
      case "paragraph":
        return <p key={index}>{children?.map(renderNode)}</p>;

      case "heading1":
        return <h1 key={index}>{children?.map(renderNode)}</h1>;

      case "heading2":
        return <h2 key={index}>{children?.map(renderNode)}</h2>;

      case "heading3":
        return <h3 key={index}>{children?.map(renderNode)}</h3>;

      case "unordered-list":
        return <ul key={index}>{children?.map(renderNode)}</ul>;

      case "ordered-list":
        return <ol key={index}>{children?.map(renderNode)}</ol>;

      case "list-item":
        return <li key={index}>{children?.map(renderNode)}</li>;

      case "link":
        return (
          <a
            key={index}
            href={attributes?.href || "#"}
            target={attributes?.target || "_blank"}
            rel="noopener noreferrer"
          >
            {children?.map(renderNode)}
          </a>
        );

      case "image":
        return (
          <img
            key={index}
            src={attributes?.src}
            alt={attributes?.alt || ""}
            style={{ maxWidth: "100%" }}
          />
        );

      case "text":
        let textContent = text;
        if (attributes?.bold) textContent = <strong>{textContent}</strong>;
        if (attributes?.italic) textContent = <em>{textContent}</em>;
        if (attributes?.underline) textContent = <u>{textContent}</u>;
        if (attributes?.code) textContent = <code>{textContent}</code>;
        return <React.Fragment key={index}>{textContent}</React.Fragment>;

      default:
        return (
          <React.Fragment key={index}>
            {children?.map(renderNode)}
          </React.Fragment>
        );
    }
  };

  return <div>{content.map(renderNode)}</div>;
};

export default RichTextRenderer;
