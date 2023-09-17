import { gql, makeVar, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../../components/atoms/Desktop_Layout';
import EditProductInputForm from '../../../../../../../components/molecules/EditProductInputForm';
import EditVariationCard from '../../../../../../../components/molecules/EditVariationCard';
import { CATEGORIES, Category } from '../../../../../../../components/mook/categories';
import { SIZES } from '../../../../../../../components/mook/sizes';
import { Size } from '../../../../../../../components/organisms/EditColorToProdoct';
import NoIndexSeo from '../../../../../../../components/organisms/NoIndexSeo';
import { imageKitUrl } from '../../../../../../../components/utils/imageKitUrl';
import { ToastOpen } from '../../../../../../../components/utils/Toast';
import { Business } from '../../../../../../interfaces/business.interface';
import { Firebase_User } from '../../../../../../interfaces/firebase_user.interface';
import { Product, Variation } from '../../../../../../interfaces/product.interface';
import DELETE_VARIATON from '../../../../../../lib/apollo/mutations/deleteVariation';
import EDIT_PRODUCT from '../../../../../../lib/apollo/mutations/editProduct';
import EDIT_VARIATIONS from '../../../../../../lib/apollo/mutations/editVariation';
import CREATE_VARIATION from '../../../../../../lib/apollo/mutations/createVariation';

import GET_PRODUCTS_FROM_SHOP from '../../../../../../lib/apollo/queries/geetProductsShop';
import GET_SINGLE_PRODUCT from '../../../../../../lib/apollo/queries/getSingleProduct';
import { Button, ButtonGroup, Text } from '@chakra-ui/react';
import AddColorToProduct from '../../../../../../../components/organisms/AddColorToProduct';
import { COLORS, Color } from '../../../../../../../components/mook/colors';
import { VariationCard } from '../../../../../../interfaces/variationCard.interface';
import { uploadImage } from '../../../../../../lib/upload/uploadImage';
import { UploadEventType } from '../../../../../../lib/upload/UploadEventTypes';
import expirationTimeTokenControll from '../../../../../../../components/utils/expirationTimeTokenControll';
import ProductVariationCard from '../../../../../../../components/molecules/ProductVariationCard';
import ModalReausable from '../../../../../../../components/organisms/ModalReausable';
import { isProductVariationChanged } from '../../../../../../../components/utils/isProductVariationChanged';

interface Props {
    shop: {
        id: string
        products: Product[],
    }
}

export interface IFormInputProductEdit {
    name: string;
    price: {
        v1: number | string,
        discountPercentage: number | string,
        v2?: number | string
    }
    brand: string;
    macrocategory: string;
    microcategory: string;
    traits: string[];
    materials: string[] | [];
    fit?: string;
    length?: string;
    description?: string;
    modelDescription?: string;
    gender: string
}

const index = () => {



    const { addToast } = ToastOpen();

    const user: Firebase_User = useSelector((state: any) => state.user.user);
    //const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);
    const router = useRouter();
    const [product, setProduct] = useState<Product>();
    const [modalVariationToDelete, setModalVariationToDelete] = useState<Variation | undefined>()
    const [defaultValue, setdefaultValue] = useState<IFormInputProductEdit>();
    const productData = useQuery(GET_SINGLE_PRODUCT, {
        variables: {
            id: router.query?.productId
        }
    })
    const [sizeTypeSelected, setSizeTypeSelected] = useState<string>('')
    const [newCard, setNewCard] = useState(false)
    const [colors, setColors] = useState<Color[]>(COLORS)
    const [createVariation] = useMutation(CREATE_VARIATION, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_SINGLE_PRODUCT, variables: {
                id: product?.id
            }
        }],
    })







    const [editProduct] = useMutation(EDIT_PRODUCT, {

        update(cache, el, query) {

            const normalizedId = cache.identify({ id: router.query.productId, __typename: 'Product' });


            cache.modify({
                id: normalizedId,
                fields: {
                    name(cachedvalue) {
                        return query?.variables?.options.name ? query?.variables?.options.name : cachedvalue
                    },
                    price(cachedvalue) {
                        return {
                            ...cachedvalue,
                            v1: query?.variables?.options?.price?.v1 ? query?.variables?.options?.price?.v1 : cachedvalue.v1,
                            v2: query?.variables?.options?.price?.v2 ? query?.variables?.options?.price?.v2 : cachedvalue.v2
                        }
                    },
                    info(cachedvalue) {
                        //gestire anche le variabili
                        return {
                            ...cachedvalue,
                            brand: query?.variables?.options?.info?.brand ? query?.variables?.options?.info?.brand : cachedvalue.brand,
                            fit: query?.variables?.options?.info?.fit ? query?.variables?.options?.info?.fit : cachedvalue.fit,
                        }
                    },
                }
            })
        }
    })

    const [deleteVariation] = useMutation(DELETE_VARIATON, {
        update(cache, el, query) {
            const normalizedIdVariation = cache.identify({ id: query?.variables?.id, __typename: 'ProductVariation' });
            cache.evict({ id: normalizedIdVariation })
        }
    })

    const [editVariation] = useMutation(EDIT_VARIATIONS, {
        update(cache, el, query) {
            const normalizedIdVariation = cache.identify({ id: query?.variables?.id, __typename: 'ProductVariation' });
            cache.modify({
                id: normalizedIdVariation,
                fields: {
                    lots(cachedvalue) {
                        return query?.variables?.options?.lots
                    },
                    photos() {
                        return query?.variables?.options?.photos
                    }
                }
            })
        }
    })




    //get Product on Card

    useEffect(() => {
        const product: Product = productData?.data?.product

        if (!product) return
        setProduct(product)
        setdefaultValue({
            name: product.name,
            price: {
                v1: product.price.v1 / 100,
                v2: product.price?.v2 ? product.price?.v2 / 100 : '',
                discountPercentage: product.price?.v2 ? Number((100 - Number(product.price.v2) / product.price.v1 * 100).toFixed(2)) : ''
            },
            brand: product.info.brand,
            macrocategory: product.info.macroCategory,
            microcategory: product.info.microCategory,
            materials: product.info.materials ? product.info.materials : [],
            fit: product.info.fit,
            traits: product.info.traits ? product.info.traits : [],
            length: product.info.length,
            description: product.info.description,
            modelDescription: product.info.modelDescription,
            gender: product.info.gender === 'f' ? 'donna' : product.info.gender === 'm' ? 'uomo' : product.info.gender === 'u' ? 'unisex' : 'donna',
        })

        //remove colors used for new variations
        let colors: string[] = [];
        product.variations.map(variation => {
            colors.push(variation?.color)
        })

        setColors((prevState: Color[]) => {
            const newColors = prevState.filter(str => !colors.includes(str.name))
            return [
                ...newColors
            ]
        })

        //find sizeType code
        product.info.gender
        const gender = product.info.gender === 'f' ? 'donna' : product.info.gender === 'm' ? 'uomo' : 'donna'
        //TODO GESTIORE accessori anche! appena tommaso ha messo la tipologia prodotto
        const sizeType = CATEGORIES[gender][product.info.univers ? product.info.univers : 'abbigliamento'].find(element => element.name.toLowerCase() === product.info.macroCategory.toLowerCase())

        if (sizeType?.sizes) {
            setSizeTypeSelected(sizeType.sizes)
        }


    }, [productData])







    const editProductHandler = async (productElement: IFormInputProductEdit) => {
        let traits = product?.info.traits ? [...product?.info.traits] : []
        let materials = product?.info.materials ? [...product?.info.materials] : []


        let options: {
            name?: string,
            info?: {
                brand?: string,
                traits: string[] | [];
                materials: string[] | [];
                fit?: string;
                length?: string;
                description?: string;
                modelDescription?: string;
                gender?: string
            }
            price?: {
                v1?: number,
                v2?: number
            }
        } = {};
        if (productElement.name.trimEnd() !== product?.name) {
            options["name"] = productElement.name.trimEnd()
        }
        let info: any = {}

        if (productElement.brand !== product?.info.brand) {
            info["brand"] = productElement.brand.toLocaleLowerCase()
        }
        if (productElement?.traits.sort().join(',') !== traits.sort().join(',')) {
            info["traits"] = productElement.traits
        }

        if (productElement?.materials.sort().join(',') !== materials.sort().join(',')) {
            info["materials"] = productElement.materials
        }
        if (productElement.fit !== product?.info.fit) {
            info["fit"] = productElement.fit
        }
        if (productElement.length !== product?.info.length) {
            info["length"] = productElement.length
        }
        if (productElement.description !== product?.info.description) {
            info["description"] = productElement.description
        }
        if (productElement.modelDescription !== product?.info.modelDescription) {
            info["modelDescription"] = productElement.modelDescription
        }

        let gender: string = '';
        if (productElement.gender === 'unisex') {
            gender = 'u'
        } else if (productElement.gender === 'donna') {
            gender = 'f'
        } else if (productElement.gender === 'uomo') {
            gender = 'm'
        }
        if (gender !== '' && gender !== product?.info.gender) {
            info["gender"] = gender
        }


        if (Object.keys(info).length > 0) {
            options["info"] = info
        }
        let price: any = {}
        if (typeof productElement.price.v1 === 'string') {
            const v1 = Math.floor(Number(productElement.price.v1.replace(',', '.')) * 100)
            if (v1 !== product?.price.v1) {
                if (v1 === 0) {

                }
                price["v1"] = v1
            }
        }



        if (typeof productElement.price.v2 === 'string' && typeof productElement.price.v1 === 'string') {

            const v1 = Math.floor(Number(productElement.price.v1.replace(',', '.')) * 100)
            const v2 = Math.floor(Number(productElement.price.v2.replace(',', '.')) * 100)
            if (v2 !== 0 && v2 <= v1) {
                price["v2"] = v2
            }
        }
        else if (typeof productElement.price.v2 === 'string' && product?.price.v1) {
            const v2 = Math.floor(Number(productElement.price.v2.replace(',', '.')) * 100)
            if (v2 !== 0 && v2 <= product?.price.v1) {
                price["v1"] = product?.price.v1
                price["v2"] = Math.floor(Number(productElement.price.v2.replace(',', '.')) * 100)
            }
        }


        if (Object.keys(price).length > 0) {
            options["price"] = price
            if (Object.keys(price).length === 1) {
                price["v2"] = product?.price.v2
            }
        }






        if (Object.keys(options).length < 1) return
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        try {
            await editProduct({
                variables: {
                    id: product?.id,
                    options
                }
            })
            addToast({ position: 'top', title: 'Prodotto modificato con successo', status: 'success', duration: 3000, isClosable: true })

        } catch {

        }


    }



    const handleDeleteVariation = async (variation: Variation) => {
        if (product && product.variations?.length <= 1) {
            return addToast({ position: 'top', title: "Impossibile cancellare il colore", description: "hai solo un colore disponibile per questo prodotto", status: 'error', duration: 5000, isClosable: true })
        }
        try {
            //Delete Variation on GraphQL
            await deleteVariation({
                variables: {
                    id: variation.id
                }
            })
            addToast({ position: 'top', title: `Variante di colore cancellata!`, status: 'success', duration: 3000, isClosable: true })

            //Edit Product.variations once you delete the variation
            setProduct((prevstate) => {
                if (!prevstate?.variations) return prevstate
                const newVariations = prevstate?.variations.filter(variation => variation?.id !== variation.id)
                return {
                    ...prevstate,
                    variations: newVariations
                }
            })

            setColors((prevState: Color[]) => {
                const colorElement: Color | undefined = COLORS.find(element => element.name === variation.color)
                if (colorElement) return [
                    colorElement,
                    ...prevState
                ]
                return [
                    ...prevState
                ]

            })


        } catch (e: any) {

        }
    }


    const handleEditCard = useCallback(async (variation: VariationCard, variationId: string) => {
        let variationSize = variation.lots?.map(element => {
            return {
                quantity: element?.quantity,
                size: element?.size.split(' (')[0]
            }
        })

        let photos: File[] = [];
        for (const photo of variation?.photos) {
            if (photo.file) photos.push(photo.file)
        }



        const promises: Promise<string>[] = [];
        addToast({ position: 'top', title: `Modifica variante ${variation?.color} in corso`, status: 'loading', duration: photos.length > 0 ? 3000 : 1000, isClosable: true })

        if (photos.length > 0) {
            //crea le promises per il Promise.all
            for await (const photo of photos) {
                promises.push(
                    new Promise<string>(async (resolve) => {
                        try {
                            const result = await uploadImage(photo, UploadEventType.product);
                            if (!result) {
                                throw new Error('Upload failed');
                            }
                            resolve(result.id);
                        } catch (error) {

                        }
                    }))
            }
        }



        try {
            let photosFileIDs: string[] = [];
            if (promises.length > 0) {
                photosFileIDs = await Promise.all(promises);
            }
            let photosURLToUpload: string[] = [];
            let indexPhoto = 0
            for (const photo of variation?.photos) {
                if (photo.file) {
                    photosURLToUpload.push(photosFileIDs[indexPhoto])
                    indexPhoto++
                } else {
                    photosURLToUpload.push(photo)
                }
            }



            //controllo che le foto siano di lunghezza superiore a 1
            if (photosURLToUpload.length <= 0) {
                return addToast({ position: 'top', title: `Non possiamo aggiornare una variante di colore senza foto`, status: 'error', duration: 3000, isClosable: true })

            }
            await editVariation({
                variables: {
                    id: variationId,
                    options: {
                        photos: photosURLToUpload,
                        lots: variationSize
                    }
                }
            })
            addToast({ position: 'top', title: `Prodotto aggiornato!`, status: 'success', duration: 3000, isClosable: true })



            //mettere alert per creazione avvenuta con successo

        } catch (e) {

        }

    }, [])

    console.log('prodotto', product);


    const confirmCard = async (variation: VariationCard) => {
        addToast({ position: 'top', title: `Creazione variante ${variation?.color} in corso!`, status: 'loading', duration: 3500, isClosable: true })

        const variationLots = variation?.lots.map(lot => {
            return {
                quantity: lot.quantity,
                size: lot.size.split(' (')[0]
            }
        })


        let photos: File[] = [];
        for (const photo of variation?.photos) {
            photos.push(photo.file)
        }

        const promises: Promise<string>[] = [];

        if (photos.length <= 0) return


        //crea le promises per il Promise.all
        for await (const photo of photos) {
            promises.push(
                new Promise<string>(async (resolve) => {
                    try {
                        const result = await uploadImage(photo, UploadEventType.product);
                        if (!result) {
                            throw new Error('Upload failed');
                        }
                        resolve(result.id);
                    } catch (error) {

                    }
                }))
        }

        try {

            const photosFileIDs: string[] = await Promise.all(promises);

            if (photosFileIDs.length <= 0) return
            await createVariation({
                variables: {
                    productId: product?.id,
                    options: {
                        color: variation?.color,
                        lots: variationLots,
                        status: "active",
                        photos: photosFileIDs
                    }
                }
            }
            )
            addToast({ position: 'top', title: `Variante ${variation?.color} creata!`, status: 'success', duration: 3000, isClosable: true })


            //mettere alert per creazione avvenuta con successo

        } catch (e) {

        }




        setNewCard(false)
        setColors((prevState: Color[]) => {
            const newColors = prevState.filter(color => color.name !== variation?.color)
            return [
                ...newColors
            ]
        })

    }



    return (
        <>
            <Desktop_Layout>
                <NoIndexSeo title='Modifica prodotto | Veplo' />
                <div className='w-full lg:w-11/12  m-auto'>
                    <h1 className='text-xl lg:text-3xl font-extrabold mb-6'>
                        Modifica prodotto
                    </h1>
                </div>
                {product?.variations && defaultValue &&
                    <div className='lg:flex w-full lg:gap-6'>
                        <div className='w-full md:w-8/12 lg:w-5/12 xl:w-1/2 m-auto mb-10 mt-0'>
                            <EditProductInputForm
                                univers={productData?.data?.product?.info?.univers}
                                handleConfirm={editProductHandler}
                                defaultValues={defaultValue}
                                gender={product.info.gender}
                            />
                        </div>
                        <div className='w-full md:w-8/12 lg:w-7/12 xl:w-1/2  mx-auto'>
                            {sizeTypeSelected && product.variations.map((variation: any, index) => {
                                return (
                                    <div
                                        key={index}

                                    >
                                        {/* <div key={index}>
                                        <EditVariationCard
                                            variation={variation}
                                            category={sizeTypeSelected}
                                            deleteVariation={handleDeleteVariation}
                                            editVariation={editVariationHandler}
                                        />
                                    </div> */}
                                        <ProductVariationCard
                                            index={index}
                                            variation={variation}
                                            deleteCard={(variation: Variation) => {
                                                setModalVariationToDelete(variation)
                                            }}
                                            editCard={(newVariation: VariationCard) => {
                                                if (!isProductVariationChanged(variation, newVariation)) return
                                                handleEditCard(newVariation, variation.id)
                                            }}
                                            category={sizeTypeSelected}
                                        />
                                    </div>

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
                                                setNewCard(false)
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>

                    </div>
                }
            </Desktop_Layout>
            <ModalReausable
                title={'Elimina Variante di colore'}
                isOpen={modalVariationToDelete ? true : false}
                closeModal={() => setModalVariationToDelete(undefined)}
            >
                <Text
                    mr={5}
                    mt={6}
                    mb={5}
                    fontSize={'18px'}
                    fontWeight={'normal'}
                    color={'secondaryBlack.text'}

                >
                    Sei sicuro di voler eliminare il colore {modalVariationToDelete?.color}
                </Text>
                <ButtonGroup
                    float={'right'}
                >
                    <Button
                        variant={'grayPrimary'}
                        borderRadius={'20px'}
                        fontSize={'md'}
                        paddingInline={'25px'}
                        onClick={() => {

                            setModalVariationToDelete(undefined)
                        }}
                    >
                        Annulla
                    </Button>
                    <Button
                        colorScheme='red'
                        borderRadius={'20px'}
                        fontSize={'md'}
                        paddingInline={'25px'}
                        onClick={() => {
                            if (!modalVariationToDelete) return
                            handleDeleteVariation(modalVariationToDelete)
                            setModalVariationToDelete(undefined)
                        }}
                    >
                        Conferma
                    </Button>
                </ButtonGroup>
            </ModalReausable>
        </>

    )
}

export default index