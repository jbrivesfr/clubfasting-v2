const assert = require('assert');
const keto = require('./keto-manager');
const fasting = require('./fasting-manager');

// Sentinel test:
fasting.writeFastingMetric(10);
assert.notStrictEqual(keto.readMetric(), 10, 'Keto metric should not be modified by Fasting manager write');

keto.writeMetric(42);
assert.notStrictEqual(fasting.readFastingMetric(), 42, 'Fasting metric should not be modified by Keto manager write');

fasting.writeFastingTask('fasting task');
assert.strictEqual(keto.readTasks().includes('fasting task'), false, 'Keto tasks should not include Fasting task');

keto.writeTask('keto task');
assert.strictEqual(fasting.readFastingTasks().includes('keto task'), false, 'Fasting tasks should not include Keto task');

console.log('Bidirectional isolation sentinels passed.');
