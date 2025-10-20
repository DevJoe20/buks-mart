"use client"
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { toast } from "react-toastify";
import slugify from "slugify";

const PostProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image_url: '',
    stock_quantity: '',
    brand: '',
    is_available: true,
    rating: '',
    tags: '',
    type: '',
    weight: '',
    flavor: '',
    texture: '',
    shape: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminAndCategories = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setAdminId(userData?.user?.id);

      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);
    };

    fetchAdminAndCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      toast.error("Only JPG, PNG, or WEBP files are allowed");
      return '';
    }

    const timestamp = Date.now();
    const ext = imageFile.name.split(".").pop();
    const cleanName = slugify(imageFile.name.replace(`.${ext}`, ""), { lower: true, strict: true });
    const fileName = `${timestamp}_${cleanName}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-icons')
      .upload(filePath, imageFile);

    if (uploadError) {
      toast.error('Image upload failed: ' + uploadError.message);
      return '';
    }

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('product-icons')
      .getPublicUrl(filePath);

    if (urlError) {
      toast.error('Failed to get image URL');
      return '';
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const image_url = await uploadImage();
    if (!image_url && imageFile) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('products').insert([
      {
        ...formData,
        image_url: image_url || '',
        admins_id: adminId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error('Failed to post product: ' + error.message);
    } else {
      toast.success('Product posted successfully!');
      setFormData({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image_url: '',
        stock_quantity: '',
        brand: '',
        is_available: true,
        rating: '',
        tags: '',
        type: '',
        weight: '',
        flavor: '',
        texture: '',
        shape: '',
      });
      setImageFile(null);
      setPreviewUrl('');
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

      {formData.name && (
        <div className="border rounded p-4 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full md:w-48 h-48 object-cover rounded border"
              />
            )}
            <div className="flex-1">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Price:</strong> ₦{formData.price}</p>
              <p><strong>Brand:</strong> {formData.brand}</p>
              <p><strong>Type:</strong> {formData.type}</p>
              <p><strong>Tags:</strong> {formData.tags}</p>
              <p><strong>Stock:</strong> {formData.stock_quantity}</p>
              <p><strong>Weight:</strong> {formData.weight}</p>
              <p><strong>Flavor:</strong> {formData.flavor}</p>
              <p><strong>Texture:</strong> {formData.texture}</p>
              <p><strong>Shape</strong> {formData.shape}</p>
              <p><strong>Available:</strong> {formData.is_available ? 'Yes' : 'No'}</p>
              <p><strong>Description:</strong> {formData.description}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="p-2 border rounded" required />
        <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" required />

        <select name="category_id" value={formData.category_id} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.category_name || cat.id}</option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" />

        {previewUrl && (
          <div className="sm:col-span-2">
            <img src={previewUrl} alt="Selected Preview" className="h-40 object-contain border rounded" />
          </div>
        )}

        <input type="text" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="Stock Quantity" className="p-2 border rounded" />
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="p-2 border rounded" />
        <input type="text" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" className="p-2 border rounded" />
        <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags" className="p-2 border rounded" />
        <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="type" className="p-2 border rounded" />
        <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="weight" className="p-2 border rounded" />
        <input type="text" name="flavor" value={formData.flavor} onChange={handleChange} placeholder="flavor" className="p-2 border rounded" />
        <input type="text" name="texture" value={formData.texture} onChange={handleChange} placeholder="texture" className="p-2 border rounded" />
        <input type="text" name="shape" value={formData.shape} onChange={handleChange} placeholder="shape" className="p-2 border rounded" />

        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded col-span-1 sm:col-span-2" rows={3}></textarea>

        <label className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} />
          <span>Available?</span>
        </label>

        <button type="submit" disabled={loading || !adminId} className="col-span-1 sm:col-span-2 bg-[#A44A26] text-white px-4 py-2 rounded hover:bg-[#B85F3A] transition">
          {loading ? 'Posting...' : 'Post Product'}
        </button>
      </form>
    </div>
  );
};

export default PostProduct;
