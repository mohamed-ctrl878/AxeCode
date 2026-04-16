const fs = require('fs');
const path = require('path');
const dir = 'tests/useCases';

fs.readdirSync(dir).filter(f => f.endsWith('.test.js')).forEach(f => {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Fix imports that used @useCase
    content = content.replace(/from ['"]@useCase\/([^'"]+)['"]/g, "from '../../src/domain/useCase/$1'");

    // Fix imports that used relative path to same directory instead of domain/useCase
    content = content.replace(/from ['"]\.\.\/use([A-Za-z]+)['"]/g, "from '../../src/domain/useCase/use$1'");

    fs.writeFileSync(fullPath, content);
});

console.log('Fixed imports successfully.');
