/*

THE PROBLEM:

Given a list of pair of numbers
A. for index i of the left list, calculate the number of times index i appears in the right list
B. find the similarity score by taking the sum of (index i * number of appearances in right list)

For example, given:

3   4
4   3
2   5
1   3
3   9
3   3

A. for index i of the left list, calculate the number of times index i appears in the right list

3 -> 3
4 -> 1
2 -> 0
1 -> 0
3 -> 3
3 -> 3

B. find the similarity score by taking the sum of (index i * number of appearances in right list)

(3*3) + (4*1) + (2*0) + (1*0) + (3*3) + (3*3) 
=   9 + 4 + 9 + 9
=   31
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

function mapAppearances(splitLists) {
	const map = {};
	for (let element of splitLists[0]) {
		if (map[element]) {
			continue;
		} else {
			const appearances = splitLists[1].filter(
				(value) => value === element
			).length;
			if (appearances) map[element] = appearances;
		}
	}
	return map;
}

function getSimilarityScore(appearances) {
	return Object.keys(appearances).reduce((previousValue, currentKey) => {
		return previousValue + +currentKey * appearances[+currentKey];
	}, 0);
}

function main() {
	if (process.argv.length < 3) {
		console.log("Usage: node" + process.argv[1] + " FILENAME");
		process.exit(1);
	} else {
		const rawInput = getRawInput(process.argv[2]);
		const splitLists = getSplitLists(rawInput);
		const appearances = mapAppearances(splitLists);
		const similarityScore = getSimilarityScore(appearances);
		console.log(similarityScore);
		return similarityScore;
	}
}

main();
