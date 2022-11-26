
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../../components/organisms/Header'
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store/store'
import { useEffect } from 'react'
import { auth, onAuthStateChanged, signOut } from '../config/firebase'
import user, { login, logout } from './store/reducers/user'
import { setAddress } from './store/reducers/address_user'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { client, initApollo, useApollo } from '../lib/apollo'
import { getAddressFromLocalStorage } from '../../components/utils/getAddress_from_LocalStorage'
import { setAuthTokenInLocalStorage } from '../../components/utils/setAuthTokenInLocalStorage'
import Modal_Error_Shop, { ErrorModal } from '../../components/organisms/Modal_Error_Shop'
import modal_error from './store/reducers/modal_error'
import GET_SHOP_BY_FIREBASE_ID from '../lib/apollo/queries/getShopByFirebaseId'


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
})

function Auth({ children }) {
  const router = useRouter()
  // console.log(address_user);
  const modal: ErrorModal = useSelector((state) => state.modal.modal);


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
      if (userAuth) {
        const idToken = await userAuth.getIdToken(true)
        setAuthTokenInLocalStorage(idToken)
        const tokenResult = await userAuth.getIdTokenResult()
        // user is logged in, send the user's details to redux, store the current user in the state
        const isShop = tokenResult.claims.isShop ? true : false
        if (!isShop) return
        let ISODate = new Date(userAuth.metadata.creationTime)
        let date_for_redux = ISODate.getDay() + '/' + (ISODate.getMonth() + 1) + '/' + ISODate.getFullYear()

        const apolloClient = initApollo()
        const { data, error } = await apolloClient.query({
          query: GET_SHOP_BY_FIREBASE_ID,
          variables: { firebaseId:  userAuth.uid},
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
            shopId: data?.shopByFirebaseId.id
          })
        );
        //if(tokenResult.claims.isShop){return router.push('/shop/prodotti')}
      } else {
        dispatch(logout())
      }
    });
  }, []);
  return (
    <>
      {children}
      {modal && <Modal_Error_Shop openModalMath={modal.openModalMath} title={modal.title} description={modal.description} closeText={modal.closeText} handleEvent={modal.handleEvent} confirmText={modal.confirmText} />}
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {



  const apolloClient = useApollo(pageProps.initialApolloState)
  //! new mode to initialize apollo
  //const clientApollo  = client;

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient} > {/* client={clientApollo} */}
        <ChakraProvider theme={theme}>
          <Auth>
            <Header></Header>
            <Component {...pageProps} />
          </Auth>
        </ChakraProvider>
      </ApolloProvider>
    </Provider >

  )
}

export default MyApp
