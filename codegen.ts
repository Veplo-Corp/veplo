import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_APOLLO_URI /* 'https://dev.veplo.it/graphql' */,
    documents: [
        './src/lib/apollo/mutations/**/*.js',
        './src/lib/apollo/queries/**/*.js',
    ],

    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './src/lib/apollo/generated/': {
            preset: 'client',
            config: {
                maybeValue: 'T',
            },
        }
    },


};

export default config;