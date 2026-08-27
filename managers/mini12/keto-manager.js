const KETO_STATE = {
  metrics: { weight: 0 },
  tasks: []
};
function readMetric() { return KETO_STATE.metrics.weight; }
function writeMetric(val) { KETO_STATE.metrics.weight = val; }
function readTasks() { return KETO_STATE.tasks; }
function writeTask(task) { KETO_STATE.tasks.push(task); }
module.exports = { readMetric, writeMetric, readTasks, writeTask, state: KETO_STATE };
