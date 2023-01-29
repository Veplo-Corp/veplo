import React, { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    CircularProgress,
    Center,
} from '@chakra-ui/react'
import Input_Search_Address from '../atoms/Input_Search_Address';
import { useDispatch } from 'react-redux';
import setUserAddress from '../utils/setUserAddress';
import { setAddress } from '../../src/store/reducers/address_user';
import Address_text_handle from '../molecules/Address_text_handle';
import { useDebounceEffect } from '../utils/useDebounceEffect';
import { ToastOpen } from '../utils/Toast';

const Drawer_Address: React.FC<{ openDrawerMath: number }> = ({ openDrawerMath }) => {
    const { addToast } = ToastOpen();

    const dispatch = useDispatch();
    let filterTimeout: any;
    const [addresses, setAddresses] = useState([]);
    const [isOpen, setisOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingGPS, setLoadingGPS] = useState<boolean>(false);

    const [lng_lat, setLng_lat] = useState<string>('0,0'); /* 12.6450501048306,42.5626616098155 */
    const [address_searched, setAddress_searched] = useState<string>(''); /* 12.6450501048306,42.5626616098155 */
    useEffect(() => {

        if (openDrawerMath !== 1 && openDrawerMath !== undefined) {

            setisOpen(true)
        }
    }, [openDrawerMath])


    const gpsPositionAddress = () => {
        
        //* handle current GPS position */
        const geolocationAPI = navigator.geolocation;
        setLoadingGPS(true)
        geolocationAPI.getCurrentPosition(async (position) => {
            const { coords } = position;
            //setLng_lat(coords.longitude + ',' + coords.latitude)
            const endpoint = `/api/mapbox/reverse-geocoding?latitude=${coords.latitude}&longitude=${coords.longitude}`
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint)

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()

            handleEventSetAddress(result.data[0])
            setLoadingGPS(false)

        }, (error) => {
            setLoadingGPS(false)
            return addToast({ position: 'top', title: 'geolocalizzazione non autorizzata', description: 'autorizza la geolocalizzazione su questo sito', status: 'info', duration: 5000, isClosable: true })
        })
    }


    const onChangeAddress = async (address_searched: string) => {
        setAddress_searched(address_searched);
        setLoading(true)
    }

    useDebounceEffect(async () => {
        setLoading(true)

        if (address_searched === undefined || address_searched.length < 3) {
            return setLoading(false)
        } else {
            //get IP
            // const res = await axios.get('https://geolocation-db.com/json/')
            // console.log(res.data);
            // console.log(res.data.IPv4)
            // const ip = res.data.IPv4
            // Send the data to the server in JSON format.
            // API endpoint where we send form data.
            //const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=user&user_ip=${ip}`


            const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=user&lng_lat=${lng_lat}`

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint)

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()
            //console.log(result.data);

            setLoading(false)
            return setAddresses(result.data)
        }


    },
        600,
        [address_searched],
    )

    const handleEventSetAddress = async (element: any) => {
        const result = await setUserAddress(element, 'user');

        if (typeof window !== "undefined") {
            localStorage.setItem('address', JSON.stringify(result))
        } else {
            return console.log('impossibile creare elemento');
        }
        dispatch(
            setAddress({
                address: result
            })
        );
        return setisOpen(false)

    }
    return (
        <Drawer
            placement='top'
            isOpen={isOpen}
            onClose={() => setisOpen(false)}>
            <DrawerOverlay />
            <DrawerContent className='h-80'  >
                <DrawerHeader borderBottomWidth='1px' border={'none'} className='flex justify-between '>
                    <h1 className="font-black text-2xl md:text-3xl italic text-black-900  ">VEPLO</h1>
                    <svg onClick={() => setisOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7  cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </DrawerHeader>
                <DrawerBody className='md:m-auto '>
                    <Input_Search_Address handleEvent={onChangeAddress} gpsPositionAddress={gpsPositionAddress} loading={loadingGPS} />
                    <div className=''>
                        {addresses[0] && !loading &&
                            <div className='py-3 ml-8'>
                                <h2 className='text-md font-bold text-gray-500 mb-2'>risultati</h2>
                                {addresses.map((element: any) => {
                                    return (
                                        <div key={element.id} onClick={() => handleEventSetAddress(element)} className=' pt-2 -ml-2  cursor-pointer hover:bg-gray-100 rounded-sm	'>
                                            <Address_text_handle key={element.geometry.coordinates[0]} element={element} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {loading &&
                            <Center className='mt-4' color='white'>
                                <CircularProgress
                                    size='40px'
                                    isIndeterminate color='gray.500' />
                            </Center>
                        }


                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer >

    )
}

export default Drawer_Address