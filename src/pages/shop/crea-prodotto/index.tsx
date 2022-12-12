import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { CheckIcon, DownloadIcon } from '@chakra-ui/icons'
import { Box, Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Autocomplete from '../../../../components/atoms/Autocomplete_Headless'
import BlackButton from '../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import Select_multiple_options from '../../../../components/atoms/Select_multiple_options'
import Select_options from '../../../../components/atoms/Select_options'
import { BRANDS } from '../../../../components/mook/brands'
import { CATEGORIES, Categories, Category } from '../../../../components/mook/categories'
import { Color, COLORS } from '../../../../components/mook/colors'
import { MACROCATEGORY, Macrocategory } from '../../../../components/mook/macrocategories'
import { MICROCATEGORY, Microcategory } from '../../../../components/mook/microcategories'
import Drawer_Add_Image from '../../../../components/organisms/Drawer_Add_Image'
import Modal_Error_Shop from '../../../../components/organisms/Modal_Error_Shop'
import Product_Form from '../../../../components/organisms/Product_Form'
import Shop_UID_Required from '../../../../components/utils/Shop_UID_Required'
import { ToastOpen } from '../../../../components/utils/Toast'
import uploadPhotoFirebase from '../../../../components/utils/uploadPhotoFirebase'
import { Firebase_User } from '../../../interfaces/firebase_user.interface'
import { initApollo } from '../../../lib/apollo'
import CREATE_PRODUCT from '../../../lib/apollo/mutations/createProduct'
import EDIT_PRODUCT from '../../../lib/apollo/mutations/editProduct'
import GET_PRODUCTS_FROM_SHOP from '../../../lib/apollo/queries/geetProductsShop'
import GET_SHOP_BY_FIREBASE_ID from '../../../lib/apollo/queries/getShopByFirebaseId'
import { setModalTitleAndDescription } from '../../../store/reducers/modal_error'


export interface IFormInput {
  name: string;
  price: string;
  brand: string;
  colors: Color[];
  macrocategory: Category;
  microcategory: string;
  sizes: Macrocategory[];
  photos: any[];
  gender: 'M' | 'F' | undefined
}

const index = () => {
  const { addToast } = ToastOpen();
  const dispatch = useDispatch();
  const apolloClient = initApollo();
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const user:Firebase_User = useSelector((state:any) => state.user.user);
  //* graphQL
  


  const { error, data, refetch } = useQuery(GET_PRODUCTS_FROM_SHOP, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    variables: { id: user?.shopId },
    // pollInterval: 500,
    // notifyOnNetworkStatusChange: true,
  });
  
  
  //redirect to createShop,whether there is not a Shop
  if (error && user?.Not_yet_Authenticated_Request === false) {
    router.push('/shop/crea-shop')
  }



  const [createProduct, Element] = useMutation(CREATE_PRODUCT, {
    update(cache, el) {
      console.log(el);
    }
  }

  );
  const [editProduct, editProductResult] = useMutation(EDIT_PRODUCT);

  const [openModalMath, setOpenModalMath] = useState(1);
  const submitData = async ({ name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender }: IFormInput) => {
    // console.log(name, price, brand, colors, macrocategory, microcategory, sizes, photos);
    // if (!brand || !colors || !macrocategory || !microcategory || !sizes || !photos[2] || !gender) {
    //   return setOpenModalMath(Math.random())
    // }
    setLoading(true)




    try {
      if (photos.length < 2) {
        throw new Error('poche immagini')
      }

      const colorsToDB = colors.map((color) => {
        return color.name
      })


      const priceToDB = Number(price.replace(',', '.'))

      if (!priceToDB || priceToDB <= 0.01) {
        dispatch(setModalTitleAndDescription({
          title: 'Manca qualcosa',
          description: "Impossibile creare il prodotto. Controlla di aver inserito tutti dati in maniera corretta"
        }))
        return setOpenModalMath(Math.random())

      }

      let Product = {
        name,
        price: priceToDB,
        colors: colorsToDB,
        sizes: sizes,
        macroCategory: macrocategory.name,
        microCategory: microcategory,
        gender: gender,
        brand: brand,
        photos: [''],
      }

      console.log(Product);

      const isCreatedProduct = await createProduct({ variables: { shopId: user.shopId, options: Product } })
      //* alert to show product creation process OK!
      //upload Images to database
      console.log(isCreatedProduct);
      const productId = isCreatedProduct.data.createProduct;
      let photoURLForDB = [];
      let i = 1;
      console.log(photos);
      for await (let photo of photos) {
        try {
          const url = await uploadPhotoFirebase('photo' + i, photo.blob, productId, user.uid)
          photoURLForDB.push(url)
          i++
        } catch {
          addToast({ position: 'top', title: 'Errore upload immagine', description: "errore durante l'upload dell'immagini", status: 'error', duration: 5000, isClosable: false })
          break;
        }
      }

      const areImagesAdded = await editProduct({
        variables: {
          id: productId, options: {
            photos: photoURLForDB
          }
        }
      })

      const prodoctForGQLCache = {
        ...Product,
        photos: photoURLForDB,
        id: productId,
        shopId: user.shopId,
        firebaseShopId: user.uid,
        updatedAt: 'ora',
        location: {
          type: 'Points',
          coordinates: [1, 1],
          __typename: 'Location'
        },
        shop: {
          city: "Terni",
          name: "Sartoria Rizzo Merlini",
          __typename: "Lightshop",
        },
        __typename: 'Product'
      }

      const { shop } = apolloClient.readQuery({
        query: GET_PRODUCTS_FROM_SHOP,
        // Provide any required variables in this object.
        // Variables of mismatched types will return `null`.
        variables: {
          id: user.shopId //* mettere idShop,
        },
      });

      if (shop) {
        apolloClient.writeQuery({
          query: GET_PRODUCTS_FROM_SHOP,
          variables: { id: user.shopId }, //*idShop
          data: {
            shop: {
              products: [
                ...shop.products,
                prodoctForGQLCache
              ]
            }
          }
        })
      }


      if (isCreatedProduct.data.createProduct && areImagesAdded.data.editProduct) {
        router.push('/shop/prodotti')
        return addToast({ position: 'top', title: 'Prodotto creato con successo', description: 'controlla il tuo nuovo prodotto nella sezione dedicata', status: 'success', duration: 5000, isClosable: true })
      }
      else {
        return addToast({ position: 'top', title: 'Impossibile creare il prodotto', description: "c'è stato un errore durante la creazione del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
      }

    } catch (e:any) {
      console.log(e);
      console.log(e.code);
      console.log(e.message);
      addToast({ position: 'top', title: 'Impossibile creare il prodotto', description: "c'è stato un errore durante la creazione del prodotto, riprova più tardi", status: 'error', duration: 5000, isClosable: true })
    }

  
    setLoading(false)

  }


  return (
    <>
      {user?.shopId ? (
        <Shop_UID_Required>
          <Desktop_Layout>
            <Product_Form handleSubmitEvent={submitData} defaultValues={{ photos: [] }} disabled={false} 
            titleText={'Aggiungi un capo di abbigliamento'}
            confirmButtonText={'aggiungi'}
            loading={loading}
            />
          </Desktop_Layout>
        </Shop_UID_Required>
      )
        : (
          <></>
        )
      }
    </>

  )
}

export default index