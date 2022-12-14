
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../../components/organisms/Header'
// 1. import `ChakraProvider` component
import { Center, ChakraProvider, CircularProgress } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store/store'
import { useEffect, useState } from 'react'
import { analytics, auth, onAuthStateChanged, signOut } from '../config/firebase'
import user, { login, logout } from '../store/reducers/user'
import { setAddress } from '../store/reducers/address_user'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { initApollo, useApollo } from '../lib/apollo'
import { getAddressFromLocalStorage } from '../../components/utils/getAddress_from_LocalStorage'
import { setAuthTokenInLocalStorage } from '../../components/utils/setAuthTokenInLocalStorage'
import Modal_Error_Shop, { ErrorModal } from '../../components/organisms/Modal_Error_Shop'
import modal_error from '../store/reducers/modal_error'
import GET_SHOP_BY_FIREBASE_ID from '../lib/apollo/queries/getShopByFirebaseId'
import Router from "next/router";
import { Firebase_User } from '../interfaces/firebase_user.interface'
import Loading from '../../components/molecules/Loading'
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";

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




  //* check at page load if a user is authenticated
  useEffect(() => {

    //* GET the user address from localstorage
    const address_user = getAddressFromLocalStorage();
    // console.log(address_user);

    dispatch(
      setAddress({
        address: address_user
      })
    );

    onAuthStateChanged(auth, async (userAuth) => {
      const apolloClient = initApollo()
      if (userAuth) {
        setUserId(analytics, userAuth.uid);
        setUserProperties(analytics, { favorite_food: 'apples' });
        const idToken = await userAuth.getIdToken(true)
        setAuthTokenInLocalStorage(idToken)
        const tokenResult = await userAuth.getIdTokenResult()
        // user is logged in, send the user's details to redux, store the current user in the state
        const isShop = tokenResult.claims.isShop ? true : false;
        let ISODate: any = userAuth.metadata.creationTime
        if (userAuth.metadata.creationTime) {
          ISODate = new Date(userAuth.metadata.creationTime)
        }
        let date_for_redux = ISODate.getDate() + '/' + (ISODate.getMonth() + 1) + '/' + ISODate.getFullYear();
        if (!isShop && userAuth.uid) {
          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              idToken: idToken,
              emailVerified: userAuth.emailVerified,
              isShop: false,
              createdAt: date_for_redux || new Date(),
              shopId: undefined
            })
          );
          return
        } else if (isShop === true) {
          const { data, error } = await apolloClient.query({
            query: GET_SHOP_BY_FIREBASE_ID,
            variables: { firebaseId: userAuth.uid },
            //!useless
            fetchPolicy: 'cache-first',
            // nextFetchPolicy: 'cache-only',
          })

          dispatch(
            login({
              email: userAuth.email,
              uid: userAuth.uid,
              idToken: idToken,
              emailVerified: userAuth.emailVerified,
              isShop,
              createdAt: date_for_redux,
              shopId: data?.shopByFirebaseId?.id || null
            })
          );
          // if(!data?.shopByFirebaseId?.id){
          //   router.push('/shop/crea-shop')
          // }
        }
      } else {
        console.log('effettua il logout');
        apolloClient.clearStore()
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




function MyApp({ Component, pageProps }: any /* AppProps */) {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  useEffect(() => {
      


    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
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
            <Header></Header>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Component {...pageProps} />
              </>
            )}
          </Auth>
        </ChakraProvider>
      </ApolloProvider>
    </Provider >

  )
}

export default MyApp
