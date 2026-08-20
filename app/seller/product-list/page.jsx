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
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch products"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (
    productId,
    productName
  ) => {

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

        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) =>
              product._id !== productId
          )
        );

        toast.success(
          "Product removed successfully"
        );

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

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

          {/* ==================================
              TITLE
          ================================== */}

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg md:text-xl font-medium text-gray-900">
                All Products
              </h2>

              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}
              </p>

            </div>

          </div>

          {/* ==================================
              EMPTY STATE
          ================================== */}

          {products.length === 0 ? (

            <div className="w-full max-w-5xl bg-white border border-gray-500/20 rounded-xl py-14 px-6 text-center">

              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">

                <span className="text-2xl">
                  📦
                </span>

              </div>

              <p className="text-gray-700 font-medium">
                No products found
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Your products will appear here.
              </p>

            </div>

          ) : (

            <>

              {/* ==================================================
                  MOBILE PRODUCT CARDS
                  Visible only below md
              ================================================== */}

              <div className="md:hidden space-y-4">

                {products.map(
                  (product, index) => (

                    <div
                      key={
                        product._id ||
                        index
                      }
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                    >

                      {/* ================================
                          PRODUCT TOP
                      ================================= */}

                      <div className="flex gap-3 p-3">

                        {/* IMAGE */}

                        <div className="w-24 h-24 shrink-0 bg-gray-500/10 rounded-lg flex items-center justify-center overflow-hidden">

                          <Image
                            src={
                              product.image?.[0]
                            }
                            alt={
                              product.name ||
                              "Product image"
                            }
                            className="w-full h-full object-contain"
                            width={300}
                            height={300}
                          />

                        </div>

                        {/* PRODUCT INFORMATION */}

                        <div className="min-w-0 flex-1 flex flex-col justify-center">

                          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                            {
                              product.name
                            }
                          </h3>

                          <p className="text-xs text-gray-500 mt-1.5 truncate">
                            {
                              product.category
                            }
                          </p>

                          <p className="text-base font-semibold text-gray-900 mt-2">

                            {
                              process.env
                                .NEXT_PUBLIC_CURRENCY
                            }

                            {
                              product.offerPrice
                            }

                          </p>

                        </div>

                      </div>

                      {/* ================================
                          ACTIONS
                      ================================= */}

                      <div className="border-t border-gray-100 p-3">

                        <div className="grid grid-cols-2 gap-2">

                          {/* VISIT */}

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/product/${product._id}`
                              )
                            }
                            className="h-10 flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white rounded-lg text-sm font-medium transition-all"
                          >

                            <span>
                              Visit
                            </span>

                            <Image
                              className="h-3.5 w-3.5"
                              src={
                                assets.redirect_icon
                              }
                              alt="redirect"
                            />

                          </button>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product._id,
                                product.name
                              )
                            }
                            disabled={
                              deletingId ===
                              product._id
                            }
                            className="h-10 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-all"
                          >

                            {deletingId ===
                            product._id ? (

                              <span>
                                Removing...
                              </span>

                            ) : (

                              <span>
                                Remove
                              </span>

                            )}

                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* ==================================================
                  DESKTOP / TABLET TABLE
                  Visible md and above
              ================================================== */}

              <div className="hidden md:flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">

                <table className="table-fixed w-full overflow-hidden">

                  {/* ============================
                      TABLE HEADER
                  ============================= */}

                  <thead className="text-gray-900 text-sm text-left">

                    <tr>

                      <th className="w-2/5 px-4 py-3 font-medium truncate">
                        Product
                      </th>

                      <th className="px-4 py-3 font-medium truncate">
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

                    {products.map(
                      (product, index) => (

                        <tr
                          key={
                            product._id ||
                            index
                          }
                          className="border-t border-gray-500/20"
                        >

                          {/* PRODUCT */}

                          <td className="px-4 py-3">

                            <div className="flex items-center gap-3 min-w-0">

                              <div className="bg-gray-500/10 rounded p-2 shrink-0">

                                <Image
                                  src={
                                    product
                                      .image?.[0]
                                  }
                                  alt={
                                    product.name ||
                                    "Product image"
                                  }
                                  className="w-16 h-16 object-contain"
                                  width={1280}
                                  height={720}
                                />

                              </div>

                              <span className="truncate">
                                {
                                  product.name
                                }
                              </span>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-4 py-3">

                            {
                              product.category
                            }

                          </td>

                          {/* PRICE */}

                          <td className="px-4 py-3">

                            {
                              process.env
                                .NEXT_PUBLIC_CURRENCY
                            }

                            {
                              product.offerPrice
                            }

                          </td>

                          {/* ACTIONS */}

                          <td className="px-4 py-3">

                            <div className="flex items-center gap-2">

                              {/* VISIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/product/${product._id}`
                                  )
                                }
                                className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                              >

                                <span>
                                  Visit
                                </span>

                                <Image
                                  className="h-3.5 w-3.5"
                                  src={
                                    assets.redirect_icon
                                  }
                                  alt="redirect"
                                />

                              </button>

                              {/* REMOVE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteProduct(
                                    product._id,
                                    product.name
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  product._id
                                }
                                className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-md transition-colors"
                              >

                                {deletingId ===
                                product._id ? (

                                  <span>
                                    Removing...
                                  </span>

                                ) : (

                                  <span>
                                    Remove
                                  </span>

                                )}

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </>

          )}

        </div>

      )}

      <Footer />

    </div>

  );

};

export default ProductList;