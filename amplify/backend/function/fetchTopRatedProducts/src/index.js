import AWS from "aws-sdk";
const { DynamoDB } = AWS;

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    // Scan the reviews table
    const params = {
      TableName: "Review-bhsuluo55vac3f3w6fsk6j4rdm-dev",
    };
    const result = await dynamodb.scan(params).promise();

    // Aggregate ratings per product
    const productRatings = {};
    result.Items.forEach((review) => {
      if (!productRatings[review.productID]) {
        productRatings[review.productID] = { totalRating: 0, count: 0 };
      }
      productRatings[review.productID].totalRating += review.rating;
      productRatings[review.productID].count += 1;
    });

    // Calculate average ratings for each product
    const productAverageRatings = [];
    for (const productID in productRatings) {
      const averageRating =
        productRatings[productID].totalRating / productRatings[productID].count;
      productAverageRatings.push({ productID, averageRating });
    }

    // Sort products by average rating in descending order
    productAverageRatings.sort((a, b) => b.averageRating - a.averageRating);

    console.log("Product Average Ratings", productAverageRatings);

    // Get the top 4 products
    const top4Products = productAverageRatings.slice(0, 4);

    // Return the top 4 product IDs
    // const topProductIDs = top4Products.map((product) => product.productID);

    return {
      topRatedProducts: top4Products,
      allProducts: productAverageRatings,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching reviews", error }),
    };
  }
};
