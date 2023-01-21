
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
import { setAuthTokenInSessionStorage } from '../../components/utils/setAuthTokenInSessionStorage'
import Modal_Error_Shop, { ErrorModal } from '../../components/organisms/Modal_Error_Shop'
import modal_error from '../store/reducers/modal_error'
import GET_SHOP_BY_FIREBASE_ID from '../lib/apollo/queries/getShopByFirebaseId'
import Router from "next/router";
import { Firebase_User } from '../interfaces/firebase_user.interface'
import Loading from '../../components/molecules/Loading'
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import Footer from '../../components/organisms/Footer'
import PostMeta from '../../components/organisms/PostMeta'
import Script from 'next/script'

const iubendaImplementation = `<script type="text/javascript">
var _iub = _iub || [];
_iub.csConfiguration = {"invalidateConsentWithoutLog":true,"perPurposeConsent":true,"siteId":2950291,"whitelabel":false,"cookiePolicyId":62612516,"lang":"it","cookiePolicyUrl":"https://www.veplo.it/informative/privacy-e-cookie", "banner":{ "acceptButtonCaptionColor":"#000000","acceptButtonColor":"#FFFFFF","acceptButtonDisplay":true,"closeButtonRejects":true,"customizeButtonDisplay":true,"explicitWithdrawal":true,"fontSizeCloseButton":"22px","listPurposes":true,"logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAIABJREFUeF7tnQnYVlP3h28ikpKSJoUyz5R5SIYMpUwhQ2QqZMxUxkyFzEJmhShTlGQsQ4bMMpZIGlFKhML/Ws//5Ks0PMM55zl779+6rud6fV9n771+9z7ve9azz95rLYNMBEQg6wSWA2pGn9WAGsCq0acasApQFagCrAxUBlYCKgErAisAFaPr8tE6A/gT+AP4HZgN/Ab8CswCfgFmAnbdz8B0YFr0+RH4IfrMzWcwXSMCIlAeAsuUZ1iNKgIiEBGwh3eD6LMWUHe+Tx3APvbAd+139R/gJ2BS9JkIzPt8C3wXfSyIkImACJSBgGt/VMqASEOKQMkEagHrAesC60SfhoA98O3hHrJZkGABwVhgTPQZDXwFTAkZjLSLQNIEFAAkTVj9h0SgHrAJsHH02RDYIFqqD4lDXFrt1cIXwOfAp9FnFDAhrgHUjwiETEABQMizL+3FEqgA2MN9K2ALYPPov+19vCx5Arbv4H3gI+DD6L8tSPgr+aE1ggj4Q0ABgD9zKSXJEWgEbAdsDTSJHvq20U6WHQK2QdGCgXeBkcBbwNfZcU+eiED2CCgAyN6cyKPyErAd842BnYAdop+hv6cv74wUP7rtL3gdGBH9fC862VB8j2opAh4RUADg0WRKSlEE7KicfbtvGn22iY7QFdWZGmWagB1lfAcYHn1slcCOOMpEIEgCCgCCnPagRS8bLeXvAewGbB+dlw8aSqDi7eH/JvAy8GL06uDvQFlIdoAEFAAEOOkBSrbd+c2BfQB78FsSHZkILEzATh1YIDAEeF6nDXSD+E5AAYDvMxymPruvbVm/ZfTQ3zJMDFJdIoEPomBgULSp0JIbyUTAGwIKALyZyuCFWOpb+3a/P7AvYMl3ZCIQFwFLSvQs8FS0SmD7CWQi4DQBBQBOT1/wzlvue1vWbwPsFeXCDx6KACROwGohDAUGRCsE9r9lIuAcAQUAzk1Z8A5bsRv7hn9Y9NC3b/4yESgXAVsJsGDgkWiFwIolyUTACQIKAJyYpuCdtEp2tonviOi9vgUBMhHIGgF7+A8GHow2EVpFRZkIZJaAAoDMTo0cizbyHQkcClgZXJkIuELAyiI/GgUDlm9AJgKZI6AAIHNTErxDVv72aKBdlG8/eCAC4DwBq1PQJ/pYSWSZCGSCgAKATExD8E4sH73XPwHYG7BiOzIR8I2AFSt6Drgr2i8wxzeB0uMWAQUAbs2Xb96uBdhD/1igtm/ipEcElkBgMnBvFAx8K1IiUA4CCgDKQV1j2i7+U6Jv/aIhAqETsPwCvaJVgdBZSH+KBBQApAg78KGqA+2Bk4GGgbOQfBFYFAErX3w7cB8wTYhEIGkCCgCSJqz+1wfOAtoqUY9uBhHIi4AlFuoHXA98mVcLXSQCRRBQAFAENDXJi8CuQOfo3H5eDXSRCIjAfwhYHYLrgGFiIwJxE1AAEDfRsPuzUrsHAudGJXfDpiH1IhAfgZHA1cCTgEoWx8c16J4UAAQ9/bGJXzE6u382sE5svaojERCBhQmMAXoCDwC/C48IlEJAAUAp9NTWUvJ2iN7x1xUOERCB1AhYQiF7NXAnoPoDqWH3ayAFAH7NZ1pqqgInRQ/+1dMaVOOIgAj8h8DUaLOgnR6YKT4iUAgBBQCF0NK1Vn7XjvHZrn49+HU/iEB2CMwLBG4DVJ44O/OSaU8UAGR6ejLjnJXc7Rht7quVGa/kiAiIwMIEpgDXAHcAVqpYJgKLJaAAQDfHkggsBxwPXAjUEyoREAFnCEwArgDuBuY647UcTZWAAoBUcTs1mB3n6w6s55TXclYERGB+Al8BXYAnhEUEFiagAED3xMIEdomWELcVGhEQAW8IvAOcA7zqjSIJKZmAAoCSEXrTgZ3ft2NFrbxRJCEiIAILE3g6ytBp+QRkgRNQABD4DQDUALoCnYCKwiECIuA9gT+BW4GrgJ+8VyuBiyWgACDcm8PS9tqRvouBmuFikHIRCJbAD8BlgB0dVHrhAG8DBQABTjpg7/lvATYLU75Ui4AIzEfgY+BU7Q8I755QABDWnFu6XisocmRYsqVWBEQgDwIPAucBlmZYFgABBQABTDJgy/2nAxcBq4YhWSpFQASKIDAduBy4Sa8FiqDnWBMFAI5NWBHubg30BrYsoq2aiIAIhEngg6jQl5UhlnlKQAGApxMLVAMuAc7wV6KUiYAIJEzgRqAb8HPC46j7MhBQAFAG6CkM2QKw6mD1UxhLQ4iACPhNYHxU/XOw3zLDU6cAwK85t0I9NwBt/ZIlNSIgAhkg0A84E7CCQzIPCCgA8GASIwn20LeHv6r1+TOnUiICWSNgD38LAiwYkDlOQAGA4xMYPfDtTH8b96VIgQiIgCMEBkS5A7Qa4MiELcpNBQAOTx5wcJTQp7bbMuS9CIiAgwQmR0HAYw76LpcBBQBu3gbVo4p9x7npvrwWARHwiMA9wLnANI80BSFFAYB707wz0BdY0z3X5bEIiICnBMYBRwGvearPS1kKANyZ1uWBS6PKfe54LU9FQARCImAVBu3v1JyQRLuqVQGAGzPXEOgPNHbDXXkpAiIQMIH3gEOAsQEzcEK6AoDsT1N74Poos1/2vZWHIiACIvD/mQPPAu4TjOwSUACQ3bmpAlwb5ePOrpfyTAREQAQWT8DqkJwD/CJI2SOgACB7c2IerQc8E/3MpofySgREQATyI/AVsB9gP2UZIqAAIEOTEblyLGAFOGwFQCYCIiACPhCwFQArTHavD2J80aAAIDszuWJ0tv/U7LgkT0RABEQgVgKWtdRyBvwea6/qrCgCCgCKwhZ7owbAk8BWsfesDkVABEQgWwTslMCBwHfZcis8bxQAlH/OmwKPAErnW/65kAciIALpELA0wocBw9MZTqMsioACgPLeF52jnf6ah/LOg0YXARFIn8A/0QmB69IfWiMaAT14ynMfVIo2+p1YnuE1qgiIgAhkhsCd0QbB2ZnxKBBHFACkP9F1gYFAk/SH1ogiIAIikEkC7wKtgYmZ9M5TpxQApDuxmwKDgfrpDqvRREAERCDzBMYDLYBPMu+pJw4qAEhvItsCdwGV0xtSI4mACIiAUwR+BU4A+jnltaPOKgBIZ+LOA3qkM5RGEQEREAHnCZwPXO28iowLUACQ7ARVAG4AlNwnWc7qXQREwD8CljToTOAv/6RlQ5ECgOTmYRXgoeidVnKjqGcREAER8JeA7Zk6Apjhr8TyKVMAkAx72+n/HGCb/mQiIAIiIALFE7BNgXvrhEDxABfXUgFA/EzXAZ4H1o6/a/UoAiIgAkES+AZoDowJUn1CohUAxAt2M2Co0vrGC1W9iYAIiABg6YP3Aj4WjXgIKACIh6P1sjvwOGDv/mUiIAIiIALxE7C9AAcBL8XfdXg9KgCIZ86tqMV9gJX0lYmACIiACCRHwEoJt4+KqCU3SgA9KwAofZJPAnqprkLpINWDCIiACORJwAoJnQLcnuf1umwRBBQAlHZbWDW/nqV1odYiIAIiIAJFEjgbUDXBIuEpACgSHHABcEXxzdVSBERABEQgBgIXAlfG0E9wXSgAKG7KLwUuKa6pWomACIiACMRMoBtgf5dlBRBQAFAArOhS+9Zv3/5lIiACIiAC2SFgqwC2GiDLk4ACgDxBRZddBXQprImuFgEREAERSIlAd6BrSmM5P4wCgPynUA///FnpShEQAREoFwEFAXmSVwCQHygt++fHSVeJgAiIQBYI6HVAHrOgAGDpkLThb+mMdIUIiIAIZI2ANgYuZUYUACwZkI76Ze1XWv6IgAiIQP4EdERwCawUACwejpL85P9LpitFQAREIKsElCxoMTOjAGDRYCy9721ZvZvllwiIgAiIQEEETlba4P/yUgDwXyZW2Odh5fYv6JdLF4uACIhAlglY7YDDVUBowSlSALAgDyvpO0hV/bL8eyzfREAERKAoAlZFsKVKCf+PnQKA/7HYDHgVWKWoW0uNREAEREAEsk5gBrAL8HHWHU3DPwUA/095HeA1oHYa0DWGCIiACIhA2QhMBnYGxpTNg4wMrAAA6gKvA2tnZE7khgiIgAiIQLIEvgF2AiYmO0y2ew89ALDlfvvmv2m2p0neiYAIiIAIxEzgk2glwF4LBGkhBwAVgIFAiyBnXqJFQAREQAQGA62Bv0JEEXIAcDNwaoiTLs0iIAIiIAL/ErgFOC1EHqEGAOcBPUKccGkWAREQARH4D4HzgatD4xJiANA2SvQT2lxLrwiIgAiIwOIJWKKgfiEBCi0AsM1+bwKVQ5pkaRUBERABEVgqgV+B7QHbHBiEhRQA2HG/t4D6QcysRIqACIiACBRKYDywXSjHA0MJACpFWf6aFHo36HoREAEREIGgCLwbZQuc7bvqUAKA3sCJvk+m9ImACIiACMRC4E6gQyw9ZbiTEAKAzkDPDM+BXBMBERABEcgegbOB67LnVnwe+R4ANAVeUWnf+G4Y9SQCIiACgRCwEsLNgOG+6vU5AGgAvK0CP77eutIlAiIgAokTsMJB2wLfJT5SGQbwNQBYMSrw07gMTDWkCIiACIiAPwTeB3YEfvdH0v8r8TUAUJpf3+5U6REBERCB8hHwMl2wjwHAscA95btPNLIIiIAIiICHBI4D7vVJl28BwHqAneGs4tMkSYsIiIAIiEDZCfwCWC6Zr8ruSUwO+BQA2EPfHv4WBMhEQAREQAREIG4C9vC3IMCCAefNpwDgjhASNzh/x0mACIiACLhNwBLLdXRbwv9770sA0N63dzM+3FzSIAIiIAKeErC9Zve5rs2HAKAh8B5QzfXJkP8iIAIiIAJOEPgZsGPmY53wdjFOuh4ALB+V99V5f5fvQvkuAiIgAu4RsC+eVj54jnuu+/EK4Eqgq6vw5bcIiIAIiIDTBK4CLnBVgcsrADtHJX5dZS+/RUAEREAE3CewC/CaizJcDQCqA5aecU0XoctnERABERABbwiMA7YCprmmyNUA4G7AsjLJREAEREAERKDcBCz77PHldqLQ8V0MAA4GBhQqVNeLgAiIgAiIQIIE2gCPJdh/7F27FgDUAj5Uid/Y7wN1KAIiIAIiUBoBKx28BTCltG7Sa+1aANAfsChLJgIiIAIiIAJZI2Cr04dkzanF+eNSANAWeNgVsPJTBERABEQgSAKHA/1cUO5KAGBL/x8B9lMmAiIgAiIgAlklYK8ANnfhVYArAYB987cVAJkIiIAIiIAIZJ2ArQDYSkCmzYUAoAUwKNMU5ZwIiIAIiIAILEigJTA4y1CyHgBYgZ+PgfpZhijfREAEREAERGAhAuOBzQArHJRJy3oAcANwRibJySkREAEREAERWDKBG4EzswopywHA1sA7WQUnv0RABERABEQgDwLbACPzuC71S7IaACwLvAtsmToRDSgCIiACIiAC8RH4AGgC/B1fl/H0lNUAwJZMro9HonqZn8Aaa6zBK6+8wnLLLRcMmE8//ZSWLW0/jkwE8iNQuXJlRo0ald/Fnlz16KOPcv7553uiJnMyzgLslXamLIsBQF3AfvNWzRQpj5x56qmnaN26tUeKli6lUaNGjB07dukX6goRAE488UR69+4dFIvGjRvz/vtWZFWWAIHpwCbAxAT6LrrLLAYAfYEji1akhkslsOeee/L8888v9TqfLujRowddunTxSZK0JEhg+PDh7LKLlXkPw9566y223377MMSWT+WDwFHlG/6/I2ctALDfuOFZAuSrL19++SXrrbeer/L+o2vKlCnUrl07GL0SWjyB+vXr89133xXfgYMt27VrR9++9t1LljCBpsCrCY+Rd/dZCgBs459tlrBzk7KECZx99tlce+21CY+Sre5btGjBs88+my2n5E3mCFx66aVccsklmfMrKYemTZtGgwYN+PXXX5MaQv3+j4DltbHN7ZnYEJilAKATcIvulHQI1KhRI/ctZ6WVVkpnwAyM0q9fPw4/PPPZOTNAKmwXxo8fj22WDcVuuOEGzjrL9qjJUiJwKnBrSmMtcZisBAA1gM+BmlmAEooPtuR35JHhbLf466+/WG211fj558wm5grl1susTnvvb+//Q7KNN96Yzz77LCTJ5db6A7Ah8FO5HclKAHAdoBA05bthu+22480330x51PIO16lTJ3r16lVeJzR6ZgnYzn87ARCKDRs2jGbNmoUiN0s67Zh753I7lIUAYB3gU6BiuWGEOP67776LHf8JxT744AO22mqrUORKZwEEVlhhBX766ScsB0AodsghhzBgwIBQ5GZJ55/AxsCYcjqVhQBgINCqnBBCHvv444/nrrvuCgrBpptuGlySl6AmuEixRx99NPfff3+Rrd1rNnXq1Nzmvz/++MM95/3w+GmgrAlZyh0A6NhfmW/kKlWqMG7cOFZdNZy8SzfffDOnn356mclr+KwRGDp0KM2bN8+aW4n50717d7p27ZpY/+o4LwJlPRZY7gDgbcAKJcjKSOCmm27itNNOK6MH6Q5tx55q1qzJ339n4iROuuI12iIJWI6ISZMmBUPnn3/+YZ111lF2zPLPuD0DtyuXG+UMAA4EHi+XcI37PwK2Czi0vOd696nfgPkJWA58+0Ycij333HPss88+ocjNus6DgCfK4WS5AgCrRGMb/8JJRVeO2S1gTCsQtOuuuxbQwu1Ln3766eDqIbg9Y8l6P3r06Nw34lCsVatWPPPMM6HIzbrOr6INgXPTdrRcAUBH4Pa0xWq8xRNo06YN/fv3DwrR6quvzg8/2JFcWcgEttlmG95+21ZiwzBLdLT22mtjeTFkmSFwEnBH2t6UIwCw1HMW8dRLW6zGWzyBihUr5jID1qpVKxhM55xzDj179gxGr4QumoDlhTj55JODwWNpji+77LJg9DoidEK0Iv5bmv6WIwCwhD+W+EeWMQKXX345F154Yca8Ss6dr776ivXXXz+5AdRz5glUqFAhd/Z/lVVWybyvcTg4Z84c1lxzzaA2PMbBLaU+LDGQJQhKzdIOAKoAo4FwvmamNpWlD2Rngr/55huWXdbqMoVhlg0xpOXfMGY1f5WHHnoojzzySP4NHL/yqaee4oADDnBchbfuTwHWBX5JS2HaAcB5QI+0xGmcwgnY5rj99tuv8IaOtrjjjjs46SR7/SYLkcDAgQOxDXGhmOU5eOGFF0KR66LO84Gr03I8zQCgavTtf/W0xGmcwgnsvffeDBkypPCGjrb45ZdfcgWC/vzTMnPKQiJg8x7SJlA76bDeejp4lfF7fGq0CjAzDT/TDAD07T+NGY1hjDFjxtCoUaMYenKji2OOOYYHHnjADWflZWwEzjjjDKwUbih23nnncc0114Qi12WdXdJaKU8rAFgZ+BrQt38Hbstzzz2Xq69ObRWq7ERefPFF9txzz7L7IQfSJfDJJ5+wySabpDtomUabPXt2bvNfSCseZUIdx7C2CmDfwGbF0dmS+kgrANDO/6RnMsb+LU2u1QeoVKlSjL1mu6t69eoxceLEbDsp72IjsNlmm/HRRx/F1l/WO+rXrx+HH3541t2Uf/8jcHYap+XSCABWjL7919XsukPgoYceCuoPhs5Gu3NvxuFpaPUvdtllF1577bU40KmPdAjYtxFbBfg9yeHSCAA6lCPDUZLQQuh7xx135PXXXw9Bak7j999/T/369YPRG7rQH3/8kRo1agSBwV512IqHzDkCljG3d5JeJx0A2IHyL4FwkmwnOVsp9/3BBx+wxRZbpDxq+YbbbbfdsJoIMr8JtG7dGjsPH4pZ6WsrgS1zjsAYwDKVJVa2NOkAwKocPeYcdjmcI9ChQwfsnHwodv/999O+fftQ5Aar89FHH8WqQYZgdszVNv9Nnz49BLk+amyT5DM06QDgHWBrH2clBE1Vq1bN1QcIJU3q77//nssJ8Ouvv4YwvUFqrFatWi71byjZLu+++25OOOGEIOfaE9EjgW2S0pJkAGC1ZbWemtTMpdTvLbfcQqdOnVIarfzDdOzYkd69E33tVn6RAXtwyimncOuttwZDYOutt+bdd98NRq+nQpsBw5LQlmQAYMWmWybhtPpMj8Cmm27Kxx9/nN6AZR5pxIgR2AZImZ8E3nnnHeyhGIKNHDkSK3Usc57AICCR/OxJBQC2ceEL57FLQI7A8OHDsWNEodi6666LZUOU+UXA0uB++aXtSQ7DbD+L7WuReUFgg2hDfaxikgoAbA31xFg9VWdlIxBaxTTLgnj++VaTQ+YTAZtXy3IZgtmmP6vuOWtW4snkQsCZBY132r7suB1JIgCoDnwLWOlfmQcEVlhhhdxmwNVXDyOT85QpU6hdu7YHMycJ8xOYPHkytWqFUYncjv3Z8T+ZNwSsRPBawLQ4FSURAHQGesbppPoqP4GrrrqKLl2sRkUYZiWRBw2yV28yHwjstddePPfccz5IyUuD7d0ZNWpUXtfqImcIxJ4eOIkAwF6ehlNKzpl7pzRH11prLcaOHcsyyyRxy5TmWxKt+/fvj736kPlBoE+fPhx11FF+iFmKildffZWmTZsGoTUwkWPjfrbG/dd8X2BwYJMSjFz7RtyiRYsg9P7999+5nABKoOL+dK+88sq5s/8VK1Z0X0weCtq2bcsjjzySx5W6xEEC9gf42bj8jjsAsIe/BQEyDwnsu+++DB4cTnx32mmnYXkQZG4TCCmjpZX7tc1/ltRK5iUBe/jH9i0szgDANih84yVyifqXgL0GWHvttYMgYuViQ6qF4Ouk2pL4zjvv7Ku8BXTpBEsQ02x/gG2jfckWZwBwJdC1ZI/UQaYJ2EZA2xAYim2++eZBJULybV4tD/6338byt9IJNMph4cQ0leqk/QG+oNROrH1cAcDywHeAzk7FMSsZ7sOOAo4bN44VV1wxw17G55q9ArBXATI3CXTr1o2LL77YTecL9Pr555/HTjvIvCcwGWgAzClVaVwBQGsgnPqapVJ3vH2/fv047LDDHFeRn/u2CdCCnrlz5+bXQFdlisD3339PvXr1MuVTUs4ccMABQZU5ToqjI/3uDwws1de4AgA7MB3bxoRSRal9sgTsfaq9Vw3F7DigHQuUuUXAjsING5ZIDZXMgZg4cWJu899ff/2VOd/kUCIEbDd2ybV24ggA6kbL/xUSkalOM0nANshtttlmmfQtbqeeeeYZWrVqFXe36i9hAnfddRfHH398wqNko3t71XHppZdmwxl5kQYBi/TsNcDEUgaLIwCwpOndS3FCbd0jcPLJJ9OrVy/3HC/SY0shO3Xq1CJbq1naBCpVqoQdiatcuXLaQ6c+nn3rt2//tgogC4qApWbtUYriOAKAz4ANS3FCbd0jsMoqq+TqA1StWtU954vw2IoD2RErmRsEjjnmGO677z43nC3Ry6effprWrW0bliwwAp8DG5WiudQAYDvgzVIcUFt3CdgKgK0EhGCjR4/GysnK3CBgO+L33HNPN5wt0cu9996boUOHltiLmjtKYHvgrWJ9LzUAuBU4pdjB1c5tApYk54MPPnBbRAHeb7/99rz1VtG/awWMpEtLIWCVHCdNmlRKF860tcRcjRqp9IozExa/o/YetlOx3ZYSAFhi7QnAasUOrnbuE3j99dfZcccd3ReSh4LevXvTsWPHPK7UJeUk0LVrV6680vKS+W+WmKtHj5JeA/sPyW+FPwJ2zvXPYmSWEgDYEYRnihlUbfwhYIVHHn74YX8ELUHJrFmzqFmzpvKsZ3y2x4wZE8S3Ysv3b5kOtTk14zdk8u7tBxRVu7yUAMDKTaleavKTm+kRLCOgbQa0B2MI1r59e+6///4QpDqpcdtttw3mNc2jjz4aTEIuJ2/G9Jy2Z3HbYoYrNgBYGbCXbPZTFjgBW4I877zzgqDw0ksvscceewSh1UWRt912GyeddJKLrhfs86677srw4cMLbqcG3hGYBdQB7GdBVmwAcAjwaEEj6WJvCVh1QNuMFIrZmevx48eHItcZnRUrVswth9sRVd/t008/ZZNNNvFdpvTlT8BW4wtOV1psAPAEcED+vulK3wkMGTIEO44Ugl122WVccsklIUh1SqPVp7A6FSHYGWecwU033RSCVGnMj8CTwIH5Xfq/q4oJAKoAVo1opUIH0/X+EmjZsiWWMjcEmzBhAmussUYIUp3SaPef3Ye+m21Gtc1/06ZN812q9OVP4LeoGu8v+Tcprhywlv8LIRzQtVZ33f4whWC2D8D2A8iyQWC11VbLpf4NwWwTqm1GlYnAQgQKfg1QzArAAOBgoReBhQlccMEFXHHFFUGA6dOnD0cffXQQWl0Q2blzZ3r27OmCqyX7uN122/H222+X3I868I7AY0CbQlQVGgDYsr8t/9trAJkILEDACuaMGzeOFVZYwXsyf/zxR+7o4y+/FLTi5j2XcgkcNWoUG2+8cbmGT23c9957jyZNmqQ2ngZyioD9MaoN2OuAvKzQAMBqog7Mq2ddFCQBO5t8yCH2lsh/s6yAlh1QVl4CIaWktvLG99xzT3mBa/QsE7CqUE/n62ChAcC9gF4+5Us3wOuaNm3KsGHDglBudQGsPoCsvARuvvlmTj311PI6kcLoP//8c26PzcyZM1MYTUM4SsBKYB6br++FBAB2rSX/qZVv57ouTAKffPJJMGeUN9hgA7788sswJzoDqpdddtnc2f8aNWpkwJtkXbj11luDCHSSpeh971OipED/5KO0kADAvuqMyKdTXRM2gU6dOnHLLbcEAcE2np1zzjlBaM2iyP33358nn7Qj0P7b5ptvzscff+y/UCkslcAOwJv5dFJIAGDltbrm06muCZtAtWrVcvUBqlTxf6+offu08rP//JNXwB32jZGA+scee4yDDjoogZ6z1eUbb7zBTjvtlC2n5E1WCVwFXJCPc4UEAO8DW+bTqa4Rgdtvvz2Y0rmtWrUKJglSlu7sVVddlR9//BF7DeC7HXHEEcFU3fR9LlPQ9wGwVT7j5BsAWL3h7/PpUNeIgBHYaqutsCNLIZh9C23TpqDjtyFgSVz1FojbAAAgAElEQVRjKK+aLMix+hOzZ89OnKkG8IaApSqdsDQ1+QYAtvPfTgDIRCBvAiNGjAhil/zff/+dywmg1Kx53xqxXDhy5MggzsRrn0kst0tondhJADsRsETLNwCwKkP6irM0mvr3BQgceeSR9O3bNwgqZ555JjfeeGMQWrMgcsMNN+Szzz7LgiuJ+7DeeusxevToxMfRAF4RsIy9S03Ikk8AYC/YfgRW9QqPxCROoFKlSrnNgJan3Xez3dm2S1uWDoFrr72Ws88+O53ByjiK1ZuwuhMyESiQwHTA/vD+vaR2+QQA2wJvFTi4LheBHIFrrrkmmGNytu/hgw9s/40saQKTJ0/GUk/7bnbC4YknrPq6TAQKJrAdsMSiEfkEAHb0z44AykSgYAKNGjVizJgxBbdzsUGvXr2wjWmyZAnsvffeDBkyJNlBMtC7BTlWdvqvv/7KgDdywUECdhTQjgQu1vIJAKzm6W4OipfLGSEwdOhQmjdvnhFvknNj+vTpuZwAf/75Z3KDqGceeughDj/8cO9JWGXNiy66yHudEpgYgZeB3UsJACoBPwH2UyYCRRFo3bo1Tz31VFFtXWt02GGHYQWRZMkQqFq1Kj/88AMVK1ZMZoCM9GonSyzv//ff6/R1RqbERTfs3KjlyF7s+dGlrQA0AyyKkIlA0QSWWWaZ3GZAW8703Z599llatGjhu8yy6evQoQN33HFH2cZPa+BBgwax3377pTWcxvGXgK3ev7I4eUsLAC4FLvGXjZSlRcCWMi+77LK0hivrOPYaYMoUq8khi5vA66+/zo477hh3t5nrz4JICyZlIlAigW6APccXaUsLACxy2LVEB9RcBHLvxseNG+f90q1N9QUXXMBVVy1x743uiCIINGzYkK+//rqIlm41+fbbb1l77bXdclreZpWA1Wa3lfyCA4AVgGnASllVJr/cItC/f/8gUubaqYd1113XrclxwFvbFGfBle+mANL3GU5V329AdeCPRY26pBUAKyn4RqquajCvCTRr1oyXXw5jS4lVbrMKbrL4CNiGuHr1rCyJv2YnSCzvv14h+TvHZVBm78xGFBoAnAtcXQZnNaTHBD799FM22mgjjxX+v7S77rqLE0880XudaQkMJXgcMGAAhxyy1AyuaWHXOH4QsGf5tYUGAHZuq7Uf+qUiKwROO+00brrppqy4k5gfv/76ay5Tnf2UlU7g3nvvpX17q0nmt+2+++7BrJL5PZOZUmfP8gMKDQAs/7+dIZSJQGwErIa7HQlceeWVY+szqx0dd9xx2INLVhqBypUrM3XqVFZaye/tSF988QVW5EgmAjETsFw+iyzIsrg9AA0B/7fbxkxZ3eVH4M477+SEE07I72KHrxo2bBi2dC0rjYB98w8hkDrrrLO44YYbSoOl1iKwaAKNgLEL/9PiAoAjgAdFUgSSINC4cWPefffdJLrOXJ92nMuOdcmKJ2AV8Xbbze9s5L/99ltu899PP9mXNZkIxE7gSOChfAMAC0PPiN0FdSgCEYG33nqLbbe1QpN+m/K5lza/tus/hHS4ffr04eijjy4NllqLwOIJ3AicmW8A8Drgf7ot3S5lI9CuXTseeOCBso2f1sATJ070/uhakixDySC5ww478OabbyaJUn2HTcDOJO+UTwBQAZgBVA6bl9QnSaBSpUqMHz+eGjX832dqlRBfeOGFJHF627dl/rMMgD7bhx9+yJZbbumzRGkrPwE7jrQKsEBt6UXtAdgYGFV+f+WB7wSuu+46bOOT72bla4880l7ByQohYN+KQ0imZAWObGOsTAQSJrAJ8On8YywqADgK6JOwI+peBHLpcr/66ivvSVh2t9VXX50ZM2xhTZYvgdtvv52OHTvme7mT182cOZP69etjP2UikDCBdkDfpQUA1y9qs0DCjqn7QAnY0vgee+zhvfqTTjopiDK2cU3kiiuumEuHW7Vq1bi6zGQ/FuScfPLJmfRNTnlHwDb3L7DkuqgVgJcAv8/ceDev7go64IADeOKJJ9wVkKfn77zzThCnHvLEsdTL2rZty8MPP7zU61y/wN792x4AmQikQMAKsey+tBWA6UC1FJzRECLAMssskzvmVbduXe9pbLzxxnz22Wfe64xD4ODBg9l3333j6CqzfdhR2O233z6z/skx7wj8DKy6pADASm19751sCco0gYsvvphu3bpl2sc4nLv++uvp3LlzHF153YftlwihGp4dhe3bd4FXsl7Pq8RlgsAawIR5niz8CmAv4LlMuCkngiFQp06dXH2A5ZZbzmvNP/zwA6b1r78WOInjteZixJ177rlcfbXfhUinTZvGGmuswezZs4tBpDYiUCyBvYGhiwsALFOQbQKUiUCqBB577DEOOuigVMcsx2D7778/AwcOLMfQzowZQsloy/kfwhFYZ266cBy1Jch/n/ELrwDcAxwbDgspzQoBOwkQQrKcJ598kgMPPDAr2DPnRyh1IjbYYAO+/PLLzPGXQ94TsPKkxy1uBWAEoF0p3t8D2RRo5VDXX3/9bDoXk1f//PNPLifAjz9atW3ZwgRuvfVWTjnlFK/BvPLKK94XN/J6At0WZ/mmd1hcADBt4V2CbmuV9y4ROOOMM4Ioh2obAW1DoGxBAssvvzyTJ0+mevXqXqM55JBDGDBggNcaJS6zBOyU37+/YPO/AqgFTM6s23LMewL2h982A1au7HcZilGjRrHpppt6P5+FCrRXI48//nihzZy63k432Oa/uXPnOuW3nPWKQG1giimaPwDYGXjVK5kS4xyBe+65h2OP9X8bytZbb827777r3Pwk6bAlhLLEUD7blVdeyYUXXuizRGnLPoFdgNcWDgDsr65tApSJQNkI2IPRsub5bkoBu+AMW1VIOyZpiaF8Ndv/sdZaa+VWuWQiUEYCtgnQNgMusAJwFdCljE5paBHIERg5ciRNmjTxmsbPP/+cywnw+++/e60zX3Gnn346N954Y76XO3nds88+S4sWLZz0XU57RaA70HXhAKA/0MYrmRLjJIFjjjmG++67z0nfC3H68MMPp1+/foU08fba999/H8uL77O1atWKZ555xmeJ0uYGAduBesjCAcBIwO+vXW5MTvBerrTSSrn6AKuuukDaau+4DB06lL33tsRcYdsmm2zCJ5984jWE8ePH06BBA681SpwzBN6b96yf/4WbHUyu4YwEOeo1ATsmd+aZlpjSb6tXrx4TJ070W+RS1IUw1xdddBFXXHFF0PMs8Zkh8BOw2vwrAFZ0e0Zm3JMjwRNYb731gsiUFvqDYdlll2XSpEm55Ei+2pw5c1hzzTVzOmUikBECVvF3xrwVADuU/HFGHJMbIpAj8NJLL3mfMW3s2LE0atQo2Bm3TXGDBg3yWr/VuWjTRturvJ5k98RtBnwyLwCwral+/xa6N0HBe2zFgeyPp+/WtGlTXn01zBQcjzzyCIceeqjXU7znnnvy4osveq1R4pwj0BIYPC8AsOTbtzonQQ57TcCWhydMmEDt2pa4yl+7//77ad++vb8CF6OsWrVqTJ06FUsB7KuNHj0ae50lE4GMEegE9JoXAFw571xgxpyUO4ETuPTSS7nkkku8pvDrr7/mcgL88ssvXutcWFyHDh244447vNasug9eT6/L4izvzwXzAgA7dH2My2rku58E6tatm8ucVqFCBT8FRqqOP/54LA1ySDZixAi2397f4qOzZ8+mfv36/PSTbbqWiUCmCNwPtJ8XAAwFmmfKPTkjAhGBEHLEv/baa+yyi6XoDsPWXXddvvrqK6/F9u3bl3bt2nmtUeKcJfA8sNe8AMBOAKg8mbNz6bfjtonq+eftfvXb7KE4ZswYv0VG6q666iq6dPE78/hOO+3EG2+8EcR8SqRzBCzz1mbzAoAf5iUGcE6GHA6CgH1btAekz9a9e3e6ds2l6PbebHOnvd7x1T7++GM233xzX+VJl/sELPFfTQsAlgP+XKgwkPvypMArAmeddRbXXXedV5oWFmMZAS0zoO+2xx578MILL3gt8+STT8YqPspEIKME/gEqWgBQBwg7F2lGZ0hu/Y9A9erVsXzqVifAZ9tnn3147rnnfJZInz59OOqoo7zVaKc51lhjDWbOnOmtRgnzgkBdCwAsI9BHXsiRCK8JWIVAqxTosz366KMcdthh3kqsUqUKkydP9jqQ6927Nx07dvR2DiXMGwKbWwCwm2Vd9UaShHhLYNttt+Wtt97yVp8J+/PPP3OJj6ZPn+6lzuOOO467777bS23zRDVu3BgrbywTgYwT2N0CgIMBqw8sE4HME3jvvffYaqutMu9nKQ526tSJXr16ldJFZtu+8sor7Lrrrpn1r1TH3nnnHSxQlYmAAwQOsQDgRKC3A87KRREghG+QFuQ0adLEu9m2injffvutd7rmF2QpnS21s0wEHCDQwQKA84AeDjgrF0Ug9+7YjpBZHnmfzY6Q2VEyn8xSOltqZ1/NXtvYKQ7LACgTAQcInG8BQHfgfAeclYsikCNw4403cvrpp3tN46abbuKMM87wSuM333zDWmut5ZWm+cXYfXnmmWd6q0/CvCPQwwKA24CTvJMmQd4S2GCDDfj888+91WfCfvzxx1yinDlz5nihc+edd/a+5PGGG27IF1984cV8SUQQBG63AOBB4Igg5EqkNwRefvllmjVr5o2eRQk56KCDsDoIPpjt/Lf9G77a8OHDvd7c6Ou8Ba7rIQsABgKtAgch+Y4RaNOmDf3793fM68LcfeaZZ2jVyv1fTdu3MWnSJKpWrVoYAIeuttwNlsNBJgIOEXjaAgDLAWC5AGQi4AyBZZddFkudW6tWLWd8LsZR0zd16tRimmamzZFHHolVxvPVfvjhh9zrmrlz5/oqUbr8JPCyBQCWWUUHV/2cYK9VXXbZZVx00UVeazz33HO59tprndY4dOhQmjf3t9p4SEWcnL4R5fzCBN62AEClgHVjOEnAjlx999132GqAr2abHTfaaCNn5dWpUye3UuOz2cmGcePG+SxR2vwk8IkFAKOBdfzUJ1W+E3jqqado3bq11zK322473n77bSc1nn/++dg3ZF9tyJAh7Lvvvr7Kky6/CYyxAGA8sIbfOqXOVwJ77bWX99Xz7rzzTjp06ODkFNoKhh3b9NX2339/Bg60fdQyEXCOwPcWANgOo5rOuS6HRSAiMGbMGBo1auQtjxkzZuQ2mf32229Oadxmm22cXbnIB7RlpLSyvzIRcJTADxYA/Ays4qgAuS0CdO7cmZ49e3pN4qijjuLBBy1lhzt22223cdJJ/uYYu/jii7n88svdmRB5KgILEphhAcA/oiICLhOoUaMG48ePp1KlSi7LWKLvL774Invuuacz+lZYYYXc5r/q1as743MhjtqRvwYNGuTyG8hEwFUCCgBcnTn5vQCBBx54gHbt2nlNxaXd5gcffDADBvhbZdwyNFqmRpkIuExAAYDLsyff/yVgO+XffPNNr4lYJb1u3bo5ofHpp59mv/32c8LXYpy0zafPP/98MU3VRgQyQ0ABQGamQo6USuCDDz5giy22KLWbzLa3s+YuVNOrWbMmU6ZMYZll7M+Lf/b111+zzjo6Oe3fzIanSAFAeHPureITTjgBOzLns+2222688sormZZoJXGvv/76TPtYinPnnHOO95tOS+Gjtu4QUADgzlzJ06UQqFy5MnY0a5VV/D3UYicB7ERAlu3DDz9k8803z7KLRfv2+++/U79+/Vy5ZpkIuE5AAYDrMyj/FyBw8803c+qpp3pLxXIBWE4Ayw2QRbNXMPYqxld76KGHsOJGMhHwgYACAB9mURr+JWB58z/99FOviVhWwKy+6rjxxhs5/fTTveW/88478/rrr3urT8LCIqAAIKz5DkLtsGHDaNq0qbdaR4wYwY477pg5fcstt1zu7L9tAvTRLLDcZJNNfJQmTYESUAAQ6MT7LPvQQw/lkUce8VkiG264IV988UWmNNqxPzv+56udcsopWHZDmQj4QkCpgH2ZSen4l0CFChVy30RXX311b6lcc801nHfeeZnS99hjj3mbHGfWrFlY+emZM2dmirmcEYESCORSAasYUAkE1TSbBCxH+4UXXphN52LwavLkybkH0t9//x1Db6V3YSl/zafll1++9M4y2MNdd93FiSeemEHP5JIIFE0gVwxI5YCL5qeGWSVgVdq+++47b5PRGPeWLVsyePDgTEyBLY/feuutmfAlCSeaNGnCe++9l0TX6lMEykUgVw54NKC0VuWaAo2bGAGr096qVavE+i93x48//jiWcz8L9vbbb2Plf320kSNHeqvNx/mSprwJjLEA4GNg07yb6EIRcITAPvvsw7PPPuuIt4W7OWfOnFxOgHInpfH96OVxxx3HvffeW/gEqYUIZJvAJxYAvAVsm20/5Z0IFEfgm2++cSJ/fnHq4IwzzuCmm24qtnks7a6++mrOPffcWPrKWic///xzLsiaPXt21lyTPyJQKoG3LQB4Cdit1J7UXgSySMDyttuOeV/N0u5uueWWZZNnBX/sxEXt2rXL5kOSA1tmSZ8TGyXJTn1nnsDLFgAMBPx9UZr5OZCDSRJYbbXV+P7771lhhRWSHKasfTdu3Jj333+/LD5YWdznnnuuLGOnMejGG2/MZ599lsZQGkME0ibwtAUADwJHpD2yxhOBtAj06dMn8wV0SmFhu+/LVf/g4Ycfpm3btqW4n9m2r776qtcZJTMLXo6lReAhCwAstdVJaY2ocUQgbQI77LADb7zxRtrDpjbeTz/9lMsJ8Mcff6Q2pg1kVRcnTZpEpUqVUh03rcGOOOIILMCRiYCnBG63AKA7cL6nAiVLBHIEfC5Ra/ratGmDZeJL0ywxTu/evdMcMrWx7GRFnTp1mDt3bmpjaiARSJlADwsALJ9oj5QH1nAikCoBq6B3xx13pDpmmoMNGTKEfffdN80hee2119hpp51SHTOtwXr06EGXLl3SGk7jiEA5CJxvAYDlt/QzjC8HUo2ZSQIrr7wyEyZMoGrVqpn0Lw6n7LiaLcmnYeussw6jR1sOMT9t7bXX5ttvv/VTnFSJwP8T6GABQBugv4iIgO8EbLOcpaz11bp27Ur37vZGL3m77LLLuOiii5IfqAwjDB06lL333rsMI2tIEUiVQBsLACwHgOUCkImA1wSslvsnn3zircavvvqK9ddfPxV948aNo0GDBqmMlfYgBxxwAE899VTaw2o8EUibwO4WAGwGfJT2yBpPBMpBwI527bzzzuUYOpUx7Z180icemjVrxssvv5yKnrQHsYqGtvlPJgIBENjcAgC72ycGIFYSRSB3Zt3no12Ws95y1ydp999/P0cffXSSQ5St70svvZRu3bqVbXwNLAIpEqhrAcBywJ+A/bdMBLwmUKFChdxGuZo1a3qpc+bMmbmcALNmzUpEn22mtNS/VapUSaT/cnb6999/Y2Wk09pIWU6tGjt4Av8AFec99H8AVgseiQAEQeDKK6/ENsz5ascccwwPPPBAIvLatWuXWN+JOFxAp08++SQHHnhgAS10qQg4S+BHoOa8AEAlgZ2dRzleKAH7ljd+/PhCmzlz/fDhw9l1110T8fell15it938rB1mO//tBIBMBAIgYLuhN5sXANhd3zwA0ZIoAjkCzzzzDC1btvSWhp3T//rrr2PVZ7v+bfe/j2Zloxs2bOijNGkSgUUReB7Ya14AcB9wjDiJQCgEWrRowaBBg7yVe/nll3PxxRfHqu/CCy/E+vXRzj33XK699lofpUmTCCyKwP1A+3kBwJWAvy9FdQOIwCII+HyW3Uog169fP9Z5tzwD6667bqx9ZqGzP//8M7dx0vL/y0QgEAJXARfMCwAsPdqtgQiXTBHIETjvvPOwnO++WvPmzXnhhRdikedzRcWHHnqII488MhZO6kQEHCHQCeg1LwBoAfi7HurIjMjNdAmsttpqufoAFStWTHfglEZ75JFHcnkP4rA777yTE044IY6uMtdH06ZNsQRRMhEIiIBtgBo8LwDYFLCTADIRCIpA3759vf32N3v27NzS9vTp00ua00qVKuXO/lerVq2kfrLY+LPPPmPjjTfOomvySQSSJGAZgD+ZFwCsAvyc5GjqWwSySMBS51pZW1/Nih/ddtttJck79NBDsdUEH+3UU0/FikTJRCAwAvbMnzl/9j/bAVMjMAiSKwJ8/PHHbLqpLYL5Z++88w7bbrttScKGDBniZXW83377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","position":"bottom" }};
</script>
<script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>
`

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
        //setUserProperties(analytics, { favorite_food: 'apples' });
        const idToken = await userAuth.getIdToken(true)
        setAuthTokenInSessionStorage(idToken)
        //console.log(idToken);
        const tokenResult = await userAuth.getIdTokenResult()
        // user is logged in, send the user's details to redux, store the current user in the state
        const isShop = tokenResult.claims.isShop ? true : false;
        let ISODate: any = userAuth.metadata.creationTime
        if (userAuth.metadata.creationTime) {
          ISODate = new Date(userAuth.metadata.creationTime)
        }
        let date_for_redux = ('0' + ISODate.getDate()).slice(-2) + '/' + ('0' + ISODate.getMonth() + 1).slice(-2) + '/' + ISODate.getFullYear();
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

          try {
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
          } catch (e: any) {
            dispatch(
              login({
                email: userAuth.email,
                uid: userAuth.uid,
                idToken: idToken,
                emailVerified: userAuth.emailVerified,
                isShop,
                createdAt: date_for_redux,
                shopId: null
              })
            );
          }

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
                <Footer />
              </>
            )}

          </Auth>
        </ChakraProvider>
      </ApolloProvider>
    </Provider >

  )
}

export default MyApp
