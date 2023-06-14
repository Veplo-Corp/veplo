import { Box, IconButton, Image, Modal, ModalBody, ModalContent, ModalOverlay, ModalCloseButton, ModalHeader, useBreakpointValue, CloseButton } from '@chakra-ui/react'
//!pronestor - not the original library! because it doesn't work with react 18
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Product, Variation } from '../../src/interfaces/product.interface'
import { imageKitUrl } from '../utils/imageKitUrl'
import ButtonClose from '../atoms/ButtonClose'
import { LIST_ITEM_VARIANT } from '../mook/transition'
import { AnimatePresence, motion } from 'framer-motion';

const Image_Product: React.FC<{ variation: Variation | undefined }> = ({ variation }) => {
    if (!variation) {
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
        if (variation?.photos) {
            setfullImage(variation.photos[0])
        }

    }, [variation])

    const isSmallView = useBreakpointValue({ base: true, sm: false });


    return (
        <>

            <Modal size={['lg', 'lg', 'full', 'full']}

                isCentered={false/* isSmallView ? false : true */} isOpen={isOpen} onClose={() => setisOpen(false)}
            >
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px)'
                />
                <ModalContent
                    margin={isSmallView ? '' : 0}
                    marginTop={isSmallView ? '18vh' : 0}
                    width={'fit-content'}
                >

                    <ModalBody padding={0} >
                        <Box
                            position={'absolute'}
                            right={3}
                            top={3}
                            zIndex={50}
                        >
                            <ButtonClose handleEvent={() => setisOpen(false)} />

                        </Box>

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
                                        //className='h-2/3'
                                        >
                                            <TransformComponent>
                                                <Image
                                                    height={'100vh'}
                                                    //width={'full'}
                                                    className='aspect-[4.2/5] object-cover'
                                                    /* onClick={onClickImageModal} */
                                                    src={imageKitUrl(fullImage)}
                                                    alt={variation.color + 'non trovato'}
                                                />
                                            </TransformComponent>
                                        </div>
                                    </React.Fragment>
                                )}
                            </TransformWrapper>
                        </div>
                        <div className='flex md:hidden '>
                            <TransformWrapper
                                maxScale={3}
                                minScale={1}
                                centerOnInit
                                centerZoomedOut
                            >
                                <TransformComponent
                                >
                                    <Image
                                        /* onClick={onClickImageModal} */

                                        src={imageKitUrl(fullImage)} alt={variation.color + 'non trovato'} />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal >

            <div className='flex space-x-3 lg:space-x-4 w-full min-h-[380px] md:min-h-0 md:w-7/12 lg:w-1/2'>

                <Box onClick={zoomImage} mb={[2, 5]} overflow='hidden' className='cursor-pointer w-full'>

                    <motion.div
                        variants={LIST_ITEM_VARIANT}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <LazyLoadImage src={imageKitUrl(fullImage)}

                            //PlaceholderSrc={PlaceholderImage}
                            //effect="blur"
                            alt={variation.color + 'non trovato'}
                            className='rounded-lg w-full aspect-[4.2/5] object-cover'
                        />
                    </motion.div>

                </Box>
                <div>
                    {variation?.photos && variation.photos.map((image) => {
                        return (
                            <Box onClick={() => changeImageFull(image)} key={Math.random()} mb={'5'} borderRadius='lg' overflow='hidden'
                                borderWidth={1.5}
                                className={` ${image == fullImage ? "border-black border-8" : "border-white"}   cursor-pointer
                                        w-14
                                        xl:w-20
                                    `}
                            >
                                <motion.div
                                    variants={LIST_ITEM_VARIANT}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <Image src={
                                        imageKitUrl(image, 171, 247)
                                    }
                                        alt={variation.color + 'non trovato'}
                                        width={'fit-content'}
                                        maxH={'52'}
                                        // height={'fit-content'}
                                        className='aspect-[4.2/5] object-cover '
                                        loading="lazy"
                                    />
                                </motion.div>
                            </Box>
                        )
                    })}

                </div>
            </div>

        </>

    )
}

export default Image_Product