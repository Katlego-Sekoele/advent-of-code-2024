/*
Given an input of numbers where each row is a report and each cell is a level, 
determing which reports are safe and which are unsafe. 
From this, return the number of safe reports.

A report (row) is safe if the following conditions are met:
** All levels in the report are in order (ascending or descending)
** The difference between two adjacent levels is in the range of [1; 3]
** If removing a single level from an unsafe report would make it safe, the report instead counts as safe.

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

function isOptimisticallySafe(report) {
	const response = {
		safe: true,
		unsafeIndexes: [],
		recovarable: true,
		unsafeDifferences: 0,
		unsafeDirections: 0,
	};

	const initialDifference = report[0] - report[1];
	if (Math.abs(initialDifference) > 3 || Math.abs(initialDifference) < 1) {
		response.safe = false;
		response.unsafeIndexes.push(0, 1);
	}

	let previousDirection = initialDifference < 0; // true means direction is ascending

	for (let i = 1; i < report.length - 1; i++) {
		const difference = report[i] - report[i + 1];
		const direction = difference < 0; // true means direction is ascending

		const unsafeDifference =
			Math.abs(difference) > 3 || Math.abs(difference) < 1;
		const unsafeDirection = direction !== previousDirection;

		if (unsafeDifference || unsafeDirection) {
			response.unsafeDifferences += Number(unsafeDifference);
			response.unsafeDirections += Number(unsafeDirection);
			response.safe = false;
			response.unsafeIndexes.push(i, i + 1);
		}

		previousDirection = direction;
	}

	response.unsafeIndexes = [0, ...new Set(response.unsafeIndexes)]; // quick fix, hard-code the first index (i'm too lazy to find a better way to do it)
	response.recovarable =
		response.unsafeDirections < 3 && response.unsafeDifferences < 3;

	return response;
}

function getReportsWithSingleUnsafeIndexRemoved(report, safetyDetails) {
	const reportsWithSingleUnsafeIndexRemoved = [];

	for (let index of safetyDetails.unsafeIndexes) {
		reportsWithSingleUnsafeIndexRemoved.push(report.toSpliced(index, 1));
	}

	return reportsWithSingleUnsafeIndexRemoved;
}

function isSafe(report) {
	const safetyDetails = isOptimisticallySafe(report);

	if (safetyDetails.safe) return true;
	if (!safetyDetails.recovarable) return false;

	const reportsWithSingleUnsafeIndexRemoved =
		getReportsWithSingleUnsafeIndexRemoved(report, safetyDetails);

	for (let modifiedReport of reportsWithSingleUnsafeIndexRemoved) {
		if (isOptimisticallySafe(modifiedReport).safe) return true; // i.e. there exists at least one modified report that is safe
		// Would it be better to have a third isSafe method that doesn't keep track of whether it's recovarable or not?
	}

	return false; // i.e. none of the modified reports were safe
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
