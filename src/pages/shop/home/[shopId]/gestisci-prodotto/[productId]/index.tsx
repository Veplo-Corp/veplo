import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, ButtonGroup, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../../components/atoms/Desktop_Layout';
import EditProductInputForm from '../../../../../../../components/molecules/EditProductInputForm';
import EditVariationCard from '../../../../../../../components/molecules/EditVariationCard';
import { CATEGORIES } from '../../../../../../../components/mook/categories';
import { SIZES } from '../../../../../../../components/mook/sizes';
import NoIndexSeo from '../../../../../../../components/organisms/NoIndexSeo';
import { imageKitUrl } from '../../../../../../../components/utils/imageKitUrl';
import { Business } from '../../../../../../interfaces/business.interface';
import { Firebase_User } from '../../../../../../interfaces/firebase_user.interface';
import { Product } from '../../../../../../interfaces/product.interface';
import EDIT_PRODUCT from '../../../../../../lib/apollo/mutations/editProduct';
import GET_BUSINESS from '../../../../../../lib/apollo/queries/business';
import GET_PRODUCTS_FROM_SHOP from '../../../../../../lib/apollo/queries/geetProductsShop';
import GET_SINGLE_PRODUCT from '../../../../../../lib/apollo/queries/getSingleProduct';

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
    vestibilità: string
}

const index = () => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    //const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);
    const router = useRouter();
    const [getShop, { error, data }] = useLazyQuery<Props>(GET_PRODUCTS_FROM_SHOP);
    const [product, setProduct] = useState<Product>();
    const [defaultValue, setdefaultValue] = useState<IFormInputProductEdit>();
    const [getProduct] = useLazyQuery(GET_SINGLE_PRODUCT);
    const [first, setfirst] = useState(true)
    console.log();
    const [sizeTypeSelected, setSizeTypeSelected] = useState<string[]>()
    const [editProduct] = useMutation(EDIT_PRODUCT, {
        update(cache, el, query) {
            console.log(el);
            console.log(query);
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
                        return {
                            ...cachedvalue,
                            brand: query?.variables?.options?.info?.brand ? query?.variables?.options?.info?.brand : cachedvalue.brand,
                            fit: query?.variables?.options?.info?.fit ? query?.variables?.options?.info?.fit : cachedvalue.fit,
                        }
                    }

                }
            })
        }
    })





    useEffect(() => {
        const { shopId, productId } = router.query;
        if (!productId || !first) return
        if (!user?.isBusiness || !shopId || typeof shopId !== 'string' || !user?.accountId) return

        getProduct({
            variables: {
                id: productId
            }
        }).then((data: any) => {
            const product: Product = data?.data?.product
            console.log(product);
            if (!product) return
            setProduct(product)
            setdefaultValue({
                name: product.name,
                price: {
                    v1: product.price.v1,
                    v2: product.price?.v2 ? product.price?.v2 : '',
                    discountPercentage: product.price?.v2 ? Number((100 - Number(product.price.v2) / product.price.v1 * 100).toFixed(2)) : ''
                },
                brand: product.info.brand,
                macrocategory: product.info.macroCategory,
                microcategory: product.info.microCategory,
                vestibilità: product.info.fit
            })


            //find sizeType
            if (product.info.gender === 'f') {
                const sizeCateggory = Object.values(CATEGORIES)[0].abbigliamento.find(element => element.name === product.info.macroCategory)?.sizes
                if (sizeCateggory === 'woman_clothes_sizes' || sizeCateggory === "shoes_sizes" || sizeCateggory === "man_clothes_sizes") {
                    setSizeTypeSelected(SIZES[sizeCateggory])
                }
            }
            if (product.info.gender === 'm') {
                const sizeCateggory = Object.values(CATEGORIES)[1].abbigliamento.find(element => element.name === product.info.macroCategory)?.sizes
                if (sizeCateggory === 'woman_clothes_sizes' || sizeCateggory === "shoes_sizes" || sizeCateggory === "man_clothes_sizes") {
                    setSizeTypeSelected(SIZES[sizeCateggory])
                }
            }

        })
        setfirst(false)
        return () => {
        }
    }, [user])


    const editProductHandler = async (productElement: IFormInputProductEdit) => {

        let options: {
            name?: string,
            info?: {
                brand?: string,
                fit?: string,
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
            info["brand"] = productElement.brand
        }
        if (productElement.vestibilità !== product?.info.fit) {
            info["fit"] = productElement.vestibilità

        }
        if (Object.keys(info).length > 0) {
            options["info"] = info
        }
        let price: any = {}
        if (productElement.price.v1 !== product?.price.v1) {
            if (typeof productElement.price.v1 === 'string') {
                const v1 = Number(productElement.price.v1.replace(',', '.'))
                if (v1 === 0) {
                    return console.log('errore');
                }
                price["v1"] = v1
            }
        }
        if (productElement.price.v2 !== product?.price.v2) {
            console.log(productElement.price.v2, product?.price.v1);
            if (typeof productElement.price.v2 === 'string' && typeof productElement.price.v1 === 'string') {

                const v1 = Number(productElement.price.v1.replace(',', '.'))
                const v2 = Number(productElement.price.v2.replace(',', '.'))
                console.log(v1, v2);

                if (v2 !== 0 && v2 < v1) {
                    price["v2"] = v2
                }
            }
            else if (typeof productElement.price.v2 === 'string' && product?.price.v1) {
                console.log('passa');
                const v2 = Number(productElement.price.v2.replace(',', '.'))
                if (v2 !== 0 && v2 < product?.price.v1) {
                    price["v1"] = product?.price.v1
                    price["v2"] = v2
                }
            }
        }
        if (Object.keys(price).length > 0) {
            options["price"] = price
        }
        if (Object.keys(options).length < 1) return
        await editProduct({
            variables: {
                id: product?.id,
                options: options
            }
        })

    }






    return (
        <Desktop_Layout>
            <NoIndexSeo title='Modifica prodotto | Veplo' />
            <div className='w-full lg:w-11/12  m-auto'>
                <h1 className='italic text-xl lg:text-3xl font-extrabold mb-6'>
                    Modifica prodotto
                </h1>
            </div>
            {defaultValue && product?.variations && sizeTypeSelected &&
                <div className='lg:flex w-full'>
                    <div className='w-full md:w-8/12 lg:w-5/12 m-auto mb-10'>
                        <EditProductInputForm
                            handleConfirm={editProductHandler}
                            defaultValues={defaultValue} />
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12  mx-auto'>
                        {sizeTypeSelected && product.variations.map((variation, index) => {
                            return (
                                <div key={index}>
                                    <EditVariationCard variation={variation} sizeTypeSelected={sizeTypeSelected} />
                                </div>
                            )
                        })}
                    </div>
                </div>

            }


        </Desktop_Layout>
    )
}

export default index