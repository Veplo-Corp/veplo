import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { Variation } from '../../src/interfaces/product.interface'
import SelectSize from '../atoms/SelectSize'
import SelectStringOption from '../atoms/SelectStringOption'
import { Size } from '../organisms/EditColorToProdoct'
import ModalReausable from '../organisms/ModalReausable'
import { imageKitUrl } from '../utils/imageKitUrl'
import { SIZES_TYPES } from '../mook/productParameters/sizes'

const quantity = Array.from({ length: 101 }, (_, i) => i + 0)


const EditVariationCard: FC<{ variation: Variation, category: string, deleteVariation: (variationId: string, color: string) => void, editVariation: (variationId: string, variationTranslate: Size[], photos: string[]) => void }> = ({ variation, category, deleteVariation, editVariation }) => {

    const [editMode, seteditMode] = useState(false);
    const [variationTranslate, setvariationTranslate] = useState<Size[]>([])
    const [openModal, setOpenModal] = useState(false);
    const [sizeTypologySelected, setSizeTypologySelected] = useState<string[]>([])


    useEffect(() => {
        const lots: Size[] = [];
        if (!category) return

        const sizeTypologySelected = SIZES_TYPES.find(element => element.name === category)?.type
        if (!sizeTypologySelected) return
        setSizeTypologySelected(sizeTypologySelected)
        variation?.lots.forEach(lot => {
            const size = sizeTypologySelected?.find(element => element.split(' (')[0] === lot.size)
            if (!size) return
            lots.push({
                size,
                quantity: Number(lot.quantity)
            })
        });
        if (lots.length <= 0) return
        setvariationTranslate(lots)
    }, [variation])




    return (
        <>
            {
                !editMode ? (
                    <Box
                        paddingTop={7}
                        paddingBottom={5}
                        paddingX={7}
                        borderWidth={1}
                        borderColor={'gray.300'}
                        borderRadius={'2xl'}
                        mb={5}
                    >

                        <div className='flex justify-between mb-1'>
                            <h5 className=' text-md lg:text-lg font-extrabold my-auto'>
                                {variation?.color}
                            </h5>
                            <h5 className=' text-sm lg:text-md font-bold text-right my-auto'>
                                Taglie
                            </h5>
                        </div>
                        <div className='flex justify-between mt-2'>

                            <div className='flex gap-2'>
                                {variation?.photos.length > 0 && variation?.photos.map((image: any) => {
                                    if (image?.url) {
                                        return (
                                            <img
                                                key={image.url}
                                                src={image.url} alt="immagine non trovata"
                                                className='
                                                h-[75px]
                                                w-[62px]
                                                object-cover
                                                rounded-lg'
                                            />
                                        )
                                    } else {
                                        return (
                                            <img
                                                key={image}
                                                src={imageKitUrl(image, 237, 247)} alt="immagine non trovata"
                                                className='
                                                h-[75px]
                                                w-[62px]
                                                object-cover
                                                rounded-lg'
                                            />
                                        )
                                    }
                                })}
                            </div>

                            <div className='gap-2 text-right'>
                                {
                                    variation?.lots.length > 0 && variation?.lots.map((size: any, index: number) => {
                                        return (

                                            <p
                                                className='text-sm mb-1'
                                                key={index}
                                            >
                                                {sizeTypologySelected?.find(element => element.split(' (')[0] === size.size)} - {size.quantity ? size.quantity + ' quantità' : 'ESAURITO'}
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
                                onClick={() => {
                                    seteditMode(true)

                                }
                                }
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                }
                            />
                            <IconButton aria-label='Search database'
                                colorScheme={'red'}
                                variant={'ghost'}
                                onClick={() => {
                                    setOpenModal(true)
                                }}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                }
                            />
                        </ButtonGroup>
                    </Box >
                ) : (
                    <Box
                        paddingY={7}
                        paddingX={7}
                        borderWidth={1}
                        borderColor={'gray.300'}
                        borderRadius={'2xl'}
                        mb={2}
                    >
                        <div className='flex justify-between mb-3'>
                            <h5 className=' text-md lg:text-lg font-extrabold my-auto'>
                                {variation?.color}
                            </h5>

                        </div>
                        <div className='w-8/12 lg:w-9/12 xl:w-7/12'>
                            <div className='flex justify-between text-sm text-gray-600 font-norma'>
                                <p >
                                    Taglia
                                </p>
                                <p >
                                    Quantità
                                </p>
                            </div>
                        </div>
                        {variationTranslate && variationTranslate.map((element, index) => {
                            return (
                                <div key={index} className="w-full flex">
                                    <div className='flex justify-between h-full mb-2 gap-4'>
                                        <SelectSize
                                            disabledSizes={variationTranslate}
                                            values={sizeTypologySelected}
                                            defaultValue={element.size}
                                            handleClick={(size) => {
                                                if (size === undefined) return
                                                setvariationTranslate((prevState: Size[]) => {
                                                    let sizeArray = prevState;
                                                    sizeArray[index] = {
                                                        ...sizeArray[index],
                                                        size: size
                                                    }

                                                    return [
                                                        ...sizeArray
                                                    ]
                                                })
                                            }}
                                        />
                                        <SelectStringOption
                                            values={quantity}
                                            defaultValue={element.quantity}
                                            handleClick={(quantity) => {
                                                if (quantity === undefined) return
                                                setvariationTranslate((prevState: Size[]) => {
                                                    let sizeArray = prevState;
                                                    sizeArray[index] = {
                                                        ...sizeArray[index],
                                                        quantity: quantity
                                                    }
                                                    return [
                                                        ...sizeArray
                                                    ]
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
                                            if (variationTranslate.length <= 1) return
                                            const newproductSizeSelected = variationTranslate.filter(value => value.size !== element.size)
                                            setvariationTranslate(newproductSizeSelected)
                                        }}
                                    />
                                </div>
                            )
                        })}
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
                                setvariationTranslate((prevstate: Size[]) => {
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
                            <Button colorScheme='red'
                                borderRadius={'full'}
                                paddingX={6}
                                paddingY={5}
                                size={'sm'}
                                isDisabled={false}
                                variant={'outline'}
                                //isDisabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                                onClick={() => {
                                    seteditMode(false)
                                    const lots: Size[] = [];
                                    variation?.lots.forEach(lot => {
                                        const size = sizeTypologySelected?.find(element => element.split(' (')[0] === lot.size)
                                        if (!size) return
                                        lots.push({
                                            size,
                                            quantity: Number(lot.quantity)
                                        })
                                    });
                                    if (lots.length <= 0) return
                                    setvariationTranslate(lots)
                                }
                                }
                            >Annulla
                            </Button>
                            <Button colorScheme='green'
                                borderRadius={'full'}
                                paddingX={6}
                                paddingY={5}
                                size={'sm'}
                                isDisabled={false}
                                //isDisabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                                onClick={
                                    () => {
                                        const variations = variationTranslate.filter(variation => variation?.size !== '' && variation?.quantity >= 0)
                                        editVariation(variation?.id, variations, variation?.photos)
                                        seteditMode(false)
                                    }
                                }
                            >Conferma
                            </Button>

                        </ButtonGroup>
                    </Box>
                )
            }
            <ModalReausable title='Elimina colore' isOpen={openModal} closeModal={() => setOpenModal(false)}>
                <p
                    className='mt-2'
                >Vuoi davvero eliminare tutti i prodotti del colore selezionato?
                </p>
                <ButtonGroup
                    mt={4}
                    gap={2}
                >
                    <Button
                        variant={'outline'}
                        onClick={() => setOpenModal(false)}
                    >
                        Annulla
                    </Button>
                    <Button
                        colorScheme={'red'}
                        variant={'outline'}
                        onClick={() => {
                            deleteVariation(variation?.id, variation?.color)
                            setOpenModal(false)

                        }}
                    >
                        Conferma
                    </Button>
                </ButtonGroup>
            </ModalReausable>
        </>

    )


}

export default EditVariationCard