import Resizer from "react-image-file-resizer";
export const resizeFile = (file: any) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            3000,
            3000,
            "WEBP",
            100,
            0,
            (uri) => {
                resolve(uri.toString());
            },
            "base64"
        );
});