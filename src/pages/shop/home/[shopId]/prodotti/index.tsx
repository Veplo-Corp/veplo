import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Tag, Text } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BlackButton from '../../../../../../components/atoms/BlackButton';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import Modal_Error_Shop from '../../../../../../components/organisms/Modal_Error_Shop';
import Table_Products_Shop from '../../../../../../components/organisms/Table_Products_Shop';
import { ToastOpen } from '../../../../../../components/utils/Toast';
import deletePhotoFirebase from '../../../../../../components/utils/deletePhotoFirebase';
import { auth } from '../../../../../config/firebase';
import { initApollo } from '../../../../../lib/apollo';
import DELETE_PRODUCT from '../../../../../lib/apollo/mutations/deleteProduct';
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop';
import GET_SINGLE_PRODUCT from '../../../../../lib/apollo/queries/getSingleProduct';
import Verified_Email from '../../../../../../components/molecules/Verified_Email/Verified_Email';
import Shop_UID_Required from '../../../../../../components/utils/Shop_UID_Required';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import { Product } from '../../../../../interfaces/product.interface';
import Create_Shop_Alert from '../../../../../../components/molecules/Create_Shop_Alert';
import PostMeta from '../../../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import { useRouter } from 'next/router';
import { addShopFavouriteToLocalStorage } from '../../../../../../components/utils/shop_localStorage';
import GET_BUSINESS from '../../../../../lib/apollo/queries/business';
import { Business } from '../../../../../interfaces/business.interface';
import { addFavouriteShopBusiness } from '../../../../../store/reducers/user';
import { Shop } from '../../../../../interfaces/shop.interface';
import ShopInfoSection from '../../../../../../components/molecules/ShopInfoSection';

interface Props {
    business: Business
}

const index = () => {
    const dispatch = useDispatch();
    const router = useRouter()
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [mathNumber, setMathNumber] = useState(1)
    const { addToast } = ToastOpen();
    const [productToDeleteData, setProductToDeleteData] = useState({})
    const apolloClient = initApollo();
    const [shopId, setShopId] = useState('')
    const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);

    const [shop, setShop] = useState<Shop>()


    useEffect(() => {
        const { shopId } = router.query


        if (!user?.isBusiness || !shopId || typeof shopId !== 'string') return
        setShopId(shopId)
        getBusiness({
            variables: {
                id: user.accountId
            }
        }).then((value) => {
            if (!value.data?.business) return
            const business: Business = value.data?.business;
            const shop = business?.shops?.find(shop => shop.id === shopId);
            setShop(shop)
            if (shopId && (!user.favouriteShop?.id || user.favouriteShop?.id !== shopId)) {
                const element = {
                    id: shopId,
                    name: shop?.name,
                    street: shop?.address.city + ', ' + shop?.address.street
                }
                addShopFavouriteToLocalStorage(element)
                dispatch(
                    addFavouriteShopBusiness(element)
                )
            }
        })
        return () => {

        }
    }, [user, router])



    //delete product
    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache, el) {
            const deleteId = el.data




            //*delete old data, finding serialized number
            const normalizedId = cache.identify({ id: deleteId.deleteProduct, __typename: 'Product' });
            cache.evict({ id: normalizedId });
            //*The gc method removes all objects from the normalized cache that are not reachable:
            //cache.gc();

            setTimeout(async () => {
                handleCache()
            }, 2000);
        }
    });



    const handleCache = () => {

    }



    const handleDeleteProductModal = (productId: string, productName: string, productPhotos: string, products?: any) => {
        // for (let i = 0; i < products.length; i++) {
        //     deleteProduct({ variables: { id: products[i].id } })
        // }
        //!restart this logic in production
        setProductToDeleteData({
            productId,
            productName,
            productPhotos
        })
        setMathNumber(Math.random())
    }

    const deleteProductEvent = async ({ productId, productName, productPhotos }: { productId: string, productName: string, productPhotos: string[] }) => {
        try {
            await deleteProduct({ variables: { id: productId } })
            return addToast({ position: 'top', title: 'Prodotto eliminato', description: `${productName} è stato eliminato con successo`, status: 'success', duration: 5000, isClosable: true })
        }
        catch (e) {

        }
    }






    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Prodotti | Veplo Shop`} />
            {shop &&
                <ShopInfoSection shop={shop} shopStreet={user?.favouriteShop?.street} />
            }

            {user && user.statusAuthentication === 'logged_in' && shopId !== '' &&
                <Table_Products_Shop idShop={shopId} deleteProduct={handleDeleteProductModal} />}
            <Modal_Error_Shop title={'Elimina prodotto'} description={'confermando eliminerai il prodotto dal tuo negozio'} closeText={'annulla'} openModalMath={mathNumber} confirmText={'conferma'} data={productToDeleteData} handleEvent={deleteProductEvent} />

        </Desktop_Layout >
    )
}

export default index




