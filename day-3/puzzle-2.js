/*

The shopkeeper turns to you. "Any chance you can see why our computers are having issues again?"

The computer appears to be trying to run a program, but its memory (your puzzle input) is corrupted. All of the instructions have been jumbled up!

It seems like the goal of the program is just to multiply some numbers. It does that with instructions like mul(X,Y), where X and Y are each 1-3 digit numbers. For instance, mul(44,46) multiplies 44 by 46 to get a result of 2024. Similarly, mul(123,4) would multiply 123 by 4.

However, because the program's memory has been corrupted, there are also many invalid characters that should be ignored, even if they look like part of a mul instruction. Sequences like mul(4*, mul(6,9!, ?(12,34), or mul ( 2 , 4 ) do nothing.

For example, consider the following section of corrupted memory:

xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
Only the four highlighted sections are real mul instructions. Adding up the result of each instruction produces 161 (2*4 + 5*5 + 11*8 + 8*5).

Scan the corrupted memory for uncorrupted mul instructions. What do you get if you add up all of the results of the multiplications?

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

The do() instruction enables future mul instructions.
The don't() instruction disables future mul instructions.
Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

For example:

xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

This time, the sum of the results is 48 (2*4 + 8*5).

Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?


*/

const INPUT_FILENAME = "input.txt";

function readInput(filename) {
	const filesystem = require("fs");
	return filesystem.readFileSync(filename, "utf-8");
}

function getArguments(instruction) {
	const openingParenthesisIndex = instruction.indexOf("(");
	const closingParenthesisIndex = instruction.indexOf(")");
	const argumentsPart = instruction.substring(
		openingParenthesisIndex + 1,
		closingParenthesisIndex
	);

	const arguments = argumentsPart.split(",").map((arg) => Number(arg));
	return arguments;
}

function executeInstruction(instruction) {
	const operation = instruction.substring(0, instruction.indexOf("("));
	const arguments = getArguments(instruction);

	if (operation === "mul")
		return arguments.reduce(
			(runningTotal, currentValue) => runningTotal * currentValue,
			1
		);
}

function removeDisabledRegions(input) {
	const instructionsRegex = /do(n't)?\(\)/g;
	const doInstructionLength = "do()".length;

	const regionDelimeters = [...input.matchAll(instructionsRegex)].map(
		(element) => [element[0], element.index]
	);

	let output = "";
	if (regionDelimeters[0][1] > 0)
		output += input.substring(0, regionDelimeters[0][1]);

	for (let i = 0; i < regionDelimeters.length - 1; i++) {
		if (regionDelimeters[i][0] === "do()") {
			output += input.substring(
				regionDelimeters[i][1],
				regionDelimeters[i + 1][1]
			);
		}
	}

	if (regionDelimeters[regionDelimeters.length - 1][0] === "do()")
		output += input.substring(
			regionDelimeters[regionDelimeters.length - 1][1] +
				doInstructionLength
		);

	return output;
}

function main() {
	const input = readInput(INPUT_FILENAME);
	const validMulInstructionsRegex = /mul\([0-9]{1,3},[0-999]{1,3}\)/g;

	const enabledRegions = removeDisabledRegions(input);

	const validMulInstructions = [
		...enabledRegions.matchAll(validMulInstructionsRegex),
	].map((match) => match[0]);
	const results = validMulInstructions
		.map((instruction) => executeInstruction(instruction))
		.reduce((runningTotal, currentValue) => runningTotal + currentValue, 0);
	console.log(results);
}

main();