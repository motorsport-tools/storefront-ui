import orderFragment from "../fragments/orderFragment";
export default `
  mutation($serviceId: String!){
    setRate(serviceId: $serviceId){
      ${orderFragment}
    }
  }
`;
