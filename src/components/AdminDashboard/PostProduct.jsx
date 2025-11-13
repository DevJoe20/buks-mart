"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import slugify from "slugify";

const PostProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    stock_quantity: "",
    brand: "",
    is_available: true,
    rating: "",
    tags: "",
    type: "",
    weight: "",
    flavor: "",
    texture: "",
    shape: "",
  });

  const [imageFiles, setImageFiles] = useState([]); // ✅ multiple images
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ multiple previews
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminAndCategories = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setAdminId(userData?.user?.id);

      const { data: catData } = await supabase.from("categories").select("*");
      setCategories(catData || []);
    };
    fetchAdminAndCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // ✅ Upload multiple images to Supabase Storage
  const uploadImages = async (productId) => {
    const uploadedUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, or WEBP files are allowed");
        continue;
      }

      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const cleanName = slugify(file.name.replace(`.${ext}`, ""), {
        lower: true,
        strict: true,
      });
      const fileName = `${timestamp}_${cleanName}.${ext}`;
      const filePath = `products/${productId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-icons")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-icons").getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);

      // ✅ Insert each image URL into product_images table
      await supabase.from("product_images").insert([
        {
          product_id: productId,
          image_url: publicUrl,
          is_main: i === 0, // mark the first one as main
        },
      ]);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Step 1: Insert product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([
          {
            ...formData,
            admins_id: adminId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      const productId = productData.id;

      // ✅ Step 2: Upload images & insert into product_images
      await uploadImages(productId);

      toast.success("✅ Product and images uploaded successfully!");
      setFormData({
        name: "",
        price: "",
        category_id: "",
        description: "",
        stock_quantity: "",
        brand: "",
        is_available: true,
        rating: "",
        tags: "",
        type: "",
        weight: "",
        flavor: "",
        texture: "",
        shape: "",
      });
      setImageFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to post product: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="relative max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-center">Post New Product</h2>

      {/* ✅ Image previews */}
      {previewUrls.length > 0 && (
        <div className="border rounded p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
          <div className="flex gap-2 flex-wrap">
            {previewUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Preview ${i}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
          required
        />

        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name || cat.id}
            </option>
          ))}
        </select>

        {/* ✅ Allow multiple image uploads */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="p-2 border rounded"
        />

        {/* other fields remain same */}
        <input
          type="text"
          name="stock_quantity"
          value={formData.stock_quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Weight"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="flavor"
          value={formData.flavor}
          onChange={handleChange}
          placeholder="Flavor"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="texture"
          value={formData.texture}
          onChange={handleChange}
          placeholder="Texture"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="shape"
          value={formData.shape}
          onChange={handleChange}
          placeholder="Shape"
          className="p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded col-span-1 sm:col-span-2"
          rows={3}
        ></textarea>

        <label className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
          <span>Available?</span>
        </label>

        <button
          type="submit"
          disabled={loading || !adminId}
          className="col-span-1 sm:col-span-2 bg-[#A44A26] text-white px-4 py-2 rounded hover:bg-[#B85F3A] transition"
        >
          {loading ? "Posting..." : "Post Product"}
        </button>
      </form>
    </div>
  );
};

export default PostProduct;
