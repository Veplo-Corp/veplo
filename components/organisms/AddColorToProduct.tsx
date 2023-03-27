import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, IconButton, Select } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Variation } from '../../src/interfaces/product.interface';
import { VariationCard } from '../../src/interfaces/variationCard.interface';
import Div_input_creation from '../atoms/Div_input_creation';
import SelectColor from '../atoms/SelectColor';
import SelectSize from '../atoms/SelectSize';
import SelectStringOption from '../atoms/SelectStringOption';
import { Color, COLORS } from '../mook/colors';
import { SIZES } from '../mook/sizes';
import Drawer_Add_Image from './Drawer_Add_Image';

const quantity = Array.from({ length: 100 }, (_, i) => i + 1)

interface Size {
    size: string,
    quantity: number
}

const AddColorToProduct: FC<{ category: string, deleteCard: () => void, confirmCard: (variation: VariationCard) => void, colors: Color[], defaultCardValue?: VariationCard }> = ({ category, deleteCard, confirmCard, colors, defaultCardValue }) => {




    const [color, setColor] = useState('')
    const sizes = useRef(SIZES)
    const [sizeTypologySelected, setSizeTypologySelected] = useState<string[]>([])
    const [canAddNewSize, setcanAddNewSize] = useState(false)
    const [openDrawNumber, setOpenDrawNumber] = useState<number>(1)
    const [images, setImages] = useState<string[]>([])
    const [isCardConfirmed, setIsCardConfirmed] = useState(false)


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
                    <SelectColor
                        colors={colors}
                        defaultValue={color}
                        handleClick={(color) => {
                            setColor(color)
                        }}
                    />
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
                        rounded={10}
                        padding={3.5}
                        mt={1}
                        backgroundColor={`${images.length < 2 ? 'white' : 'gray.100'}`}
                        borderWidth={1}
                        borderColor={'gray.200'}
                        lineHeight='tight'
                        noOfLines={1}
                        fontSize='sm'
                        className='cursor-pointer'
                        onClick={() => {
                            setOpenDrawNumber(Math.random())
                        }}
                    >
                        <div
                            className={`w-full flex justify-between ${images.length < 2 ? 'text-gray-500' : 'text-gray-900'}  `}
                        >
                            <span>
                                {images.length < 2 ? 'carica immagini del prodotto' : 'immagini caricate correttamente'}
                            </span>
                            {images.length < 2 ?
                                (<DownloadIcon
                                    className="h-5 w-5 text-gray-400 my-auto"
                                    aria-hidden="true"
                                />) : (
                                    <CheckIcon
                                        className="h-5 w-5 text-gray-400 my-auto"
                                        aria-hidden="true"
                                    />
                                )
                            }
                        </div>
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
                        //disabled={false}
                        disabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                        onClick={
                            confirmButton
                        }
                    >Conferma
                    </Button>
                </ButtonGroup>
            </Box>
            <Drawer_Add_Image openDraw={openDrawNumber} imagesUploadedBefore={[]} confirmPhotos={(images: string[]) => {
                console.log(images);
                setImages(images)
            }} />
        </>


    )
}



export default AddColorToProduct

/* 

<Box
                display={`${isCardConfirmed ? '' : 'none'}`}
                paddingTop={7}
                paddingBottom={5}
                paddingX={7}
                borderWidth={1}
                borderColor={'gray.300'}
                borderRadius={'2xl'}
            >
                <div className='flex justify-between mb-1'>
                    <h5 className=' text-md lg:text-lg font-extrabold my-auto'>
                        {color}
                    </h5>
                    <h5 className=' text-sm lg:text-md font-bold text-right my-auto'>
                        Taglie
                    </h5>
                </div>
                <div className='flex justify-between mt-2'>

                    <div className='flex gap-2'>
                        {images.length > 0 && images.map((image: any) => {
                            return (
                                <img
                                    key={image.url}
                                    src={image.url} alt="immagine non trovata"
                                    className='w-10 md:w-16 rounded-lg'
                                />
                            )
                        })}
                    </div>

                    <div className='gap-2 text-right'>
                        {
                            productSizeSelected.length > 0 && productSizeSelected.map(size => {
                                return (
                                    <p
                                        className='text-sm mb-1'
                                        key={Math.random()}
                                    >
                                        {size.size} - {size.quantity} quantità
                                    </p>
                                )
                            })
                        }
                    </div>

                </div>

                <ButtonGroup gap='2'
                    display={'flex'}
                    justifyContent={'right'}
                    mt={5}
                >
                    <IconButton
                        aria-label=''
                        colorScheme={'blue'}
                        variant={'ghost'}
                        onClick={() => setIsCardConfirmed(false)}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        }
                    />
                    <IconButton aria-label='Search database'
                        colorScheme={'red'}
                        variant={'ghost'}
                        onClick={deleteCard}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        }

                    />
                </ButtonGroup>
            </Box>
*/