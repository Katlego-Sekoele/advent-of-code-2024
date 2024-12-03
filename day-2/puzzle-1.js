/*
Given an input of numbers where each row is a report and each cell is a level, 
determing which reports are safe and which are unsafe. 
From this, return the number of safe reports.

A report (row) is safe if the following conditions are met:
** All levels in the report are in order (ascending or descending)
** The difference between two adjacent levels is in the range of [1; 3]

For example:

7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9

The following are the results:

7 6 4 2 1 -> Safe
1 2 7 8 9 -> Unsafe (|2-7| > 3)
9 7 6 2 1 -> Unsafe (|6-2| > 3)
1 3 2 4 5 -> Unsafe (not in order)
8 6 4 4 1 -> Unsafe (|4-4| < 1)
1 3 6 7 9 -> Safe

*/

const INPUT_FILENAME = "input.txt";

function readRawData(filename) {
	const filesystem = require("fs");
	return filesystem.readFileSync(filename, "utf-8");
}

function getReports(rawData) {
	const rawRows = rawData.split("\n");
	return rawRows
		.filter((rowText) => rowText.length > 0)
		.map((row) => row.split(" ").map((elemString) => Number(elemString)));
}

function isSafe(report) {
	const initialDifference = report[0] - report[1];
	if (Math.abs(initialDifference) > 3 || Math.abs(initialDifference) < 1)
		return false;

	const isAscending = initialDifference < 0;

	for (let i = 1; i < report.length - 1; i++) {
		// start at 1, we have already dealt with 0
		const difference = report[i] - report[i + 1];
		if (
			Math.abs(difference) > 3 ||
			Math.abs(difference) < 1 ||
			(isAscending && difference > 0) ||
			(!isAscending && difference < 0)
		)
			return false;
	}
	return true;
}

function main() {
	const rawData = readRawData(INPUT_FILENAME);
	const reports = getReports(rawData);
	const safeReports = reports.filter((report) => isSafe(report));
	const numSafeReports = safeReports.length;
	console.log(`Number of safe reports: ${numSafeReports}`);
	return numSafeReports;
}

main();
