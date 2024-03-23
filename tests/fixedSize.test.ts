import FixedSize from '../src/fixedSize';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('write a dummy file', () => {
    test('1Mb size, without root path', async () => {
        const size = 1 * 1024 * 1024;
        const filename = 'test1Mb.data';
        const fixedSize = new FixedSize(size);
        await fixedSize.write(filename);
        const stats = fs.statSync(filename);
        expect(stats.size).toBe(size);
        fs.unlinkSync(filename);
    });

    test('10Mb size, in temporary directory', async () => {
        const size = 10 * 1024 * 1024;
        const filename = 'test10Mb.data';
        const fullPath = path.join(os.tmpdir(), filename);
        console.log(`temporary fullPath: ${fullPath}`);

        const fixedSize = new FixedSize(size, os.tmpdir());
        await fixedSize.write(filename);
        const stats = fs.statSync(fullPath);
        expect(stats.size).toBe(size);
        fs.unlinkSync(fullPath);
    });
});
