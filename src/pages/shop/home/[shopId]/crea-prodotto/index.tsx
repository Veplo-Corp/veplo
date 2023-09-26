import { useMutation } from '@apollo/client'
import { Box, Button, Input, InputGroup, InputLeftAddon, Select, Spinner, Text, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import ProductVariationCard from '../../../../../../components/molecules/ProductVariationCard'
import { Category, Univers } from '../../../../../../components/mook/categories'
import { Color, COLORS } from '../../../../../../components/mook/colors'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { onChangeNumberPrice } from '../../../../../../components/utils/onChangePrice'
import { ToastOpen } from '../../../../../../components/utils/Toast'
import { Variation } from '../../../../../interfaces/product.interface'
import { VariationCard } from '../../../../../interfaces/variationCard.interface'
import CREATE_PRODUCT from '../../../../../lib/apollo/mutations/createProduct'
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop'
import SelectMultipleOptions from '../../../../../../components/atoms/SelectMultipleOptions'
import { MATERIALS_TYPES } from '../../../../../../components/mook/productParameters/materials'
import { FIT_TYPES } from '../../../../../../components/mook/productParameters/fit'
import { LENGTH_TYPES } from '../../../../../../components/mook/productParameters/length'
import { TRAITS_TYPES } from '../../../../../../components/mook/productParameters/traits'
import { uploadImage } from '../../../../../lib/upload/uploadImage'
import { UploadEventType } from '../../../../../lib/upload/UploadEventTypes'
import expirationTimeTokenControll from '../../../../../../components/utils/expirationTimeTokenControll'
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface'
import { useSelector } from 'react-redux'
import { Size } from '../../../../../../components/organisms/EditColorToProdoct'
import SizeGuidesComponent from '../../../../../../components/organisms/SizeGuidesComponent'

export interface IFormInputProduct {
    univers: Univers,
    name: string;
    price: string;
    brand: string;
    macrocategory: string;
    microcategory: string;
    traits?: string[];
    materials: string[];
    fit?: string;
    length?: string;
    description?: string;
    modelDescription?: string;
    gender: 'donna' | 'uomo' | 'unisex' | 'f' | 'm' | 'u'
}

export interface Macrocategory extends Category {
    gender: string,
}








const index = () => {

    const { addToast } = ToastOpen();
    const { register, handleSubmit, reset, resetField, watch, formState: { errors, isValid, isSubmitting, isDirty }, getValues, setValue, control, formState } = useForm<IFormInputProduct>({
        mode: "all",
        defaultValues: {
            univers: 'abbigliamento'
        }
    });
    const router = useRouter();
    const [macrocategorySelectedSpec, setMacrocategorySelectedSpec] = useState<Macrocategory>()
    const [newCard, setNewCard] = useState(true)
    const [productVariations, setProductVariations] = useState<VariationCard[]>([])
    const [colors, setColors] = useState<Color[]>(COLORS)
    const [isLoading, setIsLoading] = useState(false);
    const [sizeGuidePhotoUrl, setsizeGuidePhotoUrl] = useState<string | undefined>()
    const [createProduct] = useMutation(CREATE_PRODUCT, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_PRODUCTS_FROM_SHOP,
            variables: {
                id: router.query.shopId, //* mettere idShop,
                limit: 100, offset: 0,
                sort: {
                    ascending: false,
                    for: "createdAt"
                },
                filters: {

                }
            },
        }],

    });
    const user: Firebase_User = useSelector((state: any) => state.user.user);




    const confirmCard = (variation: VariationCard, isEdit?: boolean) => {
        if (isEdit) {
            setProductVariations((prevstate: VariationCard[]) => {
                let newVariation = [...prevstate]
                const index = prevstate.findIndex((state: VariationCard) => state.color === variation?.color)
                newVariation[index] = variation

                return [
                    ...newVariation
                ]
            })
            return
        }
        setProductVariations((prevstate: any[]) => {
            return [
                ...prevstate,
                variation
            ]
        })
        setColors((prevState: Color[]) => {
            const newColors = prevState.filter(color => color.name !== variation?.color)
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
            const newColors = prevState.filter(color => color.name !== variation?.color)
            return [
                ...newColors
            ]
        })
        // setCardToEdit((prevstate: VariationCard[]) => {
        //     let newVariation = [...prevstate]
        //     newVariation = newVariation.filter(element => element.color !== variation?.color)
        //     console.log(newVariation);

        //     return [
        //         ...newVariation

        // })
        // setNewCard(false)
    }








    const deleteVariationCard = useCallback((variation: Variation) => {
        setProductVariations((prevstate: any) => {
            const newState = prevstate.filter((state: Variation) => state.color !== variation?.color)
            return [
                ...newState
            ]
        })
        setColors((prevState: any) => {
            const newColor = COLORS.find(color => color.name === variation?.color)
            if (!newColor) return [...prevState]

            let newColors = [
                newColor,
                ...prevState,
            ]

            return [...newColors]
        })
    }, [])



    const createProductHandler = async () => {

        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        const v1 = Math.floor(Number(watch('price').replace(',', '.')) * 100)

        if (!v1 || v1 <= 0) return
        const values = getValues();

        setIsLoading(true)

        let photos: any[] = [];
        const promises: Promise<string>[] = [];

        for await (const variation of productVariations) {
            for (const photo of variation?.photos) {
                photos.push(photo)
            }
        }

        if (photos.length <= 0) return

        //crea le promises per il Promise.all
        for await (const photo of photos) {
            promises.push(
                new Promise<string>(async (resolve) => {
                    try {
                        const result = await uploadImage(photo.file, UploadEventType.product);
                        if (!result) {
                            setIsLoading(false);
                            throw new Error('Upload failed');
                        }
                        resolve(result.id);
                    } catch (error) {

                        setIsLoading(false);
                    }
                }))
        }

        try {
            const photosFileIDs: string[] = await Promise.all(promises);



            if (photosFileIDs.length <= 0) return setIsLoading(false)
            // Tutte le promesse sono state risolte correttamente


            let i = 0;


            const variations = productVariations.map((variation) => {
                let lots: Size[] = [];
                let photos: string[] = [];
                variation?.lots.forEach(lot => {
                    if (!lot.quantity || !lot.size) return
                    lots.push({
                        quantity: lot.quantity,
                        size: lot.size.split(' (')[0]
                    })
                });

                variation?.photos.forEach(photo => {
                    photos.push(photosFileIDs[i])
                    i++
                });

                return {
                    ...variation,
                    status: 'active',
                    lots: lots,
                    photos: photos
                }
            })



            const moreInfo: {
                fit?: string,
                length?: string,
                materials?: string[],
                description?: string,
                modelDescription?: string
            } = {}
            if (watch('fit')) {
                moreInfo['fit'] = watch('fit')?.toLocaleLowerCase()
            }
            if (watch('length')) {
                moreInfo['length'] = watch('length')?.toLocaleLowerCase()
            }
            if (watch('materials')?.length >= 1) {
                moreInfo['materials'] = watch('materials')
            }
            if (watch('description')) {
                moreInfo['description'] = watch('description')
            }
            if (watch('modelDescription')) {
                moreInfo['modelDescription'] = watch('modelDescription')
            }


            if (watch('gender') === 'unisex') {
                setValue('gender', 'u');
            } else if (watch('gender') === 'donna') {
                setValue('gender', 'f');
            } else if (watch('gender') === 'uomo') {
                setValue('gender', 'm');
            } else {
                return
            }

            const product: any = {
                name: watch('name').trim().toLowerCase(),
                status: 'active',
                canBuy: true,
                price: {
                    v1,
                    v2: v1
                },
                info: {
                    univers: watch('univers').toLowerCase(),
                    brand: watch('brand').toLocaleLowerCase(),
                    gender: watch('gender').toLocaleLowerCase(),
                    macroCategory: watch('macrocategory').toLocaleLowerCase(),
                    microCategory: watch('microcategory').toLocaleLowerCase(),
                    traits: watch('traits') ? watch('traits') : [],
                    ...moreInfo
                },
                variations: variations
            }

            if (sizeGuidePhotoUrl) {
                product["sizeGuidePhoto"] = sizeGuidePhotoUrl
            }

            await createProduct({ variables: { shopId: router.query.shopId, options: product } })

            setIsLoading(false)
            addToast({ position: 'top', title: 'Prodotto creato con successo', description: 'controlla il tuo nuovo prodotto nella sezione dedicata', status: 'success', duration: 5000, isClosable: true })
            return router.push('/shop/home/' + router.query.shopId + '/prodotti')

        } catch (error) {
            addToast({ position: 'top', title: 'Errore durante la creazione del prodotto', description: "contattaci se l'errore persiste", status: 'error', duration: 5000, isClosable: true })
            setIsLoading(false)
        }




    }



    const onSubmit = () => {
        if (isLoading) return
        createProductHandler()
    }

    const resetForm = () => {
        resetField('microcategory')
        resetField('description')
        resetField('modelDescription')
        resetField('materials')
        resetField('length')
        resetField('fit')
        resetField('traits')
    }



    return (
        <Desktop_Layout>

            <NoIndexSeo title='Crea prodotto | Veplo' />
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box
                    className='lg:flex lg:gap-6 justify-between'
                >
                    <div className='w-full md:w-8/12 m-auto lg:m-0 lg:w-5/12 xl:w-6/12  '>
                        <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                            Aggiungi prodotto
                        </h1>
                        <Div_input_creation text='Tipologia prodotto'>
                            <Select
                                _active={{
                                    transform: 'scale(0.98)'
                                }}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                }
                                width={['full', 'full']}
                                size={'lg'}
                                borderRadius={'10px'}
                                bg={'#F2F2F2'}
                                focusBorderColor="transparent"
                                borderColor={'#F2F2F2'}
                                color={'secondaryBlack.text'}
                                fontWeight={'semibold'}
                                fontSize={['18px', '16px']}
                                height={12}
                                onChange={(e) => {
                                    if (e.target.value === 'accessori' || e.target.value === 'abbigliamento') {
                                        setMacrocategorySelectedSpec(undefined)
                                        resetForm()
                                        setValue('univers', e.target.value)
                                    }
                                }}
                            >
                                {['abbigliamento', 'accessori'].map((sortElement) => {
                                    return (
                                        <option key={sortElement} value={sortElement}>{sortElement}</option>
                                    )
                                })}
                            </Select>
                        </Div_input_creation>

                        <Div_input_creation text='Nome del prodotto'>
                            <InputGroup >
                                <Input
                                    autoComplete='off'
                                    maxLength={40}
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
                            color={"cancelTag.bg"}
                            role="alert">* i caratteri speciali non sono accettati</Text>}
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
                        <Div_input_creation text='Genere'>
                            <Controller
                                control={control}
                                name="gender"
                                rules={{ required: false }}
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
                            <Controller
                                control={control}
                                name="macrocategory"
                                rules={{ required: false }}
                                render={() => (
                                    <SelectMacrocategory
                                        univers={watch('univers')}
                                        selectedValueBefore={macrocategorySelectedSpec?.name}
                                        handleClick={(macrocategory: Macrocategory) => {
                                            setValue('macrocategory', macrocategory.name);
                                            setProductVariations([])
                                            setMacrocategorySelectedSpec(macrocategory)
                                            resetForm()
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
                                render={({ field }) => (
                                    <SelectStringOption
                                        values={macrocategorySelectedSpec?.types}
                                        defaultValue={field.value}
                                        handleClick={(microcategory: string) => {
                                            setValue('microcategory', microcategory);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Descrizione prodotto (opzionale)'>
                            <InputGroup>
                                <Controller
                                    control={control}
                                    name="description"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Textarea
                                            fontSize={'sm'}
                                            maxLength={700}
                                            rounded={10}
                                            paddingY={6}
                                            paddingTop={2}
                                            paddingX={2}
                                            autoComplete="descrition-text-shop"
                                            {...field}
                                        />
                                    )}
                                />
                            </InputGroup>
                        </Div_input_creation>
                        <Div_input_creation text='Descrizione modello (opzionale)'>
                            <InputGroup>
                                <Controller
                                    control={control}
                                    name="modelDescription"
                                    defaultValue=""
                                    render={({ field }) => (

                                        <Textarea
                                            maxLength={100}
                                            rounded={10}
                                            paddingY={6}
                                            paddingTop={2}
                                            autoComplete="descrition-text-shop"
                                            placeholder='es. Il modell* nella foto è alt* 175 cm e veste una taglia M'
                                            {...field}
                                        />
                                    )}
                                />

                            </InputGroup>
                        </Div_input_creation>
                        {macrocategorySelectedSpec?.materials
                            && <Div_input_creation text='Materiali (opzionale, massimo 2)'>

                                <Controller
                                    control={control}
                                    name="materials"
                                    rules={{ required: false }}
                                    shouldUnregister={!reset} // Disassocia il campo dal form solo quando non viene chiamato reset()
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

                    </div>



                    {watch('macrocategory') !== undefined &&
                        <div className='w-full md:w-9/12 m-auto lg:m-0 lg:w-7/12 xl:w-6/12 '>
                            <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                                Guida alle taglie
                            </h1>
                            {typeof router.query.shopId === 'string' && <SizeGuidesComponent
                                isSelectable={true}
                                onChangeSizeGuide={(url: string | undefined) => {
                                    setsizeGuidePhotoUrl(url)

                                }}
                                id={router.query.shopId} />}
                            <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                                Varianti colore
                            </h1>

                            {productVariations.length > 0 && productVariations.map((variation: VariationCard, index) => {
                                console.log('variation', variation);

                                return (

                                    <ProductVariationCard
                                        index={index}
                                        key={index}
                                        variation={variation}
                                        deleteCard={deleteVariationCard}
                                        editCard={(variation) => { confirmCard(variation, true) }}
                                        category={macrocategorySelectedSpec?.sizes}
                                    />
                                )
                            })}

                            {!newCard ? (
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
                                :
                                watch('macrocategory') === undefined ? null
                                    :
                                    (
                                        <div
                                            key={Math.random()}
                                            className='mb-4'
                                        >
                                            <AddColorToProduct
                                                colors={colors}
                                                category={macrocategorySelectedSpec?.sizes}
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
                                    type='submit'
                                    isDisabled={!isValid || !watch('macrocategory') || !watch('microcategory') || !watch('brand')}
                                    px={12}
                                    py={7}
                                    rounded={'lg'}
                                    width={'full'}
                                    fontSize={'xl'}
                                >
                                    {!isLoading ? (
                                        <>Crea Prodotto</>
                                    ) :
                                        (
                                            <Spinner
                                                thickness='4px'
                                                speed='0.65s'
                                                emptyColor='gray.200'
                                                color='white'
                                                size='lg'
                                            />
                                        )
                                    }


                                </Button>
                            </div>


                        </div>}
                </Box>

            </form>



        </Desktop_Layout >
    )
}

export default index