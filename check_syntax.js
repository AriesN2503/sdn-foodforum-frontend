try { require('fs').readFileSync('./src/pages/Home.jsx', 'utf8'); console.log('No syntax errors found.'); } catch (error) { console.error('Syntax error:', error.message); }
