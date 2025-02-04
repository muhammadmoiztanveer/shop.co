import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, message, Spin } from "antd";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { StarFilled, DeleteFilled } from "@ant-design/icons";
import { generateClient } from "aws-amplify/api";
import { deleteProduct } from "../../graphql/mutations";
import { v4 as uuid } from "uuid";

const ProductCards = ({
  loadingNewArrivals,
  newArrivals,
  viewProduct,
  title = "NEW ARRIVALS",
  linkState,
}) => {
  const [loading, setLoading] = useState(false);
  const [productIdBeingDeleted, setProductIdBeingDeleted] = useState("");

  const client = generateClient();
  const handleDeleteProduct = async (productId) => {
    setProductIdBeingDeleted(`${productId}`);

    try {
      setLoading(true);
      const deleteProductResponse = await client.graphql({
        query: deleteProduct,
        variables: {
          input: {
            id: `${productId}`,
          },
        },
      });

      console.log("deleteProductResponse", deleteProductResponse);
      message.success("Product deleted successfully."); // Show success message
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product. Please try again."); // Show error message
    } finally {
      setLoading(false); // Hide spinner regardless of success or failure
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-24 py-24 px-4 sm:px-8 lg:px-10 2xl:px-16">
      <div className="text-center text-4xl">{title}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {loadingNewArrivals
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={uuid()}
                  className="flex flex-col space-y-8 animate-pulse w-full"
                >
                  <div className="bg-gray-300 aspect-square rounded-md w-full"></div>
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                    <div className="flex space-x-2 w-full bg-transparent">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <StarFilled
                            key={i}
                            className="text-3xl text-gray-300"
                          />
                        ))}
                    </div>
                    <div className="flex items-center space-x-4 w-full">
                      <div className="h-8 w-16 bg-gray-300 rounded"></div>
                      <div className="h-8 w-16 bg-gray-300 rounded"></div>
                      <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
          : newArrivals.map((product, index) => (
              <div
                key={uuid()}
                className="flex flex-col space-y-8 cursor-pointer"
                onClick={() => viewProduct(product.id)}
              >
                <StorageImage
                  alt={`image-${index}`}
                  path={product.images?.[0]}
                  className="aspect-square rounded-3xl"
                />
                <div className="flex flex-col space-y-2">
                  <span className="text-xl">{product.title}</span>
                  <div className="flex items-center space-x-1">
                    {/* Render filled stars */}
                    {Array.from({
                      length: Math.floor(product.averageRating || 0),
                    }).map((_, index) => (
                      <StarFilled
                        key={index}
                        style={{ color: "#ffca43", fontSize: "25px" }}
                      />
                    ))}
                    {/* Render half star if the rating has a decimal */}
                    {product.averageRating % 1 !== 0 && (
                      <StarFilled
                        key="half"
                        style={{ color: "#ffca43", fontSize: "25px" }}
                        className="opacity-50"
                      />
                    )}
                    {/* Render empty stars if necessary */}
                    {Array.from({
                      length: 5 - Math.ceil(product.averageRating || 0),
                    }).map((_, index) => (
                      <StarFilled
                        key={index + Math.floor(product.averageRating || 0)}
                        style={{ color: "#ccc", fontSize: "25px" }}
                      />
                    ))}
                    <div className="ps-4">
                      {product.averageRating
                        ? `${product.averageRating.toFixed(1)} / 5`
                        : ""}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg xl:text-2xl 2xl:text-3xl font-bold">
                      $
                      {Math.round(
                        product.price * (1 - product.discountPercentage / 100)
                      )}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="text-lg xl:text-2xl 2xl:text-3xl font-bold line-through text-[#7c7b7b]">
                            ${product.price}
                          </div>
                          <Button
                            size="small"
                            color="danger"
                            variant="filled"
                            shape="round"
                          >
                            -{product.discountPercentage}%
                          </Button>
                        </div>
                        <span
                          className="z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          {loading && product.id === productIdBeingDeleted ? (
                            <Spin />
                          ) : (
                            <DeleteFilled className="text-2xl xl:text-3xl text-red-500" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
      <Link to="/products" state={linkState}>
        <Button variant="outlined" shape="round" className="w-52 py-6 text-lg">
          View All
        </Button>
      </Link>
    </div>
  );
};

export default ProductCards;
