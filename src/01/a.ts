import { getInput } from "../_utils/getInput";

const total = getInput(__dirname)
    .map(findCalibrationValue)
    .filter((row): row is number => row != null)
    .reduce((acc, value) => acc + value, 0);

console.log(`total: ${total}`);

/**
 * On each line, the calibration value can be found by combining the
 * first digit and the last digit (in that order) to form a single two-digit number.
 */
function findCalibrationValue(input: string) {
    const regex = /\d/g;

    const matches = input.match(regex);

    if (!matches) {
        return null;
    }

    const firstMatch = matches[0];
    const lastMatch = matches[matches.length - 1];

    return parseInt(`${firstMatch}${lastMatch}`, 10);
}
