import { deleteObject, ref } from "firebase/storage";
import { storage } from '../../src/config/firebase'


const deletePhotoFirebase = async (name: string, productId: any, shopId: string) => {
    const storageRef = ref(storage, `/${shopId}/prodotti/${productId}/${name}`);

    try {
        await deleteObject(storageRef)
        return true
    } catch (e: any) {
        throw new Error(e);
    }


}

export default deletePhotoFirebase;

