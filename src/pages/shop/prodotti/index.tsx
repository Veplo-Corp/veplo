import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BlackButton from '../../../../components/atoms/BlackButton';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop';
import Table_Products_Shop from '../../../../components/organisms/Table_Products_Shop';
import { ToastOpen } from '../../../../components/utils/Toast';
import deletePhotoFirebase from '../../../../components/utils/deletePhotoFirebase';
import { auth } from '../../../config/firebase';
import { initApollo } from '../../../lib/apollo';
import DELETE_PRODUCT from '../../../lib/apollo/mutations/deleteProduct';
import GET_PRODUCTS_FROM_SHOP from '../../../lib/apollo/queries/geetProductsShop';
import GET_SHOP_BY_FIREBASE_ID from '../../../lib/apollo/queries/getShopByFirebaseId';
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct';
import Verified_Email from '../../../../components/molecules/Verified_Email';
import Shop_UID_Required from '../../../../components/utils/Shop_UID_Required';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { Product } from '../../../interfaces/product.interface';
import Create_Shop_Alert from '../../../../components/molecules/Create_Shop_Alert';


const index = () => {
    const dispatch = useDispatch();
    const user:Firebase_User = useSelector((state:any) => state.user.user);
    const [mathNumber, setMathNumber] = useState(1)
    const { addToast } = ToastOpen();
    const [productToDeleteData, setProductToDeleteData] = useState({})
    const apolloClient = initApollo();


    //delete product
    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache, el) {
            const deleteId = el.data
            console.log(deleteId.deleteProduct);
            const { shop } = cache.readQuery<any>({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: {
                    id: user.shopId //* mettere idShop,
                },
            });
            console.log(shop);

            //*Delete Product
            cache.writeQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: { id: user.shopId  }, //shopId
                data: {
                    shop: {
                        products: shop.products.filter((product:Product) => product.id != deleteId.deleteProduct)
                    }
                }
            })


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
        console.log(apolloClient.cache.extract());
    }



    const handleDeleteProductModal = (productId: string, productName: string, productPhotos: string) => {
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
            //*delete product's images from firebase
            let i = 1;
            for await (let photo of productPhotos) {
                try {
                    await deletePhotoFirebase('photo' + i, productId, user.uid)
                    i++
                } catch (e) {
                    console.log(e);
                    addToast({ position: 'top', title: 'Errore eliminazione prodotto', description: "errore durante l'upload dell'immagini", status: 'error', duration: 5000, isClosable: false })
                    break;
                }
            }
            return addToast({ position: 'top', title: 'Prodotto eliminato', description: `${productName} è stato eliminato con successo`, status: 'success', duration: 5000, isClosable: true })
        }
        catch (e) {
            console.log(e);
        }
    }






    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                {user && user.emailVerified === false &&
                    <Verified_Email />
                }
                {user && !user.shopId &&
                    <Create_Shop_Alert />
                }
                {user && !user?.Not_yet_Authenticated_Request && user?.shopId && <Table_Products_Shop idShop={user.shopId} deleteProduct={handleDeleteProductModal} />}
                <Modal_Error_Shop title={'Elimina prodotto'} description={'confermando eliminerai il prodotto dal tuo negozio'} closeText={'annulla'} openModalMath={mathNumber} confirmText={'conferma'} data={productToDeleteData} handleEvent={deleteProductEvent} />
                <button
                    onClick={handleCache}
                >handleCache</button>
            </Desktop_Layout >
        </Shop_UID_Required>
    )
}

export default index