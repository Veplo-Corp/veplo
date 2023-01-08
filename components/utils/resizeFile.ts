import Resizer from "react-image-file-resizer";
export const resizeFile = (file: any) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1528,
            2200,
            "WEBP",
            90,
            0,
            (uri) => {
                resolve(uri.toString());
            },
            "base64",
            762,
            1100,
        );
});