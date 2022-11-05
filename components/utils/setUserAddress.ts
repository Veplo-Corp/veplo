import { setAddress } from '../../src/pages/store/reducers/address_user';
import { Mapbox_Result } from './../../src/interfaces/mapbox_result.interface';

const setUserAddress = async (element: any, type: string) => {
    let mapbox_result: Mapbox_Result = {
        placeType: element.place_type[0],
        longitude: undefined,
        latitude: undefined,
        postcode: undefined,
        city: undefined,
        address: undefined,
        streetNumber: undefined
    }

    if (mapbox_result.placeType === 'address') {
        mapbox_result.longitude = element.geometry.coordinates[0];
        mapbox_result.latitude = element.geometry.coordinates[1];
        mapbox_result.postcode = element.context[0].text_it;
        if (element.context[1].id.split('.')[0] === 'place') {
            mapbox_result.city = element.context[1].text_it;
        } else {
            mapbox_result.city = element.context[2].text_it;
        }
        mapbox_result.address = element.text_it;
        mapbox_result.streetNumber = element.address !== undefined ? (element.address) : undefined;

    }
    else if (mapbox_result.placeType === 'place') {
        mapbox_result.longitude = element.geometry.coordinates[0];
        mapbox_result.latitude = element.geometry.coordinates[1];
        mapbox_result.city = element.text_it
    }

    // console.log({
    //   mapbox_result
    // });

    if (type === 'shop') {
        return mapbox_result;
    }

    const endpoint = `/api/mapbox/save-user-address?longitude=${mapbox_result.longitude}&latitude=${mapbox_result.latitude}&postcode=${mapbox_result.postcode}&city=${mapbox_result.city}&address=${mapbox_result.address}&placeType=${mapbox_result.placeType}&streetNumber=${mapbox_result.streetNumber}`
    const response = await fetch(endpoint)
    const result = await response.json();
    // console.log(result.address_user);
    return result.address_user



}

export default setUserAddress;