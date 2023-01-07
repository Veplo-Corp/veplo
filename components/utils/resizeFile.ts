import Resizer from "react-image-file-resizer";
export const resizeFile = (file: any) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            762,
            1100,
            "WEBP",
            80,
            0,
            (uri) => {
                resolve(uri.toString());
            },
            "base64",
            762,
            1100,
        );
});