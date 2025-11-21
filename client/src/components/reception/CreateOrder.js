// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API,
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
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Create Order By Reception Panel</h1>
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
//             <h3 className="text-3xl font-semibold text-gray-800 mb-6">Product Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full h-80 object-cover rounded-lg mb-4" />
//               </div>
//               <div>
//                 <p className="text-2xl font-semibold text-gray-700 mb-4">Name: {selectedProductDetails.name}</p>
//                 <p className="text-xl text-gray-600 mb-4">Price: ₹{selectedProductDetails.price}</p>
//                 <p className="text-lg text-gray-600 mb-4">Category: {selectedProductDetails.category}</p>
//                 <p className="text-lg text-gray-600 mb-4">Stock: {selectedProductDetails.stock}</p>
//                 <p className="text-lg text-gray-600 mb-4">Rating: {selectedProductDetails.rating}</p>
//                 <p className="text-lg text-gray-700 mb-4">{selectedProductDetails.description}</p>
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

// import React, { useReducer, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // API configuration
// const api = axios.create({
//   baseURL: 'https://rewa-project.onrender.com/api',
// });

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

// // Reducer for state management
// const initialState = {
//   userCode: '',
//   customerInfo: { name: '', email: '', mobileNo: '' },
//   shippingAddress: { address: '', city: '', state: '', pinCode: '' },
//   token: '',
//   customer: null,
//   isMiscellaneous: false,
//   products: [],
//   selectedProducts: {},
//   orderStatus: '',
//   error: '',
//   deliveryChoice: 'homeDelivery',
//   paymentMethod: 'COD',
//   selectedProductDetails: null,
//   isLoading: false,
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_FIELD':
//       return { ...state, [action.field]: action.value };
//     case 'SET_CUSTOMER_INFO':
//       return { ...state, customerInfo: { ...state.customerInfo, [action.field]: action.value } };
//     case 'SET_SHIPPING_ADDRESS':
//       return { ...state, shippingAddress: { ...state.shippingAddress, [action.field]: action.value } };
//     case 'SET_SUCCESS':
//       return { ...state, ...action.payload, isLoading: false, error: '' };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload, isLoading: false };
//     case 'SET_LOADING':
//       return { ...state, isLoading: true };
//     case 'RESET':
//       return initialState;
//     default:
//       return state;
//   }
// }

// // Panel Access Component
// const PanelAccess = ({ state, dispatch, handleUserPanelAccess, handleMiscellaneousPanelAccess }) => (
//   <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Panel Access</h2>
//     {state.error && <p className="text-red-500 text-center mb-4">{state.error}</p>}

//     <div className="mb-6">
//       <h3 className="text-lg font-medium text-gray-700 mb-2">User Panel Access</h3>
//       <input
//         type="text"
//         placeholder="Enter User Code"
//         value={state.userCode}
//         onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'userCode', value: e.target.value })}
//         className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         disabled={state.customer}
//       />
//       <button
//         onClick={handleUserPanelAccess}
//         className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition duration-300"
//         disabled={state.customer || state.isLoading}
//       >
//         {state.isLoading ? 'Accessing...' : 'Access User Panel'}
//       </button>
//     </div>

//     <div className="mb-6">
//       <h3 className="text-lg font-medium text-gray-700 mb-2">Miscellaneous Panel Access</h3>
//       {['name', 'email', 'mobileNo'].map((field) => (
//         <input
//           key={field}
//           type={field === 'email' ? 'email' : 'text'}
//           placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}${field === 'mobileNo' ? ' (10 digits)' : ''}`}
//           value={state.customerInfo[field]}
//           onChange={(e) => dispatch({ type: 'SET_CUSTOMER_INFO', field, value: e.target.value })}
//           className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={state.customer}
//         />
//       ))}
//       <button
//         onClick={handleMiscellaneousPanelAccess}
//         className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition duration-300"
//         disabled={state.customer || state.isLoading}
//       >
//         {state.isLoading ? 'Accessing...' : 'Access Miscellaneous Panel'}
//       </button>
//     </div>
//   </div>
// );

// // Product Selection Component
// const ProductSelection = ({ state, dispatch, handleOrder, handleProductClick }) => (
//   <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//     <h3 className="text-2xl font-semibold text-gray-800 mb-6">Select Products</h3>
//     {!state.isMiscellaneous && (
//       <div className="mb-6">
//         <h4 className="text-lg font-medium text-gray-700 mb-2">Shipping Details</h4>
//         {['address', 'city', 'state', 'pinCode'].map((field) => (
//           <input
//             key={field}
//             type="text"
//             placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}${field === 'pinCode' ? ' (6 digits)' : ''}`}
//             value={state.shippingAddress[field]}
//             onChange={(e) => dispatch({ type: 'SET_SHIPPING_ADDRESS', field, value: e.target.value })}
//             className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         ))}
//         <select
//           value={state.deliveryChoice}
//           onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'deliveryChoice', value: e.target.value })}
//           className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="homeDelivery">Home Delivery</option>
//           <option value="companyPickup">Company Pickup</option>
//         </select>
//         <select
//           value={state.paymentMethod}
//           onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'paymentMethod', value: e.target.value })}
//           className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="COD">Cash on Delivery (COD)</option>
//           <option value="online">Online Payment</option>
//         </select>
//       </div>
//     )}
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {state.products.map((product) => (
//         <div
//           key={product._id}
//           className="bg-gray-100 border p-4 rounded-lg hover:shadow-xl transition-shadow cursor-pointer"
//           onClick={() => handleProductClick(product)}
//         >
//           <img
//             src={product.image || '/placeholder-image.jpg'}
//             alt={product.name}
//             className="w-full h-56 object-cover rounded mb-4"
//             onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
//           />
//           <p className="text-lg font-semibold text-gray-700">{product.name}</p>
//           <p className="text-gray-600">Price: ₹{product.price}</p>
//           <p className="text-gray-600">Boxes: {product.boxes}</p>
//           <input
//             type="number"
//             min="230"
//             step="1"
//             placeholder="Boxes (min 230)"
//             value={state.selectedProducts[product._id]?.boxes || ''}
//             onChange={(e) => {
//               const boxes = parseInt(e.target.value, 10);
//               if (boxes < 230 && e.target.value !== '') {
//                 toast.error(`Boxes for ${product.name} must be at least 230.`);
//                 dispatch({ type: 'SET_ERROR', payload: `Boxes for ${product.name} must be at least 230.` });
//                 return;
//               }
//               dispatch({
//                 type: 'SET_FIELD',
//                 field: 'selectedProducts',
//                 value: {
//                   ...state.selectedProducts,
//                   [product._id]: {
//                     ...product,
//                     boxes: boxes || undefined,
//                     price: state.selectedProducts[product._id]?.price || product.price
//                   }
//                 }
//               });
//             }}
//             className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="number"
//             min="0"
//             step="0.01"
//             placeholder="Enter Price"
//             value={state.selectedProducts[product._id]?.price || ''}
//             onChange={(e) => {
//               const price = parseFloat(e.target.value);
//               if (price < 0 && e.target.value !== '') {
//                 toast.error(`Price for ${product.name} cannot be negative.`);
//                 dispatch({ type: 'SET_ERROR', payload: `Price for ${product.name} cannot be negative.` });
//                 return;
//               }
//               dispatch({
//                 type: 'SET_FIELD',
//                 field: 'selectedProducts',
//                 value: {
//                   ...state.selectedProducts,
//                   [product._id]: {
//                     ...product,
//                     price: price || undefined,
//                     boxes: state.selectedProducts[product._id]?.boxes || 230
//                   }
//                 }
//               });
//             }}
//             className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       ))}
//     </div>
//     <button
//       onClick={handleOrder}
//       className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition duration-300"
//       disabled={!state.customer || Object.keys(state.selectedProducts).length === 0 || state.isLoading}
//     >
//       {state.isLoading ? 'Creating Order...' : 'Create Order'}
//     </button>
//     {state.error && <p className="text-red-500 text-center mt-4">{state.error}</p>}
//   </div>
// );

// // Product Details Component
// const ProductDetails = ({ product }) => (
//   <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//     <h3 className="text-3xl font-semibold text-gray-800 mb-6">Product Details</h3>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <div>
//         <img
//           src={product.image || '/placeholder-image.jpg'}
//           alt={product.name}
//           className="w-full h-80 object-cover rounded-lg mb-4"
//           onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
//         />
//       </div>
//       <div>
//         <p className="text-2xl font-semibold text-gray-700 mb-4">Name: {product.name}</p>
//         <p className="text-xl text-gray-600 mb-4">Price: ₹{product.price}</p>
//         <p className="text-lg text-gray-600 mb-4">Category: {product.category || 'N/A'}</p>
//         <p className="text-lg text-gray-600 mb-4">Boxes: {product.boxes}</p>
//         <p className="text-lg text-gray-600 mb-4">Bottles per Box: {product.bottlesPerBox || 'N/A'}</p>
//         <p className="text-lg text-gray-700 mb-4">{product.description || 'No description available'}</p>
//       </div>
//     </div>
//   </div>
// );

// // Main Component
// const CreateOrder = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const handleUserPanelAccess = async () => {
//     if (!state.userCode) {
//       console.error('User code is required');
//       toast.error('User code is required.');
//       dispatch({ type: 'SET_ERROR', payload: 'User code is required.' });
//       return;
//     }
//     dispatch({ type: 'SET_LOADING' });
//     try {
//       console.log('Sending user panel access request with userCode:', state.userCode);
//       const response = await api.post('/reception/user-panel-access', { userCode: state.userCode });
//       console.log('User panel access response:', response.data);
//       dispatch({
//         type: 'SET_SUCCESS',
//         payload: {
//           token: response.data.token,
//           customer: response.data.customer,
//           isMiscellaneous: false,
//         }
//       });
//       localStorage.setItem('token', response.data.token);
//       toast.success('User panel access granted');
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Error accessing user panel';
//       console.error('User panel access error:', error.response?.data || error.message);
//       toast.error(errorMessage);
//       dispatch({ type: 'SET_ERROR', payload: errorMessage });
//     }
//   };

//   const handleMiscellaneousPanelAccess = async () => {
//     const { name, email, mobileNo } = state.customerInfo;
//     if (!name || !mobileNo) {
//       console.error('Name and mobile number are required for miscellaneous access');
//       toast.error('Name and mobile number are required.');
//       dispatch({ type: 'SET_ERROR', payload: 'Name and mobile number are required.' });
//       return;
//     }
//     if (!/^\d{10}$/.test(mobileNo)) {
//       console.error('Invalid mobile number:', mobileNo);
//       toast.error('Mobile number must be 10 digits.');
//       dispatch({ type: 'SET_ERROR', payload: 'Mobile number must be 10 digits.' });
//       return;
//     }
//     dispatch({ type: 'SET_LOADING' });
//     try {
//       console.log('Sending miscellaneous panel access request:', { name, email, mobileNo });
//       const response = await api.post('/reception/miscellaneous-panel-access', { name, email, mobileNo });
//       console.log('Miscellaneous panel access response:', response.data);
//       dispatch({
//         type: 'SET_SUCCESS',
//         payload: {
//           token: response.data.token,
//           customer: response.data.customer,
//           isMiscellaneous: true,
//         }
//       });
//       localStorage.setItem('token', response.data.token);
//       toast.success('Miscellaneous panel access granted');
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Error accessing miscellaneous panel';
//       console.error('Miscellaneous panel access error:', error.response?.data || error.message);
//       toast.error(errorMessage);
//       dispatch({ type: 'SET_ERROR', payload: errorMessage });
//     }
//   };

//   const fetchProducts = async () => {
//     dispatch({ type: 'SET_LOADING' });
//     try {
//       console.log('Fetching products from /reception/user-panel/products');
//       const response = await api.get('/reception/user-panel/products');
//       console.log('Products fetched:', response.data.products);
//       dispatch({
//         type: 'SET_SUCCESS',
//         payload: { products: response.data.products }
//       });
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Error fetching products';
//       console.error('Fetch products error:', error.response?.data || error.message);
//       toast.error(errorMessage);
//       dispatch({ type: 'SET_ERROR', payload: errorMessage });
//     }
//   };

//   const handleOrder = async () => {
//     dispatch({ type: 'SET_LOADING' });
//     try {
//       // Validate products
//       const validOrderProducts = Object.values(state.selectedProducts)
//         .filter((product) => product && product._id && product.boxes >= 230 && product.price >= 0 && !isNaN(product.boxes) && !isNaN(product.price))
//         .map((product) => ({
//           productId: product._id,
//           boxes: product.boxes,
//           price: product.price,
//         }));

//       if (validOrderProducts.length === 0) {
//         console.error('No valid products selected');
//         toast.error('Please select at least one product with minimum 230 boxes and valid price.');
//         dispatch({ type: 'SET_ERROR', payload: 'Please select at least one product with minimum 230 boxes and valid price.' });
//         return;
//       }

//       // Prepare payload
//       const payload = {
//         products: validOrderProducts,
//         paymentMethod: state.paymentMethod,
//         deliveryChoice: state.isMiscellaneous ? 'companyPickup' : state.deliveryChoice,
//         shippingAddress: state.isMiscellaneous
//           ? { address: 'Miscellaneous Customer', city: 'Ahmedabad', state: 'Gujarat', pinCode: '380001' }
//           : state.shippingAddress,
//         orderStatus: 'pending', // Always set to pending
//       };

//       // Validate miscellaneous order fields
//       if (state.isMiscellaneous) {
//         const { name, mobileNo } = state.customerInfo;
//         if (!name || !mobileNo) {
//           console.error('Missing name or mobileNo for miscellaneous order:', { name, mobileNo });
//           toast.error('Name and mobile number are required for miscellaneous orders.');
//           dispatch({ type: 'SET_ERROR', payload: 'Name and mobile number are required for miscellaneous orders.' });
//           return;
//         }
//         if (!/^\d{10}$/.test(mobileNo)) {
//           console.error('Invalid mobileNo for miscellaneous order:', mobileNo);
//           toast.error('Mobile number must be 10 digits.');
//           dispatch({ type: 'SET_ERROR', payload: 'Mobile number must be 10 digits.' });
//           return;
//         }
//         payload.name = name;
//         payload.mobileNo = mobileNo;
//       } else {
//         // Validate shipping address for non-miscellaneous orders
//         const { address, city, state, pinCode } = state.shippingAddress;
//         if (!address || !city || !state || !pinCode) {
//           console.error('Incomplete shipping address:', state.shippingAddress);
//           toast.error('Complete shipping address with pin code is required.');
//           dispatch({ type: 'SET_ERROR', payload: 'Complete shipping address with pin code is required.' });
//           return;
//         }
//         if (!/^\d{6}$/.test(pinCode)) {
//           console.error('Invalid pin code:', pinCode);
//           toast.error('Pin code must be 6 digits.');
//           dispatch({ type: 'SET_ERROR', payload: 'Pin code must be 6 digits.' });
//           return;
//         }
//         if (!['homeDelivery', 'companyPickup'].includes(state.deliveryChoice)) {
//           console.error('Invalid delivery choice:', state.deliveryChoice);
//           toast.error('Invalid delivery choice.');
//           dispatch({ type: 'SET_ERROR', payload: 'Invalid delivery choice.' });
//           return;
//         }
//         if (!['COD', 'online'].includes(state.paymentMethod)) {
//           console.error('Invalid payment method:', state.paymentMethod);
//           toast.error('Invalid payment method.');
//           dispatch({ type: 'SET_ERROR', payload: 'Invalid payment method.' });
//           return;
//         }
//       }

//       // Log payload for debugging
//       console.log('Sending order creation request with payload:', payload);

//       // Make API call
//       const response = await api.post('/reception/user-panel/orders', payload);
//       console.log('Order creation response:', response.data);

//       // Handle success
//       dispatch({
//         type: 'SET_SUCCESS',
//         payload: {
//           orderStatus: `Order created successfully: ${response.data.order.orderId}`,
//           selectedProducts: {},
//           shippingAddress: initialState.shippingAddress,
//           deliveryChoice: 'homeDelivery',
//           paymentMethod: 'COD',
//           customerInfo: state.isMiscellaneous ? initialState.customerInfo : state.customerInfo,
//           customer: state.isMiscellaneous ? null : state.customer,
//           token: state.isMiscellaneous ? '' : state.token,
//           isMiscellaneous: state.isMiscellaneous ? false : state.isMiscellaneous,
//         }
//       });
//       if (state.isMiscellaneous) localStorage.removeItem('token');
//       toast.success(`Order created successfully: ${response.data.order.orderId}`);
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.response?.data?.details || 'Error creating order';
//       console.error('Order creation error:', error.response?.data || error.message);
//       toast.error(errorMessage);
//       dispatch({ type: 'SET_ERROR', payload: errorMessage });
//     }
//   };

//   const handleProductClick = (product) => {
//     dispatch({ type: 'SET_FIELD', field: 'selectedProductDetails', value: product });
//   };

//   const resetPanelAccess = () => {
//     dispatch({ type: 'RESET' });
//     localStorage.removeItem('token');
//     console.log('Panel access reset');
//     toast.info('Panel access reset');
//   };

//   useEffect(() => {
//     if (state.token) fetchProducts();
//   }, [state.token]);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
//       <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Create Order By Reception Panel</h1>
//       <div className="max-w-6xl mx-auto">
//         <PanelAccess
//           state={state}
//           dispatch={dispatch}
//           handleUserPanelAccess={handleUserPanelAccess}
//           handleMiscellaneousPanelAccess={handleMiscellaneousPanelAccess}
//         />

//         {state.customer && (
//           <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">
//               Customer: {state.customer.name} {state.customer.firmName ? `(${state.customer.firmName})` : ''}
//               {state.isMiscellaneous && ' (Miscellaneous)'}
//             </h3>
//             <p className="text-gray-600">Email: {state.customer.email}</p>
//             {state.customer.mobileNo && <p className="text-gray-600">Mobile: {state.customer.mobileNo}</p>}
//             {state.customer.userCode && <p className="text-gray-600">User Code: {state.customer.userCode}</p>}
//             <div className="mt-2 flex space-x-2">
//               <button
//                 onClick={fetchProducts}
//                 className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-300"
//               >
//                 Fetch Products
//               </button>
//               <button
//                 onClick={resetPanelAccess}
//                 className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
//               >
//                 Exit Panel
//               </button>
//             </div>
//           </div>
//         )}

//         {state.products.length > 0 && (
//           <ProductSelection
//             state={state}
//             dispatch={dispatch}
//             handleOrder={handleOrder}
//             handleProductClick={handleProductClick}
//           />
//         )}

//         {state.selectedProductDetails && (
//           <ProductDetails product={state.selectedProductDetails} />
//         )}

//         {state.orderStatus && (
//           <p className={`mt-4 text-center ${state.orderStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
//             {state.orderStatus}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateOrder;

// =====================================================
// Imports
// =====================================================
import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const initialState = {
  userCode: "",
  customerInfo: { name: "", email: "", mobileNo: "" },
  shippingAddress: { address: "", city: "", state: "", pinCode: "" },
  token: "",
  customer: null,
  isMiscellaneous: false,
  products: [],
  selectedProducts: {},
  orderStatus: "",
  error: "",
  deliveryChoice: "homeDelivery",
  paymentMethod: "COD",
  selectedProductDetails: null,
  isLoadingUser: false, // separate loading state for User Panel
  isLoadingMisc: false,
  isLoadingProducts: false,
  isLoadingOrder: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_CUSTOMER_INFO":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, [action.field]: action.value },
      };
    case "SET_SHIPPING_ADDRESS":
      return {
        ...state,
        shippingAddress: {
          ...state.shippingAddress,
          [action.field]: action.value,
        },
      };
    case "SET_SUCCESS":
      return { ...state, ...action.payload, error: "" };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING_USER":
      return { ...state, isLoadingUser: action.value };
    case "SET_LOADING_MISC":
      return { ...state, isLoadingMisc: action.value };
    case "RESET":
      return initialState;
    case "SET_LOADING":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

const PanelAccess = ({
  state,
  dispatch,
  handleUserPanelAccess,
  handleMiscellaneousPanelAccess,
}) => (
  <div className="bg-stone-200 p-6 rounded-lg shadow-xl mb-6 w-full">
    <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
      Panel Access
    </h2>
    {state.error && (
      <p className="text-red-500 text-center mb-4">{state.error}</p>
    )}

    <div className="flex w-full gap-6">
      <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          User Panel Access
        </h3>
        <input
          type="text"
          placeholder="Enter User Code"
          value={state.userCode}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "userCode",
              value: e.target.value,
            })
          }
          className="border p-2 rounded-xl shadow w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={state.customer}
          style={state.customer ? { backgroundColor: "white" } : {}}
        />
        <button
          onClick={handleUserPanelAccess}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition duration-300"
          disabled={state.customer || state.isLoadingUser}
        >
          {state.isLoadingUser ? "Accessing..." : "Access User Panel"}
        </button>
      </div>

      {/* Right Column - Miscellaneous Panel Access */}
      <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Miscellaneous Panel Access
        </h3>
        {["name", "email", "mobileNo"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            placeholder={`Enter ${field === "email"
              ? "Email (optional)"
              : field.charAt(0).toUpperCase() + field.slice(1) + (field === "mobileNo" ? " (10 digits)" : "")
              }`}
            value={state.customerInfo[field]}
            onChange={(e) =>
              dispatch({
                type: "SET_CUSTOMER_INFO",
                field,
                value: e.target.value,
              })
            }
            className="border p-2 rounded-xl shadow w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={state.customer}
            style={state.customer ? { backgroundColor: "white" } : {}}
          />
        ))}
        <button
          onClick={handleMiscellaneousPanelAccess}
          className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition duration-300"
          disabled={state.customer || state.isLoadingMisc}
        >
          {state.isLoadingMisc ? "Accessing..." : "Access Miscellaneous Panel"}
        </button>
      </div>
    </div>
  </div>
);

const ProductSelection = ({
  state,
  dispatch,
  handleOrder,
  handleProductClick,
}) => (
  <div className="bg-stone-200 p-6 rounded-lg shadow-xl mb-6">
    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
      Select Products
    </h3>
    {!state.isMiscellaneous && (
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">
          Shipping Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Left side: Input fields */}
          <div>
            {["address", "city", "state", "pinCode"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}${field === "pinCode" ? " (6 digits)" : ""
                  }`}
                value={state.shippingAddress[field]}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SHIPPING_ADDRESS",
                    field,
                    value: e.target.value,
                  })
                }
                className="border p-2 rounded-xl shadow-xl w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Right side: Select fields */}
          <div>
            <select
              value={state.deliveryChoice}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "deliveryChoice",
                  value: e.target.value,
                })
              }
              className="border p-2 rounded-xl shadow-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="homeDelivery">Home Delivery</option>
              <option value="companyPickup">Company Pickup</option>
            </select>

            <select
              value={state.paymentMethod}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "paymentMethod",
                  value: e.target.value,
                })
              }
              className="border p-2 rounded-xl shadow-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="UPI">UPI</option>
              <option value="netBanking">Net Banking</option>
            </select>
          </div>
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {state.products.map((product) => (
        <div
          key={product._id}
          className="bg-gray-100 border p-4 rounded-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleProductClick(product)}
        >
          <img
            src={product.image || "/placeholder-image.jpg"}
            alt={product.name}
            className="w-full h-56 object-cover rounded mb-4"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          <p className="text-lg font-semibold text-gray-700">{product.name}</p>
          <p className="text-gray-700">Type: {product.type}</p>
          <p className="text-gray-700">Category: {product.category}</p>
          <p className="font-semibold text-gray-700">Description:</p>
          <p className="text-gray-700">
            {product.description
              ? product.description.split(" ").slice(0, 12).join(" ") +
              (product.description.split(" ").length > 12 ? "..." : "")
              : "N/A"}
          </p>
          <p className="text-gray-600">Price: ₹{product.price}</p>
          <p className="text-gray-600">Boxes: {product.boxes}</p>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Boxes (min 1)"
            value={state.selectedProducts[product._id]?.boxes || ""}
            onChange={(e) => {
              const inputValue = e.target.value;

              // If input is cleared, remove the product from selected products
              if (inputValue === "" || inputValue === null) {
                const updatedProducts = { ...state.selectedProducts };
                delete updatedProducts[product._id];
                dispatch({
                  type: "SET_FIELD",
                  field: "selectedProducts",
                  value: updatedProducts,
                });
                return;
              }

              const boxes = parseInt(inputValue, 10);

              if (isNaN(boxes) || boxes < 1) {
                toast.error(
                  `Boxes for ${product.name} must be at least 1.`
                );
                return;
              }

              dispatch({
                type: "SET_FIELD",
                field: "selectedProducts",
                value: {
                  ...state.selectedProducts,
                  [product._id]: {
                    ...product,
                    boxes,
                    price:
                      state.selectedProducts[product._id]?.price ||
                      product.price,
                  },
                },
              });
            }}
            className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Price input kept commented as in original */}
        </div>
      ))}
    </div>
    <button
      onClick={handleOrder}
      className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition duration-300"
      disabled={
        !state.customer ||
        Object.keys(state.selectedProducts).length === 0 ||
        state.isLoadingOrder
      }
    >
      {state.isLoadingOrder ? "Creating Order..." : "Create Order"}
    </button>
    {state.error && (
      <p className="text-red-500 text-center mt-4">{state.error}</p>
    )}
  </div>
);

const CreateOrder = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleUserPanelAccess = async () => {
    if (!state.userCode) {
      toast.error("User code is required.");
      dispatch({ type: "SET_ERROR", payload: "User code is required." });
      return;
    }
    dispatch({ type: "SET_LOADING", field: "isLoadingUser", value: true });
    try {
      const response = await api.post("/reception/user-panel-access", {
        userCode: state.userCode,
      });
      dispatch({
        type: "SET_SUCCESS",
        payload: {
          token: response.data.token,
          customer: response.data.customer,
          isMiscellaneous: false,
        },
      });
      cookies.set("token", response.data.token);
      toast.success("User panel access granted");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error accessing user panel";
      toast.error(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", field: "isLoadingUser", value: false });
    }
  };

  const handleMiscellaneousPanelAccess = async () => {
    const { name, email, mobileNo } = state.customerInfo;
    if (!name || !mobileNo) {
      toast.error("Name and mobile number are required.");
      dispatch({
        type: "SET_ERROR",
        payload: "Name and mobile number are required.",
      });
      return;
    }
    if (!/^\d{10}$/.test(mobileNo)) {
      toast.error("Mobile number must be 10 digits.");
      dispatch({
        type: "SET_ERROR",
        payload: "Mobile number must be 10 digits.",
      });
      return;
    }
    dispatch({ type: "SET_LOADING", field: "isLoadingMisc", value: true });
    try {
      // email is optional per API docs
      const bodyPayload = { name, mobileNo };
      if (email) bodyPayload.email = email;

      const response = await api.post(
        "/reception/miscellaneous-panel-access",
        bodyPayload
      );
      dispatch({
        type: "SET_SUCCESS",
        payload: {
          token: response.data.token,
          customer: response.data.customer,
          isMiscellaneous: true,
        },
      });
      cookies.set("token", response.data.token);
      toast.success("Miscellaneous panel access granted");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error accessing miscellaneous panel";
      toast.error(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", field: "isLoadingMisc", value: false });
    }
  };

  const fetchProducts = async () => {
    dispatch({ type: "SET_LOADING", field: "isLoadingProducts", value: true });
    try {
      const response = await api.get("/reception/user-panel/products");
      dispatch({
        type: "SET_SUCCESS",
        payload: { products: response.data.products },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error fetching products";
      toast.error(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({
        type: "SET_LOADING",
        field: "isLoadingProducts",
        value: false,
      });
    }
  };

  const handleOrder = async () => {
    dispatch({ type: "SET_LOADING", field: "isLoadingOrder", value: true });
    try {
      const selectedProductsArray = Object.values(state.selectedProducts);

      if (selectedProductsArray.length === 0) {
        toast.error("Please select at least one product.");
        dispatch({
          type: "SET_LOADING",
          field: "isLoadingOrder",
          value: false,
        });
        return;
      }

      // Validate boxes >= 1 for all products (API: min 1)
      const invalidBoxProducts = selectedProductsArray.filter(
        (product) => !product.boxes || product.boxes < 1
      );
      if (invalidBoxProducts.length > 0) {
        const names = invalidBoxProducts.map((p) => p.name).join(", ");
        toast.error(
          `Boxes must be at least 1 for: ${names}`
        );
        dispatch({
          type: "SET_LOADING",
          field: "isLoadingOrder",
          value: false,
        });
        return;
      }

      // Regular customers: minimum 200 boxes total across all products
      const totalBoxes = selectedProductsArray.reduce(
        (sum, product) => sum + (Number(product.boxes) || 0),
        0
      );

      if (!state.isMiscellaneous && totalBoxes < 200) {
        toast.error(
          "Minimum 200 boxes required for regular customers (total across all products)."
        );
        dispatch({
          type: "SET_LOADING",
          field: "isLoadingOrder",
          value: false,
        });
        return;
      }

      const validOrderProducts = selectedProductsArray.map((product) => ({
        productId: product._id,
        boxes: product.boxes,
        price: product.price,
      }));

      let payload;

      if (state.isMiscellaneous) {
        // Miscellaneous customers: no minimum box requirement, but shippingAddress is still required
        payload = {
          products: validOrderProducts,
          paymentMethod: state.paymentMethod,
          deliveryChoice: "companyPickup",
          shippingAddress: {
            address: "Miscellaneous Customer",
            city: "Ahmedabad",
            state: "Gujarat",
            pinCode: "380001",
          },
          // name & mobileNo required for miscellaneous per docs
          name: state.customerInfo.name,
          mobileNo: state.customerInfo.mobileNo,
        };
      } else {
        // Regular customers
        const {
          address,
          city,
          state: addressState,
          pinCode,
        } = state.shippingAddress;

        if (!address || !city || !addressState || !pinCode) {
          toast.error("Complete shipping address with pin code is required.");
          dispatch({
            type: "SET_ERROR",
            payload: "Complete shipping address with pin code is required.",
          });
          dispatch({
            type: "SET_LOADING",
            field: "isLoadingOrder",
            value: false,
          });
          return;
        }

        if (!/^\d{6}$/.test(pinCode)) {
          toast.error("Pin code must be 6 digits.");
          dispatch({
            type: "SET_ERROR",
            payload: "Pin code must be 6 digits.",
          });
          dispatch({
            type: "SET_LOADING",
            field: "isLoadingOrder",
            value: false,
          });
          return;
        }

        payload = {
          products: validOrderProducts,
          paymentMethod: state.paymentMethod,
          deliveryChoice: state.deliveryChoice,
          shippingAddress: state.shippingAddress,
        };
      }

      // API documentation: POST /orders (with reception auth)
      // Based on your existing prefix usage, using /reception/orders
      const response = await api.post("/reception/user-panel/orders", payload);

      dispatch({
        type: "SET_SUCCESS",
        payload: {
          selectedProducts: {},
          selectedProductDetails: null,
          shippingAddress: initialState.shippingAddress,
          deliveryChoice: "homeDelivery",
          paymentMethod: "COD",
          customerInfo: state.isMiscellaneous
            ? initialState.customerInfo
            : state.customerInfo,
          customer: state.isMiscellaneous ? null : state.customer,
          token: state.isMiscellaneous ? "" : state.token,
          isMiscellaneous: state.isMiscellaneous
            ? false
            : state.isMiscellaneous,
          orderStatus: response.data?.message || "Order created successfully",
        },
      });

      if (state.isMiscellaneous) {
        resetPanelAccess();
      }

      toast.success("Order created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        "Error creating order";
      toast.error(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", field: "isLoadingOrder", value: false });
    }
  };

  const handleProductClick = (product) => {
    dispatch({
      type: "SET_FIELD",
      field: "selectedProductDetails",
      value: product,
    });
  };

  const removeProduct = (productId) => {
    const updatedProducts = { ...state.selectedProducts };
    delete updatedProducts[productId];
    dispatch({
      type: "SET_FIELD",
      field: "selectedProducts",
      value: updatedProducts,
    });
  };

  const resetPanelAccess = () => {
    dispatch({ type: "RESET" });
    toast.info("Panel access reset");
  };

  useEffect(() => {
    if (state.token) fetchProducts();
  }, [state.token]);

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Create Order By Reception Panel
      </h1>
      <div className="max-w-6xl mx-auto">
        <PanelAccess
          state={state}
          dispatch={dispatch}
          handleUserPanelAccess={handleUserPanelAccess}
          handleMiscellaneousPanelAccess={handleMiscellaneousPanelAccess}
        />

        {state.customer && (
          <div className="bg-[#e5e3de] p-6 rounded-lg shadow-xl mb-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl text-gray-800">
                Name: {state.customer.name}{" "}
                {state.isMiscellaneous && " (Miscellaneous)"}
              </h3>
              <p className="text-gray-600">Email: {state.customer.email}</p>
              {state.customer.mobileNo && (
                <p className="text-gray-600">
                  Mobile: {state.customer.mobileNo}
                </p>
              )}
              {state.customer.userCode && (
                <p className="text-gray-600">
                  User Code: {state.customer.userCode}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-3 w-1/4">
              <button
                onClick={fetchProducts}
                className="w-full bg-purple-500 text-white p-2 rounded-lg shadow-xl hover:bg-purple-600 transition duration-300"
              >
                Fetch Products
              </button>
              <button
                onClick={resetPanelAccess}
                className="w-full bg-red-500 text-white p-2 rounded-lg shadow-xl hover:bg-red-600 transition duration-300"
              >
                Exit Panel
              </button>
            </div>
          </div>
        )}

        {state.products.length > 0 && (
          <ProductSelection
            state={state}
            dispatch={dispatch}
            handleOrder={handleOrder}
            handleProductClick={handleProductClick}
          />
        )}

        {Object.keys(state.selectedProducts).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Selected Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(state.selectedProducts).map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 relative"
                >
                  {/* Trash Icon */}
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="absolute top-2 right-2 p-2 h-8 w-8 bg-red-500 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
                    title="Remove Product"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                  </button>

                  <div className="flex gap-4">
                    <img
                      src={product.image || "/placeholder-image.jpg"}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-gray-600">Type: {product.type}</p>
                      <p className="text-gray-600">Price: ₹{product.price}</p>
                      <p className="text-gray-600">Boxes: {product.boxes}</p>
                      {product.category && (
                        <p className="text-gray-600">
                          Category: {product.category}
                        </p>
                      )}
                      {product.bottlesPerBox && (
                        <p className="text-gray-600">
                          Bottles per Box: {product.bottlesPerBox}
                        </p>
                      )}
                      {product.description && (
                        <p className="text-gray-600 mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.orderStatus && (
          <p
            className={`mt-4 text-center ${state.orderStatus.includes(
              "successfully"
            )
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {state.orderStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;
