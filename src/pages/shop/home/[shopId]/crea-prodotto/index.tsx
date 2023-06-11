import { useMutation } from '@apollo/client'
import { Box, Button, ButtonGroup, IconButton, Input, InputGroup, InputLeftAddon, Spinner, Textarea, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Autocomplete from '../../../../../../components/atoms/Autocomplete_Headless'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import SelectMacrocategory from '../../../../../../components/atoms/SelectMacrocategory'
import SelectStringOption from '../../../../../../components/atoms/SelectStringOption'
import ProductVariationCard from '../../../../../../components/molecules/ProductVariationCard'
import { CATEGORIES } from '../../../../../../components/mook/categories'
import { Color, COLORS } from '../../../../../../components/mook/colors'
import AddColorToProduct from '../../../../../../components/organisms/AddColorToProduct'
import EditColorToProduct, { Size } from '../../../../../../components/organisms/EditColorToProdoct'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { onChangeNumberPrice } from '../../../../../../components/utils/onChangePrice'
import { ToastOpen } from '../../../../../../components/utils/Toast'
import { Variation } from '../../../../../interfaces/product.interface'
import { VariationCard } from '../../../../../interfaces/variationCard.interface'
import CREATE_PRODUCT from '../../../../../lib/apollo/mutations/createProduct'
import UPLOAD_PHOTO from '../../../../../lib/apollo/mutations/uploadPhotos'
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop'
import SelectMultipleOptions from '../../../../../../components/atoms/SelectMultipleOptions'

export interface IFormInputProduct {
    name: string;
    price: string;
    brand: string;
    macrocategory: string;
    microcategory: string;
    traits?: string[] | [];
    materials: string[] | [];
    fit?: string;
    length?: string;
    description?: string;
}

interface Macrocategory {
    name: string,
    sizes: string,
    types: string[],
    url: string,
    gender: string
}

export const FIT = [
    'skinny',
    'slim',
    'regular',
    'baggy',
    'oversize'
]

export const MATERIALS = [
    //   "alpaca",
    //   "angora",
    //   "cammello",
    "cashmere",
    "lana",
    "lambswool",
    "mohair",
    "pelle",
    "seta",
    "cotone",
    "canapa",
    "juta",
    "lino",
    "flanella",
    //   "ramiè",
    //   "viscosa",
    //   "rayon",
    //   "acrilico",
    //   "elastan",
    //   "poliestere",
    //   "poliammide",
    //   "alcantara",
    //   "lurex",
    "gomma",
    //   "tencel",
    //   "modal",
    //   "polipropilene",
    //   "poliuretano",
    //   "lycra",
    "nylon",
    "gore-Tex",
    "microfibra",
    "pile",
    "stoffa",
    "chino",
    "jeans",
]

export const LENGTH = [
    'corto',
    'normale',
    'lungo'
]

export const TRAITS = [
    'eco-friendly',
    'vegan',
    'handmade',
    'vintage'
]




const index = () => {
    console.log('EII');

    const { addToast } = ToastOpen();
    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, isDirty }, getValues, setValue, control, formState } = useForm<IFormInputProduct>({
        mode: "all",
        //defaultValues
    });
    const router = useRouter();
    const [microcategoriesSelected, setMicrocategoriesSelected] = useState<string[]>([])
    const [genderSelected, setGenderSelected] = useState<string>('')

    const [sizeTypeSelected, setSizeTypeSelected] = useState('')
    const [newCard, setNewCard] = useState(true)
    const [productVariations, setProductVariations] = useState<VariationCard[]>([])
    const [colors, setColors] = useState<Color[]>(COLORS)
    const [cardToEdit, setCardToEdit] = useState<any>([])
    const [uploadPhotos] = useMutation(UPLOAD_PHOTO)
    const [isLoading, setIsLoading] = useState(false)
    const [createProduct] = useMutation(CREATE_PRODUCT, {
        update(cache, el, query) {
            const data = el.data

            // console.log(data.createProduct.id);
            // console.log(query?.variables?.options);


            const shop: any = cache.readQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                // Provide any required variables in this object.
                // Variables of mismatched types will return `null`.
                variables: {
                    id: router.query.shopId, //* mettere idShop,
                    limit: 100, offset: 0
                },
            });


            console.log(shop?.shop.products?.products);
            if (!shop?.shop.products.products) return
            console.log(query.variables?.options.info);
            console.log(query.variables?.options.name);
            console.log(query.variables?.options.variations);
            const variations = query.variables?.options.variations.map((element: any) => {
                return {
                    ...element,
                    id: 'testId',
                    __typename: "ProductVariation"
                }
            })
            console.log(variations);

            if (!query.variables?.options) return

            const newProduct = {
                canBuy: true,
                id: data.createProduct.id,
                info: {
                    ...query.variables.options.info,
                    __typename: "ProductInfo"
                },
                name: query.variables.options.name,
                price: {
                    v1: query.variables.options.price.v1,
                    v2: null,
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

            console.log(newProduct);


            cache.writeQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: { id: router.query.shopId, limit: 100, offset: 0 },
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
            const newColors = prevState.filter(color => color.name !== variation.color)
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
            const newColors = prevState.filter(color => color.name !== variation.color)
            return [
                ...newColors
            ]
        })
        setCardToEdit((prevstate: VariationCard[]) => {
            const newVariation = prevstate.filter(element => element.color !== variation.color)
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
            const newVariation = prevstate.filter(element => element.color !== variation.color)
            return [
                ...newVariation
            ]
        })

    }

    const deleteVariationCard = (variation: Variation) => {
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
    }



    const createProductHandler = async () => {
        setIsLoading(true)
        const values = getValues();
        console.log(values);

        let photos: any = [];
        for await (const variation of productVariations) {
            for (const photo of variation.photos) {
                photos.push(photo.file)
            }
        }


        console.log(photos);
        try {
            const photosUploaded = await uploadPhotos({
                variables: {
                    images: photos,
                    proportion: "product"
                }
            })
            console.log(photosUploaded);




            const photosString = photosUploaded?.data.uploadImages
            console.log(photosString)

            let i = 0;


            const variations = productVariations.map((variation) => {
                let lots: Size[] = [];
                let photos: string[] = [];
                variation.lots.forEach(lot => {
                    lots.push({
                        quantity: lot.quantity,
                        size: lot.size.split(' ')[0]
                    })
                });

                variation.photos.forEach(photo => {
                    photos.push(photosString[i])
                    i++
                });

                return {
                    ...variation,
                    status: 'active',
                    lots: lots,
                    photos: photos
                }
            })

            console.log(productVariations);

            const v1 = Number(watch('price').replace(',', '.'))

            if (!v1 || v1 <= 0) return

            const moreInfo: {
                fit?: string,
                length?: string,
                materials?: string[],
                description?: string
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
                moreInfo['description'] = watch('description')?.toLocaleLowerCase()
            }


            const product = {
                name: watch('name').toLowerCase(),
                status: 'active',
                canBuy: true,
                price: {
                    v1
                },
                info: {
                    brand: watch('brand').toLocaleLowerCase(),
                    //fit: watch('fit') ? watch('fit')?.toLocaleLowerCase() : null,
                    gender: genderSelected === 'donna' ? 'f' : 'm',
                    //length: watch('length') ? watch('length')?.toLocaleLowerCase() : null,
                    macroCategory: watch('macrocategory').toLocaleLowerCase(),
                    //materials: watch('materials')?.length >= 1 ? watch('materials') : null,
                    microCategory: watch('microcategory').toLocaleLowerCase(),
                    traits: watch('traits') ? watch('traits') : [],
                    //description: watch('description') ? watch('description') : null,
                    ...moreInfo
                },
                variations: variations
            }
            console.log(product);
            const isCreatedProduct = await createProduct({ variables: { shopId: router.query.shopId, options: product } })
            console.log(isCreatedProduct);
            setIsLoading(false)
            addToast({ position: 'top', title: 'Prodotto creato con successo', description: 'controlla il tuo nuovo prodotto nella sezione dedicata', status: 'success', duration: 5000, isClosable: true })
            return router.push('/shop/home/' + router.query.shopId + '/prodotti')
        } catch (e: any) {
            console.log(e);
            setIsLoading(false)
        }
    }



    return (
        <Desktop_Layout>
            <NoIndexSeo title='Crea prodotto | Veplo' />
            <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>
                <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
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
                                    setGenderSelected(macrocategory.gender)
                                    setSizeTypeSelected(macrocategory.sizes)
                                    setValue('macrocategory', macrocategory.name);
                                    setProductVariations([])
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
                                defaultValue={''}
                                handleClick={(microcategory: string) => {
                                    setValue('microcategory', microcategory);
                                }}
                            />
                        )}
                    />
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
                                        defaultValue={''}
                                        handleClick={(microcategory: string) => {
                                            setValue('length', microcategory);
                                        }}
                                    />
                                )}
                            />
                        </Div_input_creation>
                        <Div_input_creation text='Vestibilità prodotto (opzionale)'>
                            <Controller
                                control={control}
                                name="fit"
                                rules={{ required: false }}
                                render={() => (
                                    <SelectStringOption
                                        values={FIT}
                                        defaultValue={''}
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
                                limitNumber={2}
                                handleValue={(value) => {
                                    setValue('traits', value);
                                }}
                                values={TRAITS}
                            />
                        )}
                    />
                </Div_input_creation>


            </div>



            <div className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 m-auto'>
                <h1 className='text-lg md:text-2xl font-extrabold mt-6 mb-4'>
                    Varianti colore
                </h1>
                {productVariations.length > 0 && productVariations.map((variation: VariationCard, index) => {

                    console.log(variation);
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
                    console.log(variation);
                    return (
                        <div key={variation.color}>
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
                                category={sizeTypeSelected}
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
                        onClick={() => {
                            if (isLoading) return
                            createProductHandler()
                        }}
                        disabled={isLoading || productVariations.length <= 0 || !watch('name') || !watch('brand') || !watch('macrocategory') || !watch('microcategory') || !watch('price')}
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


        </Desktop_Layout>
    )
}

export default index