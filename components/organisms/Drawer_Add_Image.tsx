import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@chakra-ui/react'
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
import ReactCrop, { PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from '../molecules/Canva_previews'
import { useDebounceEffect } from '../utils/useDebounceEffect';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../../src/config/firebase'


type Image = {
    type: string,
    blob: any,
    url: any
}


const Drawer_Add_Image = () => {
    const [isOpen, setisOpen] = useState(true);
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


    const [crop, setCrop] = useState<any>(
        //     {
        //     unit: '%', // Can be 'px' or '%'
        //     x: 17.53,
        //     y: 11.00,
        //     width: 65.99,  //762 diviso 5
        //     height: 76.209,//1100 diviso 5
        // }
    )

    const onHanldeConfirm = () => {
        const storageElement = storage;
        const storageRef = ref(storageElement, 'some-child');
        console.log(blob);
        setImages((prevstate: Image[]) => {
            const updateImages = [
                ...prevstate,
                {
                    type: 'test',
                    blob: blob,
                    url: url
                }
            ]
            return updateImages
        })
        setBlob(null)
        setUrl(null)
        setCrop(null)
        setImgSrc(null)
        setIsDisabledButton(true)
    }



    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (event) => {
        hiddenFileInput.current.click();
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
                setImgSrc(reader.result?.toString() || ''),
            )
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

        <Drawer
            isOpen={isOpen}
            placement='top'
            size='full'
            onClose={() => setisOpen(false)}
        >
            <DrawerOverlay />
            <DrawerContent>

                <DrawerHeader padding={2} className='flex justify-between'>
                    <h3 className='md:ml-12 italic text-sm md:text-3xl font-black my-auto hidden md:flex'>
                        Inserisci le immagini del prodotto
                    </h3>
                    <svg onClick={() => setisOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 md:hidden my-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                    <div className='md:mr-16' >
                        <BlackButton
                            onClick={handleClick}
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
                <DrawerBody className='grid md:flex justify-between'>
                    <div className='w-full md:ml-8 md:w-2/5 grid '>
                        <div className='grid'>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => {
                                    setIsDisabledButton(true)
                                    setCompletedCrop(c)
                                }}
                                aspect={762 / 1100}
                            >
                                <img src={imgSrc} ref={imgRef} />
                            </ReactCrop>
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
                    <div className="min-h-screen items-center justify-center">
                        <div className='w-full md:mr-11 md:w-fit grid gap-5 grid-cols-2 justify-items-start mt-8'>
                            {images.map((image: Image) => {
                                return (<img
                                    className='md:w-44 lg:w-56 h-fit rounded'
                                    key={Math.random()} src={image.url} alt="" />)
                            })}
                        </div>
                    </div>
                </DrawerBody>
                <DrawerFooter padding={0}>
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
                                    disabled={true} />
                            </div>
                        </div>

                    </footer>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default Drawer_Add_Image