import { useMutation } from '@apollo/client'
import { Box, Button, ButtonGroup, IconButton, Input, InputGroup, InputLeftAddon, Select, Spinner, Text, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import ProductVariationCard from '../../../../../../components/molecules/ProductVariationCard'
import { CATEGORIES, Category, Univers } from '../../../../../../components/mook/categories'
import { Color, COLORS } from '../../../../../../components/mook/colors'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import EditColorToProduct, { Size } from '../../../../../../components/organisms/EditColorToProdoct'
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
import axios, { AxiosResponse } from 'axios'
import { uploadImage } from '../../../../../lib/upload/uploadImage'
import { UploadEventType } from '../../../../../lib/upload/UploadEventTypes'

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
    const [genderSelected, setGenderSelected] = useState<string>('')
    const [macrocategorySelectedSpec, setMacrocategorySelectedSpec] = useState<Macrocategory>()



    const [sizeTypeSelected, setSizeTypeSelected] = useState<string | undefined>('')
    const [newCard, setNewCard] = useState(true)
    const [productVariations, setProductVariations] = useState<VariationCard[]>([])
    const [colors, setColors] = useState<Color[]>(COLORS)
    const [cardToEdit, setCardToEdit] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [createProduct] = useMutation(CREATE_PRODUCT, {
        update(cache, el, query) {
            const data = el.data





            const shop: any = cache.readQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                // Provide any required variables in this object.
                // Variables of mismatched types will return `null`.
                variables: {
                    id: router.query.shopId, //* mettere idShop,
                    limit: 100, offset: 0,
                    filters: {

                    }
                },
            });



            if (!shop?.shop.products.products) return



            const variations = query.variables?.options.variations.map((element: any) => {
                return {
                    ...element,
                    id: 'testId',
                    __typename: "ProductVariation"
                }
            })


            if (!query.variables?.options) return

            const newProduct = {
                canBuy: true,
                id: data.createProduct,
                info: {
                    ...query.variables.options.info,
                    __typename: "ProductInfo"
                },
                name: query.variables.options.name,
                price: {
                    v1: query.variables.options.price.v1,
                    v2: query.variables.options.price.v1,
                    discountPercentage: null,
                    __typename: "Price"
                },
                shopInfo: {
                    businessId: "test",
                    city: "Terni",
                    id: router.query.shopId,
                    name: "Negozio fisico",
                    status: "active",
                    __typename: "ShopInfo"
                },
                status: 'active',
                variations: variations,
                location: {
                    type: 'Points',
                    coordinates: [1, 1],
                    __typename: 'Location'
                },
                __typename: 'Product',

            }




            cache.writeQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: { id: router.query.shopId, limit: 100, offset: 0, filters: {} },
                data: {
                    shop: {
                        id: router.query.shopId,
                        products: {
                            products: [
                                newProduct,
                                ...shop?.shop.products.products
                            ]
                        }
                    }
                }
            })

        }
    });




    const confirmCard = (variation: VariationCard) => {
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
        setCardToEdit((prevstate: VariationCard[]) => {
            const newVariation = prevstate.filter(element => element.color !== variation?.color)
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
            const newVariation = prevstate.filter(element => element.color !== variation?.color)
            return [
                ...newVariation
            ]
        })

    }

    const deleteVariationCard = (variation: Variation) => {
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
    }



    const createProductHandler = async () => {
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


            const product = {
                name: watch('name').toLowerCase(),
                status: 'active',
                canBuy: true,
                price: {
                    v1,
                    v2: v1
                },
                info: {
                    univers: watch('univers').toLowerCase(),
                    brand: watch('brand').toLocaleLowerCase(),
                    gender: genderSelected === 'donna' ? 'f' : 'm',
                    macroCategory: watch('macrocategory').toLocaleLowerCase(),
                    microCategory: watch('microcategory').toLocaleLowerCase(),
                    traits: watch('traits') ? watch('traits') : [],
                    ...moreInfo
                },
                variations: variations
            }

            const isCreatedProduct = await createProduct({ variables: { shopId: router.query.shopId, options: product } })

            setIsLoading(false)
            addToast({ position: 'top', title: 'Prodotto creato con successo', description: 'controlla il tuo nuovo prodotto nella sezione dedicata', status: 'success', duration: 5000, isClosable: true })
            return router.push('/shop/home/' + router.query.shopId + '/prodotti')

        } catch (error) {

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
            {/* <input type='file'
                placeholder='eiii'
                onChange={(e) => {
                    uploadImage(e.target.files[0], 'product')
                }}
            /> */}
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>
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
                                    univers={watch('univers')}
                                    selectedValueBefore={macrocategorySelectedSpec?.name}
                                    handleClick={(macrocategory: Macrocategory) => {
                                        setGenderSelected(macrocategory.gender)
                                        setSizeTypeSelected(macrocategory.sizes)
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
                                        maxLength={450}
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



                <div className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 m-auto'>
                    <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                        Varianti colore
                    </h1>
                    {productVariations.length > 0 && productVariations.map((variation: VariationCard, index) => {


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

                        return (
                            <div key={variation?.color}>
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


                </div>
            </form>



        </Desktop_Layout >
    )
}

export default index