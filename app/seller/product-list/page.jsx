'use client'

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { categories } from "@/lib/categories";
import axios from "axios";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  price: "",
  offerPrice: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:text-sm";

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const ProductList = () => {

  const {
    router,
    getToken,
    user
  } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const currency = process.env.NEXT_PUBLIC_CURRENCY;

  // ==========================================
  // CATEGORY HELPERS
  // Saves categories in the same format your
  // existing products already use (slug or label)
  // ==========================================

  const usesSlug = products.some((p) =>
    categories.some((c) => c.slug === p.category)
  );

  const categoryValue = (cat) => (usesSlug ? cat.slug : cat.label);

  const resolveCategory = (value) => {
    const match = categories.find(
      (c) => c.slug === value || c.label === value
    );
    return match ? categoryValue(match) : value || "";
  };

  const categoryIsListed = categories.some(
    (c) => categoryValue(c) === form.category
  );

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
  // EDIT PRODUCT
  // ==========================================

  const openEdit = (product) => {

    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: resolveCategory(product.category),
      price: String(product.price ?? ""),
      offerPrice: String(product.offerPrice ?? ""),
    });

  };

  const closeEdit = () => {

    if (saving) return;

    setEditingProduct(null);
    setForm(EMPTY_FORM);

  };

  const handleFormChange = (field) => (e) => {

    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  };

  const hasChanges =
    !!editingProduct &&
    (
      form.name.trim() !== (editingProduct.name || "") ||
      form.description.trim() !== (editingProduct.description || "") ||
      form.category !== resolveCategory(editingProduct.category) ||
      Number(form.price) !== Number(editingProduct.price) ||
      Number(form.offerPrice) !== Number(editingProduct.offerPrice)
    );

  const handleSaveProduct = async (e) => {

    e.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const offerPrice = Number(form.offerPrice);

    if (!name) {
      return toast.error("Product name is required");
    }

    if (!form.category) {
      return toast.error("Please select a category");
    }

    if (!(price > 0) || !(offerPrice > 0)) {
      return toast.error("Enter valid prices");
    }

    if (offerPrice > price) {
      return toast.error(
        "Offer price can't be higher than the price"
      );
    }

    try {

      setSaving(true);

      const token = await getToken();

      const { data } = await axios.put(
        "/api/product/update",
        {
          productId: editingProduct._id,
          name,
          description: form.description.trim(),
          category: form.category,
          price,
          offerPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editingProduct._id
              ? { ...product, ...data.product }
              : product
          )
        );

        toast.success("Product updated successfully");

        setSaving(false);
        setEditingProduct(null);
        setForm(EMPTY_FORM);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update product"
      );

    } finally {

      setSaving(false);

    }

  };

  // Close with Escape + stop the page behind from scrolling
  useEffect(() => {

    if (!editingProduct) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        setEditingProduct(null);
        setForm(EMPTY_FORM);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };

  }, [editingProduct, saving]);

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

                      {/* PRODUCT TOP */}

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

                            {currency}

                            {
                              product.offerPrice
                            }

                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="border-t border-gray-100 p-3">

                        <div className="grid grid-cols-3 gap-2">

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

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(product)
                            }
                            className="h-10 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-900 active:scale-[0.98] text-white rounded-lg text-sm font-medium transition-all"
                          >

                            <PencilIcon />

                            <span>
                              Edit
                            </span>

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

                  {/* TABLE HEADER */}

                  <thead className="text-gray-900 text-sm text-left">

                    <tr>

                      <th className="w-[32%] px-4 py-3 font-medium truncate">
                        Product
                      </th>

                      <th className="w-[16%] px-4 py-3 font-medium truncate">
                        Category
                      </th>

                      <th className="w-[12%] px-4 py-3 font-medium truncate">
                        Price
                      </th>

                      <th className="px-4 py-3 font-medium truncate">
                        Action
                      </th>

                    </tr>

                  </thead>

                  {/* PRODUCTS */}

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

                            {currency}

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

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEdit(product)
                                }
                                className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors"
                              >

                                <PencilIcon />

                                <span>
                                  Edit
                                </span>

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

      {/* ==================================================
          EDIT PRODUCT MODAL
          Bottom sheet on mobile, centered popup on desktop
      ================================================== */}

      {editingProduct && (

        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >

          <form
            onSubmit={handleSaveProduct}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
          >

            {/* HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">

              <div className="flex min-w-0 items-center gap-3">

                {editingProduct.image?.[0] && (

                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-500/10">

                    <Image
                      src={editingProduct.image[0]}
                      alt=""
                      width={88}
                      height={88}
                      className="h-full w-full object-contain"
                    />

                  </div>

                )}

                <div className="min-w-0">

                  <h3
                    id="edit-product-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Edit product
                  </h3>

                  <p className="truncate text-xs text-gray-500">
                    {editingProduct.name}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeEdit}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
              >

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>

              </button>

            </div>

            {/* FIELDS */}

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">

              {/* NAME */}

              <div>

                <label
                  htmlFor="edit-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Product name
                </label>

                <input
                  id="edit-name"
                  type="text"
                  value={form.name}
                  onChange={handleFormChange("name")}
                  placeholder="Product name"
                  required
                  className={inputClass}
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="edit-description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  rows={4}
                  value={form.description}
                  onChange={handleFormChange("description")}
                  placeholder="Product description"
                  className={`${inputClass} resize-none`}
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="edit-category"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="edit-category"
                  value={form.category}
                  onChange={handleFormChange("category")}
                  required
                  className={inputClass}
                >

                  <option value="" disabled>
                    Select a category
                  </option>

                  {!categoryIsListed && form.category && (
                    <option value={form.category}>
                      {form.category}
                    </option>
                  )}

                  {categories.map((cat) => (
                    <option
                      key={cat.slug}
                      value={categoryValue(cat)}
                    >
                      {cat.label}
                    </option>
                  ))}

                </select>

              </div>

              {/* PRICES */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="edit-price"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Price {currency ? `(${currency})` : ""}
                  </label>

                  <input
                    id="edit-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={handleFormChange("price")}
                    required
                    className={inputClass}
                  />

                </div>

                <div>

                  <label
                    htmlFor="edit-offer-price"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Offer price {currency ? `(${currency})` : ""}
                  </label>

                  <input
                    id="edit-offer-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={form.offerPrice}
                    onChange={handleFormChange("offerPrice")}
                    required
                    className={inputClass}
                  />

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex gap-3 border-t border-gray-100 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="h-11 flex-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="h-11 flex-1 rounded-lg bg-orange-600 text-sm font-medium text-white transition hover:bg-orange-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

            </div>

          </form>

        </div>

      )}

      {/* <Footer /> */}

    </div>

  );

};

export default ProductList;