import { useMutation } from '@apollo/client';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop';
import Table_Products_Shop from '../../../../components/organisms/Table_Products_Shop';
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification';
import { ToastOpen } from '../../../../components/utils/Toast';
import { auth } from '../../../config/firebase';
import DELETE_PRODUCT from '../../../lib/apollo/mutations/deleteProduct';


const index = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [mathNumber, setMathNumber] = useState(1)
    const { addToast } = ToastOpen();
    const [productToDeleteData, setProductToDeleteData] = useState({})


    //delete product
    const [deleteProduct, { data, loading, error }] = useMutation(DELETE_PRODUCT);

    const handleDeleteProductModal = (productId:string, productName: string) => {
        setProductToDeleteData({
            productId,
            productName
        })
        setMathNumber(Math.random())
    }

    const deleteProductEvent = async({productId, productName }: {productId:string, productName:string}) => {
        try {
            await deleteProduct({variables: {id: productId}})
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
            <Modal_Error_Shop title={'Elimina prodotto'} description={'confermando eliminerai il prodotto dal tuo negozio'} closeText={'annulla'} openModalMath={mathNumber} confirmText={'conferma'} data={productToDeleteData} handleEvent={deleteProductEvent}/>
        </Desktop_Layout >

    )
}

export default index