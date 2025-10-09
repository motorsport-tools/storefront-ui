export default `
  query ProductVariant($productTemplateId: Int, $combinationId: [Int]) {
    productVariant(
      productTemplateId: $productTemplateId
      combinationId: $combinationId
    ) {
      product {
        id
        sku
        smallImage
        price
        name
        description
        image
        imageFilename
        combinationInfoVariant
        slug
        mediaGallery {
          id
          name
          image
          imageFilename
        }
        metaTitle
        metaImage
        metaKeyword
        metaDescription
        jsonLd
        isInWishlist
        categories {
          id
          name
          slug
          parent {
            parent {
              id
            }
          }
        }
      }
      productTemplateId
      displayName
      price
      listPrice
      hasDiscountedPrice
    }
  }
`;
