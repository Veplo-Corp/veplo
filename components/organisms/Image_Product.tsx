import { Box, Image, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
//!pronestor - not the original library! because it doesn't work with react 18
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Product } from '../../src/interfaces/product.interface'

const Image_Product: React.FC<{product:Product | undefined}> = ({product}) => {
    if(!product){
        return(
            <></>
        )
    }
    const [doubleStep, setDoubleStep] = useState(1);
    const [isOpen, setisOpen] = useState(false)
    const [fullImage, setfullImage] = useState(product.photos[0])

    const zoomImage = () => {
        setisOpen(true)
    }

    const changeImageFull = (url: string) => {
        setfullImage(url)
    }

    useEffect(() => {

        setfullImage(product.photos[0])

    }, [product])

    return (
        <>
            <Modal size={'lg'} isCentered={true} isOpen={isOpen} onClose={() => setisOpen(false)}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) '
                />
                <ModalContent >
                    <ModalBody padding={0}>
                        <div className='hidden md:flex'>
                            <TransformWrapper
                                maxScale={3}
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
                                    <React.Fragment>
                                        <div
                                            onMouseEnter={((e) => {
                                                setDoubleStep(3);
                                                zoomIn(0.3)
                                            })}
                                            onMouseLeave={() => {
                                                resetTransform()
                                            }}
                                        >
                                            <TransformComponent
                                            >
                                                <Image
                                                    /* onClick={onClickImageModal} */
                                                    src={fullImage} alt={'immagine non trovata'} />
                                            </TransformComponent>
                                        </div>
                                    </React.Fragment>
                                )}
                            </TransformWrapper>
                        </div>
                        <div className='flex md:hidden'>
                            <TransformWrapper
                                maxScale={3}
                                minScale={1}
                                wheel={{ disabled: false }}
                                //doubleClick={{ mode: 'zoomIn' }}
                                pinch={{ disabled: true }}
                                //doubleClick={{ disabled: true }}
                                centerOnInit
                                centerZoomedOut
                                //!old style
                                doubleClick={{ disabled: true }}
                            >
                                <TransformComponent
                                >
                                    <Image
                                        /* onClick={onClickImageModal} */
                                        src={fullImage} alt={'immagine non trovata'} />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className='flex space-x-4 w-full md:w-7/12 xl:w-1/2 '>
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
                                        <LazyLoadImage src={fullImage}
                                            //PlaceholderSrc={PlaceholderImage}
                                            effect="blur"
                                            alt="Image Alt"
                                            className='rounded-lg'
                                        />
                                    </TransformComponent>
                                </div>
                            </React.Fragment>
                        )}
                    </TransformWrapper>

                </Box>
                <div>
                    {product.photos.map((image) => {
                        return (
                            <Box onClick={() => changeImageFull(image)} key={Math.random()} mb={'5'} borderRadius='lg' overflow='hidden'
                                borderWidth={1.5}
                                className={` ${image == fullImage ? "border-black" : "border-white"} cursor-pointer
                                        w-20
                                        xl:w-32
                                    `}
                            >
                                <Image src={image} alt={'immagine non trovata'}
                                // className='hover:scale-105'
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