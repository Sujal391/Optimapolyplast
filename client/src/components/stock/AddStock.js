


// import { useState, useEffect } from "react";
// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API,
// });

// // Axios Interceptor for Authentication
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

// export default function StockManagement() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [formData, setFormData] = useState({
//     quantity: "",
//     changeType: "addition",
//     notes: "",
//   });
//   const [error, setError] = useState("");
//   const [history, setHistory] = useState([]);
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//   const [historyTitle, setHistoryTitle] = useState("Stock History");

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Fetch all stock products
//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/stock/products");
//       if (response.data && response.data.success) {
//         setProducts(response.data.data);
//       } else {
//         setError("No History Data Available For This Product");
//       }
//     } catch (error) {
//       setError("Error fetching stock data: ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch stock history for a specific product
//   const getStockHistory = async (productId, productName) => {
//     try {
//       const response = await api.get(`/stock/history/${productId}`);
//       if (response.data && response.data.success) {
//         // Map the history entries to include product information
//         const processedHistory = response.data.data.updateHistory.map(update => ({
//           ...update,
//           productId: {
//             _id: response.data.data.productId._id,
//             name: response.data.data.productId.name
//           }
//         }));
        
//         setHistory(processedHistory);
//         setHistoryTitle(`History of ${productName}`);
//         setIsHistoryOpen(true);
//       } else {
//         setError("No stock history found for this product.");
//       }
//     } catch (error) {
//       setError("Error fetching stock history: " + error.message);
//     }
//   };

//   // Fetch all stock history
//   const getAllStockHistory = async () => {
//     try {
//       const response = await api.get("/stock/history");
//       if (response.data && response.data.success) {
//         // Ensure we're handling the nested data correctly
//         const allHistory = response.data.data.flatMap((stock) => 
//           stock.updateHistory.map(update => ({
//             ...update,
//             productId: stock.productId // Preserve the product information
//           }))
//         );
//         setHistory(allHistory);
//         setHistoryTitle("All Stock History");
//         setIsHistoryOpen(true);
//       } else {
//         setError("No stock history found.");
//       }
//     } catch (error) {
//       setError("Error fetching stock history: " + error.message);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Update stock quantity
//   const updateStock = async (e) => {
//     e.preventDefault();
//     if (!selectedProduct || !formData.quantity) {
//       setError("Please fill in all required fields.");
//       return;
//     }
//     try {
//       const userId = localStorage.getItem("userId");
//       const response = await api.put("/stock/update-quantity", {
//         productId: selectedProduct,
//         quantity: formData.quantity,
//         changeType: formData.changeType,
//         notes: formData.notes,
//         updatedBy: userId,
//       });

//       if (response.data.success) {
//         alert("Stock updated successfully!");
//         setIsFormOpen(false);
//         fetchProducts();
//       } else {
//         setError("Failed to update stock: " + response.data.message);
//       }
//     } catch (error) {
//       setError("Error updating stock: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-800">Stock Management</h2>

//         <div className="mt-4 flex justify-end space-x-4">
//           <button
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
//             onClick={() => setIsFormOpen(true)}
//           >
//             + Update Quantity
//           </button>
//           <button
//             className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
//             onClick={getAllStockHistory}
//           >
//             View All History
//           </button>
//         </div>

//         {error && (
//           <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
//         )}

//         {loading ? (
//           <p className="mt-4">Loading products...</p>
//         ) : (
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <div key={product._id} className="p-4 bg-white shadow-lg rounded-lg">
//                 {product.image && (
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-40 object-cover rounded-md"
//                   />
//                 )}
//                 <h3 className="font-semibold text-lg mt-3">{product.name}</h3>
//                 <p className="text-gray-700 text-sm">{product.description}</p>
//                 <p className="font-medium text-gray-900 mt-2">Stock: {product.quantity}</p>
//                 <button
//                   className="mt-3 text-blue-600 hover:underline"
//                   onClick={() => getStockHistory(product._id, product.name)}
//                 >
//                   View History
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {isFormOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
//               <h3 className="text-2xl font-bold mb-6 text-gray-800">Update Stock</h3>
//               <form className="space-y-6" onSubmit={updateStock}>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Select Product
//                   </label>
//                   <select
//                     className="border border-gray-300 w-full px-4 py-2 rounded-lg"
//                     onChange={(e) => setSelectedProduct(e.target.value)}
//                     value={selectedProduct}
//                   >
//                     <option value="">Select a product</option>
//                     {products.map((product) => (
//                       <option key={product._id} value={product._id}>
//                         {product.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     className="border border-gray-300 w-full px-4 py-2 rounded-lg"
//                     value={formData.quantity}
//                     onChange={handleInputChange}
//                     placeholder="Enter quantity"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Change Type</label>
//                   <select
//                     name="changeType"
//                     className="border border-gray-300 w-full px-4 py-2 rounded-lg"
//                     value={formData.changeType}
//                     onChange={handleInputChange}
//                   >
//                     <option value="addition">Addition</option>
//                     <option value="reduction">Reduction</option>
//                     <option value="adjustment">Adjustment</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Notes</label>
//                   <textarea
//                     name="notes"
//                     className="border border-gray-300 w-full px-4 py-2 rounded-lg"
//                     value={formData.notes}
//                     onChange={handleInputChange}
//                     placeholder="Enter notes"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     className="bg-gray-500 text-white px-6 py-2 rounded-lg"
//                     onClick={() => setIsFormOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {isHistoryOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-4xl">
//               <h3 className="text-2xl font-bold mb-6 text-gray-800">{historyTitle}</h3>
//               <div className="max-h-96 overflow-y-auto">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="p-2">Product</th>
//                       <th className="p-2">Updated By</th>
//                       <th className="p-2">Quantity</th>
//                       <th className="p-2">Change Type</th>
//                       <th className="p-2">Notes</th>
//                       <th className="p-2">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {history.map((entry, index) => (
//                       <tr key={index} className="border-b">
//                         <td className="p-2">
//                           {entry.productId?.name || 
//                             (entry.productId && typeof entry.productId === 'string' ? 'N/A' : 'N/A')}
//                         </td>
//                         <td className="p-2">{entry.updatedBy?.name || "N/A"}</td>
//                         <td className="p-2">{entry.quantity}</td>
//                         <td className="p-2">{entry.changeType}</td>
//                         <td className="p-2">{entry.notes || "N/A"}</td>
//                         <td className="p-2">{new Date(entry.updatedAt).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="flex justify-end mt-6">
//                 <button
//                   className="bg-gray-500 text-white px-6 py-2 rounded-lg"
//                   onClick={() => setIsHistoryOpen(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

// Axios Interceptor for Authentication
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
      const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function StockManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    boxes: "",
    changeType: "addition",
    notes: "",
  });
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTitle, setHistoryTitle] = useState("Stock History");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all stock products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/stock/products");
      if (response.data && response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("No product data available");
      }
    } catch (error) {
      setError("Error fetching stock data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock history for a specific product
  const getStockHistory = async (productId, productName) => {
    try {
      const response = await api.get(`/stock/history/${productId}`);
      if (response.data && response.data.success) {
        // Map the history entries to include product information
        const processedHistory = response.data.data.updateHistory.map(update => ({
          ...update,
          productId: {
            _id: response.data.data.productId._id,
            name: response.data.data.productId.name
          }
        }));
        
        setHistory(processedHistory);
        setHistoryTitle(`History of ${productName}`);
        setIsHistoryOpen(true);
      } else {
        setError("No stock history found for this product.");
      }
    } catch (error) {
      setError("Error fetching stock history: " + error.message);
    }
  };

  // Fetch all stock history
  const getAllStockHistory = async () => {
    try {
      const response = await api.get("/stock/history");
      if (response.data && response.data.success) {
        // Ensure we're handling the nested data correctly
        const allHistory = response.data.data.flatMap((stock) => 
          stock.updateHistory.map(update => ({
            ...update,
            productId: stock.productId // Preserve the product information
          }))
        );
        setHistory(allHistory);
        setHistoryTitle("All Stock History");
        setIsHistoryOpen(true);
      } else {
        setError("No stock history found.");
      }
    } catch (error) {
      setError("Error fetching stock history: " + error.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update stock boxes
  const updateStock = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !formData.boxes) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      // const userId = localStorage.getItem("userId");
      const userId = cookies.get("userId");
      const response = await api.put("/stock/update-quantity", {
        productId: selectedProduct,
        boxes: formData.boxes,
        changeType: formData.changeType,
        notes: formData.notes,
        updatedBy: userId,
      });

      if (response.data.success) {
        alert("Stock updated successfully!");
        setIsFormOpen(false);
        fetchProducts();
      } else {
        setError("Failed to update stock: " + response.data.message);
      }
    } catch (error) {
      setError("Error updating stock: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800">Stock Management</h2>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={() => setIsFormOpen(true)}
          >
            + Update Boxes
          </button>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={getAllStockHistory}
          >
            View All History
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {loading ? (
          <p className="mt-4">Loading products...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="p-4 bg-white shadow-lg rounded-lg">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <h3 className="font-semibold text-lg mt-3">{product.name}</h3>
                <p className="text-gray-700 text-sm">{product.description}</p>
                <p className="font-medium text-gray-900 mt-2">Boxes: {product.boxes}</p>
                <button
                  className="mt-3 text-blue-600 hover:underline"
                  onClick={() => getStockHistory(product._id, product.name)}
                >
                  View History
                </button>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Update Stock</h3>
              <form className="space-y-6" onSubmit={updateStock}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select Product
                  </label>
                  <select
                    className="border border-gray-300 w-full px-4 py-2 rounded-lg"
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    value={selectedProduct}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Boxes</label>
                  <input
                    type="number"
                    name="boxes"
                    className="border border-gray-300 w-full px-4 py-2 rounded-lg"
                    value={formData.boxes}
                    onChange={handleInputChange}
                    placeholder="Enter number of boxes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Change Type</label>
                  <select
                    name="changeType"
                    className="border border-gray-300 w-full px-4 py-2 rounded-lg"
                    value={formData.changeType}
                    onChange={handleInputChange}
                  >
                    <option value="addition">Addition</option>
                    <option value="reduction">Reduction</option>
                    <option value="adjustment">Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                  <textarea
                    name="notes"
                    className="border border-gray-300 w-full px-4 py-2 rounded-lg"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter notes"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isHistoryOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-4xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">{historyTitle}</h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Product</th>
                      <th className="p-2">Updated By</th>
                      <th className="p-2">Boxes</th>
                      <th className="p-2">Change Type</th>
                      <th className="p-2">Notes</th>
                      <th className="p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {entry.productId?.name || 
                            (entry.productId && typeof entry.productId === 'string' ? 'N/A' : 'N/A')}
                        </td>
                        <td className="p-2">{entry.updatedBy?.name || "N/A"}</td>
                        <td className="p-2">{entry.boxes}</td>
                        <td className="p-2">{entry.changeType}</td>
                        <td className="p-2">{entry.notes || "N/A"}</td>
                        <td className="p-2">{new Date(entry.updatedAt).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                  onClick={() => setIsHistoryOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}