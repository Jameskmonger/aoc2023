import { getInput } from "../_utils/getInput";

/**
 * Iterate through all games in the input and see if the game
 * would be possible with the given bag contents, that is,
 * if the maximum drawing within the game for a given colour is
 * less than the known bag contents.
 */
function test(bagContents: Record<string, number>) {
    const result = getInput(__dirname)
        .map(parseGame)
        .filter(row => {
            if (!row) {
                return false;
            }

            const { maximums: details } = row;

            return Object.keys(bagContents).every(colour => {
                const amountInBag = bagContents[colour];
                const amountObserved = details[colour];
                
                return amountObserved <= amountInBag;
            });
        })
        .reduce((acc, row) => acc + (row?.id ?? 0), 0);

    console.log(`total: ${result}`);
}

test({
    "red": 12,
    "green": 13,
    "blue": 14,
});

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
