// import React, { useEffect } from 'react';

import { useEffect } from "react";

// import Prism from 'prismjs';
// import 'prismjs/themes/prism.css'; // استورد الثيم الخاص بـ Prism.js
// import 'prismjs/themes/prism-tomorrow.css';


const CodeBlock = ({ code, language }) => {
  useEffect(() => {
    // Prism.highlightAll(); // تقوم بتهيئة الألوان لكل الأكواد في الصفحة
  }, []);

  return (
    <pre>
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodeBlock;
