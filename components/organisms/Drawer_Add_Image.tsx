import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react'
import BlackButton from '../atoms/BlackButton'
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
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../../src/config/firebase'


type Image = {
    type: string,
    blob: any,
    url: any,
    position: number
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

const ImageTextFormat: string[] = [
    'fronte del prodotto',
    'retro del prodotto',
    'prodotto indossato',
    'opzionale',
    'opzionale'
]


const Drawer_Add_Image: React.FC<{openDraw: number | undefined, confirmPhotos: any} >  = ({openDraw, confirmPhotos}) => {

    useEffect(() => {
        if(!openDraw){
            return
        }
        setisOpen(true)
    }, [openDraw])
    

    //* react image crop
    const [isOpen, setisOpen] = useState(false);
    const hiddenFileInput = useRef(null);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(762 / 1100);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [imgSrc, setImgSrc] = useState('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [url, setUrl] = useState()
    const [blob, setBlob] = useState()
    const [images, setImages] = useState<Image[]>([])
    const [isDisabledButton, setIsDisabledButton] = useState(true)
    const [positionPhoto, setPositionPhoto] = useState(null)


    const [crop, setCrop] = useState<Crop>(
        {
            unit: '%', // Can be 'px' or '%'
            x: 17.53,
            y: 11.00,
            width: 65.99,  //762 diviso 5
            height: 76.209,//1100 diviso 5
        }
    )

    const onHanldeConfirm = () => {
        const storageElement = storage;
        const storageRef = ref(storageElement, 'some-child');
        console.log(blob);
        setImages((prevstate: Image[]) => {

            const newImage: Image = {
                type: 'test',
                blob: blob,
                url: url,
                position: positionPhoto === null ? prevstate.length : positionPhoto
            }

            if (positionPhoto !== null) {
                let prevstateImages = [...prevstate]
                prevstateImages = prevstateImages.filter(image => image.position !== positionPhoto)

                let updateImages = [
                    ...prevstateImages,
                    newImage
                ]

                updateImages.sort((a, b) => a.position - b.position)
                console.log(updateImages[0]);

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
        setImgSrc(null)
        setIsDisabledButton(true)
    }



    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (position: null | number) => {
        hiddenFileInput.current.click();
        setPositionPhoto(position)
    };



    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setImgSrc(null)
        setIsDisabledButton(true)
        if (e.target.files && e.target.files.length > 0) {

            //setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || '')
            )
            // setBlob(null)
            // setUrl(null)
            // setCrop(null)
            // setImgSrc(null)
            // setIsDisabledButton(true)
            reader.readAsDataURL(e.target.files[0])
        }
        else {
            return console.log('non trovata immagine caricata');
        }
    }


    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    useDebounceEffect(async () => {
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




    return (
        <>

            <Drawer
                isOpen={isOpen}
                placement='top'
                size='full'
                onClose={() => setisOpen(false)}
            >
                <DrawerOverlay />
                <DrawerContent>

                    <DrawerHeader padding={3} className='flex justify-between'>

                        <h3 className='md:ml-12 italic text-sm  md:text-2xl xl:text-3xl  font-black my-auto hidden md:flex'>
                            {!imgSrc && <span>Inserisci le immagini del prodotto</span>}
                            {imgSrc && positionPhoto === null && <span> Inserisci immagine {ImageTextFormat[images.length]}
                            </span>}
                            {imgSrc && positionPhoto !== null && <span> Inserisci immagine {ImageTextFormat[positionPhoto]}
                            </span>}
                        </h3>

                        <svg onClick={() => setisOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 md:hidden my-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                        <div className='md:mr-16' >
                            <BlackButton
                                onClick={() => handleClick(null)}
                                element='aggiungi immagine'
                                borderRadius={5}
                                width={200}
                                heigth={12}
                                size={'sm'}
                                typeButton={'button'}
                                disabled={false} />
                        </div>
                        <input
                            ref={hiddenFileInput}
                            type="file" id="file" multiple accept="image/*"
                            className='hidden'
                            onChange={(e) => {
                                onSelectFile(e);
                            }} />
                    </DrawerHeader>
                    <DrawerBody className='grid md:flex justify-between '>
                        <div className='w-full h-fit md:ml-8 md:w-2/5 grid '>
                            <div className='grid'>
                                {imgSrc && (
                                    <>
                                        <Alert status='info' variant='solid' className='mb-2'>
                                            <AlertIcon />
                                            Ritaglia la foto
                                        </Alert>
                                        <ReactCrop
                                            className='w-full h-full'
                                            crop={crop}
                                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                                            onComplete={(c) => {
                                                setIsDisabledButton(true)
                                                setCompletedCrop(c)
                                            }}
                                            aspect={762 / 1100}
                                        >
                                            <img
                                                className='min-w-full'
                                                src={imgSrc} ref={imgRef} />
                                        </ReactCrop>
                                    </>

                                )}
                                {imgSrc && <div className='flex justify-end mt-2'>
                                    <BlackButton
                                        onClick={onHanldeConfirm}
                                        element='aggiungi'
                                        borderRadius={5}
                                        width={200}
                                        heigth={12}
                                        size={'sm'}
                                        typeButton={'button'}
                                        disabled={isDisabledButton} />
                                </div>}

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
                                {/* <div>
                            {!!url && (
                                <img src={url} alt="" />
                            )}
                            </div> */}
                            </div>


                        </div>
                        <div className="min-h-screen items-center justify-center mb-96 ">
                            <div className='w-full md:mr-11 md:w-fit grid gap-5 grid-cols-2 justify-items-start mt-8'>
                                {images.map((image: Image) => {
                                    return (
                                        <div key={image.position * Math.random()} className='md:w-44 lg:w-56 h-fit'>
                                            <div className='flex justify-between mb-1'>
                                                <p>{ImageTextFormat[image.position]}</p>
                                                <Box
                                                    className='my-auto cursor-pointer'
                                                    _active={{
                                                        transform: 'scale(0.90)',
                                                    }}
                                                    onClick={() => handleClick(image.position)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                                    </svg>
                                                </Box>



                                            </div>
                                            <img
                                                className='rounded'
                                                src={image.url} alt="" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </DrawerBody>
                    {!imgSrc && <DrawerFooter padding={0}>
                        <footer className="w-full bg-whith items-center py-4 px-6 md:px-10 border-t	border-inherit	">
                            <div className='flex justify-between'>
                                <div className='hidden md:flex'>
                                    <Button
                                        onClick={() => setisOpen(false)}
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
                                        aggiungi minimo 3 foto per confermare
                                    </p>
                                    <BlackButton
                                        element='conferma'
                                        borderRadius={5}
                                        width={200}
                                        heigth={12}
                                        size={'sm'}
                                        typeButton={'button'}
                                        onClick={() => {
                                            setisOpen(false)
                                            confirmPhotos(images)}}
                                        disabled={images.length < 3} />
                                </div>
                            </div>

                        </footer>
                    </DrawerFooter>}
                </DrawerContent>
            </Drawer>
        </>


    )
}

export default Drawer_Add_Image