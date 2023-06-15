import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, ButtonGroup, IconButton, Select } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Variation } from '../../src/interfaces/product.interface';
import { VariationCard } from '../../src/interfaces/variationCard.interface';
import Div_input_creation from '../atoms/Div_input_creation';
import SelectColor from '../atoms/SelectColor';
import SelectSize from '../atoms/SelectSize';
import SelectStringOption from '../atoms/SelectStringOption';
import { Color, COLORS } from '../mook/colors';
import { SIZES } from '../mook/sizes';
import ModalReausable from './ModalReausable';
import ImageCrop from '../molecules/ImageCrop';
import { PixelCrop } from 'react-image-crop'
import { canvasPreview } from '../molecules/Canva_previews';
import { resizeFile } from '../utils/resizeFile';

const quantity = Array.from({ length: 100 }, (_, i) => i + 1)

interface Size {
    size: string,
    quantity: number
}

type Image = {
    type: string,
    blob: any,
    url: any,
    position: number,
    file: any
}

const AddColorToProduct: FC<{ category: string, deleteCard: () => void, confirmCard: (variation: VariationCard) => void, colors: Color[], defaultCardValue?: VariationCard }> = ({ category, deleteCard, confirmCard, colors, defaultCardValue }) => {




    const [color, setColor] = useState('')
    const sizes = useRef(SIZES)
    const [sizeTypologySelected, setSizeTypologySelected] = useState<string[]>([])
    const [canAddNewSize, setcanAddNewSize] = useState(false)
    const [openDrawNumber, setOpenDrawNumber] = useState<number>(1)
    const [isCardConfirmed, setIsCardConfirmed] = useState(false)


    //image
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const hiddenFileInputImage = useRef<any>(null);
    const [imgSrc, setImgSrc] = useState<any>('');
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [images, setImages] = useState<Image[]>([])

    useEffect(() => {

        if (!defaultCardValue) return
        console.log(defaultCardValue);

        setColor(defaultCardValue?.color)
        setProductSizeSelected(defaultCardValue?.lots)

    }, [defaultCardValue])

    useEffect(() => {
        const sizeTypes = Object.keys(sizes.current);
        const sizeType = Object.keys(sizes.current).indexOf(category)
        const sizeTypologySelected = Object.values(sizes.current)[sizeType]
        setSizeTypologySelected(sizeTypologySelected);

    }, [category])

    const [productSizeSelected, setProductSizeSelected] = useState<Size[]>([
        {
            size: '',
            quantity: 0
        }
    ])

    const confirmButton = () => {
        setIsCardConfirmed(true)
        const variation: VariationCard = {
            color: color,
            lots: productSizeSelected,
            photos: images
        }
        console.log(variation);
        confirmCard(variation);
    }

    //refactoring of onSelectFile
    const onSelectFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {

        hiddenFileInputImage.current.click();
        if (e.target.files) {
            try {
                const file = e.target.files[0];
                const image = await resizeFile(file);
                setImgSrc(image)
                setIsImageModalOpen(true)

            } catch (err) {
                console.log(err);
            }

        }
        else {
            return console.log('non trovata immagine caricata');
        }


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
                        console.log('PASSA QUI');

                        const file = new File([blob], "photo1", {
                            type: 'image/webp'
                        });



                        const newImage: Image = {
                            type: 'image/webp',
                            blob: blob,
                            url: url,
                            file: file,
                            position: images.length
                        }

                        console.log(newImage);


                        setImages(prevstate => {
                            return [
                                ...prevstate,
                                newImage
                            ]
                        })

                    }, 'image/webp', quality);

                })
        }
    }

    const handleClickImage = () => {

        if (!hiddenFileInputImage.current) return
        hiddenFileInputImage.current.click();


    };




    return (
        <>

            <Box
                paddingY={7}
                paddingX={7}
                borderWidth={1}
                borderColor={'gray.300'}
                borderRadius={'2xl'}
                display={`${isCardConfirmed ? 'none' : ''}`}
            >
                <h3 className='text-md md:text-xl font-extrabold mb-6'>
                    Aggiungi colore
                </h3>
                <Div_input_creation text='Colore'>
                    <Box
                        width={80}
                        height={12}
                    >
                        <SelectColor
                            placeholder='colore'
                            colors={colors}
                            defaultValue={color}
                            handleClick={(color) => {
                                setColor(color)
                            }}
                        />
                    </Box>

                </Div_input_creation>
                <div className='w-10/12'>
                    <div className='flex justify-between text-sm text-gray-600 font-norma'>
                        <p >
                            Taglia
                        </p>
                        <p >
                            Quantità
                        </p>
                    </div>
                </div>
                {productSizeSelected && productSizeSelected.map((element, index) => {

                    return (
                        <div className='w-full flex' key={index} >
                            <div className='flex justify-between h-full w-10/12 mb-2'>
                                <SelectSize
                                    disabledSizes={productSizeSelected}
                                    values={sizeTypologySelected}
                                    defaultValue={productSizeSelected[index].size}
                                    handleClick={(size) => {
                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            prevstate[index].size = size
                                            //console.log(newState);
                                            if (prevstate[index].quantity > 0 && prevstate[index].size !== '') {
                                                console.log(prevstate[index].size !== '');
                                                setcanAddNewSize(true)
                                            } else {
                                                setcanAddNewSize(false)
                                            }
                                            return newState
                                        })
                                    }}
                                />
                                <SelectStringOption
                                    values={quantity}
                                    defaultValue={productSizeSelected[index].quantity}
                                    handleClick={(quantity) => {
                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            prevstate[index].quantity = quantity
                                            if (prevstate[index].quantity > 0 && prevstate[index].size !== '' && prevstate[index].size !== undefined) {
                                                setcanAddNewSize(true)
                                            } else {
                                                setcanAddNewSize(false)
                                            }
                                            return newState
                                        })
                                    }}
                                />
                            </div>
                            <IconButton aria-label='Search database'
                                colorScheme={'red'}
                                margin={'auto'}
                                variant={'ghost'}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                }
                                onClick={() => {
                                    console.log(productSizeSelected);
                                    const newproductSizeSelected = productSizeSelected.filter(value => value.size !== element.size)
                                    console.log(newproductSizeSelected);
                                    setProductSizeSelected(newproductSizeSelected)
                                }}
                            />
                        </div>

                    )
                })}
                {/* || productSizeSelected.length === 0  */}
                {canAddNewSize && <Button
                    size={'xs'}
                    colorScheme={'green'}
                    leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                    variant='ghost'
                    mb={3}
                    onClick={() => {
                        setProductSizeSelected((prevstate: Size[]) => {
                            return [
                                ...prevstate,
                                {
                                    size: '',
                                    quantity: 0
                                }
                            ]
                        })
                    }}
                >
                    aggiungi taglia
                </Button>}
                <Div_input_creation text='Carica immagini'>
                    <Box
                        width={'full'}
                        display={'flex'}
                        justifyContent={'start'}
                        mt={2}
                    >
                        {images.map((image, index) => {
                            return (
                                <Box
                                    key={index}
                                    className='flex mr-2'


                                    height={130}
                                    width={100}

                                    position={'relative'}
                                    borderRadius={'10px'}


                                >
                                    <img
                                        className='object-cover rounded-[10px]'
                                        src={image.url}
                                    ></img>

                                    <Box
                                        height={5}
                                        width={5}
                                        className='absolute right-1 top-1  cursor-pointer rounded-lg'
                                        bgColor={'white'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        _active={{
                                            transform: 'scale(0.90)',
                                        }}
                                        onClick={() => {

                                            setImages(prevstate => {
                                                const element = prevstate.filter(element => element.url !== image.url)
                                                console.log(element);

                                                return element
                                            })

                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                            className="w-4 h-4 m-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </Box>



                                </Box>)
                        })}
                        {images.length < 3 && <Box
                            className=' cursor-pointer flex '
                            _active={{
                                transform: 'scale(0.99)',
                            }}

                            height={130}
                            width={100}
                            borderColor={'gray.300'}
                            borderWidth={1}
                            borderRadius={'10px'}
                            borderStyle={'dashed'}
                            onClick={() => {
                                handleClickImage()
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

                            <input
                                ref={hiddenFileInputImage}
                                type="file" id="file" multiple accept="image/jpeg, image/jpg, image/webp"
                                className='hidden'
                                onChange={(e) => {
                                    onSelectFileInput(e);
                                }} />
                            {<canvas
                                ref={previewCanvasRef}
                                className='hidden'

                            />}
                        </Box>}



                    </Box>
                </Div_input_creation>

                <ButtonGroup gap='2'
                    display={'flex'}
                    justifyContent={'right'}
                    mt={5}
                >
                    <Button colorScheme='red' variant={'outline'}
                        paddingX={6}
                        paddingY={5}
                        borderRadius={'full'}
                        size={'sm'}
                        onClick={() => deleteCard()}
                    >Cancella</Button>
                    <Button colorScheme='green'
                        borderRadius={'full'}
                        paddingX={6}
                        paddingY={5}
                        size={'sm'}
                        //isDisabled={false}
                        isDisabled={images.length < 1 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                        onClick={
                            confirmButton
                        }
                    >Conferma
                    </Button>
                </ButtonGroup>
            </Box>


            <ModalReausable
                marginTop={0}
                title={'inserisci immagine (ritaglia la foto)'}
                isOpen={isImageModalOpen}
                closeModal={() => {
                    hiddenFileInputImage.current.value = null;
                    setIsImageModalOpen(false)
                }
                }
                positionTopModal={true}
            >
                <ImageCrop
                    imageSrc={imgSrc} type={'product'} aspectRatio={4.2 / 5}
                    circularCrop={false}
                    onHanldeConfirm={(image, type, imageRefCurrent) => {

                        handleImageConfirm(image, imageRefCurrent)
                        hiddenFileInputImage.current.value = null;
                        setIsImageModalOpen(false)
                    }

                    }
                    handlerCancel={() => {
                        hiddenFileInputImage.current.value = null;
                        setIsImageModalOpen(false)
                    }}
                />
            </ModalReausable>
        </>


    )
}



export default AddColorToProduct
