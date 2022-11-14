import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../src/config/firebase'


const uploadPhotoFirebase = async(name:string, blob:any, productId:any , shopId:string) => {
    const storageRef = ref(storage, `/${shopId}/prodotti/${productId}/${name}`);


    try{
        await uploadBytes(storageRef, blob)
        const url = await getDownloadURL(storageRef)
        console.log(url);
        return url
    } catch(e){
        throw new Error(e);
    }

    

    // new Promise((resolve, reject) => {
    //     const storageRef = ref(storage, `/files/${productId}/${name}`);
    // const uploadTask =  uploadBytesResumable(storageRef, blob)
    // uploadTask.on(
    //     "state_changed",
    //     (snapshot) => {
    //         console.log(snapshot.bytesTransferred)
    //     },
    //     (error) => {
    //         console.log(error);
           
    //     },


    //     async() => {

    //         const url = await getDownloadURL(uploadTask.snapshot.ref)
    //         console.log(url);
    //         resolve(url);

    //         return url
    //     }
    // )
    //   });

    

    
}

export default uploadPhotoFirebase;

