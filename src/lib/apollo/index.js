import { useMemo } from "react";

import {
    ApolloClient, createHttpLink, HttpLink, InMemoryCache
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context';
import { env } from "process";
import { createUploadLink } from 'apollo-upload-client'





let apolloClient;


function createApolloClient() {
    // Declare variable to store authToken
    let authorization_token;

    
    const httpLink = createHttpLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_URI ,
        credentials: 'same-origin',

    });

    const link = createUploadLink({
        uri: process.env.NEXT_PUBLIC_APOLLO_URI ,
        credentials: 'same-origin',
        // 'Apollo-Require-Preflight': 'true'
    })

    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        if (typeof window !== 'undefined') {
            authorization_token = localStorage.getItem('authorization_token');
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

    return new ApolloClient({
        ssrMode: typeof window !== 'undefined',
        link: authLink.concat(link) /* authLink.concat(httpLink) */,
        cache: new InMemoryCache({
            typePolicies: {
                Shop: {
                    keyFields: [/* "name",  */'id']
                },
                Product: {
                    keyFields: ["id"],
                }
               
                
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

//! other mode to initialize Apollo
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