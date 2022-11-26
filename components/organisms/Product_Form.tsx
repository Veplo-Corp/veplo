import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { IFormInput } from '../../src/pages/shop/crea-prodotto';
import Autocomplete from '../atoms/Autocomplete_Headless';
import BlackButton from '../atoms/BlackButton';
import Div_input_creation from '../atoms/Div_input_creation';
import Select_multiple_options from '../atoms/Select_multiple_options';
import Select_options from '../atoms/Select_options';
import { BRANDS } from '../mook/brands';
import { Categories, CATEGORIES } from '../mook/categories';
import { Color, COLORS } from '../mook/colors';
import { Macrocategory, MACROCATEGORY } from '../mook/macrocategories';
import { Microcategory, MICROCATEGORY } from '../mook/microcategories';
import { man_bottom_clothes_sizes, man_top_clothes_sizes, woman_clothes_sizes } from '../mook/sizes';
import { ToastOpen } from '../utils/Toast';
import Drawer_Add_Image from './Drawer_Add_Image';
import Modal_Error_Shop from './Modal_Error_Shop';




const Product_Form: React.FC<{ handleSubmitEvent: any, defaultValues: any, type?: string, disabled: boolean }> = ({ handleSubmitEvent, defaultValues, type, disabled }) => {
    //*UseForm
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<any>({
        mode: "all",
        defaultValues: defaultValues
    });






    //* create product form
    const [microcategorySelected, setMicrocategorySelected] = useState<Microcategory>();
    const [sizesSelected, setSizesSelected] = useState<string[]>();

    //openDraw
    const [openDrawNumber, setOpenDrawNumber] = useState()
    const brands = useRef<string[]>(BRANDS)
    const colors = useRef<Color[]>(COLORS)
    const microcategories = useRef<Microcategory[]>(MICROCATEGORY)
    const categories = useRef<Categories>(CATEGORIES)
    const ARRAY_woman_clothes_sizes = useRef<string[]>(woman_clothes_sizes)
    const ARRAY_man_top_clothes_sizes = useRef<string[]>(man_top_clothes_sizes)
    const ARRAY_man_bottom_clothes_sizes = useRef<string[]>(man_bottom_clothes_sizes)



    useEffect(() => {
        if (type === 'edit') {
            if (watch('gender') === 'F') {
                const sizetype = categories.current.donna.abbigliamento.filter(category => category.name === watch('macrocategory'))[0].sizes;
                console.log(sizetype);
                handleSizeType(sizetype)
            } else if (watch('gender') === 'M') {
                const sizetype = categories.current.uomo.abbigliamento.filter(category => category.name === watch('macrocategory'))[0].sizes;
                console.log(sizetype);
                handleSizeType(sizetype)
            }
        }


        if (type !== 'edit') {


            const product_macrocategory = watch('macrocategory')

            if (!product_macrocategory) {

                setMicrocategorySelected(undefined);
                setSizesSelected(undefined)
                return
            }

            if (product_macrocategory.sizes.split('_')[0] === 'man') {
                console.log('eccolo cazzo');
                setValue('gender', 'M');
            } else if (product_macrocategory.sizes.split('_')[0] === 'woman') {
                setValue('gender', 'F');
            }
            setMicrocategorySelected(watch('macrocategory').types)

            //* da migliorare logica
            handleSizeType(watch('macrocategory').sizes)
        }


    }, [watch('macrocategory')])

    const handleSizeType = (sizetype: string) => {
        //* da migliorare logica
        if (sizetype === 'woman_clothes_sizes') {
            setSizesSelected(ARRAY_woman_clothes_sizes.current)
        }
        else if (sizetype === 'man_top_clothes_sizes') {
            setSizesSelected(ARRAY_man_top_clothes_sizes.current)

        }
        else if (sizetype === 'man_bottom_clothes_sizes') {
            setSizesSelected(ARRAY_man_bottom_clothes_sizes.current)
        }
    }

    const onChangePrice = (e) => {
        let inputValue: string = e.target.value.replace(',', '.');
        inputValue = inputValue.replace(/[^0-9\.|]/g, '')
        if (inputValue === '.') {
            return setValue('price', '');
        }
        if (inputValue.split('.')[1]) {
            if (inputValue.split('.')[1].length > 2) {
                const value = Number(Number(inputValue)).toFixed(1)
                const lastChart = Number(inputValue.charAt(inputValue.length - 1))
                inputValue = (value + lastChart).toString();
                inputValue = inputValue.replace('.', ',')
                return setValue('price', inputValue);
            }
        }
        inputValue = inputValue.replace('.', ',')
        inputValue = inputValue.replace('.', '')
        return setValue('price', inputValue);

    }

    const submitData = (e) => {
        handleSubmitEvent(e)
    }

    return (
        <>
            <div className='flex justify-between w-full mb-96'>
                <form className="p-3 px-4 lg:px-16 xl:px-24 w-full md:w-6/12 xl:w-5/12" onSubmit={handleSubmit(submitData)}>
                    <div className='w-full'>
                        <h1 className='italic text-lg lg:text-xl font-extrabold mb-4'>Aggiungi un capo di abbigliamento</h1>
                        <Div_input_creation text='Nome del prodotto'>
                            <InputGroup >
                                <Input
                                    autoComplete='off'
                                    maxLength={35}
                                    rounded={10}
                                    paddingY={6}
                                    type="text"
                                    {...register("name", { required: true, maxLength: 30 })}
                                    isInvalid={false}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Prezzo'>
                            <InputGroup >
                                <InputLeftAddon rounded={10} paddingY={6} children='€' paddingInline={6} />
                                <Input
                                    rounded={10}
                                    paddingY={6}
                                    autoComplete='off'
                                    type="string"
                                    {...register("price", {
                                        required: true,
                                    })}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder={'34,99'}
                                    textAlign={"end"}
                                    isInvalid={false}
                                    onChange={onChangePrice}
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
                                    <Autocomplete values={brands.current}
                                        selectedValue={watch('brand')}
                                        handleChangeValues={(brand) => {
                                            setValue('brand', brand);
                                        }} />
                                )}
                            />

                        </Div_input_creation>
                        <Div_input_creation text='Colori disponibili'>
                            <Controller
                                control={control}
                                name="colors"
                                rules={{ required: false }}
                                render={() => (
                                    <Select_multiple_options values={colors.current} type={'color'}
                                        selectedValueBefore={watch('colors')}
                                        handleChangeState={(colors) => {
                                            setValue('colors', colors);
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
                                    <Select_options values={categories.current} type={'macrocategory'}
                                        disabled={disabled}
                                        selectedValueBefore={watch('macrocategory')}
                                        handleClick={(macrocategory) => {
                                            setValue('macrocategory', macrocategory);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Microcategoria collegata'>
                            <Controller
                                control={control}

                                name="macrocategory"
                                rules={{ required: false }}
                                render={() => (
                                    <Select_options
                                        values={microcategorySelected}
                                        disabled={disabled}
                                        selectedValueBefore={watch('microcategory')}
                                        type={'microcategory'}
                                        handleClick={(microCategory) => {
                                            console.log(microCategory);

                                            setValue('microcategory', microCategory);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>

                        <Div_input_creation text='Taglie disponibili'>
                            <Controller
                                control={control}
                                name="sizes"
                                rules={{ required: false }}
                                render={() => (
                                    <Select_multiple_options values={sizesSelected} type={'size'}
                                        selectedValueBefore={watch('sizes')}
                                        handleChangeState={(sizes) => {
                                            setValue('sizes', sizes);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Carica immagini'>
                            <Box
                                rounded={10}
                                padding={3.5}
                                mt={1}
                                // backgroundColor={`${watch('photos')} && ${watch('photos').length < 2 ? 'white' : 'gray.200'}`}
                                borderWidth={1}
                                borderColor={'gray.200'}
                                lineHeight='tight'
                                noOfLines={1}
                                fontSize='sm'
                                className='cursor-pointer'
                                onClick={() => {
                                    setOpenDrawNumber(Math.random())
                                }}
                            >
                                <div
                                    className={`w-full flex justify-between ${watch('photos').length < 2 ? 'text-gray-500' : 'text-gray-900'}  `}
                                >
                                    <span>
                                        {watch('photos').length < 2 ? 'carica immagini del prodotto' : 'immagini caricate correttamente'}
                                    </span>
                                    {watch('photos').length < 2 ?
                                        (<DownloadIcon
                                            className="h-5 w-5 text-gray-400 my-auto"
                                            aria-hidden="true"
                                        />) : (
                                            <CheckIcon
                                                className="h-5 w-5 text-gray-400 my-auto"
                                                aria-hidden="true"
                                            />
                                        )
                                    }
                                </div>
                            </Box>
                        </Div_input_creation>
                        <div className='flex justify-end mt-3'>
                            <BlackButton
                                typeButton='submit'
                                element='aggiungi'
                                borderRadius={10}
                                size={'sm'}
                                width={200}
                                heigth={12}
                                disabled={false}
                            //disabled={!isDirty || !isValid || !watch('brand') || !watch('colors') || !watch('colors')[0] || !watch('macrocategory') || !watch('microcategory') || !watch('sizes') || !watch('sizes')[0] || !watch('photos')[1]}
                            />
                        </div>

                    </div>
                </form>
            </div>
            <Controller
                control={control}
                name="photos"
                rules={{ required: false }}
                render={() => (
                    <Drawer_Add_Image openDraw={openDrawNumber} imagesUploadedBefore={watch('photos')} confirmPhotos={(images: string[]) => {
                        console.log(images);
                        
                        setValue('photos', images);
                    }} />
                )}
            />

        </>
    )
}

export default Product_Form