import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../src/config/firebase'


const uploadPhotoFirebase = async (blob: any, positionInStorage: string) => {
    //const storageRef = ref(storage, `/${shopId}/prodotti/${productId}/${name}`);
    const storageRef = ref(storage, positionInStorage);


    try {
        await uploadBytes(storageRef, blob)
        const url = await getDownloadURL(storageRef)
        return url
    } catch (e: any) {
        throw new Error(e);
    }







}

export default uploadPhotoFirebase;

