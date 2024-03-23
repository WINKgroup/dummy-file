import fs from 'fs';
import path from 'path';

export default class FixedSize {
    fileSizeInBytes: number;
    rootPath: string;

    constructor(fileSizeInBytes = 10 * 1024 * 1024 /* 10 Mb */, rootPath = '') {
        this.fileSizeInBytes = fileSizeInBytes;
        this.rootPath = rootPath;
    }

    write(filename: string, fileSizeInBytes?: number) {
        return FixedSize.write(
            path.join(this.rootPath, filename),
            fileSizeInBytes ? fileSizeInBytes : this.fileSizeInBytes,
        );
    }

    static write(
        fullPath: string,
        fileSizeInBytes = 10 * 1024 * 1024 /* 10 Mb */,
    ) {
        const stream = fs.createWriteStream(fullPath);

        let written = 0;
        const maxSizeChunk = 1024; // Chunk size set to 1KB
        const maxSizeChunkData = Buffer.alloc(maxSizeChunk);

        return new Promise<void>((resolve, reject) => {
            stream.on('finish', () => resolve());
            stream.on('error', (err) => reject(err));

            function writeStream() {
                let ok = true;
                while (written < fileSizeInBytes && ok) {
                    if (maxSizeChunk > fileSizeInBytes - written) {
                        const data = Buffer.alloc(fileSizeInBytes - written);
                        stream.write(data);
                        written = fileSizeInBytes;
                    } else {
                        ok = stream.write(maxSizeChunkData);
                        written += maxSizeChunk;
                    }
                }
                if (written < fileSizeInBytes) {
                    // Had to stop early, wait for drain to write more
                    stream.once('drain', writeStream);
                } else stream.end();
            }

            writeStream();
        });
    }
}
