import Resizer from "react-image-file-resizer";
export const resizeFile = (file: any) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            2000,
            2200,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri.toString());
            },
            "base64",
            1000,
            1100,
        );
    });