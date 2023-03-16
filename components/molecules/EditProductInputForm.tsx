import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react';
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



interface Macrocategory {
    name: string,
    sizes: string,
    types: string[],
    url: string
}

const EditProductInputForm: FC<{ defaultValues: IFormInputProductEdit, handleConfirm: (product: IFormInputProductEdit) => void }> = ({ defaultValues, handleConfirm }) => {

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInputProductEdit>({
        mode: "all",
        defaultValues
    });
    const vestibilità = [
        'skinny',
        'slim',
        'regular',
        'baggy',
        'oversize'
    ]


    const onSubmit = (value: IFormInputProductEdit) => {
        handleConfirm(value)
    }



    return (
        <form onSubmit={handleSubmit(onSubmit)}>

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
                            required: false,
                        })}
                        onWheel={(e: any) => e.target.blur()}
                        placeholder={'34,99'}
                        textAlign={"end"}
                        isInvalid={false}
                        onChange={(e) => {
                            const inputValue = onChangeNumberPrice(e)
                            setValue('price.v1', inputValue);
                            let v1 = Number(onChangeNumberPrice(e).replace(',', '.'))
                            let v2 = watch('price.v2');
                            console.log(Number(watch('price.v2')))

                            if (typeof v2 === 'string') {
                                v2 = Number(v2.replace(',', '.'))
                            }
                            if (v1 > Number(watch('price.v2'))) {
                                const discountPercentage = Number((100 - Number(v2) / v1 * 100).toFixed(2));
                                setValue('price.discountPercentage', discountPercentage);
                            } else {

                                setValue('price.v2', v1);
                                setValue('price.discountPercentage', 0);
                            }


                        }}
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Prezzo scontato'>
                <InputGroup
                    gap={10}
                >
                    <InputGroup>
                        <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />

                        <Input
                            rounded={10}
                            paddingY={6}
                            autoComplete='off'
                            type="string"
                            {...register("price.v2", {
                                required: false,
                            })}
                            onWheel={(e: any) => e.target.blur()}
                            placeholder={'34,99'}
                            textAlign={"end"}
                            isInvalid={false}
                            onChange={(e) => {
                                const inputValue = onChangeNumberPrice(e)

                                setValue('price.v2', inputValue);
                                let v2 = Number(onChangeNumberPrice(e).replace(',', '.'))
                                let v1 = watch('price.v1');
                                if (typeof v1 === 'string') {
                                    v1 = Number(v1.replace(',', '.'))
                                }
                                if (v2 > v1) {
                                    setValue('price.v2', v1);
                                    setValue('price.discountPercentage', 0);
                                } else {
                                    const discountPercentage = Number((100 - v2 / Number(v1) * 100).toFixed(2));
                                    setValue('price.discountPercentage', discountPercentage);
                                }
                            }}
                        /></InputGroup>

                    <InputGroup

                    >
                        <Input
                            rounded={10}
                            paddingY={6}
                            autoComplete='off'
                            type="string"

                            {...register("price.discountPercentage", {
                                required: false,
                            })}

                            placeholder={'percentuale sconto'}
                            textAlign={"end"}
                            isInvalid={false}
                            disabled={true}
                            _disabled={{
                                background: 'gray.50'
                            }}

                        />
                        <InputRightAddon
                            rounded={10}
                            paddingY={6}
                            children='%' />
                    </InputGroup>

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
            <Button
                mt={5}
                type={'submit'}
                borderRadius={'md'}
                size={'xl'}
                padding={5}
                paddingInline={10}
                width={'full'}
                height={'fit-content'}
                bg={'black.900'}
                color={'white'}
                _hover={{ bg: 'black.900' }}
                _focus={{
                    bg: 'black.900'
                }}
                _active={{
                    transform: 'scale(0.98)',
                }}
            >Modifica informazioni</Button>
        </form>


    )
}

export default EditProductInputForm