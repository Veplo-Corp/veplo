import { useLazyQuery } from '@apollo/client';
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
        discountPercentage: number,
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
                    v1: 100,
                    v2: 80,
                    discountPercentage: 20
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


    const editProduct = (productElement: IFormInputProductEdit) => {
        console.log(product);
        let options: {
            name?: string,
            brand?: string,
            fit?: string,
            price?: {
                v1?: number,
                v2?: number
            }
        } = {};
        if (productElement.name.trimEnd() !== product?.name) {
            options["name"] = productElement.name.trimEnd()
        }
        if (productElement.brand !== product?.info.brand) {
            options["brand"] = productElement.brand
        }
        if (productElement.vestibilità !== product?.info.fit) {
            options["fit"] = productElement.vestibilità
        }
        let price: any = {}
        if (productElement.price.v1 !== 100) {
            if (typeof productElement.price.v1 === 'string') {
                const v1 = Number(productElement.price.v1.replace(',', '.'))
                if (v1 === 0) {
                    return console.log('errore');
                }
                price["v1"] = v1
            }
        }
        if (productElement.price.v2 !== 80) {
            if (typeof productElement.price.v2 === 'string') {
                const v2 = Number(productElement.price.v2.replace(',', '.'))
                if (v2 !== 0) {
                    price["v2"] = v2
                }

            }
        }
        if (Object.keys(price).length > 0) {
            options["price"] = price
        }
        console.log(options);
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
                            handleConfirm={editProduct}
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