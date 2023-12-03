import { getInput } from "../_utils/getInput";

const NUMBER_NAMES: Record<string, number> = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9
};

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
    const first = findInstance(input, Object.keys(NUMBER_NAMES), 'first');
    const last = findInstance(input, Object.keys(NUMBER_NAMES), 'last');

    if (!first || !last) {
        console.log(`eep eep cabbage1: ${input}`);
        return null;
    }

    const firstNumber = NUMBER_NAMES[first];
    const lastNumber = NUMBER_NAMES[last];

    if (!firstNumber || !lastNumber) {
        console.log(`eep eep cabbage2: ${input}`);
        return null;
    }

    console.log(` - ${input} => ${firstNumber}${lastNumber}`);

    return parseInt(`${firstNumber}${lastNumber}`, 10);
}

/**
 * Find the first or last instance, within a string, of any of the given strings.
 * 
 * @param haystack The string to search within.
 * @param needles The strings to search for.
 * @param target Whether to find the first or last instance.
 * 
 * @returns The value of the first or last instance, or null if none found.
 */
function findInstance(haystack: string, needles: string[], target: 'first' | 'last') {
    let closestIndex: number | null = null;
    let closestValue: string | null = null;

    for (const needle of needles) {
        const currentIndex = (target === 'first')
                                ? haystack.indexOf(needle)
                                : haystack.lastIndexOf(needle);

        if (currentIndex === -1) {
            continue;
        }

        if (closestIndex !== null) {
            if (target === 'first' && closestIndex < currentIndex) {
                continue;
            }

            if (target === 'last' && closestIndex > currentIndex) {
                continue;
            }
        }

        closestIndex = currentIndex;
        closestValue = needle;
    }

    return closestValue;
}
