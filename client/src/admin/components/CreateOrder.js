// import React, { useState } from 'react';
// import axios from 'axios';

// // Axios instance with interceptor
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

// // Add request interceptor to include the token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token.startsWith('Bearer ') 
//         ? token 
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const CreateOrder = () => {
//   const [userCode, setUserCode] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [customer, setCustomer] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [orderStatus, setOrderStatus] = useState('');

//   const handleUserPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/user-panel-access', { userCode });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('User panel access granted');
//     } catch (error) {
//       alert('Error accessing user panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleMiscellaneousPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/miscellaneous-panel-access', { name, email });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('Miscellaneous panel access granted');
//     } catch (error) {
//       alert('Error accessing miscellaneous panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get('/reception/user-panel/products');
//       setProducts(response.data.products);
//     } catch (error) {
//       alert('Error fetching products: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleOrder = async () => {
//     try {
//       // Validate selected products
//       const validOrderProducts = selectedProducts.filter((p) => p._id && p.quantity > 0);
  
//       if (validOrderProducts.length === 0) {
//         setOrderStatus('Please select at least one product with a valid quantity.');
//         return;
//       }
  
//       const orderProducts = validOrderProducts.map((p) => ({
//         productId: p._id,
//         quantity: p.quantity,
//       }));
  
//       const response = await api.post('/reception/user-panel/orders', {
//         products: orderProducts,
//         paymentMethod: 'COD',
//       });
  
//       setOrderStatus('Order created successfully: ' + response.data.message);
//     } catch (error) {
//       // Improved error handling
//       const errorMessage =
//         error.response?.data?.error || error.message || 'An unexpected error occurred';
//       setOrderStatus('Error creating order: ' + errorMessage);
//     }
//   };
  

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Reception Panel</h1>
//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Enter User Code"
//           value={userCode}
//           onChange={(e) => setUserCode(e.target.value)}
//           className="border p-2"
//         />
//         <button onClick={handleUserPanelAccess} className="ml-2 bg-blue-500 text-white p-2">Access User Panel</button>
//       </div>
//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Enter Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 ml-2"
//         />
//         <button onClick={handleMiscellaneousPanelAccess} className="ml-2 bg-green-500 text-white p-2">Access Miscellaneous Panel</button>
//       </div>
//       {customer && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold">Customer Info: {customer.name}</h2>
//           <button onClick={fetchProducts} className="bg-purple-500 text-white p-2 mt-2">Fetch Products</button>
//         </div>
//       )}
//       {products.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold">Products</h3>
//           {products.map((product, index) => (
//             <div key={index} className="border p-2 mt-2">
//               <p>{product.name} - ${product.price}</p>
//               <input
//                 type="number"
//                 placeholder="Quantity"
//                 onChange={(e) => {
//                   const newProducts = [...selectedProducts];
//                   newProducts[index] = { ...product, quantity: e.target.value };
//                   setSelectedProducts(newProducts);
//                 }}
//                 className="border p-1"
//               />
//             </div>
//           ))}
//           <button onClick={handleOrder} className="bg-red-500 text-white p-2 mt-2">Create Order</button>
//         </div>
//       )}
//       {orderStatus && <p className="mt-4">{orderStatus}</p>}
//     </div>
//   );
// };

// export default CreateOrder;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Axios instance with interceptor
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

// // Add request interceptor to include the token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token.startsWith('Bearer ') 
//         ? token 
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const CreateOrder = () => {
//   const [userCode, setUserCode] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [customer, setCustomer] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [orderStatus, setOrderStatus] = useState('');

//   const handleUserPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/user-panel-access', { userCode });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('User panel access granted');
//     } catch (error) {
//       alert('Error accessing user panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleMiscellaneousPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/miscellaneous-panel-access', { name, email });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('Miscellaneous panel access granted');
//     } catch (error) {
//       alert('Error accessing miscellaneous panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get('/reception/user-panel/products');
//       setProducts(response.data.products);
//     } catch (error) {
//       alert('Error fetching products: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleOrder = async () => {
//     try {
//       // Validate selected products before proceeding
//       const validOrderProducts = selectedProducts.filter(product => product && product._id && product.quantity > 0);
  
//       if (validOrderProducts.length === 0) {
//         setOrderStatus('Please select at least one product with a valid quantity.');
//         return;
//       }
  
//       const orderProducts = validOrderProducts.map(product => ({
//         productId: product._id,
//         quantity: product.quantity,
//       }));
  
//       const response = await api.post('/reception/user-panel/orders', {
//         products: orderProducts,
//         paymentMethod: 'COD',
//       });
  
//       setOrderStatus('Order created successfully: ' + response.data.message);
//     } catch (error) {
//       // Improved error handling
//       const errorMessage =
//         error.response?.data?.error || error.message || 'An unexpected error occurred';
//       setOrderStatus('Error creating order: ' + errorMessage);
//     }
//   };
  
//   // Ensure products are fetched when the user is authenticated
//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Reception Panel</h1>
//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Enter User Code"
//           value={userCode}
//           onChange={(e) => setUserCode(e.target.value)}
//           className="border p-2"
//         />
//         <button onClick={handleUserPanelAccess} className="ml-2 bg-blue-500 text-white p-2">Access User Panel</button>
//       </div>
//       <div className="mt-4">
//         <input
//           type="text"
//           placeholder="Enter Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 ml-2"
//         />
//         <button onClick={handleMiscellaneousPanelAccess} className="ml-2 bg-green-500 text-white p-2">Access Miscellaneous Panel</button>
//       </div>
//       {customer && (
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold">Customer Info: {customer.name}</h2>
//           <button onClick={fetchProducts} className="bg-purple-500 text-white p-2 mt-2">Fetch Products</button>
//         </div>
//       )}
//       {products.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold">Products</h3>
//           {products.map((product, index) => (
//             <div key={index} className="border p-2 mt-2">
//               <p>{product.name} - ₹{product.price}</p>
//               <input
//                 type="number"
//                 placeholder="Quantity"
//                 value={selectedProducts[index]?.quantity || 0} // Set default value to 0
//                 onChange={(e) => {
//                   const newProducts = [...selectedProducts];
//                   newProducts[index] = { ...product, quantity: parseInt(e.target.value, 10) };
//                   setSelectedProducts(newProducts);
//                 }}
//                 className="border p-1"
//               />
//             </div>
//           ))}
//           <button onClick={handleOrder} className="bg-red-500 text-white p-2 mt-2">Create Order</button>
//         </div>
//       )}
//       {orderStatus && <p className="mt-4">{orderStatus}</p>}
//     </div>
//   );
// };

// export default CreateOrder;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Axios instance with interceptor
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

// // Add request interceptor to include the token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token.startsWith('Bearer ') 
//         ? token 
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const CreateOrder = () => {
//   const [userCode, setUserCode] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [customer, setCustomer] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [orderStatus, setOrderStatus] = useState('');
//   const [selectedProductDetails, setSelectedProductDetails] = useState(null);

//   const handleUserPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/user-panel-access', { userCode });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('User panel access granted');
//     } catch (error) {
//       alert('Error accessing user panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleMiscellaneousPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/miscellaneous-panel-access', { name, email });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('Miscellaneous panel access granted');
//     } catch (error) {
//       alert('Error accessing miscellaneous panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get('/reception/user-panel/products');
//       setProducts(response.data.products);
//     } catch (error) {
//       alert('Error fetching products: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleOrder = async () => {
//     try {
//       // Validate selected products before proceeding
//       const validOrderProducts = selectedProducts.filter(product => product && product._id && product.quantity > 0);
  
//       if (validOrderProducts.length === 0) {
//         setOrderStatus('Please select at least one product with a valid quantity.');
//         return;
//       }
  
//       const orderProducts = validOrderProducts.map(product => ({
//         productId: product._id,
//         quantity: product.quantity,
//       }));
  
//       const response = await api.post('/reception/user-panel/orders', {
//         products: orderProducts,
//         paymentMethod: 'COD',
//       });
  
//       setOrderStatus('Order created successfully: ' + response.data.message);
//     } catch (error) {
//       // Improved error handling
//       const errorMessage =
//         error.response?.data?.error || error.message || 'An unexpected error occurred';
//       setOrderStatus('Error creating order: ' + errorMessage);
//     }
//   };

//   const handleProductClick = (product) => {
//     setSelectedProductDetails(product);
//   };

//   // Ensure products are fetched when the user is authenticated
//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Reception Panel</h1>
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Enter User Code"
//               value={userCode}
//               onChange={(e) => setUserCode(e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//             <button onClick={handleUserPanelAccess} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Access User Panel</button>
//           </div>
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//             <input
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="border p-2 rounded w-full mt-2"
//             />
//             <button onClick={handleMiscellaneousPanelAccess} className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Access Miscellaneous Panel</button>
//           </div>
//           {customer && (
//             <div className="mt-4">
//               <h2 className="text-xl font-semibold text-gray-800">Customer Info: {customer.name}</h2>
//               <button onClick={fetchProducts} className="mt-2 w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Fetch Products</button>
//             </div>
//           )}
//         </div>

//         {products.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Products</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {products.map((product, index) => (
//                 <div key={index} className="border p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
//                   <p className="text-lg font-semibold text-gray-700">{product.name}</p>
//                   <p className="text-gray-600">₹{product.price}</p>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={selectedProducts[index]?.quantity || 0}
//                     onChange={(e) => {
//                       const newProducts = [...selectedProducts];
//                       newProducts[index] = { ...product, quantity: parseInt(e.target.value, 10) };
//                       setSelectedProducts(newProducts);
//                     }}
//                     className="border p-1 rounded w-full mt-2"
//                   />
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleOrder} className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Create Order</button>
//           </div>
//         )}

//         {selectedProductDetails && (
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Product Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-lg font-semibold text-gray-700">Name: {selectedProductDetails.name}</p>
//                 <p className="text-gray-600">Price: ₹{selectedProductDetails.price}</p>
//                 <p className="text-gray-600">Description: {selectedProductDetails.description}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600">Category: {selectedProductDetails.category}</p>
//                 <p className="text-gray-600">Stock: {selectedProductDetails.stock}</p>
//                 <p className="text-gray-600">Rating: {selectedProductDetails.rating}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {orderStatus && <p className="mt-4 text-center text-gray-700">{orderStatus}</p>}
//       </div>
//     </div>
//   );
// };

// export default CreateOrder;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Axios instance with interceptor
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

// // Add request interceptor to include the token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token.startsWith('Bearer ') 
//         ? token 
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const CreateOrder = () => {
//   const [userCode, setUserCode] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [token, setToken] = useState('');
//   const [customer, setCustomer] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [orderStatus, setOrderStatus] = useState('');
//   const [selectedProductDetails, setSelectedProductDetails] = useState(null);

//   const handleUserPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/user-panel-access', { userCode });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('User panel access granted');
//     } catch (error) {
//       alert('Error accessing user panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleMiscellaneousPanelAccess = async () => {
//     try {
//       const response = await api.post('/reception/miscellaneous-panel-access', { name, email });
//       setToken(response.data.token);
//       setCustomer(response.data.customer);
//       localStorage.setItem('token', response.data.token); // Store token in localStorage
//       alert('Miscellaneous panel access granted');
//     } catch (error) {
//       alert('Error accessing miscellaneous panel: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get('/reception/user-panel/products');
//       setProducts(response.data.products);
//     } catch (error) {
//       alert('Error fetching products: ' + error.response?.data?.error || error.message);
//     }
//   };

//   const handleOrder = async () => {
//     try {
//       // Validate selected products before proceeding
//       const validOrderProducts = selectedProducts.filter(product => product && product._id && product.quantity > 0);
  
//       if (validOrderProducts.length === 0) {
//         setOrderStatus('Please select at least one product with a valid quantity.');
//         return;
//       }
  
//       const orderProducts = validOrderProducts.map(product => ({
//         productId: product._id,
//         quantity: product.quantity,
//       }));
  
//       const response = await api.post('/reception/user-panel/orders', {
//         products: orderProducts,
//         paymentMethod: 'COD',
//       });
  
//       setOrderStatus('Order created successfully: ' + response.data.message);
//     } catch (error) {
//       // Improved error handling
//       const errorMessage =
//         error.response?.data?.error || error.message || 'An unexpected error occurred';
//       setOrderStatus('Error creating order: ' + errorMessage);
//     }
//   };

//   const handleProductClick = (product) => {
//     setSelectedProductDetails(product);
//   };

//   // Ensure products are fetched when the user is authenticated
//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Reception Panel</h1>
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Enter User Code"
//               value={userCode}
//               onChange={(e) => setUserCode(e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//             <button onClick={handleUserPanelAccess} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Access User Panel</button>
//           </div>
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border p-2 rounded w-full"
//             />
//             <input
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="border p-2 rounded w-full mt-2"
//             />
//             <button onClick={handleMiscellaneousPanelAccess} className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Access Miscellaneous Panel</button>
//           </div>
//           {customer && (
//             <div className="mt-4">
//               <h2 className="text-xl font-semibold text-gray-800">Customer Info: {customer.name}</h2>
//               <button onClick={fetchProducts} className="mt-2 w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Fetch Products</button>
//             </div>
//           )}
//         </div>

//         {products.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Products</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {products.map((product, index) => (
//                 <div 
//                   key={index} 
//                   className="bg-gray-100 border p-4 rounded-lg hover:shadow-xl transition-shadow cursor-pointer"
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded mb-4" />
//                   <p className="text-lg font-semibold text-gray-700">{product.name}</p>
//                   <p className="text-gray-600">₹{product.price}</p>
//                   <input
//                     type="number"
//                     placeholder="Quantity"
//                     value={selectedProducts[index]?.quantity || 0}
//                     onChange={(e) => {
//                       const newProducts = [...selectedProducts];
//                       newProducts[index] = { ...product, quantity: parseInt(e.target.value, 10) };
//                       setSelectedProducts(newProducts);
//                     }}
//                     className="border p-2 rounded w-full mt-2"
//                   />
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleOrder} className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Create Order</button>
//           </div>
//         )}

//         {selectedProductDetails && (
//           <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Product Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full h-64 object-cover rounded mb-4" />
//               </div>
//               <div>
//                 <p className="text-lg font-semibold text-gray-700">Name: {selectedProductDetails.name}</p>
//                 <p className="text-gray-600">Price: ₹{selectedProductDetails.price}</p>
//                 <p className="text-gray-600">Description: {selectedProductDetails.description}</p>
//                 <p className="text-gray-600">Category: {selectedProductDetails.category}</p>
//                 <p className="text-gray-600">Stock: {selectedProductDetails.stock}</p>
//                 <p className="text-gray-600">Rating: {selectedProductDetails.rating}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {orderStatus && <p className="mt-4 text-center text-gray-700">{orderStatus}</p>}
//       </div>
//     </div>
//   );
// };

// export default CreateOrder;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Axios instance with interceptor
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

// Add request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') 
        ? token 
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CreateOrder = () => {
  const [userCode, setUserCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  const handleUserPanelAccess = async () => {
    try {
      const response = await api.post('/reception/user-panel-access', { userCode });
      setToken(response.data.token);
      setCustomer(response.data.customer);
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      alert('User panel access granted');
    } catch (error) {
      alert('Error accessing user panel: ' + error.response?.data?.error || error.message);
    }
  };

  const handleMiscellaneousPanelAccess = async () => {
    try {
      const response = await api.post('/reception/miscellaneous-panel-access', { name, email });
      setToken(response.data.token);
      setCustomer(response.data.customer);
      localStorage.setItem('token', response.data.token); // Store token in localStorage
      alert('Miscellaneous panel access granted');
    } catch (error) {
      alert('Error accessing miscellaneous panel: ' + error.response?.data?.error || error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/reception/user-panel/products');
      setProducts(response.data.products);
    } catch (error) {
      alert('Error fetching products: ' + error.response?.data?.error || error.message);
    }
  };

  const handleOrder = async () => {
    try {
      // Validate selected products before proceeding
      const validOrderProducts = selectedProducts.filter(product => product && product._id && product.quantity > 0);
  
      if (validOrderProducts.length === 0) {
        setOrderStatus('Please select at least one product with a valid quantity.');
        return;
      }
  
      const orderProducts = validOrderProducts.map(product => ({
        productId: product._id,
        quantity: product.quantity,
      }));
  
      const response = await api.post('/reception/user-panel/orders', {
        products: orderProducts,
        paymentMethod: 'COD',
      });
  
      setOrderStatus('Order created successfully: ' + response.data.message);
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.error || error.message || 'An unexpected error occurred';
      setOrderStatus('Error creating order: ' + errorMessage);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProductDetails(product);
  };

  // Ensure products are fetched when the user is authenticated
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Create Order By Reception Panel</h1>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter User Code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button onClick={handleUserPanelAccess} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Access User Panel</button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            />
            <button onClick={handleMiscellaneousPanelAccess} className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Access Miscellaneous Panel</button>
          </div>
          {customer && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Customer Info: {customer.name}</h2>
              <button onClick={fetchProducts} className="mt-2 w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Fetch Products</button>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 border p-4 rounded-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{product.name}</p>
                  <p className="text-gray-600">₹{product.price}</p>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={selectedProducts[index]?.quantity || 0}
                    onChange={(e) => {
                      const newProducts = [...selectedProducts];
                      newProducts[index] = { ...product, quantity: parseInt(e.target.value, 10) };
                      setSelectedProducts(newProducts);
                    }}
                    className="border p-2 rounded w-full mt-2"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleOrder} className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Create Order</button>
          </div>
        )}

        {selectedProductDetails && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full h-80 object-cover rounded-lg mb-4" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-700 mb-4">Name: {selectedProductDetails.name}</p>
                <p className="text-xl text-gray-600 mb-4">Price: ₹{selectedProductDetails.price}</p>
                <p className="text-lg text-gray-600 mb-4">Category: {selectedProductDetails.category}</p>
                <p className="text-lg text-gray-600 mb-4">Stock: {selectedProductDetails.stock}</p>
                <p className="text-lg text-gray-600 mb-4">Rating: {selectedProductDetails.rating}</p>
                <p className="text-lg text-gray-700 mb-4">{selectedProductDetails.description}</p>
              </div>
            </div>
          </div>
        )}

        {orderStatus && <p className="mt-4 text-center text-gray-700">{orderStatus}</p>}
      </div>
    </div>
  );
};

export default CreateOrder;
