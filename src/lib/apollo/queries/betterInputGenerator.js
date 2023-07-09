import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'

const BETTER_INPUT_GENERATOR = graphql(`
query betterInputGenerator($query: String!) {
    betterInputGenerator(query: $query) {
      colors
      sizes
      brand
      minPrice
      maxPrice
      query
      macroCategory
      microCategory
      keywords
      univers
    }
  }
`
)

export default BETTER_INPUT_GENERATOR;
