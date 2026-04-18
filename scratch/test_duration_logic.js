
const formatDuration = (minutes) => {
    if (!minutes) return 'Self-paced';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? `${h}h ` : ''}${m ? `${m}m` : ''}`.trim();
};

const tests = [
    { in: 0, out: 'Self-paced' },
    { in: null, out: 'Self-paced' },
    { in: undefined, out: 'Self-paced' },
    { in: 1, out: '1m' },
    { in: 60, out: '1h' },
    { in: 75, out: '1h 15m' },
    { in: 150, out: '2h 30m' },
    { in: 3600, out: '60h' }
];

let allPassed = true;
tests.forEach(test => {
    const result = formatDuration(test.in);
    if (result !== test.out) {
        console.error(`FAIL: Input ${test.in} -> Expected "${test.out}", got "${result}"`);
        allPassed = false;
    } else {
        console.log(`PASS: Input ${test.in} -> "${result}"`);
    }
});

if (allPassed) {
    console.log('\n--- ALL DURATION FORMATTING TESTS PASSED ---');
    process.exit(0);
} else {
    process.exit(1);
}
