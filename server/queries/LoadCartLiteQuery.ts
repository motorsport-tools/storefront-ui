import { orderLiteFragment } from '../fragments';
export default `
  query {
    cart {
      ${orderLiteFragment}
    }
  }
`;
