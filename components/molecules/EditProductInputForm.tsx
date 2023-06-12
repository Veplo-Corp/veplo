import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon, Text, Textarea } from '@chakra-ui/react';
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
import SelectMultipleOptions from '../atoms/SelectMultipleOptions';
import { MATERIALS } from '../mook/productParameters/materials';
import { FIT } from '../mook/productParameters/fit';
import { TRAITS } from '../mook/productParameters/traits';
import { LENGTH } from '../mook/productParameters/length';



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
        'oversize',
        'baggy'
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
                        {...register("name", {
                            required: true,
                            pattern: /^[A-Za-z0-9 ]+$/
                        })}
                        isInvalid={false}
                    />
                </InputGroup>
            </Div_input_creation>
            {errors.name && <Text
                pl={2}
                mt={0}
                fontSize={'sm'}
                fontWeight={'medium'}
                role="alert">I caratteri speciali non sono accettati</Text>}
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
                                console.log(Number(v2));
                                if (Number(watch('price.v2')) > 0) {
                                    const discountPercentage = Number((100 - Number(v2) / v1 * 100).toFixed(2));
                                    setValue('price.discountPercentage', discountPercentage);
                                }

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
            <Div_input_creation text='Descrizione (opzionale)'>
                <InputGroup >
                    <Textarea
                        maxLength={200}
                        rounded={10}
                        paddingY={6}
                        paddingTop={2}
                        autoComplete="descrition-text-shop"
                        // value={shop_name}
                        {...register("description", { required: true })}
                        // onChange={(event) => changeInput(event, 'shop_name')}
                        isInvalid={false}
                    />
                </InputGroup>
            </Div_input_creation>
            <Div_input_creation text='Materiali (opzionale, massimo 2)'>
                <Controller
                    control={control}
                    name="materials"
                    rules={{ required: false }}
                    render={() => (
                        <SelectMultipleOptions
                            defaultValue={watch('materials')}
                            limitNumber={2}
                            handleValue={(value) => {
                                setValue('materials', value);
                            }}
                            values={MATERIALS.sort()}
                        />
                    )}
                />
            </Div_input_creation>
            {
                watch('macrocategory') && watch('macrocategory').toLocaleLowerCase() !== 'scarpe' && <>
                    <Div_input_creation text='Lunghezza (opzionale)'>
                        <Controller
                            control={control}
                            name="length"
                            rules={{ required: false }}
                            render={() => (
                                <SelectStringOption
                                    values={LENGTH}
                                    defaultValue={watch('length')}
                                    handleClick={(microcategory: string) => {
                                        setValue('length', microcategory);
                                    }}
                                />
                            )}
                        />
                    </Div_input_creation>
                    <Div_input_creation text='Vestibilità prodotto'>
                        <Controller
                            control={control}
                            name="fit"
                            rules={{ required: false }}
                            render={() => (
                                <SelectStringOption
                                    values={FIT}
                                    defaultValue={defaultValues.fit}
                                    handleClick={(vestibilità: string) => {
                                        setValue('fit', vestibilità);
                                    }}
                                />
                            )}
                        />
                    </Div_input_creation>
                </>
            }
            <Div_input_creation text='Tipologia (opzionale, massimo 2)'>
                <Controller
                    control={control}
                    name="traits"
                    rules={{ required: false }}
                    render={() => (
                        <SelectMultipleOptions
                            defaultValue={watch('traits')}
                            limitNumber={2}
                            handleValue={(value) => {


                                setValue('traits', value);
                            }}
                            values={TRAITS}
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
                variant={'black'}
                _disabled={{
                    bg: '#000000'
                }}
                _hover={{
                    color: 'primary.text'
                }}
                isDisabled={!isValid}
            >Modifica informazioni</Button>
        </form>


    )
}

export default EditProductInputForm