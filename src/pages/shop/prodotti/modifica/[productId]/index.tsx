import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import { Color, COLORS } from '../../../../../../components/mook/colors';
import Product_Form from '../../../../../../components/organisms/Product_Form';
import { ToastOpen } from '../../../../../../components/utils/Toast';
import uploadPhotoFirebase from '../../../../../../components/utils/uploadPhotoFirebase';
import { Product } from '../../../../../interfaces/product.interface';
import { initApollo } from '../../../../../lib/apollo';
import EDIT_PRODUCT from '../../../../../lib/apollo/mutations/editProduct';
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop';
import { setModalTitleAndDescription } from '../../../../store/reducers/modal_error';

const index = () => {
    const { addToast } = ToastOpen();
    const [editProduct] = useMutation(EDIT_PRODUCT)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const apolloClient = initApollo();
    const [product, setProduct] = useState<Product>(undefined)
    const [openModalMath, setOpenModalMath] = useState(1);

    const { productId } = router.query

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-only',
        nextFetchPolicy: 'cache-first',
        variables: { id: '6373bb3c0742ade8758b1a97' },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    });


    const onClick = () => {

    }

    useEffect(() => {
        if (!data) {
            //router.push('/shop/prodotti/')
            return
        }
        const product = data.shop.products.filter((product: Product) => product.id === productId)[0]

        setProduct(product)


    }, [data])



    const submitData = async ({ name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender }: IFormInput) => {
        //console.log(photos);

        let colorsToDB;
        colorsToDB = colors.map((color) => {
            return color.name
        })

        if (colorsToDB[0] === undefined) {
            colorsToDB = colors
        }

        
        let priceToDB = price
        if (typeof priceToDB != "number") {
            priceToDB = Number(price.replace(',', '.'))
            if (!priceToDB || priceToDB <= 0.01) {
                dispatch(setModalTitleAndDescription({
                    title: 'Manca qualcosa',
                    description: "Impossibile creare il prodotto. Controlla di aver inserito tutti dati in maniera corretta"
                }))
                return setOpenModalMath(Math.random())
            }
        }

        let photoURLForDB = [];
        let i = 1;
        for await (let photo of photos) {
            try {
                if (photo.blob) {
                    const url = await uploadPhotoFirebase('photo' + i, photo.blob, productId, user.uid)
                    photoURLForDB.push(url)
                } else {
                    //console.log('passa');
                    photoURLForDB.push(photo)
                }
                i++
            } catch {
                addToast({ position: 'top', title: 'Errore upload immagine', description: "errore durante l'upload dell'immagini", status: 'error', duration: 5000, isClosable: false })
                break;
            }
        }
        //console.log(photoURLForDB);


        const options = {
            name: product.name != name ? name : product.name,
            price: product.price != price ? priceToDB : product.price,
            brand: product.brand != brand ? brand : product.brand,
            colors: product.colors != colorsToDB && colorsToDB[0] ? colorsToDB : product.colors,
            sizes: product.sizes != sizes ? sizes : product.sizes,
            photos: product.photos != photos ? photoURLForDB : product.photos,
        }

        // console.log(name, price, brand, colors, macrocategory, microcategory, sizes, photos);
        //console.log(name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender);
        //console.log(product);
        try {
            const areImagesAdded = await editProduct({
                variables: {
                    id: productId,
                    options
                }
            })
            const normalizedId = apolloClient.cache.identify({ id: productId, __typename: 'Product' });
            apolloClient.cache.modify({
                id: normalizedId,
                fields: {
                    name(/* cachedvalue */) {
                        return options.name.toUpperCase()
                    },
                    price(/* cachedvalue */) {
                        return options.price
                    },
                    brand(/* cachedvalue */) {
                        return options.brand
                    },
                    colors(/* cachedvalue */) {
                        return options.colors
                    },
                    sizes(/* cachedvalue */) {
                        return options.sizes
                    },
                    photos(/* cachedvalue */) {
                        return options.photos
                    },
                },
                broadcast: false // Include this to prevent automatic query refresh
            });
            router.push('/shop/prodotti')
        } catch (e) {
            console.log(e);
        }





        // if (!brand || !colors || !macrocategory || !microcategory || !sizes || !photos[2] || !gender) {
        //   return setOpenModalMath(Math.random())
        // }




    }


    return (
        <Desktop_Layout>
            {product && <Product_Form handleSubmitEvent={submitData} defaultValues={{
                name: product.name,
                price: product.price,
                brand: product.brand,
                colors: product.colors,
                macrocategory: product.macroCategory,
                microcategory: product.microCategory,
                sizes: product.sizes,
                photos: product.photos,
                gender: product.gender
            }} type={'edit'} disabled={true} />}
        </Desktop_Layout>
    )
}

export default index