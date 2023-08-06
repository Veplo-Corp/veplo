import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'

const GET_SHOP = graphql(`
    query getSingleShop(
        $id: ID!
        ) {
        shop(
            id: $id
        ){
            id
            businessId
            name
            categories
            createdAt
            status
            profilePhoto
            profileCover
            isDigitalOnly
            minimumAmountForFreeShipping
            links{
                instagram
                tiktok
            }
            info{
                phone
                description
                opening{
                    days
                    hours
                }
            }
            address{
                postcode
                city
                street
                location {
                    type
                    coordinates
                }
            }
            
        } 
    }
`)

export default GET_SHOP;


