# dummy-file
tools to create dummy files useful for testing

## Install
```
npm install @winkgroup/dummy-file
```

## FixedSize
This class is intended to create fixed size files in the fastest way possible

Methods:
- new FixedSize(fileSizeInBytes = 10 * 1024 * 1024 /* 10 Mb */, rootPath = '')
- write(filename: string, fileSizeInBytes?:number)

in write method "filename" param is always appended to "rootPath" class attribute

You can also use static methods:
- write(fullPath:string, fileSizeInBytes = 10 * 1024 * 1024 /* 10 Mb */)

### Examples
```ts
    import os from 'os'
    import path from 'path'

    /// it creates a dummy file of 10 Mb in temporary folder
    async function myDummyTemporaryFile() {
        const size = 10 * 1024 * 1024
        const filename = 'test10Mb.data'
        const fullPath = path.join(os.tmpdir(), filename)
        console.log(`temporary fullPath: ${ fullPath  }`)

        const fixedSize = new FixedSize(size, os.tmpdir())
        await fixedSize.write(filename)
    }
```

You can create a dummy file in 1 line:
```ts
    await FixedSize.write('myFullPath', 10 * 1024 * 1024)
```

## Video
This class makes it easy to download test videos programmatically from:
- https://www.elecard.com/videos (*TO DO*)
- https://sample-videos.com/

Methods:
- new Video(rootPath: string)
- downloadFromSampleVideos(filename: string, inputParams: SampleVideosParams)

SampleVideosParams is an interface defined as:
```ts
export interface SampleVideosParams {
    size: 1 | 2 | 5 | 10 | 20 | 30
    resolution: 720 | 480 | 360 | 240 | 144
    format?: 'mp4' | 'flv' | 'mkv' | '3gp'
}
```

You can download a video file in 1 line, e.g.:
```ts
    await Video.downloadFromSampleVideos('myFullPath', {
        size: 5,
        resolution: 720
    })
```

## Maintainers
* [fairsayan](https://github.com/fairsayan)