/**
 * compute-median-response-time.js
 *
 * Reads a Newman JSON report (--reporter-json-export output) and computes
 * the median response time across all executed requests.
 *
 * Usage:
 *   node compute-median-response-time.js reports/newman-report.json
 */

const fs = require("fs");
const path = require("path");

const reportPath = process.argv[2] || "reports/newman-report.json";

if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found: ${reportPath}`);
    process.exit(1);
}

const raw = fs.readFileSync(reportPath, "utf8");
const report = JSON.parse(raw);

// Newman JSON reports store per-request execution details under run.executions
const executions = report?.run?.executions || [];

if (executions.length === 0) {
    console.error("No executions found in the report.");
    process.exit(1);
}

const responseTimes = executions
    .map((exec) => exec?.response?.responseTime)
    .filter((t) => typeof t === "number");

if (responseTimes.length === 0) {
    console.error("No response times found in executions.");
    process.exit(1);
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

const medianTime = median(responseTimes);
const min = Math.min(...responseTimes);
const max = Math.max(...responseTimes);
const avg =
    responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;

console.log("--- Response Time Summary ---");
console.log(`Total requests: ${responseTimes.length}`);
console.log(`Min:            ${min}ms`);
console.log(`Max:            ${max}ms`);
console.log(`Average:        ${avg.toFixed(2)}ms`);
console.log(`Median:         ${medianTime}ms`);
console.log("------------------------------");

// Optionally write the summary to a file for inclusion in reports/ or README
const outputPath = path.join(path.dirname(reportPath), "newman-report.json");
fs.writeFileSync(
    outputPath,
    JSON.stringify(
        {
            totalRequests: responseTimes.length,
            min,
            max,
            average: Number(avg.toFixed(2)),
            median: medianTime,
            responseTimes,
        },
        null,
        2
    )
);

console.log(`\nSummary written to: ${outputPath}`);
