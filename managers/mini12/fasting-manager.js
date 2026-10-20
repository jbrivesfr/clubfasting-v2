const FASTING_STATE = { metrics: { weight: 0 }, tasks: [] };

function readFastingMetric() { return FASTING_STATE.metrics.weight; }
function writeFastingMetric(val) { FASTING_STATE.metrics.weight = val; }
function readFastingTasks() { return FASTING_STATE.tasks; }
function writeFastingTask(task) { FASTING_STATE.tasks.push(task); }

module.exports = {
  readFastingMetric,
  writeFastingMetric,
  readFastingTasks,
  writeFastingTask,
  state: FASTING_STATE
};
