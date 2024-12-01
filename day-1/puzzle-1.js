/* THE PROBLEM:

Given a list of pair of numbers
A. order the left and right numbers
B. find the distance between the pairs
C. sum up the distances between the pairs

For example, given:

3   4
4   3
2   5
1   3
3   9
3   3

A. order the left and right lists

1   3
2   3
3   3
3   4
3   5
4   9

B. find the distance between the pairs

1   3 -> 2
2   3 -> 1
3   3 -> 0
3   4 -> 1
3   5 -> 2
4   9 -> 5

C. sum up the distances between the pairs

2 + 1 + 0 + 1 + 2 + 5
=   11
*/

function getRawInput(filename) {
	const filesystem = require("fs");
	return filesystem.readFileSync(filename, "utf-8");
}

function getSplitLists(rawInput) {
	const splitByRow = rawInput.split("\r\n");
	const left = [];
	const right = [];

	splitByRow.forEach((pair) => {
		const splitPair = pair.split("   ");
		left.push(+splitPair[0]);
		right.push(+splitPair[1]);
	});

	return [left, right];
}

function orderLists(splitLists) {
	const left = splitLists[0];
	const right = splitLists[1];

	left.sort((a, b) => a - b);
	right.sort((a, b) => a - b);

	return [left, right];
}

function main() {
	if (process.argv.length < 3) {
		console.log("Usage: node" + process.argv[1] + " FILENAME");
		process.exit(1);
	} else {
		const rawInput = getRawInput(process.argv[2]);
		const splitLists = getSplitLists(rawInput);
		const orderedLists = orderLists(splitLists);
		let sumOfDistances = 0;
		for (let i = 0; i < orderedLists[0].length; i++) {
			sumOfDistances += Math.abs(orderedLists[0][i] - orderedLists[1][i]);
		}
		console.log(sumOfDistances);
		return sumOfDistances;
	}
}

main();
