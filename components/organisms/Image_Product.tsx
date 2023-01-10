import { Box, IconButton, Image, Modal, ModalBody, ModalContent, ModalOverlay, ModalCloseButton, ModalHeader } from '@chakra-ui/react'
//!pronestor - not the original library! because it doesn't work with react 18
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Product } from '../../src/interfaces/product.interface'
import { imageKitUrl } from '../utils/imageKitUrl'

const Image_Product: React.FC<{ product: Product | undefined }> = ({ product }) => {
    if (!product) {
        return (
            <></>
        )
    }
    const [doubleStep, setDoubleStep] = useState(1);
    const [isOpen, setisOpen] = useState(false)
    const [fullImage, setfullImage] = useState<any>(undefined)

    const zoomImage = () => {
        setisOpen(true)
    }



    const changeImageFull = (url: string) => {
        setfullImage(url)
    }

    useEffect(() => {
        if (product?.photos) {
            setfullImage(product.photos[0])
        }

    }, [product])

    return (
        <>

            <Modal size={['lg', 'lg', 'md']}
                isCentered={true} isOpen={isOpen} onClose={() => setisOpen(false)}
            >

                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) '
                />
                <ModalContent
                    width={'fit-content'}
                >
                    <ModalCloseButton zIndex={'popover'}
                        size={'lg'}
                        onClick={() => setisOpen(false)}
                    />

                    <ModalBody padding={0}>

                        <div className='hidden md:flex'>

                            <TransformWrapper
                                maxScale={2}
                                minScale={1}
                                wheel={{ disabled: false }}
                                //doubleClick={{ mode: 'zoomIn' }}
                                pinch={{ disabled: true }}
                                //doubleClick={{ disabled: true }}
                                centerOnInit
                                centerZoomedOut
                                //!old style
                                doubleClick={{ step: doubleStep }}

                                initialScale={1}
                                onPanningStop={(e) => {
                                    console.log(e.state.scale);
                                    //1.65 is fot setDoubleStep = 3 onMouseEnter        
                                    if (e.state.scale !== 1 && e.state.scale !== 1.65) {
                                        setDoubleStep(-1);
                                    }
                                    else {
                                        setDoubleStep(+1);
                                    }
                                }}
                            >
                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                    <React.Fragment
                                    >
                                        <div
                                            onMouseEnter={((e) => {
                                                setDoubleStep(2);
                                                zoomIn(0.2)
                                            })}
                                            onMouseLeave={() => {
                                                resetTransform()
                                            }}
                                            className='h-2/3'
                                        >
                                            <TransformComponent

                                            >
                                                <Image
                                                    height={'full'}
                                                    width={'full'}
                                                    /* onClick={onClickImageModal} */
                                                    src={imageKitUrl(fullImage)} alt={'immagine non trovata'} />
                                            </TransformComponent>
                                        </div>
                                    </React.Fragment>
                                )}
                            </TransformWrapper>
                        </div>
                        <div className='flex md:hidden'>
                            <TransformWrapper
                                maxScale={2}
                                minScale={1}
                                centerOnInit
                                centerZoomedOut
                            >
                                <TransformComponent
                                >
                                    <Image
                                        /* onClick={onClickImageModal} */
                                        
                                        src={imageKitUrl(fullImage)} alt={'immagine non trovata'} />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className='flex space-x-4 w-full md:w-7/12 xl:w-5/12 '>
                <Box onClick={zoomImage} minW='20' maxW='450' mb={'5'} overflow='hidden' className='cursor-pointer'>
                    <TransformWrapper
                        maxScale={3}
                        minScale={1}
                        wheel={{ disabled: true }}
                        doubleClick={{ disabled: true }}
                        pinch={{ disabled: true }}
                        //doubleClick={{ disabled: true }}
                        centerOnInit
                        centerZoomedOut
                    //!old style

                    >
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <div
                                    onMouseEnter={((e) => {
                                        zoomIn(0.1)
                                    })}
                                    onMouseLeave={() => {
                                        resetTransform()
                                    }}
                                >
                                    <TransformComponent
                                    >
                                        {/* <Image borderRadius={'lg'} src={fullImage} alt='immagine non trovata' /> */}
                                        <LazyLoadImage src={imageKitUrl(fullImage)}
                                            //PlaceholderSrc={PlaceholderImage}
                                            effect="blur"
                                            alt="Image Alt"
                                            className='rounded-lg w-full aspect-[8/12] object-cover	'
                                        />
                                    </TransformComponent>
                                </div>
                            </React.Fragment>
                        )}
                    </TransformWrapper>

                </Box>
                <div>
                    {product?.photos && product.photos.map((image) => {
                        return (
                            <Box onClick={() => changeImageFull(image)} key={Math.random()} mb={'5'} borderRadius='lg' overflow='hidden'
                                borderWidth={1.5}
                                className={` ${image == fullImage ? "border-black border-8" : "border-white"}   cursor-pointer
                                        w-20
                                        xl:w-32
                                    `}
                            >
                                <Image src={
                                    imageKitUrl(image, 171, 247)
                                }
                                    alt={'immagine non trovata'}
                                    width={'fit-content'}
                                    maxH={'52'}
                                    height={'fit-content'}
                                    className='object-cover'
                                    loading="lazy"
                                />

                            </Box>
                        )
                    })}

                </div>
            </div>
        </>

    )
}

export default Image_Product