import { graphql } from '../generated/gql'
const EDIT_SHOP = graphql(`
    mutation editShop(
        $id: ID!
        $options: EditShopInput!
        ) {
        editShop(
            id: $id
            options: $options

        )      
    }
    
`)

export default EDIT_SHOP;
