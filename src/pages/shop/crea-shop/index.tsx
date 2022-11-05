import { Alert, AlertIcon, Box, Button, Center, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import BlackButton from '../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../components/atoms/Select_multiple_options'
import Address_text_handle from '../../../../components/molecules/Address_text_handle'
import { Day, DAYS } from '../../../../components/mook/days'
import setUserAddress from '../../../../components/utils/setUserAddress'
import { Mapbox_Result } from '../../../interfaces/mapbox_result.interface'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Image } from '@chakra-ui/react'
import { useDebounceEffect } from '../../../../components/utils/useDebounceEffect'
import { canvasPreview } from '../../../../components/molecules/Canva_previews'
import { storage } from '../../../config/firebase'


type Image = {
    type: string,
    blob: any,
    url: any,
}

const index = () => {

    const shop_name = useRef<HTMLInputElement>(null);
    const [shop_phone, setShop_phone] = useState('')
    const [shop_piva, setShop_piva] = useState('');
    const [open_hour, setOpen_hour] = useState('');
    const [close_hour, setClose_hour] = useState('');

    //*handle image upload and crop
    const hiddenFileInput = useRef(null);
    const [imgSrc, setImgSrc] = useState('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState()
    const [blob, setBlob] = useState()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isDisabledButton, setIsDisabledButton] = useState(true)
    const [crop, setCrop] = useState<Crop>(
        {
            unit: '%', // Can be 'px' or '%'
            x: 17.53,
            y: 11.00,
            width: 65.99,  //762 diviso 5
            height: 76.209,//1100 diviso 5
        }
    )
    const [image, setImage] = useState<Image>()


    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (position: null | number) => {
        hiddenFileInput.current.click();
    };

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setImgSrc(null)
        if (e.target.files && e.target.files.length > 0) {

            //setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || '')
            )
            reader.readAsDataURL(e.target.files[0])
        }
        else {
            return console.log('non trovata immagine caricata');
        }
    }

    useDebounceEffect(async () => {
        console.log(imgRef.current);

        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
        ) {
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                completedCrop,

            )
                .then(canvas => {
                    canvas.toBlob(function (blob) {
                        if (!blob) { return }
                        const url = URL.createObjectURL(blob);
                        setUrl(url)
                        setBlob(blob)
                        setIsDisabledButton(false)
                        console.log(url); // this line should be here
                    }, 'image/webp');
                })

        }
    },
        300,
        [completedCrop],
    )


    const onHanldeConfirm = () => {
        console.log(blob);
        const newImage: Image = {
            type: 'test',
            blob: blob,
            url: url,
        }
        setImage(newImage)
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setImgSrc(null)
        setIsDisabledButton(true)
    }

    //* address parameters
    let filterTimeout: any;
    const [address_Mapbox, setAddress_Mapbox] = useState('');

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [showAddress, setShowAddress] = useState(false)
    const [streetNumberDisabled, setStreetNumberDisabled] = useState(false)

    const days = useRef<Day[]>(DAYS)


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

    //* handle input change

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
                <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={(e) => { e.preventDefault() }}>
                    <div className='w-full'>
                        <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>parlaci di te!</h1>
                        {!imgSrc && !image && <Center
                            onClick={() => handleClick(null)}
                            marginBottom={1}
                            width={'full'}
                            height={'52'}
                            borderWidth={1}
                            borderColor={'gray.200'}
                            borderStyle={'dashed'}
                            borderRadius={10}
                            color={'gray.400'}
                            className='cursor-pointer'
                        >
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 m-auto">
                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                </svg>
                                <h2>immagine negozio</h2>
                            </div>
                        </Center>}
                        {imgSrc && (
                            <>
                                <Alert status='warning' variant='solid' className='mb-2'>
                                    <AlertIcon />
                                    Ritaglia la foto
                                </Alert>
                                <ReactCrop
                                    className='w-full h-fit'
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => {
                                        setIsDisabledButton(true)
                                        setCompletedCrop(c)
                                    }}
                                    aspect={1100 / 762}
                                >
                                    <img
                                        className='min-w-full'
                                        src={imgSrc} ref={imgRef}
                                    />
                                </ReactCrop>
                                <div className='flex justify-between mt-2 mb-2 gap-2'>
                                  
                                    <Button
                                        onClick={() => handleClick(null)}
                                        borderRadius={5}
                                        width={150}
                                        height={12}
                                        size={'sm'}
                                        variant='outline'
                                        colorScheme={'blackAlpha'}
                                        color={'blackAlpha.900'}
                                        disabled={false} >
                                        cambia immagine
                                    </Button>
                                    <BlackButton
                                        onClick={onHanldeConfirm}
                                        element='aggiungi'
                                        borderRadius={5}
                                        width={200}
                                        heigth={12}
                                        size={'sm'}
                                        typeButton={'button'}
                                        disabled={isDisabledButton} />
                                </div>
                            </>
                        )}
                        {image && !imgSrc && <Image
                            width={'full'}
                            height={'52'}
                            borderRadius={10}
                            marginBottom={1}
                            objectFit='cover'
                            onClick={() => handleClick(null)}
                            src={image.url} /* 'https://bit.ly/dan-abramov' */
                            alt='Errore estrapolazione immagine'
                        />}
                        <input
                            ref={hiddenFileInput}
                            type="file" id="file" multiple accept="image/*"
                            className='hidden'
                            onChange={(e) => {
                                onSelectFile(e);
                            }} />
                        {<canvas
                            ref={previewCanvasRef}
                            className='hidden'
                        // style={{
                        //     border: '1px solid black',
                        //     objectFit: 'contain',
                        //     width: completedCrop.width,
                        //     height: completedCrop.height,
                        // }}
                        />}
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
                        <div className={`${showAddress ? 'hidden' : ''} mb-1 w-full`}>
                            <div className='flex justify-between text-gray-400'>
                                <p className='text-xs font-normal mb-px'>
                                    Indirizzo (es. via roma 41, Terni)
                                </p>
                                {address && <svg
                                    onClick={() => setShowAddress(true)}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                    className="w-4 h-4 cursor-pointer my-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>}

                            </div>
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
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 cursor-pointer my-auto">
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
                                    <Div_input_creation text='Città'>
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
                        <div className='flex justify-end mt-4'>
                            <BlackButton
                                element='crea negozio'
                                borderRadius={5}
                                width={200}
                                heigth={12}
                                size={'sm'}
                                typeButton={'submit'}
                                disabled={false} />
                        </div>
                    </div>


                </form>
            </div>
        </Desktop_Layout>
    )
}

export default index