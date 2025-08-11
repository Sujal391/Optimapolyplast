// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import { Link } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token.startsWith("Bearer ")
//         ? token
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const Product = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
//   const [showUploadForm, setShowUploadForm] = useState(false);
//   const [productType, setProductType] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const toggleHeaderDropdown = () => setHeaderDropdownOpen(!headerDropdownOpen);

//   useEffect(() => {
//     fetchProducts();
//   }, [productType, selectedCategory]);

//   const fetchProducts = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const params = {};
//       if (productType) params.type = productType;
//       if (selectedCategory) params.category = selectedCategory;

//       const response = await api.get('/admin/products', { params });
//       setProducts(response.data.products || []);
//       setError(null);
//     } catch (error) {
//       console.error('There was a problem fetching the products:', error);
//       setError(error.response?.data?.message || error.message);
//       setProducts([]);
//       if (error.response?.status === 401 || error.message === 'No authentication token found') {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//       }
//     }
//   };

//   const handleProductTypeChange = (value) => {
//     setProductType(value);
//     setSelectedCategory("");
//   };

//   const handleCategoryChange = (value) => {
//     setSelectedCategory(value);
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setShowUploadForm(true);
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         await api.delete(`/admin/products/${productId}`);
//         await fetchProducts();
//       } catch (error) {
//         console.error('Error deleting product:', error);
//         setError(error.response?.data?.message || error.message);
//         if (error.response?.status === 401 || error.message === 'No authentication token found') {
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//         }
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-blue-50">
//       <Sidebar isOpen={isSidebarOpen} />

//       <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} p-4`}>
//         <header className="flex justify-between items-center bg-white px-6 py-4 mt-4 shadow-md">
//           <div className="flex items-center gap-4">
//             <button
//               className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//               ☰
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <select 
//               className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200" 
//               value={productType}
//               onChange={(e) => handleProductTypeChange(e.target.value)}
//             >
//               <option value="">All Types</option>
//               <option value="Bottle">Bottle</option>
//               <option value="Raw Material">Raw Material</option>
//             </select>
//             <select 
//               className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
//               value={selectedCategory}
//               onChange={(e) => handleCategoryChange(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {productType === "Raw Material" ? (
//                 <>
//                   <option value="25 mm Plastic ROPP Cap">25 mm Plastic ROPP Cap</option>
//                   <option value="Narrow Neck Cap">Narrow Neck Cap</option>
//                   <option value="Pet Preforms">Pet Preforms</option>
//                   <option value="26/22 Shortneck caps">26/22 Shortneck caps</option>
//                   <option value="27mm Alaska caps">27mm Alaska caps</option>
//                 </>
//               ) : (
//                 <>
//                   <option value="200ml">200ml</option>
//                   <option value="250ml">250ml</option>
//                   <option value="500ml">500ml</option>
//                   <option value="700ml">700ml</option>
//                   <option value="1L">1L</option>
//                   <option value="2L">2L</option>
//                   <option value="5L">5L</option>
//                 </>
//               )}
//             </select>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
//               onClick={() => {
//                 setEditingProduct(null);
//                 setShowUploadForm(true);
//               }}
//             >
//               + Upload New Product
//             </button>
//           </div>
//         </header>

//         <main className="p-6">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}
//           {showUploadForm ? (
//             <UploadForm 
//               onClose={() => {
//                 setShowUploadForm(false);
//                 setEditingProduct(null);
//               }}
//               editingProduct={editingProduct}
//               onSuccess={() => {
//                 setShowUploadForm(false);
//                 setEditingProduct(null);
//                 fetchProducts();
//               }}
//             />
//           ) : (
//             <section className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-2xl font-bold mb-6">Total Products</h2>
//               <div>
//                 <h3 className="text-xl font-semibold mb-4">Our Quality Products</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   {products.map((product) => (
//                     <ProductCard 
//                       key={product._id} 
//                       product={product}
//                       onEdit={() => handleEditProduct(product)}
//                       onDelete={() => handleDeleteProduct(product._id)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </section>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// const UploadForm = ({ onClose, editingProduct, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: editingProduct?.name || '',
//     type: editingProduct?.type || 'Bottle',
//     category: editingProduct?.category || '',
//     description: editingProduct?.description || '',
//     originalPrice: editingProduct?.originalPrice || '',
//     discountedPrice: editingProduct?.discountedPrice || '',
//     quantity: editingProduct?.quantity || '',
//     validFrom: editingProduct?.validFrom ? new Date(editingProduct.validFrom) : null,
//     validTo: editingProduct?.validTo ? new Date(editingProduct.validTo) : null,
//   });
//   const [image, setImage] = useState(null);
//   const [error, setError] = useState('');

//   const getCategories = (type) => {
//     if (type === 'Bottle') {
//       return ['200ml', '250ml', '500ml', '700ml', '1L', '2L', '5L'];
//     } else if (type === 'Raw Material') {
//       return ['25 mm Plastic ROPP Cap', 'Narrow Neck Cap', 'Pet Preforms', '26/22 Shortneck caps', '27mm Alaska caps'];
//     }
//     return [];
//   };

//   const handleTypeChange = (type) => {
//     setFormData(prev => ({
//       ...prev,
//       type,
//       category: ''
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Validate required fields
//     if (!formData.name || !formData.type || !formData.category || !formData.originalPrice || !formData.quantity) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     // Validate discounted price logic
//     if (formData.discountedPrice && Number(formData.discountedPrice) >= Number(formData.originalPrice)) {
//       setError('Discounted price must be less than original price');
//       return;
//     }

//     if (formData.discountedPrice && (!formData.validFrom || !formData.validTo)) {
//       setError('Please provide validity dates for the discount');
//       return;
//     }

//     // Prepare FormData
//     const formDataToSend = new FormData();
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('type', formData.type);
//     formDataToSend.append('category', formData.category);
//     formDataToSend.append('description', formData.description || ''); // Default to empty string
//     formDataToSend.append('originalPrice', Number(formData.originalPrice)); // Convert to number
//     formDataToSend.append('quantity', Number(formData.quantity)); // Convert to number

//     if (formData.discountedPrice) {
//       formDataToSend.append('discountedPrice', Number(formData.discountedPrice));
//     }
//     if (formData.validFrom) {
//       formDataToSend.append('validFrom', formData.validFrom.toISOString());
//     }
//     if (formData.validTo) {
//       formDataToSend.append('validTo', formData.validTo.toISOString());
//     }
//     if (image) {
//       formDataToSend.append('image', image);
//     } else {
//       console.warn('No image provided');
//     }

//     // Debug: Log the payload
//     for (let pair of formDataToSend.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       if (editingProduct) {
//         await api.put(`/admin/products/${editingProduct._id}`, formDataToSend);
//       } else {
//         await api.post('/admin/products', formDataToSend);
//       }
//       onSuccess();
//     } catch (error) {
//       setError(error.response?.data?.message || error.message);
//       console.error('Error saving product:', error);
//       if (error.response?.status === 401 || error.message === 'No authentication token found') {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">
//         {editingProduct ? 'Edit Product' : 'Upload New Product'}
//       </h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="col-span-1">
//             <label htmlFor="upload-photo" className="border-dashed border-2 border-gray-600 flex justify-center items-center rounded-lg h-48 cursor-pointer">
//               <input
//                 type="file"
//                 id="upload-photo"
//                 onChange={(e) => setImage(e.target.files[0])}
//                 accept="image/*"
//                 className="hidden"
//               />
//               <span className="text-gray-500">+ Upload Product Photo</span>
//             </label>
//             {(editingProduct?.image || image) && (
//               <div className="mt-4">
//                 <img
//                   src={image ? URL.createObjectURL(image) : editingProduct.image}
//                   alt="Product Preview"
//                   className="w-full h-auto rounded-lg"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="col-span-2 grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Product Name *"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="border p-2 rounded-md w-full"
//               required
//             />

//             <input
//               type="number"
//               placeholder="Quantity *"
//               value={formData.quantity}
//               onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//               className="border p-2 rounded-md w-full"
//               min="0"
//               required
//             />

//             <select
//               value={formData.type}
//               onChange={(e) => handleTypeChange(e.target.value)}
//               className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
//               required
//             >
//               <option value="Bottle">Bottle</option>
//               <option value="Raw Material">Raw Material</option>
//             </select>

//             <select
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
//               required
//             >
//               <option value="">Select Category</option>
//               {getCategories(formData.type).map(category => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="number"
//               placeholder="Original Price *"
//               value={formData.originalPrice}
//               onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
//               className="border p-2 rounded-md w-full"
//               min="0"
//               required
//             />

//             <input
//               type="number"
//               placeholder="Discounted Price"
//               value={formData.discountedPrice}
//               onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
//               className="border p-2 rounded-md w-full"
//               min="0"
//             />

//             {formData.discountedPrice && (
//               <>
//                 <DatePicker
//                   selected={formData.validFrom}
//                   onChange={(date) => setFormData({ ...formData, validFrom: date })}
//                   placeholderText="Valid From *"
//                   className="border p-2 rounded-md w-full"
//                   dateFormat="dd/MM/yyyy"
//                   minDate={new Date()}
//                   required={!!formData.discountedPrice}
//                 />

//                 <DatePicker
//                   selected={formData.validTo}
//                   onChange={(date) => setFormData({ ...formData, validTo: date })}
//                   placeholderText="Valid To *"
//                   className="border p-2 rounded-md w-full"
//                   dateFormat="dd/MM/yyyy"
//                   minDate={formData.validFrom || new Date()}
//                   required={!!formData.discountedPrice}
//                 />
//               </>
//             )}
//           </div>
//         </div>

//         <textarea
//           placeholder="Product Description"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           className="border p-2 rounded-md w-full mt-4"
//           rows="4"
//         />

//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             type="button"
//             className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           >
//             {editingProduct ? 'Update Product' : 'Save & Publish'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const ProductCard = ({ product, onEdit, onDelete }) => {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
//       <div className="relative h-48">
//         <img
//           src={product.image || 'placeholder-image-url'}
//           alt={product.name}
//           className="w-full h-full object-cover rounded-t-lg"
//         />
//         <div className="absolute top-2 right-2 flex gap-2">
//           <button
//             onClick={() => onEdit(product)}
//             className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
//           >
//             ✏️
//           </button>
//           <button
//             onClick={() => onDelete(product._id)}
//             className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
//           >
//             🗑️
//           </button>
//         </div>
//       </div>
//       <div className="p-4">
//         <h4 className="text-lg font-semibold truncate">{product.name}</h4>
//         <p className="text-sm text-gray-600 truncate">{product.description}</p>
//         <div className="mt-2">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Original Price:</span>
//             <span className="font-bold">₹{product.originalPrice}</span>
//           </div>
//           {product.discountedPrice && (
//             <div className="flex justify-between items-center text-blue-500">
//               <span>Discounted Price:</span>
//               <span className="font-bold">₹{product.discountedPrice}</span>
//             </div>
//           )}
//         </div>
//         <div className="mt-2 text-gray-700">
//           <div className="flex justify-between items-center">
//             <span>Type:</span>
//             <span className="font-medium">{product.type}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span>Category:</span>
//             <span className="font-medium">{product.category}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span>Stock:</span>
//             <span className="font-bold">{product.quantity}</span>
//           </div>
//         </div>
//         {product.discountedPrice && product.validTo && (
//           <div className="mt-2 text-sm text-red-500">
//             Offer valid till: {new Date(product.validTo).toLocaleDateString()}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Product;





import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Product = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [productType, setProductType] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleHeaderDropdown = () => setHeaderDropdownOpen(!headerDropdownOpen);

  useEffect(() => {
    fetchProducts();
  }, [productType, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const params = {};
      if (productType) params.type = productType;
      if (selectedCategory) params.category = selectedCategory;

      const response = await api.get("/admin/products", { params });
      setProducts(response.data.products || []);
      setError(null);
    } catch (error) {
      console.error("There was a problem fetching the products:", error);
      setError(error.response?.data?.message || error.message);
      setProducts([]);
      if (
        error.response?.status === 401 ||
        error.message === "No authentication token found"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const handleProductTypeChange = (value) => {
    setProductType(value);
    setSelectedCategory("");
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowUploadForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        await api.delete(`/admin/products/${productId}`);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError(error.response?.data?.message || error.message);
        if (
          error.response?.status === 401 ||
          error.message === "No authentication token found"
        ) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-4`}
      >
        <header className="flex justify-between items-center bg-white px-6 py-4 mt-4 shadow-md">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              value={productType}
              onChange={(e) => handleProductTypeChange(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Bottle">Bottle</option>
              <option value="Raw Material">Raw Material</option>
            </select>
            <select
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {productType === "Raw Material" ? (
                <>
                  <option value="25 mm Plastic ROPP Cap">
                    25 mm Plastic ROPP Cap
                  </option>
                  <option value="Narrow Neck Cap">Narrow Neck Cap</option>
                  <option value="Pet Preforms">Pet Preforms</option>
                  <option value="26/22 Shortneck caps">
                    26/22 Shortneck caps
                  </option>
                  <option value="27mm Alaska caps">27mm Alaska caps</option>
                </>
              ) : (
                <>
                  <option value="200ml">200ml</option>
                  <option value="250ml">250ml</option>
                  <option value="500ml">500ml</option>
                  <option value="700ml">700ml</option>
                  <option value="1L">1L</option>
                  <option value="2L">2L</option>
                  <option value="5L">5L</option>
                </>
              )}
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
              onClick={() => {
                setEditingProduct(null);
                setShowUploadForm(true);
              }}
            >
              + Upload New Product
            </button>
          </div>
        </header>

        <main className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {showUploadForm ? (
            <UploadForm
              onClose={() => {
                setShowUploadForm(false);
                setEditingProduct(null);
              }}
              editingProduct={editingProduct}
              onSuccess={() => {
                setShowUploadForm(false);
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          ) : (
            <section className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Total Products</h2>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Our Quality Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product._id)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const UploadForm = ({ onClose, editingProduct, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    type: editingProduct?.type || "Bottle",
    category: editingProduct?.category || "",
    description: editingProduct?.description || "",
    originalPrice: editingProduct?.originalPrice || "",
    discountedPrice: editingProduct?.discountedPrice || "",
    boxes: editingProduct?.boxes || "",
    bottlesPerBox: editingProduct?.bottlesPerBox || "",
    validFrom: editingProduct?.validFrom
      ? new Date(editingProduct.validFrom)
      : null,
    validTo: editingProduct?.validTo ? new Date(editingProduct.validTo) : null,
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const getCategories = (type) => {
    if (type === "Bottle") {
      return ["200ml", "250ml", "500ml", "700ml", "1L", "2L", "5L"];
    } else if (type === "Raw Material") {
      return [
        "25 mm Plastic ROPP Cap",
        "Narrow Neck Cap",
        "Pet Preforms",
        "26/22 Shortneck caps",
        "27mm Alaska caps",
      ];
    }
    return [];
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (
      !formData.name ||
      !formData.type ||
      !formData.category ||
      !formData.originalPrice ||
      !formData.boxes ||
      !formData.bottlesPerBox
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate boxes (minimum 230)
    if (Number(formData.boxes) < 230) {
      setError("Minimum 230 boxes are required");
      return;
    }

    // Validate bottlesPerBox (minimum 1)
    if (Number(formData.bottlesPerBox) < 1) {
      setError("Bottles per box must be at least 1");
      return;
    }

    // Validate discounted price logic
    if (
      formData.discountedPrice &&
      Number(formData.discountedPrice) >= Number(formData.originalPrice)
    ) {
      setError("Discounted price must be less than original price");
      return;
    }

    // Validate offer dates if discounted price is provided
    if (formData.discountedPrice && (!formData.validFrom || !formData.validTo)) {
      setError("Please provide validity dates for the discount");
      return;
    }

    if (
      formData.discountedPrice &&
      formData.validFrom &&
      formData.validTo &&
      formData.validFrom > formData.validTo
    ) {
      setError("Valid To date must be after Valid From date");
      return;
    }

    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("originalPrice", Number(formData.originalPrice));
    formDataToSend.append("boxes", Number(formData.boxes));
    formDataToSend.append("bottlesPerBox", Number(formData.bottlesPerBox));

    if (formData.discountedPrice) {
      formDataToSend.append("discountedPrice", Number(formData.discountedPrice));
    }
    if (formData.validFrom) {
      formDataToSend.append("validFrom", formData.validFrom.toISOString());
    }
    if (formData.validTo) {
      formDataToSend.append("validTo", formData.validTo.toISOString());
    }
    if (image) {
      formDataToSend.append("image", image);
    } else if (!editingProduct) {
      console.warn("No image provided for new product");
    }

    // Debug: Log the payload
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formDataToSend);
      } else {
        await api.post("/admin/products", formDataToSend);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error("Error saving product:", error);
      if (
        error.response?.status === 401 ||
        error.message === "No authentication token found"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {editingProduct ? "Edit Product" : "Upload New Product"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="upload-photo"
              className="border-dashed border-2 border-gray-600 flex justify-center items-center rounded-lg h-48 cursor-pointer"
            >
              <input
                type="file"
                id="upload-photo"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
              <span className="text-gray-500">+ Upload Product Photo</span>
            </label>
            {(editingProduct?.image || image) && (
              <div className="mt-4">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : editingProduct.image
                  }
                  alt="Product Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              required
            />

            <input
              type="number"
              placeholder="Number of Boxes * (min 230)"
              value={formData.boxes}
              onChange={(e) =>
                setFormData({ ...formData, boxes: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              min="230"
              required
            />

            <input
              type="number"
              placeholder="Bottles per Box * (min 1)"
              value={formData.bottlesPerBox}
              onChange={(e) =>
                setFormData({ ...formData, bottlesPerBox: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              min="1"
              required
            />

            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            >
              <option value="Bottle">Bottle</option>
              <option value="Raw Material">Raw Material</option>
            </select>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select Category</option>
              {getCategories(formData.type).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Original Price per Box *"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData({ ...formData, originalPrice: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              min="0"
              required
            />

            <input
              type="number"
              placeholder="Discounted Price per Box"
              value={formData.discountedPrice}
              onChange={(e) =>
                setFormData({ ...formData, discountedPrice: e.target.value })
              }
              className="border p-2 rounded-md w-full"
              min="0"
            />

            {formData.discountedPrice && (
              <>
                <DatePicker
                  selected={formData.validFrom}
                  onChange={(date) =>
                    setFormData({ ...formData, validFrom: date })
                  }
                  placeholderText="Valid From *"
                  className="border p-2 rounded-md w-full"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  required={!!formData.discountedPrice}
                />

                <DatePicker
                  selected={formData.validTo}
                  onChange={(date) =>
                    setFormData({ ...formData, validTo: date })
                  }
                  placeholderText="Valid To *"
                  className="border p-2 rounded-md w-full"
                  dateFormat="dd/MM/yyyy"
                  minDate={formData.validFrom || new Date()}
                  required={!!formData.discountedPrice}
                />
              </>
            )}
          </div>
        </div>

        <textarea
          placeholder="Product Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 rounded-md w-full mt-4"
          rows="4"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {editingProduct ? "Update Product" : "Save & Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
      <div className="relative h-48">
        <img
          src={product.image || "placeholder-image-url"}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold truncate">{product.name}</h4>
        <p className="text-sm text-gray-600 truncate">{product.description}</p>
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Original Price per Box:</span>
            <span className="font-bold">₹{product.originalPrice}</span>
          </div>
          {product.discountedPrice && (
            <div className="flex justify-between items-center text-blue-500">
              <span>Discounted Price per Box:</span>
              <span className="font-bold">₹{product.discountedPrice}</span>
            </div>
          )}
          {product.discountTag && (
            <div className="flex justify-between items-center text-green-500">
              <span>Discount:</span>
              <span className="font-bold">{product.discountTag}</span>
            </div>
          )}
        </div>
        <div className="mt-2 text-gray-700">
          <div className="flex justify-between items-center">
            <span>Type:</span>
            <span className="font-medium">{product.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Category:</span>
            <span className="font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Boxes:</span>
            <span className="font-bold">{product.boxes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Bottles per Box:</span>
            <span className="font-bold">{product.bottlesPerBox}</span>
          </div>
        </div>
        {product.discountedPrice && product.offerEndsIn && (
          <div className="mt-2 text-sm text-red-500">
            Offer valid till:{" "}
            {new Date(product.offerEndsIn).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;