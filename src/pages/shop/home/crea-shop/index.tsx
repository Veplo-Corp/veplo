import { Alert, AlertIcon, Box, Button, Center, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Spinner, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import BlackButton from '../../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../../components/atoms/Select_multiple_options'
import Address_text_handle from '../../../../../components/molecules/Address_text_handle'
import { Day, DAYS } from '../../../../../components/mook/days'
import setUserAddress from '../../../../../components/utils/setUserAddress'
import { Mapbox_Result } from '../../../../interfaces/mapbox_result.interface'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Image } from '@chakra-ui/react'
import { useDebounceEffect } from '../../../../../components/utils/useDebounceEffect'
import { canvasPreview } from '../../../../../components/molecules/Canva_previews'
import { storage } from '../../../../config/firebase'
import { useForm, Controller } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import CREATE_SHOP from '../../../../lib/apollo/mutations/createShop'
import { ToastOpen } from '../../../../../components/utils/Toast'
import { useDispatch, useSelector } from 'react-redux'
import Shop_UID_Required from '../../../../../components/utils/Shop_UID_Required'
import { Firebase_User } from '../../../../interfaces/firebase_user.interface'
import { useRouter } from 'next/router'
import { resizeFile } from '../../../../../components/utils/resizeFile'
import uploadPhotoFirebase from '../../../../../components/utils/uploadPhotoFirebase'
import PostMeta from '../../../../../components/organisms/PostMeta'
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo'
import isShopOpen from '../../../../../components/utils/isShopOpen'
import GET_BUSINESS from '../../../../lib/apollo/queries/business'
import DOES_SHOP_UNIQUE_NAME_EXISTS from '../../../../lib/apollo/queries/doesShopUniqueNameExists'

import { addShopFavouriteToLocalStorage } from '../../../../../components/utils/shop_localStorage'
import ModalReausable from '../../../../../components/organisms/ModalReausable'
import ImageCrop from '../../../../../components/molecules/ImageCrop'
import { onChangeNumberPrice } from '../../../../../components/utils/onChangePrice'
import SelectMultipleOptions from '../../../../../components/atoms/SelectMultipleOptions'
import { SHOP_CATEGORIES } from '../../../../../components/mook/shopCategories'
import { uploadImage } from '../../../../lib/upload/uploadImage'
import { UploadEventType } from '../../../../lib/upload/UploadEventTypes'
import SelectStringOption from '../../../../../components/atoms/SelectStringOption'
import { Cancel, CheckCircle } from 'iconoir-react'
import expirationTimeTokenControll from '../../../../../components/utils/expirationTimeTokenControll'



type Image = {
    type: string,
    blob: any,
    url: any,
    file: any
}

interface IFormInput {

    name?: {
        unique?: string;
        visualized?: string;
    },

    //! togliere description (obbligatoria), macrocategories e gendere in createProduct
    //!deve inserire tommaso
    profileCover: string,
    type: 'brand' | 'shop',
    profilePhoto: string,
    isDigitalOnly?: boolean,
    categories: string[],
    address?: {
        city: string | undefined
        street: string
        postcode?: string,
        location: {
            type: string,
            coordinates: number[]
        }
    }
    info?: {
        phone?: string
        description?: ''
        opening?: {
            days: number[],
            hours: string[],
        },
    },
    minimumAmountForFreeShipping?: number | string


}


const typeShop = [
    'Fisico',
    'Digitale'
]

const index = () => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [isLoading, setIsLoading] = useState(false)
    const [createShop] = useMutation(CREATE_SHOP, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_BUSINESS,
            variables: {
                //mongoId Shop
                id: user.accountId
            }
        }],

    });
    const [isValidUniqueName, setIsValidUniqueName] = useState<boolean | undefined>()



    const { addToast } = ToastOpen();
    const router = useRouter()
    //*useForm Registration Shop
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInput>({
        mode: "all",
        defaultValues: {
            profileCover: '',
            profilePhoto: ''
        }
    });

    //* input to create shop
    const [shop_name, setShop_name] = useState('')
    const [shop_phone, setShop_phone] = useState('')
    const [open_hour, setOpen_hour] = useState('');
    const [close_hour, setClose_hour] = useState('');
    const [days_open, setDays_open] = useState<any[]>([]);
    const [shopIsDigital, setShopIsDigital] = useState(true)
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
    const [isValid_open_hour, setIsValid_Open_hour] = useState<boolean | null>(null)
    const [isValid_close_hour, setIsValid_Close_hour] = useState<boolean | null>(null)


    //*handle image upload and crop
    const hiddenFileInputProfileImage = useRef<any>(null);
    const [typeCroppedImage, setTypeCroppedImage] = useState<UploadEventType>()

    const [imgSrc, setImgSrc] = useState<any>('');

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)

    const [image, setImage] = useState<Image>()
    const [imageProfile, setImageProfile] = useState<Image>()

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (position: null | number, type: UploadEventType) => {

        // if (type === 'cover') {
        //     hiddenFileInput.current.click();
        //     return setShowCroppedImage(true)
        //     //set the posizion of the cropp
        // }

        if (!hiddenFileInputProfileImage.current) return
        setTypeCroppedImage(type)
        hiddenFileInputProfileImage.current.click();


    };



    //refactoring of onSelectFile
    const onSelectFileInput = async (e: React.ChangeEvent<HTMLInputElement>, type: UploadEventType) => {

        hiddenFileInputProfileImage.current.click();
        if (e.target.files) {
            try {

                const file = e.target.files[0];
                const image = await resizeFile(file);
                setImgSrc(image)
                setisProfileImageModalOpen(true)

            } catch (err) {

            }

        }
        else {

        }


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
    const [isProfileImageModalOpen, setisProfileImageModalOpen] = useState(false)
    const [getIsNameValid] = useLazyQuery(DOES_SHOP_UNIQUE_NAME_EXISTS);


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


        //     //return setAddresses(result.data)
        // }, 500)
    }


    useDebounceEffect(async () => {
        if (address_searched === undefined || address_searched.length < 3) {
            return
        } else {


            const endpoint = `/api/mapbox/autocomplete-address?search_text=${address_searched}&type=shop&lng_lat=0,0`

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint)
            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json()

            return setAddresses(result.data)
        }


    },
        600,
        [address_searched],
    )



    const handleEventSetAddress = async (element: Mapbox_Result) => {
        const result = await setUserAddress(element, 'shop');


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


        setAddress(result);
        setAddress_Mapbox('');
        setShowAddress(true)

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

            case 'days_open':
                // setDays_open(e)

                let dayArray = []
                for (let i = 0; i < e.length; i++) {

                    dayArray.push(Number(e[i].id))
                }

                dayArray = dayArray.sort()
                setValue('info.opening.days', dayArray);
                break;
            default:

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

        }
    }

    const changeShopType = (event: any) => {

        setShopIsDigital(event.target.value === 'Digitale' ? true : false)
    }

    const submitData = async (e: IFormInput) => {
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        // const url = await uploadPhotoFirebase(image?.blob, `/${user.uid}/shop_image/immagine`)

        setIsLoading(true)

        try {
            //uploadImage cover
            const photoUploadedCover = await uploadImage(image?.file, UploadEventType.shopCover)
            //uploadImage profile

            const photoUploadedProfile = await uploadImage(imageProfile?.file, UploadEventType.shopPhoto)

            let Shop: IFormInput = {
                name: {
                    visualized: e.name?.visualized,
                    unique: e.name?.unique,
                },
                type: e.type,
                profileCover: photoUploadedCover.id,
                profilePhoto: photoUploadedProfile.id,
                info: {
                    phone: watch('info.phone'),
                    description: watch('info.description'),
                },
                address: {
                    city: address.city,
                    street: address.address + ' ' + address.streetNumber,
                    postcode: address.postcode,
                    location: address.location
                },
                categories: e.categories
            }


            const minimumAmountForFreeShipping = watch('minimumAmountForFreeShipping')

            if (typeof minimumAmountForFreeShipping === 'string' && Number(minimumAmountForFreeShipping.replace(',', '.')) > 0) {
                Shop = {
                    ...Shop,
                    minimumAmountForFreeShipping: parseInt(minimumAmountForFreeShipping.replace(',', '.')) * 100
                }
            }






            if (!shopIsDigital) {
                Shop = {
                    ...Shop,
                    isDigitalOnly: shopIsDigital,
                    info: {
                        ...Shop.info,
                        opening: {
                            days: watch('info.opening.days'),
                            hours: [open_hour, close_hour]
                        },
                    },
                }

            }

            if (shopIsDigital) {
                Shop = {
                    ...Shop,
                    isDigitalOnly: shopIsDigital,
                    info: {
                        ...Shop.info,
                        opening: {
                            days: [0, 1, 3, 4, 5, 6],
                            hours: ["00:00", "00:00"]
                        },
                    },
                }
            }



            //return the mongoID of the Shop
            const isCreatedShop = await createShop({ variables: { options: Shop } })

            //?OLD addshopId deprecated 
            // dispatch(
            //     addShopId(isCreatedShop.data.createShop)
            // );
            //TODO
            //add shopId to user in Redux with function
            addToast({ position: 'top', title: 'Shop creato con successo', description: "inizia a inserire i tuoi prodotti in Veplo!", status: 'success', duration: 5000, isClosable: true })


            addShopFavouriteToLocalStorage({
                name: {
                    visualized: e.name?.visualized,
                    unique: e.name?.unique,
                },
                street: address.city + ', ' + address.address + ' ' + address.streetNumber,
                id: isCreatedShop.data.createShop
            })
            setIsLoading(false)
            return router.push('/shop/home/' + isCreatedShop.data.createShop + '/prodotti')
        } catch (e) {
            setIsLoading(false)

            addToast({ position: 'top', title: 'Errore durante la creazione dello Shop', description: "non siamo riusciti a creare il tuo shop. riprova più tardi o contattaci", status: 'error', duration: 10000, isClosable: true })
        }
    }

    const uniqueNameCheck = () => {
        if (!watch('name.unique') || errors?.name?.unique) {
            return (<></>)
        }
        if (watch('name.unique'))
            if (isValidUniqueName === true) {
                return (<CheckCircle
                    className='h-6 w-6 text-[#37D1A9]'
                />)
            } else if (isValidUniqueName === false) {
                return (<Cancel
                    className='h-6 w-6 text-[#C63F3F]'
                    strokeWidth={2}
                />)
            } else {
                return (<Spinner
                    thickness='2px'
                    emptyColor='white'
                    color='gray.900'
                    speed='0.65s'
                    size={'md'}
                />)
            }
    }

    useDebounceEffect(async () => {
        const isValid = false;
        const nameBrand = watch('name.unique')
        if (!nameBrand || errors?.name?.unique) {
            return setIsValidUniqueName(undefined)
        }

        getIsNameValid({ variables: { name: nameBrand } }).then((res) => {

            if (res.data?.doesShopUniqueNameExists === false) {
                return setIsValidUniqueName(true)
            } else {
                setIsValidUniqueName(false)
            }
        }).catch(() => {
            setIsValidUniqueName(false)
        })



    },
        1500,
        [watch('name.unique')],
    )




    const handleImageConfirm = (image: PixelCrop, type: UploadEventType, imgRefCurrent: HTMLImageElement) => {

        if (
            image?.width &&
            image?.height &&
            imgRefCurrent &&
            previewCanvasRef.current
        ) {
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
                imgRefCurrent,
                previewCanvasRef.current,
                image,
            )
                .then(canvas => {
                    const yourBase64String = imgSrc.substring(imgSrc.indexOf(',') + 1);
                    const kb = Math.ceil(((yourBase64String.length * 6) / 8) / 1000); //es. 426 kb

                    //set quality based on dimension photo
                    const quality = kb > 3000 ? 0.9 : 1;
                    canvas.toBlob(function (blob) {
                        if (!blob) { return }
                        const url = URL.createObjectURL(blob);
                        const file = new File([blob], "photo1", {
                            type: 'image/jpeg'
                        });


                        const newImage: Image = {
                            type: 'image/jpeg',
                            blob: blob,
                            url: url,
                            file: file
                        }
                        if (type === UploadEventType.shopPhoto) {
                            setImageProfile(newImage)
                        }
                        if (type === UploadEventType.shopCover) {
                            setImage(newImage)
                        }

                    }, 'image/jpeg', quality);

                })
        }
    }

    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Crea Negozio | Veplo`} />
            <div className='flex '>
                <form className="p-3 px-0 lg:px-16 xl:px-24 w-full md:w-3/4 lg:w-7/12 m-auto" onSubmit={handleSubmit(submitData)}>
                    <div className='w-full'>
                        <h1 className='text-xl lg:text-2xl font-extrabold mb-4'>Crea un profilo</h1>

                        <Div_input_creation text=''>
                            {!image && <Center

                                onClick={() => {
                                    setTypeCroppedImage(UploadEventType.shopCover)
                                    handleClick(null, UploadEventType.shopCover)
                                }}
                                marginBottom={1}
                                width={'full'}
                                //minHeight={['52', '64']}
                                fontSize={['xs', 'sm']}
                                borderWidth={1}
                                borderColor={'gray.200'}
                                borderStyle={'dashed'}
                                borderRadius={10}
                                color={'gray.400'}
                                className='cursor-pointer aspect-[2.3/1]'
                            >
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 m-auto">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    <h2>immagine copertina</h2>
                                </div>
                            </Center>}

                            {image && <Image
                                width={'full'}
                                height={['52', '64']}
                                borderRadius={10}
                                marginBottom={1}
                                zIndex={0}
                                objectFit='cover'
                                cursor={'pointer'}
                                onClick={() => {
                                    setTypeCroppedImage(UploadEventType.shopCover)
                                    handleClick(null, UploadEventType.shopCover)
                                }}
                                className='z-0'
                                src={image.url} /* 'https://bit.ly/dan-abramov' */
                                alt={shop_name}
                            />}
                            <Box
                                onClick={() => {
                                    setTypeCroppedImage(UploadEventType.shopPhoto)
                                    handleClick(null, UploadEventType.shopPhoto)
                                }
                                }
                                marginBottom={1}
                                width={['32', '40']}
                                height={['32', '40']}
                                mt={[-16, -20]}
                                zIndex={50}
                                borderWidth={1}
                                borderColor={imageProfile ? 'white' : 'gray.200'}
                                borderStyle={imageProfile ? 'none' : 'dashed'}
                                background={'white'}
                                borderRadius={'full'}
                                color={'gray.400'}
                                fontSize={['xs', 'sm']}
                                className='cursor-pointer ml-6 md:ml-8'
                                display={'flex'}
                            >
                                {!imageProfile ? (
                                    <Box
                                        borderRadius={'full'}
                                        width={'full'}
                                        height={'full'}
                                        background={'white'}
                                        textAlign={'center'}
                                        display={'flex'}
                                    >
                                        <Box
                                            alignItems={'center'}
                                            margin={'auto'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 z-50 m-auto">
                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                            </svg>
                                            <h2>immagine profilo</h2>
                                        </Box>


                                    </Box>

                                )
                                    : (
                                        <Box
                                            className='border-[5px] border-white rounded-full
                                                w-36 h-36 md:w-40 md:h-40
                                                '
                                        >


                                            <Image


                                                borderRadius={'full'}

                                                marginBottom={1}
                                                objectFit='cover'
                                                src={imageProfile.url} /* 'https://bit.ly/dan-abramov' */
                                                alt={shop_name}
                                            />
                                        </Box>

                                    )
                                }
                            </Box>
                            <input
                                ref={hiddenFileInputProfileImage}
                                type="file" id="file" multiple
                                accept="image/*"
                                className='hidden'
                                onChange={(e) => {
                                    onSelectFileInput(e, typeCroppedImage === UploadEventType.shopPhoto ? UploadEventType.shopPhoto : UploadEventType.shopCover);
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
                        </Div_input_creation>



                        <Div_input_creation text='Tipologia'>
                            <Controller
                                control={control}
                                name="type"
                                rules={{ required: false }}
                                defaultValue='brand'
                                render={({ field }) => (
                                    <SelectStringOption
                                        values={['brand', 'shop']}
                                        defaultValue={field.value}
                                        handleClick={(microcategory: 'brand' | 'shop') => {
                                            setValue('type', microcategory);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Nome univoco (utilizzato per creare il tuo link univoco)'>
                            <InputGroup>
                                <Input
                                    rounded={10}
                                    paddingY={6}
                                    autoComplete="new-password"
                                    type="text"
                                    maxLength={30}
                                    borderRightColor={'white'}
                                    {...register("name.unique", {
                                        required: true,
                                        pattern: /^[A-Za-zÀ-ÿ0-9.\-_]+$/,
                                        // Espressione regolare che accetta lettere, numeri e "-"
                                        onChange: () => {
                                            setIsValidUniqueName(undefined);
                                        },
                                    })}
                                />

                                <InputRightAddon
                                    borderLeftColor={'white'}
                                    paddingY={6}
                                    bg={'white'}
                                    borderLeftWidth={0}
                                    children={
                                        uniqueNameCheck()
                                    } />
                            </InputGroup>
                            {errors.name?.unique && watch('name.unique') && <Text
                                pl={2}
                                mt={0}
                                fontSize={'sm'}
                                fontWeight={'medium'}
                                color={"cancelTag.bg"}
                                role="alert">* i caratteri speciali non sono accettati</Text>}
                            {isValidUniqueName === false && <Text
                                pl={2}
                                mt={0}
                                fontSize={'sm'}
                                fontWeight={'normal'}
                                color={'#C63F3F'}
                                role="alert">il nome inserito è già esistente</Text>}

                        </Div_input_creation>

                        <Div_input_creation text='Nome pubblico (visualizzato dagli utenti)'>
                            <InputGroup >
                                <Input
                                    maxLength={35}
                                    rounded={10}
                                    paddingY={6}
                                    autoComplete="new-password"
                                    type="text"
                                    // value={shop_name}
                                    {...register("name.visualized", { required: true, maxLength: 30 })}
                                    // onChange={(event) => changeInput(event, 'shop_name')}
                                    isInvalid={false}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Categoria (massimo 2)'>
                            <Controller
                                control={control}
                                name="categories"
                                rules={{ required: true }}
                                render={() => (
                                    <SelectMultipleOptions
                                        limitNumber={2}
                                        handleValue={(value) => {

                                            setValue('categories', value.map(value => {
                                                return value.toLowerCase()
                                            }));
                                        }}
                                        defaultValue={watch('categories')}

                                        values={SHOP_CATEGORIES}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Descrizione del negozio (opzionale, max 700 caratteri)'>
                            <InputGroup >

                                <Textarea

                                    size='sm'
                                    maxLength={700}
                                    rounded={10}
                                    paddingY={3}
                                    autoComplete="descrition-text-shop"
                                    height={48}
                                    // value={shop_name}
                                    {...register("info.description", { required: false, maxLength: 700 })}
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
                                    {...register("info.phone", { required: true, minLength: 6, maxLength: 12 })}
                                />
                            </InputGroup>
                            {isValid_shop_phone === false && <p className='text-sm md:text-xs text-red-600'>Inserisci un numero corretto</p>}
                        </Div_input_creation>
                        <Div_input_creation text='ordine minimo per spedizione gratuita (opzionale)'>
                            <InputGroup
                            >
                                <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                                <Input
                                    rounded={10}
                                    paddingY={6}
                                    autoComplete='off'
                                    type="number"
                                    {...register("minimumAmountForFreeShipping", {
                                    })}
                                    onWheel={(e: any) => e.target.blur()}
                                    placeholder={'numero intero'}
                                    textAlign={"end"}
                                    isInvalid={false}
                                    step={1}
                                    onChange={(e) => {
                                        const inputValue = onChangeNumberPrice(e)
                                        return setValue('minimumAmountForFreeShipping', inputValue);
                                    }}
                                />
                            </InputGroup>
                            {isValid_shop_phone === false && <p className='text-sm md:text-xs text-red-600'>Inserisci un numero corretto</p>}
                        </Div_input_creation>
                        {/* <Div_input_creation text='Tipologia negozio'>
                                <Select size='lg' marginBottom={2} onChange={changeShopType} fontSize={'md'}>
                                    {typeShop.map((option: string) => {
                                        return (<option
                                            key={option} value={option}>{option}</option>)
                                    })}
                                </Select>
                            </Div_input_creation> */}
                        <Div_input_creation text={shopIsDigital ? 'Indirizzo sede operativa' : 'Indirizzo (es. via roma 41, Terni)'}>
                            <div className={`${showAddress ? 'hidden' : ''} mb-1 w-full`}>
                                <div className='flex justify-between text-gray-400'>

                                    {address.address !== '' && <svg
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
                        </Div_input_creation>


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


                        {!shopIsDigital &&
                            <>
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
                            </>
                        }
                        <div className='flex justify-end mt-4'>
                            <BlackButton
                                element={
                                    !isLoading
                                        ?
                                        'conferma'
                                        :
                                        <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.400'
                                            color='white'
                                            size='lg'
                                        />

                                }
                                borderRadius={5}
                                width={200}
                                heigth={12}
                                size={'sm'}
                                typeButton={'submit'}
                                //disabled={false}
                                isDisabled={isLoading || !address || address.streetNumber === '' /*|| !open_hour || !close_hour || !isValid_close_hour || !isValid_open_hour || !isValid_shop_streetNumber || !watch('info.opening.days') || watch('info.opening.days').length <= 0 */ || !isValid || !image?.file || !imageProfile?.file || watch('categories')?.length <= 0}
                            />
                        </div>
                    </div>
                </form>
            </div>
            <ModalReausable
                marginTop={0}
                title={typeCroppedImage === UploadEventType.shopPhoto ? 'inserisci immagine di profilo (ritaglia la foto)' : 'inserisci immagine di copertina (ritaglia la foto)'}
                isOpen={isProfileImageModalOpen}
                closeModal={() => {

                    hiddenFileInputProfileImage.current.value = null;
                    setisProfileImageModalOpen(false)
                }
                }
                positionTopModal={true}
            >
                <ImageCrop
                    imageSrc={imgSrc} type={typeCroppedImage} aspectRatio={typeCroppedImage === UploadEventType.shopPhoto ? 1 : (2.6 / 1)}
                    circularCrop={typeCroppedImage === UploadEventType.shopPhoto ? true : false}
                    onHanldeConfirm={(image, type, imageRefCurrent) => {
                        if (type === UploadEventType.shopCover || type === UploadEventType.shopPhoto) {


                            handleImageConfirm(image, type, imageRefCurrent)
                        }
                        hiddenFileInputProfileImage.current.value = null;
                        setisProfileImageModalOpen(false)
                    }
                    }
                    handlerCancel={() => {
                        hiddenFileInputProfileImage.current.value = null;
                        setisProfileImageModalOpen(false)
                    }}
                />
            </ModalReausable>
        </Desktop_Layout>



    )
}

export default index