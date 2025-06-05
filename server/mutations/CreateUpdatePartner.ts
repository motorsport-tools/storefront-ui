import { gql } from "@apollo/client/core";
import partnerFragament from "../fragments/partnerFragment";

export default gql`
  mutation CreateUpdatePartner(
    $name: String!
    $email: String!
    $phone: String!
    $subscribeNewsletter: Boolean!
  ) {
    createUpdatePartner(
      name: $name
      email: $email
      phone: $phone
      subscribeNewsletter: $subscribeNewsletter
    ) {
      id
      name
      email
      isPublic
      phone
      country {
        id
        name
        code
      }
      vat
    }
  }
`;
