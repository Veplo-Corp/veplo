import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../components/atoms/Select_multiple_options'
import Address_text_handle from '../../../../components/molecules/Address_text_handle'
import { Day, DAYS } from '../../../../components/mook/days'
import setUserAddress from '../../../../components/utils/setUserAddress'
import { Mapbox_Result } from '../../../interfaces/mapbox_result.interface'

const index = () => {

    const shop_name = useRef<HTMLInputElement>(null);
    const [shop_phone, setShop_phone] = useState('')
    const [shop_piva, setShop_piva] = useState('');
    const [open_hour, setOpen_hour] = useState('');
    const [close_hour, setClose_hour] = useState('');

    //address parameters
    let filterTimeout: any;
    const [address_Mapbox, setAddress_Mapbox] = useState('');

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [showAddress, setShowAddress] = useState(false)
    const [streetNumberDisabled, setStreetNumberDisabled] = useState(false)

    const days = useRef<Day[]>(DAYS)


    const onChangePhoneNumber = (e) => {
        const value: string = e.target.value.replace(/[^0-9\.]+/g, '');
        setShop_phone(value)
    }

    const onChangePiva = (e) => {
        const value: string = e.target.value.replace(/[^0-9\.]+/g, '');
        setShop_piva(value)
    }

    const customizeTime = (time) => {
        const minutes = time.split(':')[1];
        let roundUp_minutes: number | string = (Math.round(minutes / 15) * 15) % 60;
        roundUp_minutes = ('0' + roundUp_minutes).slice(-2)
        console.log(roundUp_minutes);
        const newTime = time.split(':')[0] + ':' + roundUp_minutes;
        return newTime
    }

    const onChangeAddress = async (address_searched: string) => {
        //setAddress_Mapbox(address_searched)
        clearTimeout(filterTimeout)
        filterTimeout = setTimeout(async () => {
            if (address_searched === undefined || address_searched.length < 3) {
                return
            }
            // Send the data to the server in JSON format.
            // API endpoint where we send form data.
            const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=shop`

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint)

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()
            return setAddresses(result.data)
        }, 500)
    }

    const handleEventSetAddress = async (element: Mapbox_Result) => {
        const result = await setUserAddress(element, 'shop');
        console.log(result);

        setCity(result.city);
        setAddress(result.address);
        setAddress_Mapbox('');
        setShowAddress(true)
        if (result.streetNumber !== undefined) {
            setStreetNumber(result.streetNumber)
            setStreetNumberDisabled(true)
        }
        console.log(result);
        return setAddresses([])
    }

    const changeInput = (e, type: string) => {
        let newTime: string;
        switch (type) {
            case 'shop_phone':
                setShop_phone(e.target.value.replace(/[^0-9\.]+/g, ''))
                break;
            case 'shop_piva':
                setShop_piva(e.target.value.replace(/[^0-9\.]+/g, ''))
                break;
            case 'open_hour':
                newTime = customizeTime(e.target.value)
                setOpen_hour(newTime)
                break;
            case 'close_hour':
                newTime = customizeTime(e.target.value)
                setClose_hour(newTime)
                break;
            default:
                console.log(`Sorry, we are out of ${type}.`);
        }
    }

    return (
        <Desktop_Layout>
            <div className='flex justify-between w-full mb-96'>
                <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={() => { }}>
                    <div className='w-full'>
                        <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>parlaci di te!</h1>
                        <Div_input_creation text='Nome (visualizzato dagli utenti)'>
                            <InputGroup >
                                <Input
                                    maxLength={35}
                                    rounded={10}
                                    paddingY={6}
                                    type="text"
                                    ref={shop_name}
                                    isInvalid={false}
                                //onChange={()=> console.log(product_name.current.value)}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Numero di telefono'>
                            <InputGroup >
                                <InputLeftAddon children='+39' paddingY={6} />
                                <Input
                                    maxLength={12}
                                    rounded={10}
                                    paddingY={6}
                                    type='tel'
                                    value={shop_phone}
                                    isInvalid={false}
                                    onChange={(event) => changeInput(event, 'shop_phone')}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <div className={`${showAddress ? 'hidden' : ''}`}>
                            <Div_input_creation text='Indirizzo (es. via roma 41, Terni)'>
                                <InputGroup >
                                    <Input
                                        maxLength={30}
                                        rounded={10}
                                        paddingY={6}
                                        type='tel'
                                        //value={address_Mapbox}
                                        isInvalid={false}
                                        //onChange={(event) => changeInput(event, 'search_address')}
                                        onChange={(e) => {
                                            onChangeAddress(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </Div_input_creation>
                        </div>

                        <div className={` my-3`}>
                            {addresses.map((element: any) => {
                                return (
                                    <div key={element.id} onClick={() => handleEventSetAddress(element)} className=' pt-2 -ml-2  cursor-pointer hover:bg-gray-100 rounded-sm	'>
                                        <Address_text_handle key={element.geometry.coordinates[0]} element={element} />
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            className={`${showAddress ? '' : 'hidden'}`}>
                            <div className='mb-1 w-full'>
                                <div className='flex justify-between text-gray-400'>
                                    <p className='text-xs font-normal mb-px'>
                                        Indirizzo
                                    </p>
                                    <svg
                                        onClick={() => setShowAddress(false)}
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 cursor-pointer">
                                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                    </svg>
                                </div>

                                <InputGroup >
                                    <Input
                                        maxLength={30}
                                        rounded={10}
                                        paddingY={6}
                                        type='tel'
                                        value={address}
                                        isInvalid={false}
                                        readOnly
                                        disabled={address.length > 0}
                                        _disabled={{
                                            opacity: '1'
                                        }}
                                    //onChange={(event) => setAddress(event.target.value)}
                                    />
                                </InputGroup>
                            </div>

                            <Div_input_creation text=''>
                                <InputGroup className='flex justify-between gap-2'>
                                    <div className='mb-1 w-fit'>
                                        <p className='text-xs text-gray-400 font-normal mb-px'>
                                            Civico
                                        </p>
                                        <Input
                                            width={'28'}
                                            rounded={10}
                                            paddingY={6}
                                            type="text"
                                            value={streetNumber}
                                            onChange={(event) => setStreetNumber(event.target.value)}
                                            disabled={streetNumberDisabled}
                                            _disabled={{
                                                opacity: '1'
                                            }}
                                        />
                                    </div>
                                    <Div_input_creation text='città'>
                                        <Input
                                            width={'full'}
                                            rounded={10}
                                            paddingY={6}
                                            type="text"
                                            value={city}
                                            readOnly
                                            disabled={city.length > 0}
                                            _disabled={{
                                                opacity: '1'
                                            }}
                                        //onChange={(event) => setCity(event.target.value)}
                                        />
                                    </Div_input_creation>
                                </InputGroup>
                            </Div_input_creation>
                        </div>

                        <Div_input_creation text='Partita Iva'>
                            <InputGroup >
                                <Input
                                    maxLength={11}
                                    rounded={10}
                                    paddingY={6}
                                    type='tel'
                                    value={shop_piva}
                                    isInvalid={false}
                                    onChange={(event) => changeInput(event, 'shop_piva')}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text=''>
                            <InputGroup className='flex justify-between gap-2'>
                                <Div_input_creation text='orario apertura'>
                                    <Input
                                        rounded={10}
                                        paddingY={6}
                                        type="time"
                                        value={open_hour}
                                        onChange={(event) => setOpen_hour(event.target.value)}
                                        onBlur={(event) => changeInput(event, 'open_hour')}
                                    />
                                </Div_input_creation>
                                <Div_input_creation text='orario chiusura'>
                                    <Input
                                        rounded={10}
                                        paddingY={6}
                                        type="time"
                                        value={close_hour}
                                        onChange={(event) => setClose_hour(event.target.value)}
                                        onBlur={(event) => changeInput(event, 'close_hour')}
                                    />
                                </Div_input_creation>
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='giorni di apertura'>
                            <Select_multiple_options values={days.current} type={'day'} />
                        </Div_input_creation>
                    </div>

                </form>
            </div>
        </Desktop_Layout>
    )
}

export default index