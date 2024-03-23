/***
 * This class makes it easy to download test videos programmatically from:
 * https://www.elecard.com/videos
 * https://sample-videos.com/
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import _ from 'lodash';

export interface SampleVideosParams {
    size: 1 | 2 | 5 | 10 | 20 | 30;
    resolution: 720 | 480 | 360 | 240 | 144;
    format?: 'mp4' | 'flv' | 'mkv' | '3gp';
}

export default class Video {
    rootPath: string;

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    downloadFromSampleVideos(
        filename: string,
        inputParams: SampleVideosParams,
    ) {
        return Video.downloadFromSampleVideos(
            path.join(this.rootPath, filename),
            inputParams,
        );
    }

    static getSampleVideosValidParamList() {
        const list = [] as (Required<SampleVideosParams> & { url: string })[];
        const sizeOptions = [
            1, 2, 5, 10, 20, 30,
        ] as SampleVideosParams['size'][];
        const resolutionOptions = [
            720, 480, 360, 240, 144,
        ] as SampleVideosParams['resolution'][];
        const formatOptions = [
            'mp4',
            'flv',
            'mkv',
            '3gp',
        ] as Required<SampleVideosParams>['format'][];

        for (const format of formatOptions) {
            for (const resolution of resolutionOptions) {
                for (const size of sizeOptions) {
                    const url = this.getSampleVideosUrl({
                        format: format,
                        resolution: resolution,
                        size: size,
                    });
                    if (url === '') continue;
                    list.push({
                        format: format,
                        resolution: resolution,
                        size: size,
                        url: url,
                    });
                }
            }
        }

        return list;
    }

    /***
     * @returns string if this combination doesn't exist => will return empty string
     */
    static getSampleVideosUrl(inputParams: SampleVideosParams) {
        const params = _.defaults(inputParams, { format: 'mp4' });
        if (
            ['mp4', 'flv', 'mkv'].indexOf(params.format) !== -1 &&
            params.resolution < 240
        )
            return '';
        if (params.format === '3gp') {
            if ([144, 240].indexOf(params.resolution) === -1) return '';
            if (params.resolution === 144 && params.size > 10) return '';
        }

        return `https://sample-videos.com/video321/${params.format}/${params.resolution}/big_buck_bunny_${params.resolution}p_${params.size}mb.${params.format}`;
    }

    /***
     * @throws downloading errors
     * @returns false if params combination doesn't exist, true otherwise
     */
    static downloadFromSampleVideos(
        fullPath: string,
        inputParams: SampleVideosParams,
    ) {
        return new Promise<boolean>((resolve, reject) => {
            const url = this.getSampleVideosUrl(inputParams);
            if (url === '') {
                resolve(false);
                return;
            }

            const file = fs.createWriteStream(fullPath);

            https
                .get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        resolve(true);
                    });
                })
                .on('error', function (err) {
                    fs.unlinkSync(fullPath);
                    reject(err);
                });
        });
    }
}
