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
import { SIZES_TYPES } from '../mook/productParameters/sizes';

const quantity = Array.from({ length: 100 }, (_, i) => i + 1)

export interface Size {
    size: string,
    quantity: number
}

const EditColorToProduct: FC<{ category: string | undefined, confirmCard: (variation: VariationCard) => void, colors: Color[], defaultCardValue: VariationCard }> = ({ category, confirmCard, colors, defaultCardValue }) => {




    const [color, setColor] = useState('')
    const sizes = useRef(SIZES)
    const [sizeTypologySelected, setSizeTypologySelected] = useState<string[]>([])
    const [canAddNewSize, setcanAddNewSize] = useState(false)
    const [openDrawNumber, setOpenDrawNumber] = useState<number>(1)
    const [images, setImages] = useState<string[]>([])
    const [isCardConfirmed, setIsCardConfirmed] = useState(false)
    const [productSizeSelected, setProductSizeSelected] = useState<Size[]>([])


    useEffect(() => {

        if (!defaultCardValue) return

        setColor(defaultCardValue?.color)
        setImages(defaultCardValue?.photos)
        setProductSizeSelected((prevState) => {
            return [
                ...defaultCardValue?.lots
            ]
        }
        )

    }, [defaultCardValue])

    useEffect(() => {
        if (!category) return
        const sizeType = SIZES_TYPES.find(size => size.name === category)?.type
        if (!sizeType) return setSizeTypologySelected([])
        setSizeTypologySelected(sizeType);
        setSizeTypologySelected(sizeTypologySelected);

    }, [category])


    const confirmButton = () => {
        setIsCardConfirmed(true)
        const variation: VariationCard = {
            color: color,
            lots: productSizeSelected,
            photos: images
        }
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
                mb={2}
            >
                <h3 className='text-md md:text-xl font-extrabold mb-6'>
                    Aggiungi colore
                </h3>
                <Div_input_creation text='Colore'>
                    <SelectColor
                        fit='fit'
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
                                    defaultValue={element.size}

                                    handleClick={(size) => {
                                        if (size === undefined) return

                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            element.size = size

                                            return newState
                                        })
                                    }}
                                />
                                <SelectStringOption
                                    values={quantity}
                                    defaultValue={element.quantity}
                                    handleClick={(quantity) => {
                                        if (quantity === undefined) return
                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            element.quantity = quantity
                                            if (element.quantity > 0 && element.size !== '' && element.size !== undefined) {
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

                                }}
                            />
                        </div>

                    )
                })}
                {/* || productSizeSelected.length === 0  */}
                <Button
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
                </Button>

                <ButtonGroup gap='2'
                    display={'flex'}
                    justifyContent={'right'}
                    mt={5}
                >

                    <Button colorScheme='green'
                        borderRadius={'full'}
                        paddingX={6}
                        paddingY={5}
                        size={'sm'}
                        isDisabled={false}
                        //disabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                        onClick={
                            confirmButton
                        }
                    >Conferma
                    </Button>


                </ButtonGroup>
            </Box>

        </>


    )
}



export default EditColorToProduct