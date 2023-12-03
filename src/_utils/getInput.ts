import * as fs from 'fs';
import * as path from 'path';

export function getInput(testDir: string) {
    const fileName = `input-${(process.env.AOC_INPUT ?? 'example')}.txt`;
    const filePath = path.join(testDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\r\n').filter(Boolean);
}
