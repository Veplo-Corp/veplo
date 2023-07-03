import { gql } from '@apollo/client'

const GET_COMPONENTS_HOME_LIST = gql`
query allListComponentWithImages {
    allListComponentWithImages {
      title
      imageAndText {
        titolo
        immagine {
          url
        }
      }
    }
  }
`



export default GET_COMPONENTS_HOME_LIST;