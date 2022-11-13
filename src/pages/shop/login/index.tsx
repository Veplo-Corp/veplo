import React, { useReducer, useState } from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import { Button } from '@chakra-ui/react'
import BlackButton from '../../../../components/atoms/BlackButton'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../../config/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/reducers/user'
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification'
import resetPassword from '../../../../components/utils/resetPassword'
import { useMutation, useQuery } from '@apollo/client'
import DELETE_PRODUCT from '../../../lib/apollo/queries/deleteProduct'
import { setAuthTokenInLocalStorage } from '../../../../components/utils/setAuthTokenInLocalStorage'
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct'
import { initApollo } from '../../../lib/apollo'




const index = () => {

  //! test cache GraphQL
  // const ElementTest = useQuery(GET_SINGLE_PRODUCT, {
  //   fetchPolicy: 'cache-only',
  //   nextFetchPolicy: 'cache-only',
  //   variables: {
  //       id: '63693558a3aab0f65e18b1c1', /* 63693558a3aab0f65e18b1c1 */
  //   },

  // })

  // console.log(ElementTest.data);

  // const [deleteProduct, { data, loading, error }] = useMutation(DELETE_PRODUCT);
  // const apolloClient = initApollo()
  // const cache = apolloClient.cache.extract();
  // console.log(cache);
  
  // const handleDeleteProductTest = async () => {
  //   try {
  //     await deleteProduct();
  //     console.log(data);

  //   }
  //   catch (e) {
  //     console.log(error);

  //   }
  // }
  //! end test apollo client



  const [showPassword, setshowPassword] = useState<boolean>(false)
  const [email, setemail] = useState<string>('')
  const [isValidEmail, setisValidEmail] = useState<boolean | null>(null)
  const [isValidPassword, setisValidPassword] = useState<boolean | null>(null)
  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')

  const [password, setpassword] = useState<string>('')
  const user = useSelector((state) => state.user.user);


  const dispatch = useDispatch();

  const emailHandler = (event) => {
    setemail(event.target.value)
    if (/\S+@\S+\.\S+/.test(event.target.value)) {
      return setisValidEmail(true)
    }
  }

  const emailErrorHandler = () => {
    if (/\S+@\S+\.\S+/.test(email)) {
      return setisValidEmail(true)
    }
    setisValidEmail(false)
  }

  const passwordHandler = (event) => {
    setpassword(event.target.value)
    if (event.target.value.length >= 8) {
      return setisValidPassword(true)
    }
  }


  const passwordErrorHandler = () => {
    if (password.length > 8) {
      return setisValidPassword(true)
    }
    setisValidPassword(false)
  }

  // const handleSubmit = async (event) => {
  //   // Stop the form from submitting and refreshing the page.
  //   event.preventDefault();

  //   // Get data from the form.
  //   const data = {
  //     email: event.target.email.value,
  //     password: event.target.password.value,
  //     typeForm: typeForm
  //   }

  //   // Send the data to the server in JSON format.
  //   const JSONdata = JSON.stringify(data)

  //   // API endpoint where we send form data.
  //   const endpoint = '/api/firebase/registration-company'

  //   // Form the request for sending data to the server.
  //   const options = {
  //     // The method is POST because we are sending data.
  //     method: 'POST',
  //     // Tell the server we're sending JSON.
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     // Body of the request is the JSON data we created above.
  //     body: JSONdata,
  //   }
  //   // Send the form data to our forms API on Vercel and get a response.
  //   const response = await fetch(endpoint, options)

  //   // Get the response data from server as JSON.
  //   // If server returns the name submitted, that means the form works.
  //   const result = await response.json()
  //   console.log(result.data);

  //   if(response.status === 200){
  //     dispatch(
  //       login(result.data)
  //     );
  //     setemail('')
  //     setpassword('')
  //   } else {
  //     console.log(result);

  //   }    
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeForm === 'registration') {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const idToken = await userCredential.user.getIdToken(true);
          setAuthTokenInLocalStorage(idToken)
          console.log(user);
          sendEmailVerificationHanlder()
          dispatch(
            login(
              {
                email: user.email,
                uid: user.uid,
                idToken: await user.getIdToken(true)
              }
            )
          );
          setemail('')
          setpassword('')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);

        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const idToken = await userCredential.user.getIdToken();
          setAuthTokenInLocalStorage(idToken)
          dispatch(
            login({
              email: user.email,
              uid: user.uid
            })
          );

          setemail('')
          setpassword('')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
        });
    }

  }

  const LoginButton = () => {



    return (
      <>
        <p className='mr-1 text-black	'>hai già un account?</p>
        <Button className='underline' onClick={() => settypeForm('login')} variant='link' colorScheme={'black'}>
          Accedi
        </Button>
      </>
    )
  }



  return (

    <Desktop_Layout>
      <div className='flex justify-between'>
        <form className="p-3 w-fit space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="mt-1 flex rounded-sm">
              <span className="inline-flex items-center rounded-l-md border-r-0 border-2 border-gray-900  bg-black px-3 text-sm text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                onBlur={emailErrorHandler}
                value={email}
                onChange={emailHandler}
                type="text" name="email" id="email" className="block w-80 flex-1 rounded-r-md border-2 p-2 py-3 border-gray-900
                focus:outline-none
                sm:text-sm placeholder-black" placeholder="email" />
            </div>
            {isValidEmail === false && <p className='text-sm md:text-xs text-red-600'>email non corretta</p>}
          </div>
          {typeForm !== 'reset_password' && <div>
            <div className="mt-1 flex rounded-sm">
              <span className="inline-flex items-center rounded-l-md border-r-0 border-2 border-gray-900  bg-black px-3 text-sm text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                onBlur={passwordErrorHandler}
                value={password}
                onChange={passwordHandler}
                type={showPassword ? 'text' : 'password'} name="password" id="password" className="block md:w-80 flex-1 border-2 border-r-0	 p-2 py-3 border-gray-900
                focus:outline-none
                sm:text-sm placeholder-black" placeholder="password" />
              <span className="inline-flex items-center rounded-r-md border-l-0 border-2 border-black   px-3 text-sm text-black" onClick={() => setshowPassword(!showPassword)}>
                {!showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>}
                {showPassword && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                }

              </span>
            </div>
            {isValidPassword === false && <p className='text-sm md:text-xs text-red-600'>la password deve contentere almeno 8 caratteri</p>}
          </div>}
          {typeForm !== 'reset_password' && <div className='w-full flex justify-end pt-2 md:pt-1'>
            <BlackButton disabled={!isValidEmail || !isValidPassword} typeButton='submit' element={typeForm == 'registration' ? 'registrati' : 'accedi'} borderRadius={10} size={'md'}></BlackButton>
          </div>}
          {typeForm === 'reset_password' && <div className='w-full flex justify-end pt-2 md:pt-1' onClick={() => resetPassword(email)}>
            <Button disabled={isValidEmail == null || false} onClick={() => resetPassword(email)} colorScheme={'orange'} borderRadius={10} size={'md'}>resetta password</Button>
          </div>}
          <div className='flex'>
            {(typeForm === 'registration') && <LoginButton />}
            {(typeForm === 'reset_password') && <LoginButton />}

            {typeForm === 'login' &&
              <div className='grid'>
                <p className=' text-black	'>non hai ancora un account?
                  <Button className='underline ml-1' onClick={() => settypeForm('registration')} variant='link' colorScheme={'black'}>
                    Registrati
                  </Button>
                </p>
                <p className='mt-1 text-black	'>hai dimenticato la tua password?
                  <Button className='underline md:ml-1' onClick={() => settypeForm('reset_password')} variant='link' colorScheme={'black'}>
                    Resetta password
                  </Button>
                </p>
              </div>
            }
          </div>
        </form>
        {user && <div className='hidden md:flex  '>
          <h1>{user.email}</h1>
          {/* <button onClick={handleDeleteProductTest}>delete product</button> */}
        </div>}
      </div>
    </Desktop_Layout>
  )
}

export default index;