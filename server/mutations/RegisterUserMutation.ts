import { partnerFragment } from '../fragments';
import { internalOrderFragment } from '../fragments/orderFragment'
export default `
mutation register($email: String!, $name: String!, $password: String!, $subscribeNewsletter: Boolean!) {
    register(email: $email, name: $name, password: $password, subscribeNewsletter: $subscribeNewsletter) {
      user {
        id
        name
        email
        ${partnerFragment}
      }
      cart {
        ${internalOrderFragment}
      }
    }
  }`;
