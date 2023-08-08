
import '../styles/globals.css'
import type { AppProps } from 'next/app'
// 1. import `ChakraProvider` component
import { Box, Center, ChakraProvider, CircularProgress, Text, VStack } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store/store'
import { FC, useEffect, useRef, useState } from 'react'
import { auth, onAuthStateChanged, signOut } from '../config/firebase'
import user, { addFavouriteShopBusiness, login, logout } from '../store/reducers/user'
import { setAddress } from '../store/reducers/address_user'
import { useRouter } from 'next/router'
import { ApolloProvider, useLazyQuery } from '@apollo/client'
import { initApollo, useApollo } from '../lib/apollo'
import { getAddressFromLocalStorage } from '../../components/utils/getAddress_from_LocalStorage'
import { setAuthTokenInSessionStorage } from '../../components/utils/setAuthTokenInSessionStorage'
import modal_error, { openModal } from '../store/reducers/globalModal'
import Router from "next/router";
import { Firebase_User } from '../interfaces/firebase_user.interface'
import Loading from '../../components/molecules/Loading'
import Footer from '../../components/organisms/Footer'
import PostMeta from '../../components/organisms/PostMeta'
import Script from 'next/script'
import { Open_Sans, Work_Sans } from 'next/font/google'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import GET_BUSINESS from '../lib/apollo/queries/business'
import GET_USER from '../lib/apollo/queries/getUser'

import { Business } from '../interfaces/business.interface'
import { getFavouriteShopFromLocalStorage } from '../../components/utils/getFavouriteShopFromLocalStroage'
import Header from '../../components/organisms/Header'
import { resetCarts, setCarts } from '../store/reducers/carts'
import { detroyOrders, setOrders } from '../store/reducers/orders'
import { setBrands } from '../store/reducers/brands'
import ModalWrapper from '../../components/organisms/ModalWrapper'
import { Cart, CartWarning, Order } from '../lib/apollo/generated/graphql'
import { deleteAuthTokenInSessionStorage } from '../../components/utils/deleteAuthTokenSessionStorage'
import WarningCard from '../../components/molecules/WarningCard'


const theme = extendTheme({

  colors: {
    primary: {
      bg: '#FF5A78',
      text: '#FFFFFF',
      opacityBg: '#FFE8EC',
      secondaryText: "#E0E0E0"
    },
    secondary: {
      bg: "#37D1A9",
      text: '#FFFFFF',
    },
    primaryBlack: {
      text: '#222222'
    },
    secondaryBlack: {
      text: '#3A3A3A',
      borderColor: '#EFEFEF'
    },
    inputLoginColor: {
      bg: "#F2F2F2",
      text: '#A19F9F',
    },
    successTag: {
      text: "#FFFFFF",
      bg: "#37D1A9"
    },
    pendingTag: {
      text: "#222222",
      bg: "#FFF7BC"
    },
    cancelTag: {
      text: "#FFFFFF",
      bg: "#C63F3F"
    },
    grayTag: {
      text: "#222222",
      bg: "#F2F2F2"
    }
  },
  components: {


    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        primary: {
          bg: "primary.bg", // Usa il colore primario come sfondo
          color: "white", // Testo bianco
          _hover: {
            bg: "primary.bg", // Cambia il colore in primario al passaggio del mouse
            opacity: 1,
            color: "primary.text"
          },
          _active: {
            bg: "primary.bg",
            transform: 'scale(0.98)',
          },
          _disabled: {
            bg: "primary.bg",
            opacity: 1,
            transform: "scale(0.98)",
            // _hover: {
            //   bg: "primary.bg", // Mantieni il colore di sfondo primario quando disabilitato e fai hover
            //   color: "primary.text", // Cambia il colore del testo quando disabilitato e fai hover
            // },
          },

        },
        whiteButton: {
          bg: "white", // Usa il colore primario come sfondo
          color: "secondaryBlack.text", // Testo bianco
          borderColor: "#gray",
          borderWidth: "1px",
          borderStyle: "solid",
          _hover: {
            bg: "white", // Cambia il colore in primario al passaggio del mouse
            opacity: 1,
            color: "secondaryBlack.text"
          },
          _active: {
            bg: "white",
            transform: 'scale(0.98)',
          },
          _disabled: {
            bg: "white",
            opacity: 1,
            transform: "scale(0.98)",
            // _hover: {
            //   bg: "white", // Mantieni il colore di sfondo primario quando disabilitato e fai hover
            //   color: "primary.text", // Cambia il colore del testo quando disabilitato e fai hover
            // },
          },

        },
        secondary: {
          bg: "secondary.bg", // Usa il colore primario come sfondo
          color: "white", // Testo bianco
          _hover: {
            bg: "secondary.bg", // Cambia il colore in primario al passaggio del mouse
          },
          _active: {
            bg: "secondary.bg",
            transform: 'scale(0.98)',
          }
        },
        grayPrimary: {
          bg: "#F2F2F2", // Usa il colore primario come sfondo
          color: "secondaryBlack.text", // Testo bianco
          _hover: {
            bg: "#F2F2F2", // Cambia il colore in primario al passaggio del mouse
          },
          _active: {
            bg: "#F2F2F2",
            transform: 'scale(0.98)',
          }
        },
        black: {
          bg: "#000000", // Usa il colore primario come sfondo
          color: "white", // Testo bianco
          _hover: {
            bg: "#000000", // Cambia il colore in primario al passaggio del mouse
            opacity: 1,
            color: "primary.text"
          },
          _active: {
            bg: "#000000",
            transform: 'scale(0.98)',
          },
          _disabled: {
            bg: "#000000",
            opacity: 1,
            transform: "scale(0.98)",
            // _hover: {
            //   bg: "primary.bg", // Mantieni il colore di sfondo primario quando disabilitato e fai hover
            //   color: "primary.text", // Cambia il colore del testo quando disabilitato e fai hover
            // },
          },

        },
        whitePrimary: {
          bg: "#FFFFFF", // Usa il colore primario come sfondo
          color: "#A19F9F", // Testo bianco
          borderWidth: 1,
          borderColor: "#F2F2F2",
          _hover: {
            bg: "#FFFFFF", // Cambia il colore in primario al passaggio del mouse
            opacity: 1,
            color: "#A19F9F"
          },
          _active: {
            bg: "#FFFFFF",
            transform: 'scale(0.98)',
          },
          _disabled: {
            bg: "#000000",
            opacity: 1,
            transform: "scale(0.98)",
            // _hover: {
            //   bg: "primary.bg", // Mantieni il colore di sfondo primario quando disabilitato e fai hover
            //   color: "primary.text", // Cambia il colore del testo quando disabilitato e fai hover
            // },
          },

        },
      },
    },
  },
  zIndex: {
    drawer: '1'
  }
})

const sans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
})


const Auth: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);
  const [getUser] = useLazyQuery(GET_USER);



  const fetchBrandsFromDB = async () => {

    const endpoint = process.env.NEXT_PUBLIC_APOLLO_URI + `/brands`
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        mode: 'cors', // Puoi scegliere tra 'no-cors', 'cors', o 'same-origin' a seconda delle tue esigenze
      });


      if (response.ok) {
        const result = await response.json();

        if (!result) return;

        dispatch(setBrands(result));
      } else {
        //console.log('La chiamata API non è andata a buon fine. Stato:', response.status);
      }
    } catch (error) {
      //console.log('Si è verificato un errore durante la chiamata API:', error);
    }

  }



  //* check at page load if a user is authenticated
  useEffect(() => {
    //* GET the user address from localstorage
    const address_user = getAddressFromLocalStorage();


    onAuthStateChanged(auth, async (userAuth) => {
      //signOut(auth)
      const apolloClient = initApollo()
      if (userAuth) {
        //analytics
        //setUserId(analytics, userAuth.uid);
        //setUserProperties(analytics, { favorite_food: 'apples' });
        const idToken = await userAuth.getIdToken(true)
        setAuthTokenInSessionStorage(idToken)
        const tokenResult = await userAuth.getIdTokenResult()
        console.log(tokenResult);


        // user is logged in, send the user's details to redux, store the current user in the state
        const isBusiness = tokenResult.claims.isBusiness ? true : false;
        if (!isBusiness && tokenResult.claims.mongoId) {
          dispatch(
            login({
              statusAuthentication: 'logged_in',
              email: userAuth.email,
              uid: userAuth.uid,
              idToken: idToken,
              emailVerified: userAuth.emailVerified,
              accountId: tokenResult.claims.mongoId,
              expirationTime: tokenResult.expirationTime,
              userInfo: {
                name: userAuth.displayName
              }
            })
          );
          getUser().then((data) => {
            if (!data.data) return


            let carts: Cart[] = data?.data?.user?.carts?.carts ? data?.data?.user?.carts?.carts : []


            carts = carts.map(cart => {
              if (!cart?.productVariations || cart?.productVariations?.length > 0) {
                const sortedProductVariations = cart.productVariations ? [...cart.productVariations].filter((oggetto) => oggetto !== null).sort((a: any, b: any) => (a?.id > b?.id) ? 1 : -1) : [];
                return { ...cart, productVariations: sortedProductVariations };
              }
              return cart;
            });


            //const orders: Order[] = data?.data?.user?.orders ? data?.data?.user?.orders : [];
            //TODO Non gestiamo il caso in cui un prodotto venga eliminato
            //TODO per questo abbiamo messo un filter su isSizeNonExisting
            const warnings: CartWarning[] = data?.data?.user?.carts?.warnings ? data?.data?.user?.carts?.warnings.filter((warning) => warning?.isProductNonExisting === null) : [];
            if (warnings.length > 0) {
              dispatch(openModal({
                description: null,
                title: 'Aggiornamenti al carrello',
                descriptionComponent: 'Warnings',
                props: warnings
              }))
            }



            if (carts?.length > 0) {
              dispatch(
                setCarts(carts)
              )
            } else {
              dispatch(
                resetCarts()
              )
            }

            //TODO eliminare gestione orders in redux
            // if (orders?.length > 0) {
            //   dispatch(
            //     setOrders(orders)
            //   )
            // }
          })
        }
        let ISODate: any = userAuth.metadata.creationTime
        if (userAuth.metadata.creationTime) {
          ISODate = new Date(userAuth.metadata.creationTime)
        }
        let date_for_redux = ('0' + ISODate.getDate()).slice(-2) + '/' + ('0' + Number(ISODate.getMonth() + 1)).slice(-2) + '/' + ISODate.getFullYear();

        if (isBusiness) {
          dispatch(
            login({
              statusAuthentication: 'logged_in',
              email: userAuth.email,
              uid: userAuth.uid,
              idToken: idToken,
              emailVerified: userAuth.emailVerified,
              isBusiness,
              createdAt: date_for_redux || new Date(),
              shopId: undefined,
              accountId: tokenResult.claims.mongoId,
              expirationTime: tokenResult.expirationTime
            })
          );
          const favouriteShop: ({ id: string, name: string, street: string }) = getFavouriteShopFromLocalStorage();

          if (favouriteShop) {
            dispatch(
              addFavouriteShopBusiness({
                id: favouriteShop.id,
                name: favouriteShop.name,
                street: favouriteShop.street
              })
            )
          }
          getBusiness({
            variables: {
              id: tokenResult.claims.mongoId
            }
          })
            .then(async (value) => {
              //redirect to the right page based on status
              const business: Business = value.data?.business

              if (business?.status === 'stripe_id_requested') {
                router.push('/shop/crea-business-account')
              }

              //! deprecated
              // if (business?.status === 'onboarding_KYC_requested') {
              //   router.push('/shop/continua-processo-kyc')
              // }


            })
          return
        }



        return
      } else if (!userAuth) {
        deleteAuthTokenInSessionStorage()
        apolloClient.clearStore()
        dispatch(
          resetCarts()
        )
        dispatch(
          detroyOrders()
        )
        const carts = localStorage.getItem('carts')
        if (carts) {
          const cartsJSON = JSON.parse(carts)

          if (cartsJSON.length > 0) {
            dispatch(
              setCarts(cartsJSON)
            )
          }
        }
        return dispatch(logout())

      }
      return
    });
  }, []);

  useEffect(() => {
    fetchBrandsFromDB()

  }, [])




  return (
    <>
      {children}
    </>
  )
}





function MyApp({ Component, pageProps }: any /* AppProps */) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();







  const apolloClient = useApollo(pageProps.initialApolloState)
  //! new mode to initialize apollo
  //const clientApollo  = client;




  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [])



  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient} > {/* client={clientApollo} */}
        <ChakraProvider theme={theme}>
          <Auth>
            {router.pathname !== '/' && !router.pathname.includes("/user/settings/email-actions") && !router.pathname.includes("/login") &&
              <Header />
            }

            {loading ? (
              <div className='mt-32'>
                <Loading />

              </div>
            ) : (
              <main className={`${sans.variable} font-sans`}>
                <Component {...pageProps} />
                {router.pathname !== '/' && !router.pathname.includes("/login") && !router.pathname.includes("/user/settings/email-actions") && !router.query?.fbclid && <Footer />}
              </main>
            )}
            <ModalWrapper />
          </Auth>
        </ChakraProvider>
      </ApolloProvider>

    </Provider >

  )
}


export default MyApp
