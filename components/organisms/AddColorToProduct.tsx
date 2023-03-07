import { Box, Button, Select } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'
import Div_input_creation from '../atoms/Div_input_creation';
import SelectColor from '../atoms/SelectColor';
import SelectStringOption from '../atoms/SelectStringOption';
import { SIZES } from '../mook/sizes';

const quantity = Array.from({ length: 100 }, (_, i) => i + 1)

interface Size {
    size: string,
    quantity: number
}

const AddColorToProduct: FC<{ category: string }> = ({ category }) => {

    const [color, setColor] = useState('')
    const sizes = useRef(SIZES)
    const [sizeTypologySelected, setSizeTypologySelected] = useState<string[]>([])
    const [canAddNewSize, setcanAddNewSize] = useState(false)


    useEffect(() => {
        const sizeTypes = Object.keys(sizes.current);
        const sizeType = Object.keys(sizes.current).indexOf(category)

        console.log(sizeType);
        console.log(sizeTypes);

        const sizeTypologySelected = Object.values(sizes.current)[sizeType]
        setSizeTypologySelected(sizeTypologySelected);


    }, [category])

    const [productSizeSelected, setProductSizeSelected] = useState<Size[]>([
        {
            size: '',
            quantity: 0
        }
    ])


    return (
        <Box
            paddingY={7}
            paddingX={7}
            borderWidth={1}
            borderColor={'gray.300'}
            borderRadius={'2xl'}
        >
            <h3 className='text-md md:text-xl font-extrabold mb-6'>
                Aggiungi colore
            </h3>
            <Div_input_creation text='Colore'>
                <SelectColor
                    selectedValueBefore={''}
                    handleClick={(color) => {
                        setColor(color)
                    }}
                />
            </Div_input_creation>

            {productSizeSelected.map((element, index) => {
                console.log(index);

                return (
                    <div className='w-full flex'>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <p className='text-sm text-gray-600 font-normal mb-px'>
                                    Taglia
                                </p>
                                <p className='text-sm text-gray-600 font-normal mb-px'>
                                    Quantità
                                </p>
                            </div>
                            <div className='flex justify-between h-full'>
                                <SelectStringOption
                                    values={sizeTypologySelected}
                                    selectedValueBefore={''}
                                    handleClick={(size) => {
                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            prevstate[index].size = size
                                            console.log(newState);
                                            if (prevstate[index].quantity > 0 && prevstate[index].size !== '') {
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
                                    selectedValueBefore={''}
                                    handleClick={(quantity) => {
                                        setProductSizeSelected((prevstate: Size[]) => {
                                            let newState = prevstate;
                                            prevstate[index].quantity = quantity
                                            console.log(newState);
                                            if (prevstate[index].quantity > 0 && prevstate[index].size !== '') {
                                                setcanAddNewSize(true)
                                            } else {
                                                setcanAddNewSize(false)
                                            }
                                            return newState
                                        })
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                )
            })}
            {canAddNewSize && <Button
                size={'xs'}
                colorScheme={'green'}
                leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                }
                variant='ghost'
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
        </Box>
    )
}

export default AddColorToProduct