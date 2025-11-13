"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";

const BUCKET_NAME = "product-icons";
const ITEMS_PER_PAGE = 5;

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] = useState({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page]);

  async function fetchProducts() {
    setLoading(true);

    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      toast.error("Failed to fetch product count");
      setLoading(false);
      return;
    }

    setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Failed to fetch products");
    } else {
      setProducts(data);
      await fetchProductImages(data);
    }
    setLoading(false);
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) toast.error("Failed to fetch categories");
    else setCategories(data);
  }

  async function fetchProductImages(products) {
    const ids = products.map((p) => p.id);
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .in("product_id", ids);

    if (error) {
      toast.error("Failed to fetch product images");
      return;
    }

    const grouped = {};
    data.forEach((img) => {
      if (!grouped[img.product_id]) grouped[img.product_id] = [];
      grouped[img.product_id].push(img);
    });
    setProductImages(grouped);
  }

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.category_name || "Uncategorized";

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Error deleting product");
    else {
      toast.success("Product deleted");
      fetchProducts();
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedProduct(product);
  };

  const handleChange = (e) =>
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });

  // Upload multiple images
  const handleMultiImageUpload = async (e, productId) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      if (!files.length) return;

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        if (!data?.publicUrl) continue;

        // insert into product_images table
        await supabase.from("product_images").insert([
          { product_id: productId, image_url: data.publicUrl },
        ]);
      }

      toast.success("Images uploaded successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) toast.error("Failed to delete image");
    else {
      toast.success("Image deleted");
      fetchProducts();
    }
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("products")
      .update(editedProduct)
      .eq("id", editingId);

    if (error) toast.error("Error saving changes");
    else {
      toast.success("Product updated");
      setEditingId(null);
      fetchProducts();
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 p-4">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => {
              const images = productImages[product.id] || [];

              return (
                <div
                  key={product.id}
                  className="bg-[#FAF8F4] shadow rounded-xl p-4 flex flex-col"
                >
                  {/* Show main image */}
                  <img
                    src={images[0]?.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mb-2">
                      {images.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.image_url}
                            alt="thumb"
                            className="w-16 h-16 rounded object-cover border"
                          />
                          <button
                            onClick={() => handleImageDelete(img.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingId === product.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={editedProduct.name || ""}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full border px-2 py-1 rounded"
                      />
                      <input
                        type="text"
                        name="price"
                        value={editedProduct.price || ""}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full border px-2 py-1 rounded"
                      />
                      <textarea
                        name="description"
                        value={editedProduct.description || ""}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border px-2 py-1 rounded"
                      />

                      <select
                        name="category_id"
                        value={editedProduct.category_id || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 rounded"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        name="tags"
                        value={editedProduct.tags || ""}
                        onChange={handleChange}
                        placeholder="Tags (comma separated)"
                        className="w-full border px-2 py-1 rounded"
                      />

                      <div className="mt-2">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleMultiImageUpload(e, product.id)
                          }
                          disabled={uploading}
                          className="w-full text-sm"
                        />
                        {uploading && (
                          <p className="text-xs text-gray-500 mt-1">
                            Uploading...
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <p className="text-lg font-bold text-gray-600 mb-1">
                        Price: £{product.price}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        {product.description}
                      </p>

                      <div className="text-sm text-gray-800 space-y-1 mb-3">
                        <p>Brand: {product.brand || "N/A"}</p>
                        <p>Stock: {product.stock_quantity || "N/A"}</p>
                        <p>Category: {getCategoryName(product.category_id)}</p>
                        <p>Tags: {product.tags}</p>
                        <p>Type: {product.type || "N/A"}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAllProducts;
