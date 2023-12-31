import { Box, ButtonGroup, Center, IconButton, Spinner } from '@chakra-ui/react'
import React, { FC, memo, useEffect, useState } from 'react'
import { Variation } from '../../src/interfaces/product.interface'
import { VariationCard } from '../../src/interfaces/variationCard.interface'
import { imageKitUrl } from '../utils/imageKitUrl'
import AddColorToProduct from '../organisms/AddColorToProduct'

const ProductVariationCard: FC<{ category: string | undefined, index: number, variation: VariationCard, deleteCard: (variation: any) => void, editCard: (variation: VariationCard) => void, isLoading?: boolean }> = ({ category, index, deleteCard, editCard, variation, isLoading }) => {
    const [isEdited, setIsEdited] = useState(false)
    const [variationState, setVariationState] = useState<VariationCard>(variation)
    useEffect(() => {
        setVariationState(variation)
    }, [variation])



    return (

        isLoading ? (
            <Box
                paddingTop={7}
                paddingBottom={5}
                paddingX={7}
                borderWidth={1}
                borderColor={'gray.300'}
                borderRadius={'2xl'}
                mb={5}
            >
                <Center>
                    <Spinner
                        thickness='5px'
                        speed='0.65s'
                        emptyColor='primary.bg'
                        color='white'
                        size='xl'
                    />
                </Center>
            </Box>

        ) :
            isEdited ?
                (
                    <Box
                        mb={5}
                    >
                        <AddColorToProduct
                            defaultCardValue={variationState}
                            confirmCard={(variationState) => {
                                editCard(variationState)
                                setIsEdited(false)
                            }}
                            deleteCard={() => setIsEdited(false)}
                            colors={[]}
                            category={category}
                        />
                    </Box>

                )
                :
                (
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
                                {variationState?.color}
                            </h5>
                            <h5 className=' text-sm lg:text-md font-bold text-right my-auto'>
                                Taglie
                            </h5>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <div className='flex gap-2'>
                                {variationState?.photos.length > 0 && variationState?.photos.map((image: any) => {

                                    if (image?.url) {
                                        return (
                                            <img
                                                key={image.url}
                                                src={image.url} alt="immagine non trovata"
                                                className='w-10 md:w-16 h-fit rounded-lg'
                                            />
                                        )
                                    } else {
                                        return (
                                            <img
                                                key={image}
                                                src={imageKitUrl(image, 237, 247)} alt="immagine non trovata"
                                                className='w-10 md:w-16 h-fit rounded-lg'
                                            />
                                        )
                                    }

                                })}
                            </div>

                            <div className='gap-2 text-right'>
                                {
                                    variationState?.lots.length > 0 && variationState?.lots.map((size: any, index: number) => {
                                        return (
                                            <p
                                                className='text-sm mb-1'
                                                key={index}
                                            >
                                                {size.size} - {size.quantity ? size.quantity + ' quantità' : 'ESAURITO'}
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
                                    setIsEdited(true)
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
                                    deleteCard(variationState)
                                }}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                }
                            />
                        </ButtonGroup>
                    </Box>
                )
    )
}

export default memo(ProductVariationCard)