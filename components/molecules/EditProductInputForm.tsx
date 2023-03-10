import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import React, { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Variation } from '../../src/interfaces/product.interface';
import { IFormInputProductEdit } from '../../src/pages/shop/home/[shopId]/gestisci-prodotto/[productId]';
import Autocomplete from '../atoms/Autocomplete_Headless';
import Div_input_creation from '../atoms/Div_input_creation';
import SelectMacrocategory from '../atoms/SelectMacrocategory';
import SelectStringOption from '../atoms/SelectStringOption';
import { onChangeNumberPrice } from '../utils/onChangePrice';
import ProductVariationCard from './ProductVariationCard';

const vestibilità = [
    'skinny',
    'slim fit',
    'regular',
    'baggy'
]

interface Macrocategory {
    name: string,
    sizes: string,
    types: string[],
    url: string
}

const EditProductInputForm: FC<{ defaultValues: IFormInputProductEdit, variations: Variation[] }> = ({ defaultValues, variations }) => {
    console.log(variations);

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInputProductEdit>({
        mode: "all",
        defaultValues
    });


    const [sizeTypeSelected, setSizeTypeSelected] = useState('')
    const [productVariations, setProductVariations] = useState<any[]>(variations)


    return (
        <>
            <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>

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
                            {...register("price.v1", {
                                required: true,
                            })}
                            onWheel={(e: any) => e.target.blur()}
                            placeholder={'34,99'}
                            textAlign={"end"}
                            isInvalid={false}
                            onChange={(e) => {
                                const inputValue = onChangeNumberPrice(e)
                                return setValue('price.v1', inputValue);
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
                    <InputGroup >
                        <Input
                            autoComplete='off'
                            maxLength={30}
                            rounded={10}
                            paddingY={6}
                            disabled={true}
                            _disabled={{
                                background: 'gray.200'
                            }}
                            type="text"
                            {...register("macrocategory", { required: true })}
                            isInvalid={false}
                        />
                    </InputGroup>
                </Div_input_creation>
                <Div_input_creation text='Microcategoria'>
                    <InputGroup >
                        <Input
                            autoComplete='off'
                            maxLength={30}
                            rounded={10}
                            paddingY={6}
                            disabled={true}
                            _disabled={{
                                background: 'gray.200'
                            }}
                            type="text"
                            {...register("microcategory", { required: true })}
                            isInvalid={false}
                        />
                    </InputGroup>
                </Div_input_creation>
                <Div_input_creation text='Vestibilità prodotto'>
                    <Controller
                        control={control}
                        name="vestibilità"
                        rules={{ required: false }}
                        render={() => (
                            <SelectStringOption
                                values={vestibilità}
                                defaultValue={defaultValues.vestibilità}
                                handleClick={(vestibilità: string) => {
                                    setValue('vestibilità', vestibilità);
                                }}
                            />
                        )}
                    />
                </Div_input_creation>
            </div>
            <div className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 m-auto mt-6'>

                {productVariations.length > 0 && productVariations.map((variation: any, index) => {

                    console.log(variation);
                    return (
                        <div key={index} >
                            <ProductVariationCard
                                index={index}
                                variation={variation}
                                editCard={() => { }}
                                deleteCard={() => { }}
                            />
                        </div>
                    )
                })}
            </div>
        </>


    )
}

export default EditProductInputForm