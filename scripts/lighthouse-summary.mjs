import { appendFileSync, readdirSync, readFileSync } from "node:fs";

const reportDirectory = ".lighthouseci";
const categories = [
  ["performance", "Performance"],
  ["accessibility", "Accessibility"],
  ["best-practices", "Best Practices"],
  ["seo", "SEO"]
];

const reportFiles = readdirSync(reportDirectory)
  .filter((file) => /^lhr-.*\.json$/.test(file))
  .sort();

if (reportFiles.length === 0) {
  throw new Error(`No Lighthouse JSON reports found in ${reportDirectory}.`);
}

const reports = reportFiles.map((file) => ({
  file,
  report: JSON.parse(readFileSync(`${reportDirectory}/${file}`, "utf8"))
}));

let failed = false;
const rows = reports.map(({ file, report }) => {
  const scores = categories.map(([key]) => {
    const score = report.categories?.[key]?.score;
    if (typeof score !== "number") {
      failed = true;
      return "Missing ❌";
    }

    if (score < 0.9) {
      failed = true;
      return `${Math.round(score * 100)}% ❌`;
    }

    return `${Math.round(score * 100)}% ✅`;
  });

  return `| ${file} | ${scores.join(" | ")} |`;
});

const summary = [
  "## Lighthouse audit",
  "",
  `| Report | ${categories.map(([, label]) => label).join(" | ")} |`,
  `| --- | ${categories.map(() => "---:").join(" | ")} |`,
  ...rows,
  "",
  "Download the **lighthouse-reports** workflow artifact to view the full HTML reports and JSON results.",
  ""
].join("\n");

appendFileSync(process.env.GITHUB_STEP_SUMMARY ?? "/dev/stdout", summary);
