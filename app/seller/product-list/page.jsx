'use client'

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const {
    router,
    getToken,
    user
  } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH SELLER PRODUCTS
  // ==========================================

  const fetchSellerProduct = async () => {

    try {

      const token = await getToken();

      const { data } = await axios.get(
        "/api/product/seller-list",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {

        setProducts(data.products);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.error("FETCH PRODUCTS ERROR:", error);

      toast.error(
        error.response?.data?.message || error.message
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (productId, productName) => {

    const confirmed = window.confirm(
      `Are you sure you want to remove "${productName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(productId);

      const token = await getToken();

      const { data } = await axios.delete(
        "/api/product/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            productId
          }
        }
      );

      if (data.success) {

        // Remove product immediately from the UI
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== productId
          )
        );

        toast.success("Product removed successfully");

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to remove product"
      );

    } finally {

      setDeletingId(null);

    }

  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {

    if (user) {
      fetchSellerProduct();
    } else {
      setLoading(false);
    }

  }, [user]);

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="flex-1 min-h-screen flex flex-col justify-between">

      {loading ? (

        <Loading />

      ) : (

        <div className="w-full md:p-10 p-4">

          <h2 className="pb-4 text-lg font-medium">
            All Products
          </h2>

          <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">

            <table className="table-fixed w-full overflow-hidden">

              {/* ============================
                  TABLE HEADER
              ============================= */}

              <thead className="text-gray-900 text-sm text-left">

                <tr>

                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                    Product
                  </th>

                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    Category
                  </th>

                  <th className="px-4 py-3 font-medium truncate">
                    Price
                  </th>

                  <th className="px-4 py-3 font-medium truncate">
                    Action
                  </th>

                </tr>

              </thead>

              {/* ============================
                  PRODUCTS
              ============================= */}

              <tbody className="text-sm text-gray-500">

                {products.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="text-center py-10 text-gray-500"
                    >
                      No products found.
                    </td>

                  </tr>

                ) : (

                  products.map((product, index) => (

                    <tr
                      key={product._id || index}
                      className="border-t border-gray-500/20"
                    >

                      {/* ============================
                          PRODUCT
                      ============================= */}

                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">

                        <div className="bg-gray-500/10 rounded p-2 shrink-0">

                          <Image
                            src={product.image[0]}
                            alt="product Image"
                            className="w-16 h-16 object-contain"
                            width={1280}
                            height={720}
                          />

                        </div>

                        <span className="truncate w-full">

                          {product.name}

                        </span>

                      </td>

                      {/* ============================
                          CATEGORY
                      ============================= */}

                      <td className="px-4 py-3 max-sm:hidden">

                        {product.category}

                      </td>

                      {/* ============================
                          PRICE
                      ============================= */}

                      <td className="px-4 py-3">

                        {process.env.NEXT_PUBLIC_CURRENCY}
                        {product.offerPrice}

                      </td>

                      {/* ============================
                          ACTIONS
                      ============================= */}

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-2">

                          {/* VISIT */}

                          <button
                            onClick={() =>
                              router.push(
                                `/product/${product._id}`
                              )
                            }
                            className="flex items-center gap-1 px-2 md:px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                          >

                            <span className="hidden md:block">
                              Visit
                            </span>

                            <Image
                              className="h-3.5"
                              src={assets.redirect_icon}
                              alt="redirect_icon"
                            />

                          </button>

                          {/* REMOVE */}

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                product._id,
                                product.name
                              )
                            }
                            disabled={deletingId === product._id}
                            className="flex items-center gap-1 px-2 md:px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-md transition-colors"
                          >

                            {deletingId === product._id ? (

                              <span className="text-xs">
                                Removing...
                              </span>

                            ) : (

                              <>
                                <span className="hidden md:block">
                                  Remove
                                </span>

                                <span className="md:hidden">
                                  ×
                                </span>
                              </>

                            )}

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      <Footer />

    </div>

  );

};

export default ProductList;