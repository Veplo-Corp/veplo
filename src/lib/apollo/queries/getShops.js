import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'

const GET_SHOPS = graphql(`
    query shops($limit: Int!, $offset: Int!, $filters: ShopFilters!) {
    shops(limit: $limit, offset: $offset, filters: $filters) {
      categories
      id
      name{
        unique
        visualized
      }
      status
      profileCover
      profilePhoto
      stats{
        followers
        averagePrice
        productsQuantity
      }
      minimumAmountForFreeShipping
    }
  }
`)

export default GET_SHOPS;