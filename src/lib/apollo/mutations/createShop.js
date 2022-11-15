import { gql } from '@apollo/client';

const CREATE_SHOP = gql`
    mutation createShop(
        $options: ShopInput!
    ) {
        createShop(
            options: $options
        )
    }
`

export default CREATE_SHOP;