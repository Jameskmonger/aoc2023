import { getInput } from "../_utils/getInput";

const grid = parseGrid(getInput(__dirname));
const usedParts = getUsedPartNumbers(grid);
const total = Array.from(usedParts).reduce((acc, cur) => acc + cur.value, 0);

console.log(`total: ${total}`);

/**
 * Get a Set containing the unique part numbers which are "used" within the grid,
 * that is they have some symbol adjacent to them.
 */
function getUsedPartNumbers(grid: GridItem[][]): Set<GridPartNumber> {
    const parts: GridPartNumber[] = [];

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
    
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
    
            // look for the symbols and then find adjacent part numbers
            if (cell.type === "spacer" || cell.type === "part-number") {
                continue;
            }

            const surroundingParts = getSurroundingCells(grid, x, y)
                                        .filter((c): c is GridPartNumber => c.type === "part-number");

            parts.push(...surroundingParts);
        }
    }

    return new Set(parts);
}

/**
 * Get the surrounding cells from a 2d array for a given position.
 * 
 * This will get all cells within a given radius, and will respect the boundaries of the grid.
 */
function getSurroundingCells<T>(grid: T[][], x: number, y: number, radius: number = 1): T[] {
    const bounds = {
        minX: Math.max(0, x - radius),
        minY: Math.max(0, y - radius),
        maxX: Math.min(x + radius, grid[0].length - 1),
        maxY: Math.min(y + radius, grid.length - 1),
    };

    const output: T[] = [];

    for (let x = bounds.minX; x <= bounds.maxX; x++) {
        for (let y = bounds.minY; y <= bounds.maxY; y++) {
            output.push(grid[y][x]);
        }
    }

    return output;
}

// === parsing and types

type GridPartNumber = {
    type: "part-number";
    id: number;
    value: number;
};

type GridSymbol = {
    type: "symbol";
    value: string;
};

type GridSpacer = { type: "spacer" };

type GridItem = GridPartNumber | GridSymbol | GridSpacer;

function parseGrid(input: string[]) {
    const grid = input.map(line => line.split(""));
    const outputGrid: GridItem[][] = [];

    let partNumberCount = 0;

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        outputGrid[y] = [];

        let lastCellWasNumber = false;
        let lastPartNumber: GridPartNumber | null = null;

        for (let x = 0; x < row.length; x++) {
            const cell = row[x];

            if (cell === ".") {
                outputGrid[y][x] = { type: "spacer" };
                lastCellWasNumber = false;
                lastPartNumber = null;
                continue;
            }

            const parsed = parseInt(cell, 10);

            if (isNaN(parsed)) {
                outputGrid[y][x] = { type: "symbol", value: cell };
                lastCellWasNumber = false;
                lastPartNumber = null;
                continue;
            }

            // if the last cell in the row was also a part number,
            // combine them together e.g. `1` and `3` becomes `13`
            if (lastCellWasNumber) {
                lastPartNumber!.value = parseInt(`${lastPartNumber!.value}${parsed}`, 10);
                outputGrid[y][x] = lastPartNumber!;
                continue;
            }

            lastCellWasNumber = true;
            lastPartNumber = {
                type: "part-number",
                id: partNumberCount++,
                value: parsed
            };
            outputGrid[y][x] = lastPartNumber!;
        }
    }

    return outputGrid;
} 
