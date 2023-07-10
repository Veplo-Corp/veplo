import axios, { AxiosResponse } from "axios";
import { UploadEventType } from "./UploadEventTypes";

//per GO
export const uploadImage = async (image: File, proportion: UploadEventType): Promise<any> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('proportion', proportion);
    console.log(image);

    const URI = process.env.NEXT_PUBLIC_APOLLO_URI ? process.env.NEXT_PUBLIC_APOLLO_URI + '/uploadImage' : ''

    try {
        const response: AxiosResponse<any> = await axios.post(URI, formData);
        const data: any = response.data;
        console.log('Output della funzione:', data);
        return data;
    } catch (error) {
        console.error('Errore durante l\'upload dell\'immagine:', error);
        throw error;
    }
}


