import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { EditIcon } from '@chakra-ui/icons';
import { Box, FormControl, FormLabel, Switch, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation';
import { Color, COLORS } from '../../../../../../components/mook/colors';
import Image_Product from '../../../../../../components/organisms/Image_Product';
import Modal_Edit_Discount from '../../../../../../components/organisms/Modal_Edit_Discount';
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import PostMeta from '../../../../../../components/organisms/PostMeta';
import Product_Form from '../../../../../../components/organisms/Product_Form';
import { imageKitUrl } from '../../../../../../components/utils/imageKitUrl';
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
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const toast = useToast()

    const { addToast } = ToastOpen();
    const [editProduct] = useMutation(EDIT_PRODUCT)
    const dispatch = useDispatch();
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();
    const apolloClient = initApollo();
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [openModalMath, setOpenModalMath] = useState(1);
    const [loading, setLoading] = useState(false)
    const [loadingHandleDiscount, setLoadingHandleDiscount] = useState(false)

    const { productId } = router.query

    const [loadShop, { data, error }] = useLazyQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-first',
        //nextFetchPolicy: 'cache-first',
        variables: { id: user?.shopId, limit: 100, offset: 0 },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    });

    console.log(error);


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
                    description: "Impossibile creare il prodotto. Controlla di aver inserito tutti i dati in maniera corretta"
                }))
                setLoading(false)
                return setOpenModalMath(Math.random())
            }
        }

        let photoURLForDB = [];
        let i = 1;
        for await (let photo of photos) {
            try {
                if (photo.blob) {
                    //const url = await uploadPhotoFirebase('photo' + i, photo.blob, productId, user.uid)
                    const url = await uploadPhotoFirebase(photo.blob, `/${user.uid}/prodotti/${productId}/${'photo' + i}`)

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
        if (!product) return setLoading(false)

        const options = {
            name: product.name != name ? name : product.name,
            price: product.price != price ? priceToDB : product.price,
            brand: product.brand != brand ? brand : product.brand,
            colors: product.colors != colorsToDB && colorsToDB[0] ? colorsToDB : product.colors,
            sizes: product.sizes != sizes ? sizes : product.sizes,
            //!remove photos 
            //! should use newPhotos: [Upload!] & deletedPhotos: [String!]
            // photos: product.photos != photos ? photoURLForDB : product.photos,
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
                    // photos(/* cachedvalue */) {
                    //     return options.photos
                    // },
                },
                broadcast: false // Include this to prevent automatic query refresh
            });

            addToast({ position: 'top', title: 'Prodotto aggiornato con successo', description: `${options.name.toUpperCase()} è stato aggiornato con successo. Controla nella sezione dedicata`, status: 'success', duration: 5000, isClosable: true })

        } catch (e: any) {

            console.log(e?.message);

            if (e?.message === "you didn't edit any fields") {

            } else {
                addToast({ position: 'top', title: 'Impossibile aggiornare il prodotto', description: "c'è stato un errore durante l'aggiornamento del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
            }
        }

        setLoading(false)
    }

    const setNewImages = (images: any) => {
        if (product) {
            setProduct((prevstate: any) => {
                return {
                    ...prevstate,
                    photos: images
                }
            })

        }
    }

    const handleDiscountChange = () => {
        setLoadingHandleDiscount(true)
        setTimeout(() => {
            setIsOpen(false)
            setLoadingHandleDiscount(false)
            addToast({
                position: 'top', title: 'Sconto aggiornato con successo',
                description:
                    <table className='w-full font-light'>
                        <tbody>
                            <tr>
                                <th className='text-left'>Prezzo Reale</th>
                                <td className='text-right'>100€</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Percentuale Sconto</th>
                                <td className='text-right'>20%</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Prezzo scontato</th>
                                <td className='text-right'>80€</td>
                            </tr>
                        </tbody>


                    </table>
                ,
                status: 'success', duration: 8000, isClosable: true
            })

        }, 2000);
    }


    if (!product) { return (<></>) }


    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                <NoIndexSeo title={`Modifica prodotto | Veplo`} />
                {product &&
                    <>
                        <div className='md:flex justify-center'>
                            <div className='w-full sm:w-fit lg:w-4/12 h-fit grid gap-5 grid-cols-2 mt-8'>
                                {product.photos?.map((image: any, id: number) => {
                                    return (
                                        // <div key={id} className='flex w-fit md:w-40 h-fit'>
                                        //     {!image.url ? (
                                        //         <img
                                        //             className='rounded'
                                        //             src={image} alt="" />
                                        //     ) :
                                        //         (
                                        //             <img
                                        //                 className='rounded'
                                        //                 src={image.url} alt="" />
                                        //         )
                                        //     }
                                        // </div>
                                        <img
                                            key={image}
                                            className='rounded'
                                            src={imageKitUrl(image, 305, 440)} alt="immagine non trovata" />
                                    )
                                })}
                            </div>
                            <div className='md:w-1/2 lg:w-5/12'>
                                <div
                                    className="mt-4 md:mt-0 px-4 mb-[-25px] lg:px-12 xl:px-20 w-full"
                                >
                                    <FormControl
                                        rounded={10}
                                        padding={3.5}
                                        mb={1}
                                        borderWidth={1}
                                        borderColor={'gray.200'}
                                        lineHeight='tight'
                                        noOfLines={1}
                                        display='flex'
                                        justifyContent={'space-between'}
                                        onChange={() => {
                                            setIsActive(prevState => {
                                                return !prevState
                                            })
                                        }}
                                    >
                                        <FormLabel htmlFor='email-alerts' mb='0'
                                            fontWeight={'normal'}
                                        >
                                            Prodotto attivo
                                        </FormLabel>
                                        <Switch
                                            size={'md'}
                                            my={'auto'}
                                            colorScheme='green'
                                            isChecked={isActive}
                                        />
                                    </FormControl>
                                    <Div_input_creation text='Applica sconto'>
                                        <Box
                                            rounded={10}
                                            padding={3.5}
                                            mt={1}
                                            borderWidth={1}
                                            borderColor={'gray.200'}
                                            lineHeight='tight'
                                            noOfLines={1}
                                            fontSize='sm'
                                            className='cursor-pointer'
                                            style={{
                                                background: 'linear-gradient(0deg, rgba(169,99,224,1) 0%, rgba(6,214,160,1) 100%)'
                                            }}
                                            onClick={() => {
                                                setIsOpen(true)
                                            }}
                                        >
                                            <div
                                                className={`w-full flex justify-between text-white`}
                                            >
                                                <div className='w-1/4 text-start my-auto'>
                                                    {false ?
                                                        (<span>
                                                            Crea sconto
                                                        </span>)
                                                        :
                                                        (
                                                            <span className='px-2 py-1 bg-white rounded-3xl text-black mr-2'>
                                                                20%
                                                            </span>

                                                        )
                                                    }
                                                </div>

                                                {true &&
                                                    <span className='my-auto text-xs'>
                                                        prezzo scontato: 80,00€
                                                    </span>
                                                }
                                                <div className='w-1/4 text-end my-auto'>
                                                    <EditIcon
                                                        w={4} h={4}
                                                        my={'auto'}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                            </div>
                                        </Box>
                                    </Div_input_creation>
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
                                    backbutton={true}
                                />
                            </div>
                        </div>
                        <Modal_Edit_Discount isOpen={isOpen}
                            onConfirm={() => {
                                handleDiscountChange()
                            }}
                            onClose={
                                () => {
                                    setIsOpen(false)
                                }
                            }
                            loading={loadingHandleDiscount}

                        />
                    </>
                }
            </Desktop_Layout>
        </Shop_UID_Required>

    )
}

export default index