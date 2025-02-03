export const listProductFilters = /* GraphQL */ `
  query ListProductFilters(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        colors
        sizes
      }
      nextToken
    }
  }
`;
