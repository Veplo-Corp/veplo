import { Box, Button } from '@chakra-ui/react'
import React, { FC, useRef, useState } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import BlackButton from '../atoms/BlackButton'
import { useDebounceEffect } from '../utils/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import { UploadEventType } from '../../src/lib/upload/UploadEventTypes'

interface Props {
    imageSrc: any,
    aspectRatio: number,
    circularCrop: boolean,
    onHanldeConfirm: (completeCrop: PixelCrop, type: UploadEventType | undefined, imageRefCurrent: HTMLImageElement) => void,
    handlerCancel: () => void,
    type: UploadEventType | undefined,
    defaultCrop?: Crop | any
}

const ImageCrop: FC<Props> = ({ ...props }) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [crop, setCrop] = useState<Crop | any>(props.defaultCrop ? props.defaultCrop : undefined)

    /* {
            unit: '%', // Can be 'px' or '%'
            // x: 17.53,
            // y: 11.00,
            width: 50,  //762 diviso 5
            height: 50,//1100 diviso 5
        } */

    const onHanldeConfirm = () => {
        if (completedCrop && imgRef.current) {
            props.onHanldeConfirm(completedCrop, props.type, imgRef.current)
        }
    }







    return (
        <Box
            minWidth={['container.xs', 'container.xs', 'container.sm', 'container.md']}
            className='max-w-full '
            maxWidth={'container.md'}
            paddingTop={6}>

            <Box
                maxH={'container.sm'}
                maxW={'fit-content'}
                className='w-96 m-auto'
            >

                <ReactCrop
                    className='w-full h-fit max-h-[65vh] border-2 border-gray'
                    //className="border-2 border-dashed border-red-500 transition-all duration-300"
                    crop={crop}
                    circularCrop={props.circularCrop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => {
                        setCompletedCrop(c)
                    }}

                    aspect={props.aspectRatio}

                >

                    <img

                        className='object-contain border-none cursor-crosshair'
                        src={props.imageSrc} ref={imgRef}
                    />

                </ReactCrop>
            </Box>

            <div className='flex justify-between mt-2 gap-2'>
                <Button
                    //onClick={() => setImgSrc(null)}
                    onClick={props.handlerCancel}
                    borderRadius={5}
                    width={'fit-content'}
                    height={12}
                    size={'sm'}
                    variant='outline'
                    colorScheme={'blackAlpha'}
                    color={'blackAlpha.900'}
                    disabled={false} >

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                    Annulla
                </Button>
                <BlackButton
                    onClick={onHanldeConfirm}
                    element='Conferma'
                    borderRadius={5}
                    width={200}
                    heigth={12}
                    size={'sm'}
                    typeButton={'button'}
                    isDisabled={false}
                />

            </div>
        </Box>
    )
}

export default ImageCrop