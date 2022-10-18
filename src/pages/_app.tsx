
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../../components/organisms/Header'
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './store/store'
import { useEffect } from 'react'
import { auth, onAuthStateChanged } from './config/firebase'
import { login, logout } from './store/reducers/user'
import { useRouter } from 'next/router'


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
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // check at page load if a user is authenticated
  // check at page load if a user is authenticated
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {    
      console.log(userAuth?.email);
        
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(
          login({
            email:userAuth.email,
            uid: userAuth.uid
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
  return (
    <Provider store={store}>
      <Auth>
        <ChakraProvider theme={theme}>
          <Header></Header>
          <Component {...pageProps} />
        </ChakraProvider>
      </Auth>
    </Provider>

  )
}

export default MyApp
