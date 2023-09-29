import { Box, Button, Input, InputGroup, InputLeftAddon, Spinner, Textarea } from '@chakra-ui/react'
import React, { FC, memo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Shop } from '../../src/interfaces/shop.interface';
import Div_input_creation from '../atoms/Div_input_creation'
import { DAYS } from '../mook/days';
import { imageKitUrl } from '../utils/imageKitUrl';
import SelectMultipleOptions from '../atoms/SelectMultipleOptions';
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString';
import { EditPencil, Instagram, TikTok } from 'iconoir-react';
import BlackButton from '../atoms/BlackButton';
import Modal_Help_Customer_Care from './Modal_Help_Customer_Care';
import { UploadEventType } from '../../src/lib/upload/UploadEventTypes';
import { Image } from '../../src/pages/shop/home/crea-shop';
import { resizeFile } from '../utils/resizeFile';
import { PixelCrop } from 'react-image-crop';
import { canvasPreview } from '../molecules/Canva_previews';
import ModalReausable from './ModalReausable';
import ImageCrop from '../molecules/ImageCrop';
import EDIT_SHOP from '../../src/lib/apollo/mutations/editShop';
import { useMutation } from '@apollo/client';
import { uploadImage } from '../../src/lib/upload/uploadImage';
import { ToastOpen } from '../utils/Toast';
import GET_BUSINESS from '../../src/lib/apollo/queries/business';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { useSelector } from 'react-redux';
import { EditShopInputInfo } from '../../src/lib/apollo/generated/graphql';




const Shop_Form: FC<{ shop: Shop }> = ({ shop }) => {
    const [isOpen, setIsOpen] = useState(false);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [isLoading, setIsLoading] = useState(false)
    const [editShop] = useMutation(EDIT_SHOP, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_BUSINESS,
            variables: {
                //mongoId Shop
                id: user.accountId
            }
        }],

    });

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<Shop>({
        mode: "all",
        defaultValues: {
            ...shop,
            minimumAmountForFreeShipping: typeof shop.minimumAmountForFreeShipping === 'number' ? shop.minimumAmountForFreeShipping / 100 : 0
        }
    });
    const { addToast } = ToastOpen();


    //*handle image upload and crop
    const hiddenFileInputProfileImage = useRef<any>(null);
    const [typeCroppedImage, setTypeCroppedImage] = useState<UploadEventType>()
    const [isProfileImageModalOpen, setisProfileImageModalOpen] = useState(false)

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

    const handleEditShop = async () => {
        try {
            setIsLoading(true)

            let options: {
                info?: EditShopInputInfo,
                links?: {
                    instagram?: string,
                    tiktok?: string,
                },
                profileCover?: string,
                profilePhoto?: string,
                minimumAmountForFreeShipping?: number
            } = {};
            let info: any = {}
            let links: any = {}
            if (watch("info.description") !== shop.info.description) {
                info["description"] = watch("info.description")
                info["phone"] = watch("info.phone")
                if (watch("info.opening.days") && watch("info.opening.hours")) {
                    let opening: any = {}
                    opening["days"] = watch("info.opening.days")
                    opening["hours"] = watch("info.opening.hours")
                    info["opening"] = opening
                }
            }
            if (watch("links.instagram") !== shop.links.instagram || watch("links.tiktok") !== shop.links.tiktok) {
                links["instagram"] = watch("links.instagram")
                links["tiktok"] = watch("links.tiktok")
                if (watch("links.instagram") !== shop.links.instagram) {
                    links["instagram"] = watch("links.instagram")
                }
                if (watch("links.tiktok") !== shop.links.tiktok) {
                    links["tiktok"] = watch("links.tiktok")
                }
            }


            if (image) {
                const photoUploadedCover = await uploadImage(image?.file, UploadEventType.shopCover)
                options.profileCover = photoUploadedCover.id
            }
            if (imageProfile) {
                const photoUploadedProfile = await uploadImage(imageProfile?.file, UploadEventType.shopPhoto)
                options.profilePhoto = photoUploadedProfile.id
            }
            if (watch("minimumAmountForFreeShipping") !== shop.minimumAmountForFreeShipping) {

                let minimumAmountForFreeShipping = watch("minimumAmountForFreeShipping")
                if (typeof minimumAmountForFreeShipping === 'string') {

                    minimumAmountForFreeShipping = parseInt(minimumAmountForFreeShipping.replace(',', '.')) * 100
                    options.minimumAmountForFreeShipping = minimumAmountForFreeShipping
                }

            }
            if (Object.keys(info).length > 0) {
                options["info"] = info
            }
            if (Object.keys(links).length > 0) {
                options["links"] = links
            }
            if (Object.keys(options).length < 1) return setIsLoading(false)



            editShop({
                variables: {
                    id: shop.id,
                    options: options
                }
            })
            addToast({
                position: 'top',
                title: 'Profilo aggiornato con successo',
                status: 'success',
                duration: 6000,
                isClosable: true
            })
            setIsLoading(false)
        } catch (e) {

            addToast({
                position: 'top',
                title: 'Errore durante aggiornamento profilo',
                description: 'Ci dispiace, non siamo riusciti ad aggiornare il profilo, contattaci sei il problema persiste',
                status: 'error',
                duration: 6000,
                isClosable: true
            })
            setIsLoading(false)

        }


    }

    return (
        <>
            <h1 className='text-xl lg:text-2xl font-extrabold mb-3 md:mb-4'>Info Profilo</h1>

            <Div_input_creation text='Nome univoco (utilizzato per creare il tuo link univoco)'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("name.unique", { required: true, maxLength: 30 })}
                        isInvalid={false}
                        disabled={isLoading}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Nome pubblico (visualizzato dagli utenti)'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register("name.visualized", { required: true, maxLength: 30 })}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>

            <Div_input_creation text=''>
                <InputGroup className='flex justify-between gap-2'>
                    <Div_input_creation text='Città'>
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("address.city")}
                            isInvalid={false}
                            disabled={true}
                            _disabled={{
                                opacity: '1',
                                background: 'gray.50'
                            }}
                            className='cursor-not-allowed'
                        />
                    </Div_input_creation>
                    <Div_input_creation text='Indirizzo'>
                        <Input
                            maxLength={35}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("address.street")}
                            isInvalid={false}
                            disabled={true}
                            _disabled={{
                                opacity: '1',
                                background: 'gray.50'
                            }}
                            className='cursor-not-allowed'
                        />
                    </Div_input_creation>
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Numero di telefono'>

                <InputGroup
                >
                    <InputLeftAddon children='+39' paddingY={6} />
                    <Input
                        maxLength={12}
                        rounded={10}
                        paddingY={6}
                        type='tel'
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        //borderColor={`${isValid_shop_phone === false ? 'red.900' : 'gray.200'}`}
                        {...register("info.phone", { required: true, minLength: 6, maxLength: 12 })}
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Categorie'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        {...register(`categories`, { required: true, maxLength: 30 })}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />

                </InputGroup>
            </Div_input_creation>
            <div className='mt-5 text-end'>
                <BlackButton
                    element={'Vuoi modificare qualcosa?'}
                    onClick={() => setIsOpen(true)}
                    borderRadius={5}
                    width={200}
                    heigth={12}
                    size={'sm'}
                    typeButton={'button'}
                    isDisabled={false}
                />
            </div>
            <h1 className='text-xl lg:text-2xl font-extrabold mt-6 mb-2 md:mb-4'>Informazioni aggiuntive</h1>
            <Div_input_creation text='Immagine copertina'>
                <Box
                    position={'relative'}
                >
                    <img
                        src={image ? image.url : imageKitUrl(shop.profileCover)}
                        className='w-full aspect-[2.6/1] object-cover rounded-md mb-4'
                    />
                    <Box
                        className='absolute top-2 right-2 p-2'
                        borderRadius={'full'}
                        bg={'white'}
                        cursor={'pointer'}
                        onClick={() => {
                            setTypeCroppedImage(UploadEventType.shopCover)
                            handleClick(null, UploadEventType.shopCover)
                        }}
                    >
                        <EditPencil
                            width={16}
                            height={16}
                            strokeWidth={2}
                        />
                    </Box>
                </Box>
            </Div_input_creation>
            <Div_input_creation text='Immagine profilo'>
                <Box
                    position={'relative'}
                    width={'fit-content'}
                >
                    <img src={imageProfile ? imageProfile.url : imageKitUrl(shop.profilePhoto)}

                        className='w-32 h-32 object-cover rounded-full'
                    />
                    <Box
                        className='absolute top-1 right-1 p-2'
                        borderRadius={'full'}
                        bg={'white'}
                        cursor={'pointer'}
                        onClick={() => {
                            setTypeCroppedImage(UploadEventType.shopPhoto)
                            handleClick(null, UploadEventType.shopPhoto)
                        }}
                    >
                        <EditPencil
                            width={16}
                            height={16}
                            strokeWidth={2}
                        />
                    </Box>
                </Box>

            </Div_input_creation>
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
            />}
            <Div_input_creation text='ordine minimo per spedizione gratuita'>
                <InputGroup
                >
                    <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                    <Input
                        maxLength={12}
                        rounded={10}
                        paddingY={6}
                        type='text'
                        isInvalid={false}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        {...register("minimumAmountForFreeShipping", { required: true })}
                    />
                </InputGroup>

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
            <Div_input_creation text='Instagram'>
                <InputGroup
                >
                    <InputLeftAddon rounded={10} paddingY={6} children={
                        <Instagram
                            className='w-5 h-5'
                        />
                    } paddingInline={5} />
                    <Input
                        maxLength={200}

                        rounded={10}
                        paddingY={6}
                        type='text'
                        isInvalid={false}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        {...register("links.instagram", { required: true })}
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='TikTok'>
                <InputGroup
                >
                    <InputLeftAddon rounded={10} paddingY={6} children={
                        <TikTok
                            className='w-5 h-5'
                        />
                    } paddingInline={5} />
                    <Input
                        maxLength={200}
                        rounded={10}
                        paddingY={6}
                        type='text'
                        isInvalid={false}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50',
                        }}
                        {...register("links.tiktok", { required: true })}
                    />
                </InputGroup>
            </Div_input_creation>

            <Button
                variant={'primary'}
                width={'full'}
                mt={2}
                fontSize={'lg'}
                size={'lg'}
                borderRadius={'10px'}
                onClick={handleEditShop}
                mb={20}
            >
                {
                    !isLoading
                        ?
                        'Aggiorna informazioni'
                        :
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.400'
                            color='white'
                            size='lg'
                        />

                }
            </Button>
            {/* <Div_input_creation text='Giorni di apertura'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        value={`${shop.info.opening.days.map((dayNumber) => { return DAYS.find(day => day.id === dayNumber.toString())?.name }).join(', ')}`}

                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Orario di apertura'>
                <InputGroup>
                    <Input
                        autoComplete='off'
                        maxLength={35}
                        rounded={10}
                        paddingY={6}
                        type="text"
                        value={`${shop.info.opening?.hours[0]} - ${shop.info.opening?.hours[1]}`}
                        isInvalid={false}
                        disabled={true}
                        _disabled={{
                            opacity: '1',
                            background: 'gray.50'
                        }}
                        className='cursor-not-allowed'
                    />
                </InputGroup>
            </Div_input_creation> */}
            {/* descrizione negozio  */}
            {/* <Div_input_creation text='Descrizione negozio (massimo 400 lettere)'>
                    <InputGroup>
                        <Textarea 
                        maxLength={400}
                        rounded={10}
                        paddingY={6}
                        height={'2xs'}
                        placeholder='inserisci una descrizione del negozio'
                        {...register("description")}
                        resize={'horizontal'}
                        />
                    </InputGroup>
                </Div_input_creation> */}
            <Modal_Help_Customer_Care isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
        </>
    )
}

export default memo(Shop_Form)