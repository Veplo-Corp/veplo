import { uploadBytes } from 'firebase/storage';
import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { storage } from "../../../config/firebase"

type Req = {
    base64: any,
    name: string
}

export default async function handler(req, res) {


    const requestMethod = req.method;
    const body: Req = await JSON.parse(req.body);
    
    const base64Response = await fetch(`data:image/webp;base64,${body.base64}`);
    const blob = await base64Response.blob();




    if (!body.base64 || !body.name) {
        res.status(400).json({ message: `Errore: nono trovo body o name` })
    }




    switch (requestMethod) {
        case 'POST':
            const storageRef = ref(storage, `/files/${req.name}`);
            try {
                // const uploadTask = uploadBytesResumable(storageRef, body.base64)
                // uploadTask.on(
                //     "state_changed",
                //     (snapshot) => {
                //         console.log(snapshot.bytesTransferred)
                //     },
                //     (error) => {
                //         console.log(error);
                //         res.status(200).json({ message: `Errore: ${error.message}` })
                //         res
                //     },
                //     () => {
                //         getDownloadURL(uploadTask.snapshot.ref).then(url => {
                //             console.log(url);
                //             res.status(200).json({ message: `url prodotto creato: ${url}` })
                //         })
                //     }
                // )

                // 'file' comes from the Blob or File API
                const uploadImage =  await uploadBytes(storageRef, blob)
                res.status(200).json({ message: 'fatto' })

            } catch (e) {
                res.status(200).json({ message: 'errore' })
            }





        default:
            res.status(200).json({ message: 'Welcome to API Routes!' })
    }


}

// export default function handler(req, res) {
//     const requestMethod = req.method;
//     const body = JSON.parse(req.body);

//     switch (requestMethod) {
//         case 'POST':
//             res.status(200).json({ message: `You submitted the following data: ${body.title}` })
//         // handle other HTTP methods
//         default:
//             res.status(200).json({ message: 'Welcome to API Routes!' })
//     }
// }