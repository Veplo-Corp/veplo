import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertIcon, Box, Button, Center, Highlight, List, ListItem, UnorderedList } from '@chakra-ui/react'
import BlackButton from '../atoms/BlackButton'
import Resizer from "react-image-file-resizer";

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from '../molecules/Canva_previews'
import { useDebounceEffect } from '../utils/useDebounceEffect';
import { DownloadIcon } from '@chakra-ui/icons';
import MobileDetect from 'mobile-detect';
import Loading from '../molecules/Loading';
import { resizeFile } from '../utils/resizeFile';
import { imageKitUrl } from '../utils/imageKitUrl';
import { useMutation } from '@apollo/client';
import CREATE_IMAGE from '../../src/lib/apollo/mutations/createImage';
import ModalReausable from './ModalReausable';
import ImageCrop from '../molecules/ImageCrop';



type Image = {
    type: string,
    blob: any,
    url: any,
    position: number,
    file: any
}

const ImageFormat: { position: number, text: string }[] = [
    {
        position: 0,
        text: 'fronte del prodotto'
    },
    {
        position: 1,
        text: 'retro del prodotto'
    },
    {
        position: 2,
        text: 'prodotto indossato'
    },
    {
        position: 3,
        text: 'opzionale'
    },
    {
        position: 4,
        text: 'opzionale'
    },
]

const list_explanation_photos_format = [
    {
        type: 'vestiti',
        list: [
            'prima immagine: fronte del prodotto',
            'seconda immagine: retro del prodotto o prodotto indossato',
            'terza immagine: prodotto indossato',
        ]
    },
    {
        type: 'scarpe',
        list: [
            'prima immagine: profilo del prodotto',
            'seconda immagine: fronte del prodotto',
            'terza immagine: scarpe indossate',
        ]
    }
]



const ImageTextFormat: string[] = [
    'fronte del prodotto',
    'retro del prodotto',
    'prodotto indossato',
    'opzionale',
    'opzionale'
]

// const resizeFile = (file: any) =>
//     new Promise((resolve) => {
//         Resizer.imageFileResizer(
//             file,
//             3000,
//             3000,
//             "WEBP",
//             100,
//             0,
//             (uri) => {
//                 resolve(uri.toString());
//             },
//             "base64"
//         );
// });


const Drawer_Add_Image: React.FC<{ openDraw: number | undefined, confirmPhotos: any, imagesUploadedBefore?: string[] | [] }> = ({ openDraw, confirmPhotos, imagesUploadedBefore }) => {
    //create image test
    const [createImage] = useMutation(CREATE_IMAGE);
    const [isImageModalOpen, setisImageModalOpen] = useState(false)


    //* react image crop
    const [isOpen, setisOpen] = useState(false);
    const hiddenFileInput = useRef<any>(null);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(762 / 1100);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [imgSrc, setImgSrc] = useState<any>('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState<any>()
    const [blob, setBlob] = useState<any>()
    const [images, setImages] = useState<Image[] | string[]>([])
    const [isDisabledButton, setIsDisabledButton] = useState<any>(true)
    const [positionPhoto, setPositionPhoto] = useState<any>(null);
    const [showCroppedImage, setShowCroppedImage] = useState<any>(false);
    const [loading, setLoading] = useState(false)

    //padding for Mobile
    const [bottomPadding, setbottomPadding] = useState(0)

    useEffect(() => {
        if (!openDraw || openDraw == 1) {
            return
        }
        setisOpen(true)

    }, [openDraw])

    // useEffect(() => {
    //     console.log(imgSrc);
    // }, [imgSrc])

    useEffect(() => {
        if (imagesUploadedBefore && imagesUploadedBefore.length > 0) {
            setImages(imagesUploadedBefore)
        }
    }, [imagesUploadedBefore])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let type = new MobileDetect(window.navigator.userAgent)
            //console.log(type);            
            if (type.os() === "AndroidOS" || type.os() === 'iOS') {
                const newHeight = window.innerHeight;
                const screenHeight = screen.availHeight;

                setbottomPadding(screenHeight - newHeight - (type.os() === 'iOS' ? 105 : 80))
                const updateWindowDimensions = () => {
                    const newHeight = window.innerHeight;
                    const screenHeight = screen.availHeight;
                    console.log(newHeight);
                    console.log(screenHeight);
                    console.log(screenHeight - newHeight);
                    setbottomPadding(screenHeight - newHeight - (type.os() === 'iOS' ? 105 : 80))
                    console.log("updating height");
                };
                window.addEventListener("resize", updateWindowDimensions);
                return () => window.removeEventListener("resize", updateWindowDimensions)
            }
        }
    }, []);

    const [crop, setCrop] = useState<Crop | null>(
        {
            unit: '%', // Can be 'px' or '%'
            x: 17.53,
            y: 11.00,
            width: 65.99,  //762 diviso 5
            height: 76.209,//1100 diviso 5
        }
    )

    const onHanldeConfirm = async () => {
        //add image Blob in the array of images
        setImages((prevstate: any) => {
            console.log('position photo: ', positionPhoto);

            const file = new File([blob], "photo" + positionPhoto, {
                type: 'image/webp'
            });

            const newImage: Image = {
                type: 'image/webp',
                blob: blob,
                url: url,
                file: file,
                position: positionPhoto === null ? prevstate.length : positionPhoto
            }


            if (positionPhoto !== null) {
                let prevstateImages = [...prevstate]
                //prevstateImages = prevstateImages.filter(image => image.position !== positionPhoto)
                prevstateImages.splice(positionPhoto, 1, newImage)
                console.log(prevstateImages);

                let updateImages = [
                    ...prevstateImages,
                    //*vecchio modello
                    //newImage
                ]
                // updateImages.sort((a, b) => a.position - b.position)
                // console.log(updateImages[0]);

                return updateImages

            } else {
                const updateImages: Image[] = [
                    ...prevstate,
                    newImage
                ]

                console.log(updateImages);
                return updateImages
            }
        })
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setShowCroppedImage(false)
        //setImgSrc(null)
        setIsDisabledButton(true)
    }

    const handleImageConfirm = (image: PixelCrop, imgRefCurrent: HTMLImageElement) => {

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
                    console.log(kb);
                    //set quality based on dimension photo
                    const quality = kb > 3000 ? 0.3 : 0.8;
                    canvas.toBlob(function (blob) {
                        if (!blob) { return }
                        const url = URL.createObjectURL(blob);
                        setUrl(url)
                        setBlob(blob)
                        console.log('PASSA QUI');

                        const file = new File([blob], "photo1", {
                            type: 'image/webp'
                        });


                        const newImage: Image = {
                            type: 'image/webp',
                            blob: blob,
                            url: url,
                            file: file,
                            position: 0
                        }
                        setImages([newImage])



                    }, 'image/webp', quality);

                })
        }
    }



    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (position: null | number) => {

        hiddenFileInput.current.click();
        setShowCroppedImage(true)
        //set the posizion of the cropp
        setPositionPhoto(position)
    };


    async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {


        setLoading(true)
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setIsDisabledButton(true)
        setShowCroppedImage(true)


        if (e.target.files /* && e.target.files.length > 0 */) {
            try {
                console.log(e.target.files);

                //const isImageCreated = await createImage({ variables: { files:e.target.files[0] } })
                //console.log(isImageCreated);
                //return

                const file = e.target.files[0];
                console.log(file);

                //!don't use resize image
                const image = await resizeFile(file);
                console.log(image);
                setImgSrc(image)

                // const reader = new FileReader()
                // reader.addEventListener('load', () =>
                //     setImgSrc(reader.result?.toString() || '')
                // )

                // reader.readAsDataURL(e.target.files[0])

            } catch (err) {
                console.log(err);
            }
            //!depecrated
            // const reader = new FileReader()
            // reader.addEventListener('load', () =>            
            //     setImgSrc(reader.result?.toString() || '')
            // )
            // // setBlob(null)
            // // setUrl(null)
            // // setCrop(null)
            // // setImgSrc(null)
            // // setIsDisabledButton(true)
            // reader.readAsDataURL(e.target.files[0])
        }
        else {
            return console.log('non trovata immagine caricata');
        }

        setLoading(false)
    }

    useDebounceEffect(async () => {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
        ) {
            const dimension = {
                width: completedCrop.width,
                height: completedCrop.height
            }
            console.log(dimension);
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                completedCrop,

            )
                .then(canvas => {
                    // const yourBase64String = imgSrc.substring(imgSrc.indexOf(',') + 1);
                    // const kb = Math.ceil(((yourBase64String.length * 6) / 8) / 1000); //es. 426 kb
                    // console.log(kb);
                    console.log('inizia');
                    canvas.toBlob(function (blob) {
                        if (!blob) { return }
                        console.log('finisce');
                        setIsDisabledButton(false)
                        const url = URL.createObjectURL(blob);
                        setUrl(url)
                        setBlob(blob)
                    }, 'image/webp');
                })
        }
    },
        600,
        [completedCrop],
    )

    const closeModal = () => {
        setisOpen(false)
        confirmPhotos(images)
    }






    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='top'
                size='full'
                onClose={() => setisOpen(false)}

            >
                <DrawerOverlay />
                <DrawerContent

                >
                    <DrawerHeader padding={3} className='flex justify-between'>

                        <h3 className='md:ml-12 italic text-sm  md:text-2xl xl:text-3xl  font-black my-auto hidden md:flex'>
                            {!imgSrc && <span>Inserisci le immagini del prodotto</span>}
                            {imgSrc && positionPhoto === null && <span> Inserisci immagine {ImageTextFormat[images.length]}
                            </span>}
                            {imgSrc && positionPhoto !== null && <span> Inserisci immagine {ImageTextFormat[positionPhoto]}
                            </span>}
                        </h3>

                        <svg onClick={closeModal} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 md:hidden my-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                        <div className='md:mr-16' >
                            <BlackButton
                                onClick={() => handleClick(null)}
                                element='upload immagine'
                                borderRadius={5}
                                width={200}
                                heigth={12}
                                size={'sm'}
                                typeButton={'button'}
                                leftIcon={<DownloadIcon />}
                                disabled={images.length > 2} />
                        </div>
                        <input
                            ref={hiddenFileInput}
                            type="file" id="file" multiple accept="image/*"
                            className='hidden'

                            onChange={(e) => {
                                onSelectFile(e);
                            }} />
                    </DrawerHeader>
                    {!loading ?
                        (<DrawerBody className='grid md:flex justify-between '>
                            {imgSrc || images[0] ? (
                                <>
                                    <div className='w-full px-3 md:px-0 h-fit md:ml-8 md:w-4/12 grid '>
                                        <div className='grid'>
                                            {showCroppedImage && imgSrc && (
                                                <>
                                                    <Alert status='info' variant='solid' className='mb-2'>
                                                        <AlertIcon />
                                                        Ritaglia la foto
                                                    </Alert>
                                                    <ReactCrop
                                                        className='w-full h-full'
                                                        crop={crop || {
                                                            unit: '%', // Can be 'px' or '%'
                                                            x: 0,
                                                            y: 0,
                                                            width: 0,  //762 diviso 5
                                                            height: 0,//1100 diviso 5

                                                            // unit: '%', // Can be 'px' or '%'
                                                            // x: 17.53,
                                                            // y: 11.00,
                                                            // width: 65.99,  //762 diviso 5
                                                            // height: 76.209,//1100 diviso 5
                                                        }}
                                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                                        onComplete={(c) => {
                                                            setIsDisabledButton(true)
                                                            setCompletedCrop(c)
                                                        }}
                                                        aspect={762 / 1100}
                                                    >
                                                        <img
                                                            className='max-w-full' /* min-w-full */
                                                            src={imgSrc} ref={imgRef} />
                                                    </ReactCrop>

                                                    <div className='flex justify-between mt-2 mb-2 gap-2'>
                                                        <Button
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
                                                        {/* <Button
                                                        onClick={() => handleClick(null)}
                                                        borderRadius={5}
                                                        height={12}
                                                        size={'sm'}
                                                        variant='outline'
                                                        colorScheme={'blackAlpha'}
                                                        color={'blackAlpha.900'}
                                                        disabled={false} >
                                                        cambia
                                                    </Button> */}
                                                        <BlackButton
                                                            onClick={onHanldeConfirm}
                                                            element='aggiungi immagine'
                                                            borderRadius={5}

                                                            heigth={12}
                                                            size={'sm'}
                                                            typeButton={'button'}
                                                            disabled={isDisabledButton} />
                                                    </div>
                                                </>

                                            )}


                                            <div className='hidden'>
                                                {!!completedCrop && (
                                                    <canvas
                                                        ref={previewCanvasRef}
                                                        style={{
                                                            border: '1px solid black',
                                                            objectFit: 'contain',
                                                            width: completedCrop.width,
                                                            height: completedCrop.height,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-h-screen items-center justify-center mb-96 ">
                                        <div className='w-full md:mr-11 md:w-fit grid gap-5 grid-cols-2 justify-items-start mt-8'>
                                            {images.map((image: any, position: any) => {
                                                return (
                                                    <div key={position} className='md:w-44 lg:w-56 h-fit'>
                                                        <div className='flex justify-between mb-1'>
                                                            <p>{ImageTextFormat[position]}</p>
                                                            <Box
                                                                className='my-auto cursor-pointer'
                                                                _active={{
                                                                    transform: 'scale(0.90)',
                                                                }}
                                                                onClick={() => handleClick(position)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                                                </svg>
                                                            </Box>



                                                        </div>
                                                        {!image.url ? (
                                                            <img
                                                                className='rounded'
                                                                src={imageKitUrl(image, 305, 440)} alt="immagine non trovata"
                                                            />
                                                        ) :
                                                            (
                                                                <img
                                                                    className='rounded'
                                                                    src={image.url} alt="immagine non trovata" />
                                                            )
                                                        }

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Box
                                    display={'flex'}
                                    width={'full'}
                                    justifyContent={'space-between'}
                                    className='m-10 w-full'
                                >
                                    <Box
                                        width={'full'}
                                    >
                                        <h1 className='text-2xl font-bold mb-2'>
                                            <Highlight
                                                query={['perfetta!']}
                                                styles={{ px: '2', py: '1', bg: 'gray.900', color: 'white', fontStyle: 'italic' }}
                                            >
                                                Mostra i tuoi prodotti in maniera perfetta!
                                            </Highlight>
                                        </h1>

                                        <h3 className='text-sm font-medium leading-4	'>inserisci le immagini secondo uno schema preciso, migliorando l’esperienza
                                            che vivranno gli utenti nel tuo store</h3>
                                        {list_explanation_photos_format.map(list => {
                                            return (
                                                <div key={list.type}><h2 className='text-lg font-bold mt-2'>{list.type}:</h2>
                                                    <List spacing={1} marginLeft={30}>
                                                        <UnorderedList >
                                                            {
                                                                list.list.map((value, id) => {
                                                                    return (
                                                                        <ListItem key={id}>{value}</ListItem>
                                                                    )
                                                                })
                                                            }
                                                        </UnorderedList>
                                                    </List>
                                                </div>
                                            )
                                        })}
                                    </Box>
                                    <Box
                                        width={'full'}
                                        display={'flex'}
                                        justifyContent={'end'}
                                    >
                                        <Box
                                            className=' cursor-pointer flex'
                                            _active={{
                                                transform: 'scale(0.99)',
                                            }}

                                            height={162}
                                            width={126}
                                            borderColor={'gray.300'}
                                            borderWidth={2}
                                            borderRadius={'10px'}
                                            borderStyle={'dashed'}
                                            onClick={() => {
                                                console.log('ao');
                                                setisImageModalOpen(true)
                                            }}
                                        >
                                            <Box
                                                alignItems={'center'}
                                                margin={'auto'}
                                                color={'gray.500'}

                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 m-auto">
                                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                </svg>
                                                <h2>aggiungi</h2>
                                            </Box>

                                        </Box>
                                        {/* <div className="min-h-screen items-center justify-center mb-96 ">
                                            <div className='w-full md:mr-11 md:w-fit grid gap-5 grid-cols-2 justify-items-start mt-8'>
                                                {images.map((image: any, position: any) => {
                                                    return (
                                                        <div key={position} className='md:w-44 lg:w-56 h-fit'>
                                                            <div className='flex justify-between mb-1'>
                                                                <p>{ImageTextFormat[position]}</p>
                                                                <Box
                                                                    className='my-auto cursor-pointer'
                                                                    _active={{
                                                                        transform: 'scale(0.90)',
                                                                    }}
                                                                    onClick={() => handleClick(position)}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                                                    </svg>
                                                                </Box>



                                                            </div>
                                                            {!image.url ? (
                                                                <img
                                                                    className='rounded'
                                                                    src={imageKitUrl(image, 305, 440)} alt="immagine non trovata"
                                                                />
                                                            ) :
                                                                (
                                                                    <img
                                                                        className='rounded'
                                                                        src={image.url} alt="immagine non trovata" />
                                                                )
                                                            }

                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div> */}
                                    </Box>

                                </Box>

                            )}


                        </DrawerBody>) :
                        (
                            <Loading />
                        )
                    }
                    {/* !showCroppedImage */ !showCroppedImage &&
                        <DrawerFooter
                            paddingX={0}
                            paddingBottom={bottomPadding}
                        >
                            <footer className={`w-full bg-whith items-center py-4 pb-${bottomPadding}px px-6 md:px-10 border-t border-inherit	`}>
                                <div className='flex justify-between'>
                                    <div className='hidden md:flex'>
                                        <Button
                                            onClick={closeModal}
                                            borderRadius={5}
                                            width={200}
                                            height={12}
                                            size={'sm'}
                                            variant='outline'
                                            colorScheme={'blackAlpha'}
                                            color={'blackAlpha.900'}
                                            disabled={false} >
                                            indietro
                                        </Button>
                                    </div>

                                    <div className='flex justify-between gap-6  md:gap-4'>
                                        <p className='my-auto	italic text-sm md:text-base	font-medium	'>
                                            aggiungi minimo 2 foto per confermare
                                        </p>
                                        <Button
                                            bgGradient='linear(to-r, green.200, pink.500)'
                                            _hover={{ bg: 'linear(to-r, green.200, pink.500)' }}
                                            _active={{ bg: 'linear(to-r, green.200, pink.500)' }}
                                            borderRadius={5}
                                            width={200}
                                            height={12}
                                            size={'sm'}
                                            type={'button'}
                                            onClick={closeModal}
                                            disabled={images.length < 2}>
                                            prosegui
                                        </Button>
                                    </div>
                                </div>
                            </footer>
                        </DrawerFooter>}
                </DrawerContent>

            </Drawer >
            <ModalReausable
                marginTop={0}
                title={'inserisci immagine (ritaglia la foto)'}
                isOpen={isImageModalOpen}
                closeModal={() => {
                    hiddenFileInput.current.value = null;
                    setisImageModalOpen(false)
                }
                }
                positionTopModal={true}
            >
                <ImageCrop
                    imageSrc={imgSrc} type={'product'} aspectRatio={(1 / 1.3)}
                    circularCrop={false}
                    onHanldeConfirm={(image, type, imageRefCurrent) => {

                        handleImageConfirm(image, imageRefCurrent)

                        hiddenFileInput.current.value = null;
                        setisImageModalOpen(false)
                    }

                    }
                    handlerCancel={() => {
                        hiddenFileInput.current.value = null;
                        setisImageModalOpen(false)
                    }}
                />
            </ModalReausable>
        </>


    )
}

export default Drawer_Add_Image