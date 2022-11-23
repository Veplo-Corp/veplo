import { useMutation } from '@apollo/client';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BlackButton from '../../../../components/atoms/BlackButton';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop';
import Table_Products_Shop from '../../../../components/organisms/Table_Products_Shop';
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification';
import { ToastOpen } from '../../../../components/utils/Toast';
import deletePhotoFirebase from '../../../../components/utils/deletePhotoFirebase';
import { auth } from '../../../config/firebase';
import { initApollo } from '../../../lib/apollo';
import DELETE_PRODUCT from '../../../lib/apollo/mutations/deleteProduct';
import GET_PRODUCTS_FROM_SHOP from '../../../lib/apollo/queries/geetProductsShop';
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct';


const index = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [mathNumber, setMathNumber] = useState(1)
    const { addToast } = ToastOpen();
    const [productToDeleteData, setProductToDeleteData] = useState({})
    const apolloClient = initApollo();


    //delete product
    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache, el) {
            const deleteId = el.data
            console.log(deleteId.deleteProduct);
            //mi devi dare l'id come data dalla delete
            /* 637746060742ade8758b1aa9 */
            const { shop } = cache.readQuery<any>({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: {
                    id: '6373bb3c0742ade8758b1a97'//* mettere idShop,
                },
            });
            console.log(shop);

            //*Delete Product
            cache.writeQuery({
                query: GET_PRODUCTS_FROM_SHOP,
                variables: { id: deleteId.deleteProduct },
                data: {
                    shop: {
                        products: shop.products.filter(product => product.id != deleteId.deleteProduct)
                    }
                }
            })




            //! add new product on Cache
            // let newProduct = {
            //     ...shop.products[0],
            //     id: 'cacca'
            // }

            // console.log(newProduct);
            // newProduct['id'] = '637746060742ade875869100'
            // newProduct['name']= 'CHE COSA STA SUCCEDENDO'
            // cache.writeQuery({
            //     query: GET_PRODUCTS_FROM_SHOP,
            //     variables: { id: '6373bb3c0742ade8758b1a97' },
            //     data: {
            //         shop: {
            //             products: [
            //                 ...shop.products,
            //                 newProduct
            //             ]
            //         }
            //     }
            // })


            //*delete old data, finding serialized number
            const normalizedId = cache.identify({ id: deleteId.deleteProduct, __typename: 'Product' });
            cache.evict({ id: normalizedId });
            //*The gc method removes all objects from the normalized cache that are not reachable:
            //cache.gc();

            setTimeout(async () => {
                console.log(apolloClient.cache.extract());
                const { shop } = apolloClient.readQuery({
                    query: GET_PRODUCTS_FROM_SHOP,
                    // Provide any required variables in this object.
                    // Variables of mismatched types will return `null`.
                    variables: {
                        id: '6373bb3c0742ade8758b1a97' //* mettere idShop,
                    },
                });
                console.log(shop.products);
            }, 2000);
        }
    });




    const handleDeleteProductModal = (productId: string, productName: string, productPhotos:string) => {        
        setProductToDeleteData({
            productId,
            productName,
            productPhotos
        })
        setMathNumber(Math.random())
    }

    const deleteProductEvent = async ({ productId, productName, productPhotos }: { productId: string, productName: string, productPhotos:string[] }) => {                
        try {
            await deleteProduct({ variables: { id: productId } })
            //*delete product's images from firebase
            let i = 1;
            for await (let photo of productPhotos) {                
                try {
                    await deletePhotoFirebase('photo'+i ,productId, user.uid)
                    i++
                } catch(e) {
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
        <Desktop_Layout>
            {user.emailVerified === false &&
                <Alert status='warning' maxW={1000} className='m-auto' >
                    <AlertIcon />
                    <Box className='w-full'>
                        <AlertTitle className='hidden md:flex'>Convalida la tua mail!</AlertTitle>
                        <AlertDescription className='text-md'>
                            <span className='leading-0'>
                                Controlla la casella mail e convalida l'account, poi ricarica la pagina
                            </span>
                            <br />
                            <div className='flex md:hidden '>
                                <Button colorScheme={'black'} variant='link'>
                                    <span className='underline'>invia mail di nuovo</span>
                                </Button>
                            </div>
                        </AlertDescription>
                    </Box>
                    <div className='hidden md:flex justify-end'>
                        <Button onClick={sendEmailVerificationHanlder} colorScheme={'orange'}>
                            invia nuova mail
                        </Button>
                    </div>

                </Alert>
            }
            <Table_Products_Shop idShop={'6373bb3c0742ade8758b1a97'} deleteProduct={handleDeleteProductModal} />
            <Modal_Error_Shop title={'Elimina prodotto'} description={'confermando eliminerai il prodotto dal tuo negozio'} closeText={'annulla'} openModalMath={mathNumber} confirmText={'conferma'} data={productToDeleteData} handleEvent={deleteProductEvent} />
        </Desktop_Layout >

    )
}

export default index