import { Button, Input, InputGroup, InputLeftAddon, InputRightAddon, Text, Textarea } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Variation } from '../../src/interfaces/product.interface';
import { IFormInputProductEdit } from '../../src/pages/shop/home/[shopId]/gestisci-prodotto/[productId]';
import Autocomplete from '../atoms/Autocomplete_Headless';
import Div_input_creation from '../atoms/Div_input_creation';
import SelectMacrocategory from '../atoms/SelectMacrocategory';
import SelectStringOption from '../atoms/SelectStringOption';
import { onChangeNumberPrice } from '../utils/onChangePrice';
import SelectMultipleOptions from '../atoms/SelectMultipleOptions';
import { MATERIALS, MATERIALS_TYPES } from '../mook/productParameters/materials';
import { FIT_TYPES } from '../mook/productParameters/fit';
import { TRAITS_TYPES } from '../mook/productParameters/traits';
import { LENGTH_TYPES } from '../mook/productParameters/length';
import { CATEGORIES, Category } from '../mook/categories';



interface Macrocategory {
    name: string,
    sizes: string,
    types: string[],
    url: string
}

const EditProductInputForm: FC<{ univers: string, defaultValues: IFormInputProductEdit, handleConfirm: (product: IFormInputProductEdit) => void, gender: 'f' | 'm' | 'u' }> = ({ univers, defaultValues, handleConfirm, gender }) => {
    const [macrocategorySelectedSpec, setMacrocategorySelectedSpec] = useState<Category>()

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<IFormInputProductEdit>({
        mode: "all",
        defaultValues
    });





    const onSubmit = (value: IFormInputProductEdit) => {
        handleConfirm(value)
    }

    useEffect(() => {
        if (!defaultValues || !gender) return
        const genderSelected = gender === 'f' ? 'donna' : 'uomo'
        const productUnivers = univers === 'accessori' ? 'accessori' : 'abbigliamento'
        const categoryInformation: Category | undefined = CATEGORIES[genderSelected][productUnivers].find(category => category.name.toLowerCase() === defaultValues.macrocategory.toLowerCase())
        if (!categoryInformation) return
        setMacrocategorySelectedSpec(categoryInformation)

    }, [defaultValues])




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
                            pattern: /^[A-Za-zÀ-ÿ0-9 -]+$/
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
                            console.log(typeof v2);

                            if (typeof v2 === 'string') {
                                return v2 = Number(v2.replace(',', '.'))
                            }
                            else {
                                setValue('price.v2', v1);
                                return setValue('price.discountPercentage', 0);
                            }
                            // if (v1 >= Number(watch('price.v2'))) {

                            //     if (Number(watch('price.v2')) > 0) {
                            //         const discountPercentage = Number((100 - Number(v2) / v1 * 100).toFixed(2));
                            //         return setValue('price.discountPercentage', discountPercentage);
                            //     }
                            //     else {
                            //         setValue('price.v2', v1);
                            //         return setValue('price.discountPercentage', 0);
                            //     }
                            // } else {
                            //     console.log('passa qui');

                            //     setValue('price.v2', v1);
                            //     return setValue('price.discountPercentage', 0);
                            // }


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

                    <InputGroup>
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
            <Div_input_creation text='Genere'>
                <Controller
                    control={control}
                    name="gender"
                    rules={{ required: false }}
                    defaultValue={watch('gender')}
                    render={({ field }) => (
                        <SelectStringOption
                            values={['donna', 'uomo', 'unisex']}
                            defaultValue={field.value}
                            handleClick={(gender: 'donna' | 'uomo' | 'unisex') => {
                                setValue('gender', gender);
                            }}
                        />
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
                <InputGroup>
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
                        height={32}
                        maxLength={450}
                        rounded={10}
                        paddingY={6}
                        paddingX={2}
                        paddingTop={2}
                        autoComplete="descrition-text-product"
                        // value={shop_name}
                        {...register("description", { required: false })}
                        // onChange={(event) => changeInput(event, 'shop_name')}
                        isInvalid={false}
                    />
                </InputGroup>
            </Div_input_creation>

            <Div_input_creation text='Descrizione modello (opzionale)'>
                <InputGroup >
                    <Textarea
                        height={32}
                        maxLength={100}
                        rounded={10}
                        paddingY={6}
                        paddingX={2}
                        paddingTop={2}
                        placeholder='es. Il modell* nella foto è alt* 175 cm e veste una taglia M'

                        autoComplete="descrition-text-product"
                        // value={shop_name}
                        {...register("modelDescription", { required: false })}
                        // onChange={(event) => changeInput(event, 'shop_name')}
                        isInvalid={false}
                    />


                </InputGroup>
            </Div_input_creation>
            {macrocategorySelectedSpec?.materials
                && <Div_input_creation text='Materiali (opzionale, massimo 2)'>

                    <Controller
                        control={control}
                        name="materials"
                        rules={{ required: false }}
                        render={({ field }) => (
                            <SelectMultipleOptions
                                limitNumber={2}
                                handleValue={(value) => {
                                    setValue('materials', value);
                                }}
                                defaultValue={field.value}
                                values={MATERIALS_TYPES.find(materialType => materialType.name === macrocategorySelectedSpec.materials)?.type}
                            />
                        )}
                    />
                </Div_input_creation>}

            {macrocategorySelectedSpec?.length && <Div_input_creation text='Lunghezza (opzionale)'>

                <Controller
                    control={control}
                    name="length"
                    rules={{ required: false }}
                    render={({ field }) => (
                        <SelectStringOption
                            values={LENGTH_TYPES.find(
                                (materialType) => materialType.name === macrocategorySelectedSpec.length
                            )?.type}
                            defaultValue={field.value}
                            handleClick={(value: string) => {
                                setValue('length', value);
                            }}
                        />
                    )}
                />
            </Div_input_creation>}
            {macrocategorySelectedSpec?.fit && <Div_input_creation text='Vestibilità prodotto (opzionale)'>

                <Controller
                    control={control}
                    name="fit"
                    rules={{ required: false }}
                    render={({ field }) => (
                        <SelectStringOption
                            values={FIT_TYPES.find(materialType => materialType.name === macrocategorySelectedSpec.fit)?.type}

                            defaultValue={field.value}
                            handleClick={(value: string) => {
                                setValue('fit', value);
                            }}
                        />
                    )}
                />
            </Div_input_creation>}
            {macrocategorySelectedSpec?.traits && <Div_input_creation text='Tipologia (opzionale, massimo 2)'>

                <Controller
                    control={control}
                    name="traits"
                    rules={{ required: false }}
                    render={({ field }) => (
                        <SelectMultipleOptions
                            limitNumber={2}
                            handleValue={(value) => {
                                setValue('traits', value);
                            }}
                            defaultValue={field.value}
                            values={TRAITS_TYPES.find(materialType => materialType.name === macrocategorySelectedSpec.traits)?.type}
                        />
                    )}
                />
            </Div_input_creation>}

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