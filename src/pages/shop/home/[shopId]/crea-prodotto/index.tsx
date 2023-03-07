import { Box, Button, ButtonGroup, IconButton, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import { Color, COLORS } from '../../../../../../components/mook/colors'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { onChangeNumberPrice } from '../../../../../../components/utils/onChangePrice'
import { Variation } from '../../../../../interfaces/product.interface'
import { VariationCard } from '../../../../../interfaces/variationCard.interface'

interface IFormInput {
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

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInput>({
        mode: "all",
        //defaultValues
    });

    const [microcategoriesSelected, setMicrocategoriesSelected] = useState<string[]>([])
    const [sizeTypeSelected, setSizeTypeSelected] = useState('')
    const [newCard, setNewCard] = useState(true)
    const [productVariations, setProductVariations] = useState<any[]>([])
    const [colors, setColors] = useState<Color[]>(COLORS)

    const deleteVariation = (index: number) => {
        if (productVariations.length < 1) return
        console.log(index);
    }

    const confirmCard = (variation: VariationCard) => {
        console.log(variation);
        console.log(index);
        console.log(productVariations);
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



    return (
        <Desktop_Layout>
            <NoIndexSeo title='Crea prodotto | Veplo' />
            <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>
                <h1 className='italic text-xl lg:text-4xl font-extrabold mb-6'>
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
                                selectedValueBefore={''}
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
                                selectedValueBefore={''}
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

                {productVariations.length > 0 && productVariations.map((variation: any, index) => {
                    console.log(variation);
                    return (
                        <Box
                            key={index}
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
                                    {variation.color}
                                </h5>
                                <h5 className=' text-sm lg:text-md font-bold text-right my-auto'>
                                    Taglie
                                </h5>
                            </div>
                            <div className='flex justify-between mt-2'>

                                <div className='flex gap-2'>
                                    {variation.images.length > 0 && variation.images.map((image: any) => {
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
                                        variation.sizes.length > 0 && variation.sizes.map((size: any) => {
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
                                {/* <IconButton
                                    aria-label=''
                                    colorScheme={'blue'}
                                    variant={'ghost'}
                                    //onClick={() => setIsCardConfirmed(false)}
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    }
                                /> */}
                                <IconButton aria-label='Search database'
                                    colorScheme={'red'}
                                    variant={'ghost'}
                                    onClick={() => {
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

                })}



                {!newCard ? (<Button
                    size={['sm', 'md']}
                    colorScheme={'gray'}
                    ml={8}
                    leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                    variant='ghost'
                    mb={3}
                    mt={-2}
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
                            />
                        </div>
                    )
                }
            </div>
        </Desktop_Layout>
    )
}

export default index