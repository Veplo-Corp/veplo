
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../../components/organisms/Header'
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store/store'
import { useEffect } from 'react'
import { auth, onAuthStateChanged } from '../config/firebase'
import user, { login, logout } from './store/reducers/user'
import { setAddress } from './store/reducers/address_user'
import { useRouter } from 'next/router'
import { ApolloProvider } from '@apollo/client'
import { client, useApollo } from '../lib/apollo'
import { getAddressFromLocalStorage } from '../../components/utils/getAddress_from_LocalStorage'
import { setAuthTokenInLocalStorage } from '../../components/utils/setAuthTokenInLocalStorage'

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
  // const user = useSelector((state) => state.user);
  // const address_user = useSelector((state) => state.address);
  // console.log(address_user);



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
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            idToken: idToken,
            emailVerified: userAuth.emailVerified,
            isShop: tokenResult.claims.isShop ? true : false
          })
        );
        //!router.push('/impresa/home')

      } else {
        dispatch(logout());


      }
    });
  }, []);
  return (
    <>
      {children}
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
        <Auth>
          <ChakraProvider theme={theme}>
            <Header></Header>
            <Component {...pageProps} />
          </ChakraProvider>
        </Auth>
      </ApolloProvider>
    </Provider>

  )
}

export default MyApp
