import { CheckIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, CircularProgress, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
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
import { Sizes, SIZES } from '../mook/sizes';
import { ToastOpen } from '../utils/Toast';
import Drawer_Add_Image from './Drawer_Add_Image';
import Modal_Error_Shop from './Modal_Error_Shop';




const Product_Form: React.FC<{ handleSubmitEvent: any, defaultValues: any, type?: string, disabled: boolean, titleText: string, confirmButtonText: string, toParentPhoto?: any, loading?: boolean, backbutton?: boolean }> = ({ handleSubmitEvent, defaultValues, type, disabled, titleText, confirmButtonText, toParentPhoto, loading, backbutton }) => {
    //*UseForm
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, setValue, control, formState } = useForm<any>({
        mode: "all",
        defaultValues: defaultValues
    });
    const router = useRouter()
    //* create product form
    const [microcategorySelected, setMicrocategorySelected] = useState<Microcategory>();
    const [sizesSelected, setSizesSelected] = useState<string[]>();

    //openDraw
    const [openDrawNumber, setOpenDrawNumber] = useState<number>(1)
    const brands = useRef<string[]>(BRANDS)
    const colors = useRef<Color[]>(COLORS)
    const microcategories = useRef<Microcategory[]>(MICROCATEGORY)
    const categories = useRef<Categories>(CATEGORIES)
    const sizes = useRef<Sizes>(SIZES)

    useEffect(() => {
        if (type === 'edit') {
            console.log(watch('sizes'));
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
            console.log(watch('sizes'));

            const product_macrocategory = watch('macrocategory')

            if (!product_macrocategory) {
                setMicrocategorySelected(undefined);
                setSizesSelected(undefined);
                return
            }
            if (product_macrocategory.sizes.split('_')[0] === 'man') {
                setValue('gender', 'M');
            } else if (product_macrocategory.sizes.split('_')[0] === 'woman') {
                setValue('gender', 'F');
            }
            setMicrocategorySelected(watch('macrocategory').types)

            handleSizeType(watch('macrocategory').sizes)
        }

    }, [watch('macrocategory')])

    const handleSizeType = (sizetype: string) => {
        const index = Object.keys(sizes.current).indexOf(sizetype)
        setSizesSelected((Object.values(sizes.current)[index]))
        // if(type !== 'edit'){
        //     setValue('sizes', []);
        // }
    }

    const onChangePrice = (e: any) => {
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

    const submitData = (e: any) => {
        if (loading) return
        handleSubmitEvent(e)
    }

    return (
        <>
            <div className='w-full md:w-1/2  mb-96'>
                <form className="p-3 px-4 lg:px-16 xl:px-24 w-full" onSubmit={handleSubmit(submitData)}>
                    <div className='w-full'>
                        <h1 className='italic text-lg lg:text-xl font-extrabold mb-4'>{titleText}</h1>
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
                                    onWheel={(e: any) => e.target.blur()}
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
                                        handleChangeValues={(brand: any) => {
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
                                        typeOperation={type}
                                        selectedValueBefore={watch('colors')}
                                        handleChangeState={(colors: any) => {
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
                                        handleClick={(macrocategory: any) => {
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
                                        handleClick={(microCategory: any) => {
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
                                        typeOperation={type}
                                        selectedValueBefore={watch('sizes')}
                                        handleChangeState={(sizes: any) => {
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
                        <div className={`flex ${!backbutton ? 'justify-end' : 'justify-between'} mt-3`}>
                            {backbutton && <Button
                                onClick={() => { 
                                    router.back()
                                }}
                                borderRadius={5}
                                width={'fit-content'}
                                height={12}
                                size={'sm'}
                                variant='outline'
                                colorScheme={'blackAlpha'}
                                color={'blackAlpha.900'}
                                disabled={false} >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                            </Button>}
                            <BlackButton
                                typeButton={'submit'}
                                element={!loading ? confirmButtonText :
                                    <CircularProgress
                                        size='25px'
                                        isIndeterminate color='black'
                                    />
                                }
                                borderRadius={10}
                                size={'sm'}
                                width={200}
                                heigth={12}
                                //disabled={false}
                                disabled={type === 'edit' ? false : (!isDirty || !isValid || !watch('brand') || !watch('colors') || !watch('colors')[0] || !watch('macrocategory') || !watch('microcategory') || !watch('sizes') || !watch('sizes')[0] || !watch('photos')[1])}
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

                        if (toParentPhoto) {
                            toParentPhoto(images)
                        }
                        setValue('photos', images);
                    }} />
                )}
            />

        </>
    )
}

export default Product_Form