const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('D:/newViteApp/Axe_code/src/presentation/feature/cms');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    content = content
        .replace(/bg-ivory/g, 'bg-surface')
        .replace(/text-near-black/g, 'text-text-primary')
        .replace(/bg-near-black/g, 'bg-text-primary')
        .replace(/text-ivory/g, 'text-surface')
        .replace(/bg-parchment/g, 'bg-background')
        .replace(/border-near-black/g, 'border-text-primary')
        .replace(/hover:border-near-black/g, 'hover:border-text-primary')
        .replace(/group-hover:bg-near-black/g, 'group-hover:bg-text-primary')
        .replace(/group-hover:text-ivory/g, 'group-hover:text-surface')
        .replace(/bg-white/g, 'bg-surface-elevated');

    if (original !== content) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
