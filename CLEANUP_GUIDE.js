#!/usr/bin/env node

/**
 * Script to update all CSS Module files to use Clean Brutalist theme
 * This removes gradients, glassmorphism, and complex effects
 */

const fs = require('fs');
const path = require('path');

// Patterns to find and replace
const replacements = [
  // Remove backdrop-filter
  {
    pattern: /backdrop-filter:\s*blur\([^;]+\);?/g,
    replacement: ''
  },
  
  // Replace gradient backgrounds with solid colors
  {
    pattern: /background:\s*linear-gradient\([^;]+var\(--primary[^;]+\);?/g,
    replacement: 'background-color: var(--text-primary);'
  },
  
  // Replace gradient text with regular text color
  {
    pattern: /-webkit-background-clip:\s*text;?\s*-webkit-text-fill-color:\s*transparent;?\s*background-clip:\s*text;?/g,
    replacement: 'color: var(--text-primary);'
  },
  
  // Replace blur filters
  {
    pattern: /filter:\s*blur\([^;]+\);?/g,
    replacement: ''
  },
  
  // Replace complex box-shadows with simple ones
  {
    pattern: /box-shadow:\s*0\s+\d+px\s+\d+px\s+[^;,]+,\s*0\s+[^;]+;/g,
    replacement: 'box-shadow: var(--shadow-sm);'
  },
  
  // Replace large border-radius with smaller ones
  {
    pattern: /border-radius:\s*var\(--radius-xl\)/g,
    replacement: 'border-radius: 8px'
  },
  {
    pattern: /border-radius:\s*var\(--radius-lg\)/g,
    replacement: 'border-radius: 4px'
  },
  {
    pattern: /border-radius:\s*var\(--radius-md\)/g,
    replacement: 'border-radius: 3px'
  },
  
  // Replace complex transitions
  {
    pattern: /transition:\s*var\(--transition-normal\)/g,
    replacement: 'transition: all 0.3s ease'
  },
  {
    pattern: /transition:\s*var\(--transition-fast\)/g,
    replacement: 'transition: all 0.3s ease'
  }
];

// نظام الألوان الجديد
const colorReplacements = `
/* Clean Brutalist Theme Variables */
:root {
  --main-bg-color: #f0eee6;
  --text-primary: #141413;
  --text-secondary: #5c5b5b;
  --text-muted: #aaa;
  --surface-card: #e3dacc;
  --white: rgba(255, 255, 255, 0.87);
  --border-dark: #141413;
  --border-medium: #ddd;
  --border-light: #f0f0f0;
  --shadow-solid: 3px 3px 0px black;
  --shadow-soft-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-soft-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}
`;

console.log('🎨 AxeCode CSS Cleanup Tool - Clean Brutalist Migration');
console.log('======================================================\n');
console.log('This script will:');
console.log('1. Remove backdrop-filter (glassmorphism)');
console.log('2. Replace gradients with solid colors');
console.log('3. Simplify box-shadows');
console.log('4. Reduce border-radius values');
console.log('5. Clean up complex transitions\n');

console.log('⚠️  Please backup your files before running this script!\n');
console.log('To run this script:');
console.log('1. Save it as update-styles.js in the root directory');
console.log('2. Run: node update-styles.js\n');

console.log('📝 Manual steps needed:');
console.log('1. Update each .module.css file to import ../theme.css');
console.log('2. Replace var(--primary) with var(--text-primary)');
console.log('3. Replace var(--glass) with var(--surface-card)');
console.log('4. Test each component after changes');
console.log('\n🎯 Focus on these files first:');
console.log('- pages/community.module.css');
console.log('- pages/courses.module.css');
console.log('- pages/login.module.css');
console.log('- pages/settings.module.css');
console.log('\n✨ Use the design-system.css utilities when possible!');
