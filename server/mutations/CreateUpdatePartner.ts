import partnerFragament from "../fragments/partnerFragment";
export default `
  mutation CreateUpdatePartner(
    $name: String!
    $email: String!
    $phone: String!
    $vat: String
    $subscribeNewsletter: Boolean!
  ) {
    createUpdatePartner(
      name: $name
      email: $email
      phone: $phone
      vat: $vat
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
