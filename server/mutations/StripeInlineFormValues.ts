import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!, $pmCode: String!) {
    stripeGetInlineFormValues(providerId: $providerId, pmCode: $pmCode) {
      stripeGetInlineFormValues
    }
  }
`;