import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { onChangeNumberPrice } from '../../../../../../components/utils/onChangePrice'

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
                <h1 className='text-lg md:text-2xl font-extrabold mt-4 mb-6'>
                    Varianti colore
                </h1>
            </div>

            <div className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 m-auto'>
                <AddColorToProduct
                    category={sizeTypeSelected}
                />

            </div>
        </Desktop_Layout>
    )
}

export default index