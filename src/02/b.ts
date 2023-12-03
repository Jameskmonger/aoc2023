import { getInput } from "../_utils/getInput";

const result = getInput(__dirname)
    .map(parseGame)
    .reduce((acc, row) => {
        if (!row) {
            return acc;
        }

        // The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.
        const setPower = Object.values(row.maximums)
            .reduce((acc, value) => acc * value, 1);

        return acc + setPower;
    }, 0);

console.log(`total: ${result}`);

// === parsing

/**
 * Parse a game in the format:
 *      
 *      Game 1: 1 red, 2 green, 3 blue; 3 red, 2 green, 1 blue
 * 
 * and return a list of games mapped to their "maximum" draw for each colour.
 * 
 * For the game above, the maximums are:
 * 
 *          3 red, 2 green, 3 blue
 */
function parseGame(line: string) {
    const match = line.match(/Game (\d+): (.+)/);

    if (!match) {
        console.log(`eep eep cabbage1: ${line}`);
        return null;
    }

    const [, id, details] = match;

    return {
        id: parseInt(id, 10),
        maximums: details.split(";")
            .map(group => group.trim())
            .flatMap(parseDrawing)
            .reduce((acc, { colour, count }) => {
                const previousMax = acc[colour] ?? 0;
                const newMax = Math.max(previousMax, count);

                return {
                    ...acc,
                    [colour]: newMax,
                };
            }, {} as Record<string, number>),
    };
}

/**
 * Parse a single "drawing" in the format:
 * 
 *      1 red, 2 green, 3 blue
 */
function parseDrawing(group: string) {
    return group.split(",")
        .map(item => item.trim())
        .map(item => {
            const match = item.match(/(\d+) (.+)/);

            if (!match) {
                console.log(`eep eep cabbage2: ${item}`);
                return null;
            }

            const [, count, colour] = match;

            return {
                colour,
                count: parseInt(count, 10),
            };
        })
        .filter((item): item is { count: number, colour: string } => item != null);
}
