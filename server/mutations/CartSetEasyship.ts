import gql from "graphql-tag";
import orderFragment from "../fragments/orderFragment";

export default gql`
  mutation($serviceId: String!){
    setRate(serviceId: $serviceId){
      ${orderFragment}
    }
  }
`;
