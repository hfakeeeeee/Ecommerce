import React, { useEffect, useState } from 'react';
import { 
  FaEdit, FaTrash, FaUserEdit, FaKey, FaUserShield, FaPlus, FaSpinner, 
  FaTimes, FaSave, FaSearch, FaImage, FaChevronLeft, FaChevronRight,
  FaFilter, FaSort, FaDownload, FaUpload, FaBox, FaTruck, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');

  // Pagination states
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER'
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: 0
  });

  const [orderForm, setOrderForm] = useState({
    status: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        fetch('/api/auth/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/products/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/orders/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      const usersData = await usersResponse.json();
      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      
      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  // Always sort by ID
  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => a.id - b.id);
  }, [users]);
  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => a.id - b.id);
  }, [products]);

  // Use sortedUsers and sortedProducts for filtering
  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter(user => {
      const matchesSearch = (user.firstName || '').toLowerCase().includes((userSearch || '').toLowerCase());
      const matchesFilter = userFilter === 'all' || user.role === userFilter;
      return matchesSearch && matchesFilter;
    });
  }, [sortedUsers, userSearch, userFilter]);

  const filteredProducts = React.useMemo(() => {
    return sortedProducts.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes((productSearch || '').toLowerCase());
      const matchesFilter = productFilter === 'all' || (product.category && product.category === productFilter);
      return matchesSearch && matchesFilter;
    });
  }, [sortedProducts, productSearch, productFilter]);

  // Pagination functions - memoized
  const paginatedUsers = React.useMemo(() => {
    return filteredUsers.slice(
      (currentUserPage - 1) * itemsPerPage,
      currentUserPage * itemsPerPage
    );
  }, [filteredUsers, currentUserPage, itemsPerPage]);

  const paginatedProducts = React.useMemo(() => {
    return filteredProducts.slice(
      (currentProductPage - 1) * itemsPerPage,
      currentProductPage * itemsPerPage
    );
  }, [filteredProducts, currentProductPage, itemsPerPage]);

  const totalUserPages = React.useMemo(() => Math.ceil(filteredUsers.length / itemsPerPage), [filteredUsers.length, itemsPerPage]);
  const totalProductPages = React.useMemo(() => Math.ceil(filteredProducts.length / itemsPerPage), [filteredProducts.length, itemsPerPage]);

  // Image handling - URL preview
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setProductForm({...productForm, image: url});
    setImagePreview(url);
  };

  const handleUserAction = (action, user) => {
    setSelectedUser(user);
    setActionType(action);
    setUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    setShowUserModal(true);
  };

  const handleProductAction = (action, product) => {
    setSelectedProduct(product);
    setActionType(action);
    if (action === 'edit') {
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        image: product.image || '',
        stock: product.stock || 0
      });

    } else {
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: 0
      });
    }
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setActionType('add');
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: 0
    });
    setShowAddProductModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;
      if (actionType === 'edit') {
        response = await fetch(`/api/auth/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userForm)
        });
      } else if (actionType === 'change-role') {
        response = await fetch(`/api/auth/admin/users/${selectedUser.id}/role`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userForm.role)
        });
      } else if (actionType === 'reset-password') {
        response = await fetch(`/api/auth/admin/users/${selectedUser.id}/reset-password`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        showToast(`User ${actionType} successful`, 'success');
        fetchData();
        setShowUserModal(false);
      } else {
        const error = await response.json();
        showToast(error.message || `Failed to ${actionType} user`, 'error');
      }
    } catch (error) {
      showToast(`Error ${actionType} user`, 'error');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: productForm.stock || 0
      };

      let response;
      if (actionType === 'add') {
        response = await fetch('/api/products/admin/add', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      } else if (actionType === 'edit') {
        response = await fetch(`/api/products/admin/edit/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      } else if (actionType === 'delete') {
        response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        showToast(`Product ${actionType} successful`, 'success');
        fetchData();
        setShowProductModal(false);
        setShowAddProductModal(false);
      } else {
        const error = await response.json();
        showToast(error.message || `Failed to ${actionType} product`, 'error');
      }
    } catch (error) {
      showToast(`Error ${actionType} product`, 'error');
    }
  };

  // Stable onChange handlers
  const handleUserSearchChange = React.useCallback((val) => {
    console.log('User search input:', val);
    setUserSearch(String(val));
  }, []);
  const handleProductSearchChange = React.useCallback((val) => {
    console.log('Product search input:', val);
    setProductSearch(String(val));
  }, []);

  const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${
              size === 'lg' ? 'max-w-2xl' : 'max-w-md'
            } w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 text-2xl" />
          <span className="text-gray-600 dark:text-gray-300 text-lg">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage users and products with ease
            </p>
          </div>

          {/* User Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    User Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredUsers.length} users found • {users.length} total
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={e => {
                        console.log('User search input:', e.target.value);
                        setUserSearch(e.target.value);
                      }}
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="USER">Users</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleUserAction('edit', user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Edit User"
                          >
                            <FaUserEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction('reset-password', user)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            title="Reset Password"
                          >
                            <FaKey className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction('change-role', user)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Change Role"
                          >
                            <FaUserShield className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalUserPages > 1 && (
                <Pagination
                  currentPage={currentUserPage}
                  totalPages={totalUserPages}
                  onPageChange={setCurrentUserPage}
                />
              )}
            </div>
          </motion.div>

          {/* Product Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Product Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredProducts.length} products found • {products.length} total
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => {
                        console.log('Product search input:', e.target.value);
                        setProductSearch(e.target.value);
                      }}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <FaImage className="mx-auto h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No products found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <img
                                className="h-16 w-16 rounded-lg object-cover shadow-md mb-2"
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                }}
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">ID: {product.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              ${product.price}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                            {product.category || 'Uncategorized'}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium space-x-3">
                            <button
                              onClick={() => handleProductAction('edit', product)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="Edit Product"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProductAction('delete', product)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete Product"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {totalProductPages > 1 && (
                <Pagination
                  currentPage={currentProductPage}
                  totalPages={totalProductPages}
                  onPageChange={setCurrentProductPage}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} User`}
      >
        <form onSubmit={handleUserSubmit} className="space-y-6">
          {actionType === 'edit' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
            </>
          )}
          {actionType === 'change-role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          )}
          {(actionType === 'reset-password') && (
            <div className="text-center">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                  Are you sure you want to reset the password for <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  The password will be reset to: <strong>user1234</strong>
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <FaSave className="w-4 h-4 mr-2" />
              {actionType === 'edit' ? 'Update' : actionType === 'change-role' ? 'Change Role' : 'Reset Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal || showAddProductModal}
        onClose={() => {
          setShowProductModal(false);
          setShowAddProductModal(false);
        }}
        title={`${actionType === 'add' ? 'Add' : actionType === 'edit' ? 'Edit' : 'Delete'} Product`}
        size="lg"
      >
        {actionType === 'delete' ? (
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 mb-4">
                Are you sure you want to delete <strong>"{selectedProduct?.name}"</strong>?
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProductSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={e => {
                    console.log('Product name input:', e.target.value);
                    setProductForm({ ...productForm, name: e.target.value });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={String(productForm.image)}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
                {productForm.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 mt-2">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setShowAddProductModal(false);
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <FaSave className="w-4 h-4 mr-2" />
                {actionType === 'add' ? 'Add Product' : 'Update Product'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Product Image"
      >
        <div className="text-center">
          {selectedProduct?.image ? (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x256?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <FaImage className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {selectedProduct?.name}
          </p>
        </div>
      </Modal>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl z-50 ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage; 