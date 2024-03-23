import Video from '../src/video';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

jest.setTimeout(900000);

test('on https://sample-videos.com/ try to download everything', async () => {
    const testFolder = 'dataSampleVideos';
    if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder);
    const videoDummyFile = new Video(testFolder);
    const plainList = Video.getSampleVideosValidParamList();

    const chunkedList = _.chunk(plainList, 3);

    for (const list of chunkedList) {
        await Promise.all(
            list.map(async (params) => {
                const filename = `${params.resolution}_${params.size}mb.${params.format}`;
                const fullPath = path.join(testFolder, filename);
                const result = await videoDummyFile.downloadFromSampleVideos(
                    filename,
                    params,
                );
                expect(result).toBe(true);
                const stats = fs.statSync(fullPath);
                expect(stats.size / 1024 / 1024).toBeCloseTo(params.size, 0);
            }),
        );
    }

    fs.rmSync(testFolder, { force: true, recursive: true });
});
