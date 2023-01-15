import { Alert, AlertIcon, Box, Button, Center, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import CREATE_SHOP from '../../../lib/apollo/mutations/createShop'
import { ToastOpen } from '../../../../components/utils/Toast'
import { useDispatch, useSelector } from 'react-redux'
import Shop_UID_Required from '../../../../components/utils/Shop_UID_Required'
import { Firebase_User } from '../../../interfaces/firebase_user.interface'
import { useRouter } from 'next/router'
import { addShopId } from '../../../store/reducers/user'
import { resizeFile } from '../../../../components/utils/resizeFile'
import uploadPhotoFirebase from '../../../../components/utils/uploadPhotoFirebase'
import PostMeta from '../../../../components/organisms/PostMeta'
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'


type Image = {
    type: string,
    blob: any,
    url: any,
    file: any
}

interface IFormInput {
    name?: string;
    postcode?: string
    address?: {
        city: string | undefined
        street: string
        location: {
            type: string,
            coordinates: number[]
        }
    }
    opening?: {
        days: number[],
        hours: string[]
    },
    description?: ''

    //! togliere description (obbligatoria), macrocategories e gendere in createProduct
    //!deve inserire tommaso
    piva: string
    photo: string[]
    phone: string
}


const index = () => {

    const [createShop, createShopElement] = useMutation(CREATE_SHOP);
    const { addToast } = ToastOpen();
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter()
    //*useForm Registration Shop
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInput>({
        mode: "all",
        defaultValues: {
            photo: ['']
        }
    });

    //* input to create shop
    const [shop_name, setShop_name] = useState('')
    const [shop_phone, setShop_phone] = useState('')
    const [shop_piva, setShop_piva] = useState('');
    const [open_hour, setOpen_hour] = useState('');
    const [close_hour, setClose_hour] = useState('');
    const [days_open, setDays_open] = useState<any[]>([]);
    const days = useRef<Day[]>(DAYS)


    const customizeTime = (time: any) => {
        const minutes = time.split(':')[1];
        let roundUp_minutes: number | string = (Math.round(minutes / 15) * 15) % 60;
        roundUp_minutes = ('0' + roundUp_minutes).slice(-2)
        const newTime = time.split(':')[0] + ':' + roundUp_minutes;
        return newTime
    }
    //* validators
    const [isValid_shop_phone, setIsValid_Shop_phone] = useState<boolean | null>(null)
    const [isValid_shop_piva, setIsValid_Shop_piva] = useState<boolean | null>(null)
    const [isValid_open_hour, setIsValid_Open_hour] = useState<boolean | null>(null)
    const [isValid_close_hour, setIsValid_Close_hour] = useState<boolean | null>(null)


    //*handle image upload and crop
    const hiddenFileInput = useRef<any>(null);
    const [imgSrc, setImgSrc] = useState<any>('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState<any>()
    const [blob, setBlob] = useState<any>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isDisabledButton, setIsDisabledButton] = useState(true)
    const [crop, setCrop] = useState<Crop | any>(
        {
            unit: '%', // Can be 'px' or '%'
            x: 17.53,
            y: 11.00,
            width: 65.99,  //762 diviso 5
            height: 76.209,//1100 diviso 5
        }
    )
    const [image, setImage] = useState<Image>()
    const [loading, setLoading] = useState(false)
    const [showCroppedImage, setShowCroppedImage] = useState<any>(false);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (position: null | number) => {
        hiddenFileInput.current.click();
        setShowCroppedImage(true)
        //set the posizion of the cropp
    };

    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {


        setLoading(true)
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setShowCroppedImage(true)

        if (e.target.files /* && e.target.files.length > 0 */) {
            try {
                const file = e.target.files[0];
                const image = await resizeFile(file);
                console.log(image);

                setImgSrc(image)

            } catch (err) {
                console.log(err);
            }

        }
        else {
            return console.log('non trovata immagine caricata');
        }

        setLoading(false)
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
                    const yourBase64String = imgSrc.substring(imgSrc.indexOf(',') + 1);
                    const kb = Math.ceil(((yourBase64String.length * 6) / 8) / 1000); //es. 426 kb
                    console.log(kb);
                    //set quality based on dimension photo
                    const quality = kb > 3000 ? 0.3 : 0.8;
                    canvas.toBlob(function (blob) {
                        if (!blob) { return }
                        const url = URL.createObjectURL(blob);
                        setUrl(url)
                        setBlob(blob)
                        setIsDisabledButton(false)
                    }, 'image/webp', quality);
                })
        }
    },
        0,
        [completedCrop],
    )


    const onHanldeConfirm = () => {
        const file = new File([blob], "photo1", {
            type: 'image/webp'
        });

        const newImage: Image = {
            type: 'image/webp',
            blob: blob,
            url: url,
            file: file
        }
        setImage(newImage)
        setBlob(null)
        setUrl(null)
        setCrop(null)
        //setImgSrc(null)
        setIsDisabledButton(true)
        setShowCroppedImage(false)
    }

    //* address parameters
    let filterTimeout: any;
    const [address_Mapbox, setAddress_Mapbox] = useState('');

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState<Mapbox_Result>({
        placeType: '',
        location: {
            type: 'Point',
            coordinates: [1, 1]
        },
        CAP_Location: {
            type: 'Point',
            coordinates: [1, 1]
        },
        postcode: '',
        city: '',
        address: '',
        streetNumber: ''
    })
    const [isValid_shop_streetNumber, setisValid_shop_streetNumber] = useState<boolean | null>(null)
    const [showAddress, setShowAddress] = useState(false)
    const [streetNumberDisabled, setStreetNumberDisabled] = useState(false)
    const [address_searched, setAddress_searched] = useState('')
    const dispatch = useDispatch();


    const onChangeAddress = async (address_searched: string) => {
        setAddress_searched(address_searched)
        // clearTimeout(filterTimeout)
        // filterTimeout = setTimeout(async () => {
        //     if (address_searched === undefined || address_searched.length < 3) {
        //         return
        //     }
        //     // Send the data to the server in JSON format.
        //     // API endpoint where we send form data.
        //     const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=shop&lng_lat=0,0`

        //     // Send the form data to our forms API on Vercel and get a response.
        //     const response = await fetch(endpoint)

        //     // Get the response data from server as JSON.
        //     // If server returns the name submitted, that means the form works.
        //     const result = await response.json()
        //     console.log(result);

        //     //return setAddresses(result.data)
        // }, 500)
    }


    useDebounceEffect(async () => {

        if (address_searched === undefined || address_searched.length < 3) {
            return
        } else {
            //get IP
            // const res = await axios.get('https://geolocation-db.com/json/')
            // console.log(res.data);
            // console.log(res.data.IPv4)
            // const ip = res.data.IPv4
            // Send the data to the server in JSON format.
            // API endpoint where we send form data.
            //const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=user&user_ip=${ip}`


            const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=user&lng_lat=0,0`

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint)

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()
            //console.log(result.data);

            return setAddresses(result.data)
        }


    },
        600,
        [address_searched],
    )

    const handleEventSetAddress = async (element: Mapbox_Result) => {
        const result = await setUserAddress(element, 'shop');
        console.log(result);

        if (result.streetNumber !== undefined) {
            //setStreetNumber(result.streetNumber)
            setStreetNumberDisabled(true)
        } else {
            //reset StreetNumber
            //setStreetNumber('');
            setStreetNumberDisabled(false)
            setisValid_shop_streetNumber(false)
            result.streetNumber = ''
        }
        setisValid_shop_streetNumber(true)
        console.log(result);

        setAddress(result);
        setAddress_Mapbox('');

        setShowAddress(true)

        console.log(result);
        return setAddresses([])
    }

    //* handle input change

    const changeInput = (e: any, type: string) => {
        let newTime: string;
        let value: string = e;
        if (type !== 'days_open') {
            value = e.target.value.replace(/[^0-9]+/g, '');
        }

        switch (type) {
            case 'shop_name':
                setShop_name(e.target.value);
                break
            case 'shop_phone':
                setShop_phone(value)
                setIsValid_Shop_phone(true)
                break;
            case 'shop_piva':
                let inputValue: string = e.target.value.replace(/[^0-9]/g, '')
                setValue('piva', inputValue);
                // setShop_piva(value)
                // setIsValid_Shop_piva(true)
                break;
            case 'days_open':
                // setDays_open(e)
                // console.log(value);                
                let dayArray = []
                for (let i = 0; i < e.length; i++) {

                    dayArray.push(Number(e[i].id))
                }

                dayArray = dayArray.sort()
                setValue('opening.days', dayArray);
                break;
            default:
                console.log(`Sorry, we are out of ${type}.`);
        }
    }

    const checkInput = (type: string) => {
        let newTime: string;
        switch (type) {
            case 'shop_phone':
                if (shop_phone.length < 6) {
                    setIsValid_Shop_phone(false)
                }
                break;
            case 'shop_piva':
                if (shop_piva.length !== 11) {
                    setIsValid_Shop_piva(false)
                }
                break;
            case 'open_hour':
                newTime = customizeTime(open_hour)
                if (newTime.length === 5) {
                    setOpen_hour(newTime)
                } else {
                    setIsValid_Open_hour(false)
                }
                break;
            case 'close_hour':
                newTime = customizeTime(close_hour)
                if (newTime.length === 5) {
                    setClose_hour(newTime)
                } else {
                    setIsValid_Close_hour(false)
                }
                break;
                break;
            default:
                console.log(`Sorry, we are out of ${type}.`);
        }
    }

    const submitData = async (e: IFormInput) => {
        const url = await uploadPhotoFirebase(image?.blob, `/${user.uid}/shop_image/immagine`)
        console.log(url);

        const Shop: IFormInput = {
            name: e.name,
            address: {
                city: address.city,
                street: address.address + ' ' + address.streetNumber,
                //postcode: address.postcode,
                location: address.location
            },
            opening: {
                days: watch('opening.days'),
                hours: [open_hour, close_hour]
            },
            piva: watch('piva'),
            photo: [image?.file],
            phone: watch('phone'),
            description: ''
        }
        console.log(Shop);
        try {
            //return the mongoID of the Shop
            const isCreatedShop = await createShop({ variables: { options: Shop } })
            console.log(isCreatedShop.data.createShop)
            dispatch(
                addShopId(isCreatedShop.data.createShop)
            );
            //TODO
            //add shopId to user in Redux with function
            addToast({ position: 'top', title: 'Shop creato con successo', description: "inizia a inserire i tuoi prodotti in Veplo!", status: 'success', duration: 5000, isClosable: false })
            return router.push('/shop/prodotti')
        } catch (e) {
            console.log(e);
            addToast({ position: 'top', title: 'Errore durante la creazione dello Shop', description: "non siamo riusciti a creare il tuo shop. riprova più tardi o contattaci", status: 'error', duration: 5000, isClosable: false })
        }
    }

    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                <NoIndexSeo title={`Crea Negozio | Veplo`} />
                <div className='flex justify-between w-full mb-96'>
                    <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={handleSubmit(submitData)}>
                        <div className='w-full'>
                            <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>parlaci di te!</h1>
                            {imgSrc !== '' || !image && <Center
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
                            {imgSrc && showCroppedImage && (
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

                                        aspect={4.8 / 3}

                                    >
                                        <img
                                            className='min-w-full'
                                            src={imgSrc} ref={imgRef}
                                        />
                                    </ReactCrop>
                                    <div className='flex justify-between mt-2 mb-2 gap-2'>
                                        <Button
                                            //onClick={() => setImgSrc(null)}
                                            onClick={() => setShowCroppedImage(false)}
                                            borderRadius={5}
                                            width={'fit-content'}
                                            height={12}
                                            size={'sm'}
                                            variant='outline'
                                            colorScheme={'blackAlpha'}
                                            color={'blackAlpha.900'}
                                            disabled={false} >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
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
                                            cambia
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
                            {image && !showCroppedImage && <Image
                                width={'full'}
                                height={'52'}
                                borderRadius={10}
                                marginBottom={1}
                                objectFit='cover'
                                onClick={() => handleClick(null)}
                                src={image.url} /* 'https://bit.ly/dan-abramov' */
                                alt={shop_name}
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
                                        autoComplete="new-password"
                                        type="text"
                                        // value={shop_name}
                                        {...register("name", { required: true, maxLength: 30 })}
                                        // onChange={(event) => changeInput(event, 'shop_name')}
                                        isInvalid={false}
                                    />
                                </InputGroup>
                            </Div_input_creation>
                            <Div_input_creation text='Numero di telefono'>
                                <InputGroup
                                >
                                    <InputLeftAddon children='+39' paddingY={6}
                                        textColor={`${isValid_shop_phone === false ? 'red.900' : 'gray.500'}`}
                                        borderColor={`${isValid_shop_phone === false ? 'red.900' : 'gray.200'}`}
                                    />
                                    <Input
                                        maxLength={12}
                                        autoComplete='off'
                                        rounded={10}
                                        paddingY={6}
                                        type='tel'
                                        isInvalid={false}
                                        borderColor={`${isValid_shop_phone === false ? 'red.900' : 'gray.200'}`}
                                        //value={shop_phone}
                                        // onBlur={() => checkInput('shop_phone')}
                                        // onChange={(event) => changeInput(event, 'shop_phone')}
                                        {...register("phone", { required: true, minLength: 6, maxLength: 12 })}
                                    />
                                </InputGroup>
                                {isValid_shop_phone === false && <p className='text-sm md:text-xs text-red-600'>Inserisci un numero corretto</p>}
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
                                        maxLength={50}
                                        rounded={10}
                                        paddingY={6}
                                        type='text'
                                        autoComplete="new-password"                                        //value={address_Mapbox}
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
                                            value={address.address}
                                            isInvalid={false}
                                            readOnly
                                            disabled={address?.address === undefined || address.address.length > 0}
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
                                                borderColor={`${isValid_shop_streetNumber === false ? 'red.900' : 'gray.200'}`}
                                                width={'28'}
                                                rounded={10}
                                                paddingY={6}
                                                type="number"
                                                min={1}
                                                max={999}
                                                onWheel={(e: any) => e.target.blur()}
                                                value={address.streetNumber}
                                                onChange={(event) => {
                                                    const value = event.target.value
                                                    setAddress(prevstate => {
                                                        return {
                                                            ...prevstate,
                                                            streetNumber: value.toString()
                                                        }
                                                    })
                                                    if (value.length > 0) {
                                                        setisValid_shop_streetNumber(true)
                                                    } else {
                                                        setisValid_shop_streetNumber(false)
                                                    }
                                                }}
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
                                                value={address.city}
                                                readOnly
                                                disabled={address?.city === undefined || address.city.length > 0}
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
                                        borderColor={`${isValid_shop_piva === false ? 'red.900' : 'gray.200'}`}
                                        maxLength={11}
                                        rounded={10}
                                        paddingY={6}
                                        autoComplete='off'
                                        type='tel'
                                        isInvalid={false}
                                        {...register("piva", { required: true, minLength: 11, maxLength: 11 })}
                                        onChange={(event) => changeInput(event, 'shop_piva')}

                                    />
                                </InputGroup>
                                {isValid_shop_piva === false && <p className='text-sm md:text-xs text-red-600'>la Partita Iva deve contenere 11 numeri</p>}
                            </Div_input_creation>
                            <Div_input_creation text=''>
                                <InputGroup className='flex justify-between gap-2'>
                                    <Div_input_creation text='orario apertura'>
                                        <Input
                                            rounded={10}
                                            paddingY={6}
                                            type="time"
                                            value={open_hour}
                                            onChange={(event) => {
                                                setIsValid_Open_hour(true)
                                                setOpen_hour(event.target.value)
                                            }}
                                            onBlur={() => checkInput('open_hour')}
                                            borderColor={`${isValid_open_hour === false ? 'red.900' : 'gray.200'}`}
                                        />
                                    </Div_input_creation>
                                    <Div_input_creation text='orario chiusura'>
                                        <Input
                                            rounded={10}
                                            paddingY={6}
                                            type="time"
                                            value={close_hour}
                                            onChange={(event) => {
                                                setClose_hour(event.target.value)
                                                setIsValid_Close_hour(true)
                                            }}
                                            onBlur={() => checkInput('close_hour')}
                                            borderColor={`${isValid_close_hour === false ? 'red.900' : 'gray.200'}`}
                                        />
                                    </Div_input_creation>
                                </InputGroup>
                            </Div_input_creation>
                            <Div_input_creation text='giorni di apertura'>
                                <Select_multiple_options
                                    handleChangeState={changeInput}
                                    values={days.current} type={'day'}
                                    selectedValueBefore={undefined}
                                />
                            </Div_input_creation>
                            <div className='flex justify-end mt-4'>
                                <BlackButton
                                    element='conferma'
                                    borderRadius={5}
                                    width={200}
                                    heigth={12}
                                    size={'sm'}
                                    typeButton={'submit'}
                                    //disabled={false}
                                    disabled={!address || address.streetNumber === '' || !open_hour || !close_hour || !isValid_close_hour || !isValid_open_hour || !isValid_shop_streetNumber || !watch('opening.days') || watch('opening.days').length <= 0 || !isValid}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </Desktop_Layout>
        </Shop_UID_Required>


    )
}

export default index