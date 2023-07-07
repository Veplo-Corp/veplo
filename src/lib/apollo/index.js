import { useMemo } from "react";

import {
    ApolloClient, ApolloLink, createHttpLink, HttpLink, InMemoryCache
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context';
import { env } from "process";
import { createUploadLink } from 'apollo-upload-client'





let apolloClient;


function createApolloClient() {
    // Declare variable to store authToken
    let authorization_token;




    const BACKEND_LINK = createUploadLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_URI + '/query',
        //credentials: 'same-origin',
        // fetchOptions: {
        //     mode: 'no-cors',
        // },
    });

    const DATO_CMS_LINK = createHttpLink({
        uri: 'https://graphql.datocms.com/',
        //credentials: 'same-origin',
    });




    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        if (typeof window !== 'undefined') {
            authorization_token = sessionStorage.getItem('authorization_token');
        }
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                Authorization: authorization_token ? `${authorization_token}` : "",
                'Apollo-Require-Preflight': 'true',
            }
        }
    });

    const authLinkDATOCMS = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN}`,
            }
        }
    });


    return new ApolloClient({
        ssrMode: typeof window !== 'undefined',
        link: ApolloLink.split(
            operation => operation.getContext().clientName === 'DATO_CMS_LINK',
            authLinkDATOCMS.concat(DATO_CMS_LINK), //if above 
            authLink.concat(BACKEND_LINK),
        ),

        cache: new InMemoryCache({
            typePolicies: {
                Shop: {
                    keyFields: ['id']
                },
                Product: {
                    keyFields: ["id"],
                },
                ShopInfo: {
                    keyFields: false,
                    merge: false,
                    read: () => null,
                },
                CartProductVariation: {
                    keyFields: false,
                    merge: false,
                    read: () => null,
                },
                // ProductVariation: {
                //     keyFields: ["id"],
                // },
            }

        }),
        connectToDevTools: true,
        // defaultOptions: {
        //     watchQuery: {
        //         nextFetchPolicy(currentFetchPolicy) {
        //             if (
        //                 currentFetchPolicy === 'network-only' ||
        //                 currentFetchPolicy === 'cache-and-network'
        //             ) {
        //                 // Demote the network policies (except "no-cache") to "cache-first"
        //                 // after the first request.
        //                 return 'cache-first';
        //             }
        //             // Leave all other fetch policies unchanged.
        //             return currentFetchPolicy;
        //         },
        //     },
        // },
    })
}

export function initApollo(initialState = null) {
    const client = apolloClient || createApolloClient();
    if (initialState) {
        client.cache.restore({
            ...client.extract(),
            ...initialState
        })
    }


    if (typeof window === 'undefined') {
        return client
    }


    if (!apolloClient) {
        apolloClient = client
    }


    return client
}


export function useApollo(initialState) {
    return useMemo(
        () => initApollo(initialState),
        [initialState]
    )
}

//! other way to initialize Apollo
// import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// const httpLink = createHttpLink({
//     uri: 'http://206.189.55.217/graphql',
//     credentials: 'include',
// });

// let token;

// const authLink = setContext((_, { headers }) => {
//     // get the authentication token from local storage if it exists
//     if (typeof window !== 'undefined') {
//     // return the headers to the context so httpLink can read them
//         token = localStorage.getItem('token');
//         console.log(token);
//     }

//     const authorization = token ? `${token}` : ""
//     console.log(authorization);

//     return {
//         headers: {
//             //...headers,
//             authorization: authorization
//         }
//     }
// });

// export const client = new ApolloClient({
//     link: authLink.concat(httpLink),
//     ssrMode: typeof window !== 'undefined',
//     cache: new InMemoryCache(),
// });