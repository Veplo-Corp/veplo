import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import { Color, COLORS } from '../../../../../../components/mook/colors';
import Image_Product from '../../../../../../components/organisms/Image_Product';
import Product_Form from '../../../../../../components/organisms/Product_Form';
import Shop_UID_Required from '../../../../../../components/utils/Shop_UID_Required';
import { ToastOpen } from '../../../../../../components/utils/Toast';
import uploadPhotoFirebase from '../../../../../../components/utils/uploadPhotoFirebase';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import { Product } from '../../../../../interfaces/product.interface';
import { initApollo } from '../../../../../lib/apollo';
import EDIT_PRODUCT from '../../../../../lib/apollo/mutations/editProduct';
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop';
import GET_SHOP_BY_FIREBASE_ID from '../../../../../lib/apollo/queries/getShopByFirebaseId';
import { setModalTitleAndDescription } from '../../../../../store/reducers/modal_error';

const index = () => {
    const { addToast } = ToastOpen();
    const [editProduct] = useMutation(EDIT_PRODUCT)
    const dispatch = useDispatch();
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();
    const apolloClient = initApollo();
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [openModalMath, setOpenModalMath] = useState(1);
    const [loading, setLoading] = useState(false)

    const { productId } = router.query

    const [loadShop, { data, error }] = useLazyQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-first',
        //nextFetchPolicy: 'cache-first',
        variables: { id: user?.shopId },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    });

    //redirect to createShop,whether there is not a Shop
    if (error) {
        router.push('/shop/crea-shop')
    }



    useEffect(() => {
        if (user && user?.shopId) {
            loadShop()
        }
    }, [user])

    useEffect(() => {
        console.log(data);

        if (!data) {
            //router.push('/shop/prodotti/')
            return
        }
        const product = data.shop.products.filter((product: Product) => product.id === productId)[0]

        setProduct(product)
    }, [data])



    const submitData = async ({ name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender }: any) => {
        //console.log(photos);
        setLoading(true)
        let colorsToDB;
        colorsToDB = colors.map((color: any) => {
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
        if(!product)return setLoading(false)

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
            addToast({ position: 'top', title: 'Prodotto aggiornato con successo', description: `${options.name.toUpperCase()} è stato aggiornato con successo. Controla nella sezione dedicata`, status: 'success', duration: 5000, isClosable: true })

        } catch (e) {            
            addToast({ position: 'top', title: 'Impossibile aggiornare il prodotto', description: "c'è stato un errore durante l'aggiornamento del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
        }

        setLoading(false)
    }

    const setNewImages = (images:any) => {        
        if(product){
            setProduct((prevstate:any) => {
                return{
                    ...prevstate,
                    photos: images
                }
            })
            
        }
    }

    if (!product) { return (<></>) }


    return (
        <Shop_UID_Required>
            <Desktop_Layout>

                {product &&
                    <>
                        <div className='md:flex justify-center'>
                            <div className='w-full  md:w-fit h-fit grid gap-5 grid-cols-2 mt-8'>
                                {product.photos?.map((image: any, id: number) => {                                    
                                    return (
                                        <div key={id} className='flex w-fit md:w-40 h-fit'>
                                            {!image.url ? (
                                                <img
                                                    className='rounded'
                                                    src={image} alt="" />
                                            ) :
                                                (
                                                    <img
                                                        className='rounded'
                                                        src={image.url} alt="" />
                                                )
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                            <Product_Form handleSubmitEvent={submitData} defaultValues={{
                                name: product.name,
                                price: product.price,
                                brand: product.brand,
                                colors: product.colors,
                                macrocategory: product.macroCategory,
                                microcategory: product.microCategory,
                                sizes: product.sizes,
                                photos: product.photos,
                                gender: product.gender
                            }} type={'edit'} disabled={true}
                                titleText={''}
                                confirmButtonText={'modifica'} 
                                toParentPhoto={setNewImages}
                                loading={loading}
                                />
                        </div>
                    </>
                }
            </Desktop_Layout>
        </Shop_UID_Required>

    )
}

export default index