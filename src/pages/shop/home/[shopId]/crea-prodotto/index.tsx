import { Box, Button, ButtonGroup, IconButton, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import ProductVariationCard from '../../../../../../components/molecules/ProductVariationCard'
import { Color, COLORS } from '../../../../../../components/mook/colors'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import EditColorToProduct from '../../../../../../components/organisms/EditColorToProdoct'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { onChangeNumberPrice } from '../../../../../../components/utils/onChangePrice'
import { Variation } from '../../../../../interfaces/product.interface'
import { VariationCard } from '../../../../../interfaces/variationCard.interface'

export interface IFormInputProduct {
    name: string;
    price: string;
    brand: string;
    macrocategory: string;
    microcategory: string;
    vestibilità: string
}

interface Macrocategory {
    name: string,
    sizes: string,
    types: string[],
    url: string
}

const vestibilità = [
    'skinny',
    'slim fit',
    'regular',
    'baggy'
]




const index = () => {

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInputProduct>({
        mode: "all",
        //defaultValues
    });

    const [microcategoriesSelected, setMicrocategoriesSelected] = useState<string[]>([])
    const [sizeTypeSelected, setSizeTypeSelected] = useState('')
    const [newCard, setNewCard] = useState(true)
    const [productVariations, setProductVariations] = useState<any[]>([])
    const [colors, setColors] = useState<Color[]>(COLORS)
    const [cardToEdit, setCardToEdit] = useState<any>([])
    // const deleteVariation = (index: number) => {
    //     if (productVariations.length < 1) return
    //     console.log(index);
    // }



    const confirmCard = (variation: VariationCard) => {
        setProductVariations((prevstate: any[]) => {
            // let prevElements = prevstate;
            // prevElements[index] = variation
            // console.log(prevElements);
            // return prevElements
            return [
                ...prevstate,
                variation
            ]
        })
        setColors((prevState: Color[]) => {
            const newColors = prevState.filter(color => color.name !== variation.color)
            return [
                ...newColors
            ]
        })

        setNewCard(false)
    }

    const editCard = (variation: VariationCard) => {
        setProductVariations((prevstate: any[]) => {
            return [
                ...prevstate,
                variation
            ]
        })
        setColors((prevState: Color[]) => {
            const newColors = prevState.filter(color => color.name !== variation.color)
            return [
                ...newColors
            ]
        })
        setCardToEdit((prevstate: VariationCard[]) => {
            const newVariation = prevstate.filter(element => element.color !== variation.color)
            return [
                ...newVariation
            ]
        })


        setNewCard(false)
    }

    const trasformInEditCard = (variation: any) => {
        setCardToEdit((prevstate: VariationCard[]) => {
            return [
                variation,
                ...prevstate
            ]
        })

        setProductVariations((prevstate: VariationCard[]) => {
            const newVariation = prevstate.filter(element => element.color !== variation.color)
            return [
                ...newVariation
            ]
        })

    }

    const deleteVariationCard = (variation: Variation) => {
        setProductVariations((prevstate: any) => {
            const newState = prevstate.filter((state: Variation) => state.color !== variation.color)
            return [
                ...newState
            ]
        })
        setColors((prevState: any) => {
            const newColor = COLORS.find(color => color.name === variation.color)
            if (!newColor) return [...prevState]
            console.log(newColor);
            let newColors = [
                newColor,
                ...prevState,
            ]
            console.log(newColors);
            return [...newColors]
        })
    }



    return (
        <Desktop_Layout>
            <NoIndexSeo title='Crea prodotto | Veplo' />
            <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>
                <h1 className='italic text-xl lg:text-3xl font-extrabold mb-6'>
                    Aggiungi prodotto
                </h1>
                <Div_input_creation text='Nome del prodotto'>
                    <InputGroup >
                        <Input
                            autoComplete='off'
                            maxLength={30}
                            rounded={10}
                            paddingY={6}
                            type="text"
                            {...register("name", { required: true })}
                            isInvalid={false}
                        />
                    </InputGroup>
                </Div_input_creation>
                <Div_input_creation text='Prezzo'>
                    <InputGroup

                    >
                        <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                        <Input
                            rounded={10}
                            paddingY={6}
                            autoComplete='off'
                            type="string"
                            {...register("price", {
                                required: true,
                            })}
                            onWheel={(e: any) => e.target.blur()}
                            placeholder={'34,99'}
                            textAlign={"end"}
                            isInvalid={false}
                            onChange={(e) => {
                                const inputValue = onChangeNumberPrice(e)
                                return setValue('price', inputValue);
                            }}
                        />
                    </InputGroup>
                </Div_input_creation>
                <Div_input_creation text='Brand'
                >
                    <Controller
                        control={control}
                        name="brand"
                        rules={{ required: false }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Autocomplete
                                selectedValue={watch('brand')}
                                handleChangeValues={(brand: any) => {
                                    setValue('brand', brand);
                                }} />
                        )}
                    />
                </Div_input_creation>
                <Div_input_creation text='Categoria'>
                    <Controller
                        control={control}
                        name="macrocategory"
                        rules={{ required: false }}
                        render={() => (
                            <SelectMacrocategory
                                selectedValueBefore={''}
                                handleClick={(macrocategory: Macrocategory) => {
                                    setSizeTypeSelected(macrocategory.sizes)
                                    setValue('macrocategory', macrocategory.name);
                                    setProductVariations([])
                                    setMicrocategoriesSelected(macrocategory.types)
                                }}
                            />
                        )}
                    />
                </Div_input_creation>
                <Div_input_creation text='Microcategoria'>
                    <Controller
                        control={control}
                        name="microcategory"
                        rules={{ required: false }}
                        render={() => (
                            <SelectStringOption
                                values={microcategoriesSelected}
                                defaultValue={''}
                                handleClick={(microcategory: string) => {
                                    setValue('microcategory', microcategory);
                                }}
                            />
                        )}
                    />
                </Div_input_creation>
                <Div_input_creation text='Vestibilità prodotto'>
                    <Controller
                        control={control}
                        name="vestibilità"
                        rules={{ required: false }}
                        render={() => (
                            <SelectStringOption
                                values={vestibilità}
                                defaultValue={''}
                                handleClick={(vestibilità: string) => {
                                    setValue('vestibilità', vestibilità);
                                }}
                            />
                        )}
                    />
                </Div_input_creation>
                <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                    Varianti colore
                </h1>
            </div>



            <div className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 m-auto'>

                {productVariations.length > 0 && productVariations.map((variation: VariationCard, index) => {

                    console.log(variation);
                    return (
                        <div key={index}>
                            <ProductVariationCard
                                index={index}
                                variation={variation}
                                editCard={trasformInEditCard}
                                deleteCard={deleteVariationCard}
                            />
                        </div>

                    )
                })}

                {cardToEdit.length > 0 && cardToEdit.map((variation: VariationCard) => {
                    console.log(variation);
                    return (
                        <div key={variation.color}>
                            <EditColorToProduct
                                defaultCardValue={variation}
                                colors={colors}
                                category={sizeTypeSelected}
                                confirmCard={(variation) => {
                                    editCard(variation)
                                }}
                            />

                        </div>
                    )
                    // return (
                    //     <div
                    //         key={Math.random()}
                    //         className='mb-4'
                    //     >
                    //         <AddColorToProduct
                    //             defaultCardValue={variation}
                    //             colors={colors}
                    //             category={sizeTypeSelected}
                    //             confirmCard={(variation) => {
                    //                 confirmCard(variation)
                    //             }}
                    //         />
                    //     </div>
                    // )
                })
                }


                {!newCard || watch('macrocategory') === undefined ? (
                    <Button
                        size={['sm', 'md']}
                        colorScheme={'gray'}
                        ml={[0, 8]}
                        leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        }
                        variant='ghost'
                        mb={3}
                        mt={-1}
                        onClick={() => {
                            setNewCard(true)
                        }}
                    >
                        aggiungi nuova variante
                    </Button>)
                    : (
                        <div
                            key={Math.random()}
                            className='mb-4'
                        >
                            <AddColorToProduct
                                colors={colors}
                                category={sizeTypeSelected}
                                confirmCard={(variation) => {
                                    confirmCard(variation)
                                }}
                                deleteCard={() => {
                                    if (productVariations.length < 1) return
                                    setNewCard(false)
                                }}
                            />
                        </div>
                    )
                }
                <div
                    className='text-center'
                >
                    <Button
                        mt={4}
                        mr={[0, 10]}
                        bgColor={'gray.900'}
                        color={'white'}
                        _hover={{
                            background: 'black'
                        }}
                        _active={{
                            background: 'gray.800'
                        }}
                        onClick={() => {
                            console.log(cardToEdit);
                            console.log(productVariations);
                        }}
                        disabled={false}
                        px={12}
                        py={7}
                        rounded={'lg'}
                    >
                        Crea Prodotto
                    </Button>
                </div>


            </div>


        </Desktop_Layout>
    )
}

export default index