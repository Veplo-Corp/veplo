
import '../styles/globals.css'
import type { AppProps } from 'next/app'
// 1. import `ChakraProvider` component
import { Center, ChakraProvider, CircularProgress } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store/store'
import { useEffect, useState } from 'react'
import { analytics, auth, onAuthStateChanged, signOut } from '../config/firebase'
import user, { addFavouriteShopBusiness, login, logout } from '../store/reducers/user'
import { setAddress } from '../store/reducers/address_user'
import { useRouter } from 'next/router'
import { ApolloProvider, useLazyQuery } from '@apollo/client'
import { initApollo, useApollo } from '../lib/apollo'
import { getAddressFromLocalStorage } from '../../components/utils/getAddress_from_LocalStorage'
import { setAuthTokenInSessionStorage } from '../../components/utils/setAuthTokenInSessionStorage'
import Modal_Error_Shop, { ErrorModal } from '../../components/organisms/Modal_Error_Shop'
import modal_error from '../store/reducers/modal_error'
import Router from "next/router";
import { Firebase_User } from '../interfaces/firebase_user.interface'
import Loading from '../../components/molecules/Loading'
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import Footer from '../../components/organisms/Footer'
import PostMeta from '../../components/organisms/PostMeta'
import Script from 'next/script'
import { Open_Sans, Work_Sans } from '@next/font/google'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'
import GET_BUSINESS from '../lib/apollo/queries/business'
import GET_USER from '../lib/apollo/queries/getUser'

import { Business } from '../interfaces/business.interface'
import { getFavouriteShopFromLocalStorage } from '../../components/utils/getFavouriteShopFromLocalStroage'
import Header from '../../components/organisms/Header'
import { Cart } from '../interfaces/carts.interface'
import { resetCarts, setCarts } from '../store/reducers/carts'
import { Order } from '../interfaces/order.interface'
import { detroyOrders, setOrders } from '../store/reducers/orders'


const theme = extendTheme({
  colors: {
    black: {
      100: "#4D4D4D",
      900: "#000000",
    },
    brand: {
      100: "#D91818",
      // ...
      900: "#D91818",
    },
  },
  zIndex: {
    drawer: '1'
  }
})

const Auth: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter()
  // console.log(address_user);
  const modal: ErrorModal = useSelector((state: any) => state.modal.modal);


  const dispatch = useDispatch();
  const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);
  const [getUser] = useLazyQuery(GET_USER);



  //* check at page load if a user is authenticated
  useEffect(() => {

    //* GET the user address from localstorage
    const address_user = getAddressFromLocalStorage();



    dispatch(
      setAddress({
        address: address_user
      })
    );

    onAuthStateChanged(auth, async (userAuth) => {
      //signOut(auth)
      const apolloClient = initApollo()
      if (userAuth) {
        //analytics
        //setUserId(analytics, userAuth.uid);
        //setUserProperties(analytics, { favorite_food: 'apples' });
        const idToken = await userAuth.getIdToken(true)
        setAuthTokenInSessionStorage(idToken)
        console.log(userAuth);
        const tokenResult = await userAuth.getIdTokenResult()
        //console.log(tokenResult);

        //handle refresh token
        console.log(new Date > new Date(tokenResult.expirationTime));
        console.log(new Date(tokenResult.expirationTime));



        // user is logged in, send the user's details to redux, store the current user in the state
        const isBusiness = tokenResult.claims.isBusiness ? true : false;
        let ISODate: any = userAuth.metadata.creationTime
        if (userAuth.metadata.creationTime) {
          ISODate = new Date(userAuth.metadata.creationTime)
        }
        let date_for_redux = ('0' + ISODate.getDate()).slice(-2) + '/' + ('0' + Number(ISODate.getMonth() + 1)).slice(-2) + '/' + ISODate.getFullYear();
        // const { data, error } = await apolloClient.query({
        //   query: GET_SHOP_BY_FIREBASE_ID,
        //   variables: { firebaseId: userAuth.uid },
        //   //!useless
        //   fetchPolicy: 'cache-first',
        // })
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
              console.log(value);

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
        if (!isBusiness && tokenResult.claims.mongoId) {
          getUser().then((data) => {

            if (!data.data) return
            dispatch(
              login({
                statusAuthentication: 'logged_in',
                email: userAuth.email,
                uid: userAuth.uid,
                idToken: idToken,
                emailVerified: userAuth.emailVerified,
                createdAt: date_for_redux || new Date(),
                accountId: tokenResult.claims.mongoId,
                expirationTime: tokenResult.expirationTime,
                userInfo: {
                  name: data?.data.user.name
                }
              })
            );

            const carts: Cart[] = data?.data?.user.carts.carts;
            const orders: Order[] = data?.data?.user.orders;

            if (carts?.length > 0) {
              dispatch(
                setCarts(carts)
              )
            }

            if (orders?.length > 0) {
              dispatch(
                setOrders(orders)
              )
            }
          })
        }


        return
      } else if (!userAuth) {
        console.log('effettua il logout matto');
        apolloClient.clearStore()
        dispatch(resetCarts())
        dispatch(detroyOrders())
        return dispatch(logout())
      }
      return
    });
  }, []);



  return (
    <>
      {children}
      {modal && <Modal_Error_Shop openModalMath={modal.openModalMath} title={modal.title} description={modal.description} closeText={modal.closeText} handleEvent={modal.handleEvent} confirmText={modal.confirmText} />}
    </>
  )
}


//font

//const sans = Open_Sans({ subsets: ['latin'] })
const sans = Work_Sans({ subsets: ['latin'] })



function MyApp({ Component, pageProps }: any /* AppProps */) {

  const [loading, setLoading] = useState(false);
  const router = useRouter()
  useEffect(() => {
    const start = () => {
      //console.log("start");
      setLoading(true);
    };
    const end = () => {
      //console.log("finished");
      setLoading(false);
    };
    // Router.events.on("routeChangeStart", start);
    // Router.events.on("routeChangeComplete", end);
    // Router.events.on("routeChangeError", end);
    // return () => {
    //   Router.events.off("routeChangeStart", start);
    //   Router.events.off("routeChangeComplete", end);
    //   Router.events.off("routeChangeError", end);
    // };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const analytics = getAnalytics();
      //console.log(process.env.NODE_ENV );

      const EventLog = (url: string) => {
        console.log(url);

        logEvent(analytics, 'notification_received');
        logEvent(analytics, 'screen_view', {
          firebase_screen: url,
          firebase_screen_class: url
        });
        logEvent(analytics, 'select_content', {
          content_type: 'image',
          content_id: 'P12453'
        });
      };


      return () => {
        router.events.off('routeChangeComplete', EventLog);
      };
    }
  }, []);



  const apolloClient = useApollo(pageProps.initialApolloState)
  //! new mode to initialize apollo
  //const clientApollo  = client;






  return (
    <Provider store={store}>

      <ApolloProvider client={apolloClient} > {/* client={clientApollo} */}
        <ChakraProvider theme={theme}>
          <Auth>
            {router.asPath !== '/' && !router.query?.fbclid && <Header />}

            {loading ? (
              <div className='mt-32'>
                <Loading />

              </div>
            ) : (
              <main className={sans.className}>
                <Component {...pageProps} />
                {router.asPath !== '/' && !router.query?.fbclid && <Footer />}
              </main>
            )}

          </Auth>
        </ChakraProvider>
      </ApolloProvider>

    </Provider >

  )
}

export default MyApp
