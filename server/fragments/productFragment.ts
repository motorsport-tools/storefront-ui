import alternativeProductsFragment from "./alternativeProductsFragment"
import frequentlyTogetherProductsFragment from "./frequentlyTogetherProductsFragment"
export default `
  id
  firstVariant{
    id
    combinationInfoVariant
    slug
    variantAttributeValues{
      id
      name
      displayType
      name
      htmlColor
      search
      attribute{
        id
        name
      }
    }
  }
  ${alternativeProductsFragment}
  ${frequentlyTogetherProductsFragment}
  smallImage
  price
  name
  description
  image
  imageFilename
  combinationInfo
  slug
  sku
  jsonLd
  isInWishlist
  ribbon {
    id
    html
    textColor
    htmlClass
    bgColor
    displayName
  }
  categories {
    id
    name
    slug
    parent{
      parent{
        id
      }
    }
  }
  attributeValues {
    id
    name
    displayType
    priceExtra
    attribute {
      id
      name
    }
    search
  }
`;
