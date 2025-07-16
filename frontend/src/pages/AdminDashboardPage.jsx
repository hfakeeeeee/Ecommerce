import React, { useEffect, useState, memo, useCallback } from 'react';
import { 
  FaEdit, FaTrash, FaUserEdit, FaKey, FaUserShield, FaPlus, FaSpinner, 
  FaTimes, FaSave, FaSearch, FaImage, FaChevronLeft, FaChevronRight,
  FaFilter, FaSort, FaDownload, FaUpload, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaEye,
  FaChartLine, FaUsers, FaShoppingCart, FaDollarSign, FaCrown, FaStar, FaArrowUp, FaArrowDown,
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaShieldAlt, FaChevronDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, getPlaceholderUrl, createDataUrlPlaceholder } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

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
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [categories, setCategories] = useState([]);
  const [showChart, setShowChart] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [orderTrends, setOrderTrends] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoModeEnabled, setAutoModeEnabled] = useState(true);
  const [autoModeLoading, setAutoModeLoading] = useState(true);

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

  // Replace showProductModal and showAddProductModal with a single modal mode
  const [productModalMode, setProductModalMode] = useState('none'); // 'none' | 'add' | 'edit' | 'delete'

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchAnalytics();
    fetchAutoModeStatus();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersResponse, productsResponse, ordersResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE_URL}/api/products/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE_URL}/api/orders/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE_URL}/api/products/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
      
      const usersData = await usersResponse.json();
      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      const categoriesData = await categoriesResponse.json();
      
      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      
      // Debug: Log order data structure
      console.log('Orders data:', ordersData);
      if (ordersData.length > 0) {
        console.log('First order structure:', ordersData[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [analyticsResponse, trendsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/dashboard`, { headers }),
        fetch(`${API_BASE_URL}/api/analytics/orders-by-month`, { headers })
      ]);

      if (!analyticsResponse.ok || !trendsResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const analyticsData = await analyticsResponse.json();
      const trendsData = await trendsResponse.json();
      
      setAnalytics(analyticsData);
      
      // Transform trends data for the chart
      const transformedTrends = Object.entries(trendsData).map(([month, count]) => ({
        month,
        orders: count
      }));
      setOrderTrends(transformedTrends);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showToast('Error fetching analytics data', 'error');
    }
  };

  const fetchAutoModeStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/orders/admin/auto-mode`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAutoModeEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Error fetching auto mode status:', error);
      showToast('Failed to fetch auto mode status', 'error');
    } finally {
      setAutoModeLoading(false);
    }
  };

  const toggleAutoMode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/orders/admin/auto-mode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: !autoModeEnabled })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAutoModeEnabled(data.enabled);
        showToast(data.message, 'success');
      } else {
        showToast('Failed to toggle auto mode', 'error');
      }
    } catch (error) {
      console.error('Error toggling auto mode:', error);
      showToast('Failed to toggle auto mode', 'error');
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

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Order filtering and pagination
  const sortedOrders = React.useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [orders]);

  const filteredOrders = React.useMemo(() => {
    return sortedOrders.filter(order => {
      const matchesSearch = (
        order.orderNumber?.toLowerCase().includes((orderSearch || '').toLowerCase()) ||
        order.user?.firstName?.toLowerCase().includes((orderSearch || '').toLowerCase()) ||
        order.user?.lastName?.toLowerCase().includes((orderSearch || '').toLowerCase()) ||
        order.user?.email?.toLowerCase().includes((orderSearch || '').toLowerCase())
      );
      const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
      return matchesSearch && matchesFilter;
    });
  }, [sortedOrders, orderSearch, orderFilter]);

  const paginatedOrders = React.useMemo(() => {
    return filteredOrders.slice(
      (currentOrderPage - 1) * itemsPerPage,
      currentOrderPage * itemsPerPage
    );
  }, [filteredOrders, currentOrderPage, itemsPerPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);

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

  const handleProductAction = useCallback((action, product) => {
    setSelectedProduct(product);
    setActionType(action);
    if (action === 'edit') {
      setProductForm(prev => ({
        ...prev,
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        image: product.image || '',
        stock: product.stock || 0
      }));
      setProductModalMode('edit');
    } else if (action === 'delete') {
      setProductModalMode('delete');
    }
  }, []);

  const handleAddProduct = useCallback(() => {
    setActionType('add');
    setProductForm(prev => ({
      ...prev,
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: 0
    }));
    setProductModalMode('add');
  }, []);

  const handleOrderAction = (action, order) => {
    setSelectedOrder(order);
    setActionType(action);
    setOrderForm({
      status: order.status
    });
    setShowOrderModal(true);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;
      if (actionType === 'edit') {
        response = await fetch(`${API_BASE_URL}/api/auth/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userForm)
        });
      } else if (actionType === 'change-role') {
        response = await fetch(`${API_BASE_URL}/api/auth/admin/users/${selectedUser.id}/role`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userForm.role)
        });
      } else if (actionType === 'reset-password') {
        response = await fetch(`${API_BASE_URL}/api/auth/admin/users/${selectedUser.id}/reset-password`, {
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
        response = await fetch(`${API_BASE_URL}/api/products/admin/add`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      } else if (actionType === 'edit') {
        response = await fetch(`${API_BASE_URL}/api/products/admin/edit/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      } else if (actionType === 'delete') {
        response = await fetch(`${API_BASE_URL}/api/products/${selectedProduct.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.ok) {
        showToast(`Product ${actionType} successful`, 'success');
        fetchData();
        setProductModalMode('none');
      } else {
        const error = await response.json();
        showToast(error.message || `Failed to ${actionType} product`, 'error');
      }
    } catch (error) {
      showToast(`Error ${actionType} product`, 'error');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;

      if (actionType === 'update-status') {
        response = await fetch(`${API_BASE_URL}/api/orders/admin/${selectedOrder.orderNumber}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: orderForm.status })
        });

        if (response.status === 400) {
          const error = await response.json();
          showToast(error.message || 'Cannot update status at this time', 'error');
          return;
        }
      } else if (actionType === 'cancel') {
        response = await fetch(`${API_BASE_URL}/api/orders/${selectedOrder.orderNumber}/cancel`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        showToast(`Unknown order action: ${actionType}`, 'error');
        console.error('Unknown order actionType:', actionType);
        return;
      }

      if (response.ok) {
        showToast(`Order ${actionType} successful`, 'success');
        fetchData();
        setShowOrderModal(false);
      } else {
        let errorMsg = `Failed to ${actionType} order (Status: ${response.status})`;
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
          console.error('Order update error:', error, 'Status:', response.status);
        } catch (err) {
          console.error('Order update error: could not parse JSON', err, 'Status:', response.status);
        }
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      showToast(`Error ${actionType} order: ${error.message}`, 'error');
      console.error('Order update exception:', error);
    }
  };

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

  // Memoized ProductForm component with local state
  const ProductForm = memo(function ProductForm({ initialProduct, onSubmit, onCancel, actionType, categories }) {
    const [form, setForm] = React.useState(() => ({ ...initialProduct }));

    React.useEffect(() => {
      setForm({ ...initialProduct });
    }, [initialProduct]);

    const handleChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
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
              value={form.price}
              onChange={e => handleChange('price', e.target.value)}
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
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="relative w-full sm:w-auto">
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 w-full"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={e => handleChange('stock', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image URL
            </label>
            <input
              type="url"
              value={String(form.image)}
              onChange={e => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
            {form.image && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 mt-2">
                <img
                  src={form.image}
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
            onClick={onCancel}
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
    );
  });

  // Memoize setProductForm for ProductForm to prevent focus loss
  const stableSetProductForm = useCallback((updater) => {
    setProductForm(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return updater;
    });
  }, []);

  // Memoize onCancel handler for ProductForm
  const handleProductFormCancel = useCallback(() => {
    setProductModalMode('none');
    setSelectedProduct(null);
  }, []);

  // ... after const [orders, setOrders] = useState([]); ...
  const nonCancelledOrders = React.useMemo(
    () => orders.filter(order => order.status !== 'CANCELLED'),
    [orders]
  );
  const totalOrders = nonCancelledOrders.length;
  const totalRevenue = React.useMemo(
    () => nonCancelledOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    [nonCancelledOrders]
  );
  // ... existing code ...

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
        </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Dashboard</h3>
            <p className="text-gray-500 dark:text-gray-400">Preparing your admin workspace...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
        <motion.div
        initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCrown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your e-commerce platform</p>
                </div>
              </div>
          </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Sucess Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">${totalRevenue.toFixed(2)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalUsers || 0}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-nowrap overflow-x-auto gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1 sm:p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartLine },
              { id: 'users', label: 'Users', icon: FaUsers },
              { id: 'products', label: 'Products', icon: FaBox },
              { id: 'orders', label: 'Orders', icon: FaShoppingCart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Analytics Overview */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words whitespace-pre-line">
                      Analytics Overview
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Real-time insights into your business performance</p>
                  </div>
                  <button
                    onClick={() => setShowChart(!showChart)}
                    className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm sm:text-base"
                  >
                    <FaChartLine className="mr-2" />
                    {showChart ? 'Hide Charts' : 'Show Charts'}
                  </button>
                </div>
                {/* Stats Cards Responsive Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Sucess Orders</p>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</h3>
                          <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                      </div>
                      </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    </div>
                  </motion.div>

                  <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalUsers || 0}</h3>
                          <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                      </div>
                      </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaUsers className="w-6 h-6 text-white" />
                    </div>
                    </div>
                  </motion.div>

                  <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</h3>
                          <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                      </div>
                      </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaDollarSign className="w-6 h-6 text-white" />
                    </div>
                    </div>
                  </motion.div>

                  <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Recent Orders</p>
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{analytics?.recentOrders || 0}</h3>
                          <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                      </div>
                      </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FaChartLine className="w-6 h-6 text-white" />
                    </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Charts Section */}
                <AnimatePresence>
                  {showChart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* Orders Trend Chart */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Orders Trend</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Monthly Orders</span>
                          </div>
                        </div>
                        <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderTrends}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#6B7280"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#6B7280"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: 'none',
                                  borderRadius: '12px',
                                  color: '#F3F4F6',
                                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                            }}
                          />
                          <Bar 
                            dataKey="orders" 
                                fill="url(#purpleGradient)" 
                            name="Orders"
                                radius={[6, 6, 0, 0]}
                              />
                              <defs>
                                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                </linearGradient>
                              </defs>
                        </BarChart>
                      </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Revenue Chart */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Monthly Revenue</span>
                          </div>
                        </div>
                        <div className="h-[300px] flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                              ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Total Revenue</div>
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                              Revenue data visualization coming soon...
                            </div>
                          </div>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
          <motion.div
              key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4 lg:gap-0">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words whitespace-pre-line">
                    User Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base">
                    {filteredUsers.length} users found • {users.length} total
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                    <div className="relative w-full sm:w-auto">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                        className="appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 w-full"
                  >
                    <option value="all">All Roles</option>
                    <option value="USER">Users</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                      <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
              </div>
              
                {/* Users Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 flex-grow-0 h-12 w-12 min-w-[3rem] min-h-[3rem] flex items-center justify-center overflow-hidden">
                              {user.imageUrl ? (
                                <img
                                  src={getImageUrl(user.imageUrl)}
                                  alt={user.firstName + ' ' + user.lastName}
                                    className="h-full w-full rounded-full object-cover object-center border-2 border-gray-200 dark:border-gray-600"
                                  onError={e => { 
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = createDataUrlPlaceholder('No Image', 80, 80);
                                  }}
                                />
                              ) : (
                                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                              )}
                            </div>
                              <div className="flex-1">
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
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
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
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
          <motion.div
              key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4 lg:gap-0">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words whitespace-pre-line">
                    Product Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base">
                    {filteredProducts.length} products found • {products.length} total
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                    <div className="relative w-full sm:w-auto">
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                        className="appearance-none px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 w-full"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                      <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  <button
                      onClick={() => setProductModalMode('add')}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
              
                {/* Modern Products Table */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
              <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
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
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                            <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                                <FaImage className="mx-auto h-16 w-16 mb-4 opacity-50" />
                                <p className="text-xl font-medium mb-2">No products found</p>
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
                              className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
                        >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  className="flex flex-col items-center w-full focus:outline-none group cursor-pointer hover:scale-105 transition-transform"
                                  title={`View details for ${product.name}`}
                                >
                                  <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center mb-2">
                                    <img
                                      className="h-16 w-16 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                      src={product.image}
                                      alt={product.name}
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                      }}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors underline-offset-2 group-hover:underline">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      ID: {product.id}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 max-w-xs">
                                      {product.description}
                                    </div>
                                  </div>
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              ${product.price}
                            </span>
                          </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {product.category || 'Uncategorized'}
                                </span>
                          </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                  product.stock > 0 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                          </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div className="flex items-center justify-center space-x-2">
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
                                </div>
                          </td>
                        </motion.tr>
                      )))}
                    </tbody>
                  </table>
                </div>
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
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
          <motion.div
              key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
          >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4 lg:gap-0">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 break-words whitespace-pre-line">
                    Order Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base">
                    {orders.length} total orders
                  </p>
                </div>
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {autoModeEnabled ? 'Auto Updates' : 'Manual Updates'}
                    </span>
                    <button
                      onClick={toggleAutoMode}
                      disabled={autoModeLoading}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        autoModeEnabled 
                          ? 'bg-green-500 focus:ring-green-500' 
                          : 'bg-gray-400 focus:ring-blue-500'
                      } disabled:opacity-50`}
                      role="switch"
                      aria-checked={autoModeEnabled}
                    >
                      <span className="sr-only">
                        {autoModeEnabled ? 'Disable automatic order processing' : 'Enable automatic order processing'}
                      </span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          autoModeEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                      {autoModeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-full">
                          <FaSpinner className="w-3 h-3 text-white animate-spin" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
                {/* Modern Orders Table */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
              <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                    <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {orders.slice(0, 10).map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                                  <FaShoppingCart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    #{order.id}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {order.items?.length || 0} items
                                  </div>
                                </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left">
                            <div className="flex items-center justify-start space-x-3 min-h-[2.5rem]">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                {order.user?.imageUrl ? (
                                  <img
                                    src={getImageUrl(order.user.imageUrl)}
                                    alt={order.user?.firstName + ' ' + order.user?.lastName}
                                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                    onError={e => {
                                      e.target.onerror = null;
                                      e.target.src = createDataUrlPlaceholder('No Image', 80, 80);
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {order.user?.firstName?.charAt(0)}{order.user?.lastName?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col justify-center text-left min-w-0 h-10">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white leading-none self-start">
                                  {order.user?.firstName} {order.user?.lastName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5 self-start">
                                  {order.user?.email}
                                </span>
                              </div>
                            </div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              ${(() => {
                                try {
                                  if (order.totalAmount !== null && order.totalAmount !== undefined) {
                                    return parseFloat(order.totalAmount).toFixed(2);
                                  }
                                  return '0.00';
                                } catch (error) {
                                  return '0.00';
                                }
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                order.status === 'COMPLETED' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : order.status === 'PROCESSING'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {order.status || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                            {(() => {
                              try {
                                if (order.orderDate) {
                                  return new Date(order.orderDate).toLocaleDateString();
                                } else if (order.createdAt) {
                                  return new Date(order.createdAt).toLocaleDateString();
                                }
                                return 'N/A';
                              } catch (error) {
                                return 'Invalid Date';
                              }
                            })()}
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  title="View Details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOrderAction('update-status', order)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                              title="Edit Order"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                              </div>
                          </td>
                        </motion.tr>
                        ))}
                  </tbody>
                </table>
              </div>
                </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={userForm.imageUrl || ''}
                  onChange={e => setUserForm({ ...userForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
                {userForm.imageUrl && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 mt-2">
                    <img
                      src={getImageUrl(userForm.imageUrl)}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={e => { 
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = createDataUrlPlaceholder('No Image', 80, 80);
                      }}
                    />
                  </div>
                )}
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

      {/* Product Modal - always mounted, content changes by mode */}
      <Modal
        isOpen={productModalMode !== 'none'}
        onClose={handleProductFormCancel}
        title={
          productModalMode === 'add' ? 'Add Product' :
          productModalMode === 'edit' ? 'Edit Product' :
          productModalMode === 'delete' ? 'Delete Product' : ''
        }
        size="lg"
      >
        {productModalMode === 'delete' ? (
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
                onClick={handleProductFormCancel}
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
        ) : productModalMode === 'add' || productModalMode === 'edit' ? (
          <ProductForm
            initialProduct={productModalMode === 'edit' && selectedProduct ? {
              name: selectedProduct.name,
              description: selectedProduct.description || '',
              price: selectedProduct.price?.toString() || '',
              category: selectedProduct.category || '',
              image: selectedProduct.image || '',
              stock: selectedProduct.stock || 0
            } : {
              name: '',
              description: '',
              price: '',
              category: '',
              image: '',
              stock: 0
            }}
            onSubmit={async (formData) => {
              try {
                const token = localStorage.getItem('token');
                const productData = {
                  ...formData,
                  price: parseFloat(formData.price),
                  stock: formData.stock || 0
                };
                let response;
                if (productModalMode === 'add') {
                  response = await fetch(`${API_BASE_URL}/api/products/admin/add`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                  });
                } else if (productModalMode === 'edit' && selectedProduct) {
                  response = await fetch(`${API_BASE_URL}/api/products/admin/edit/${selectedProduct.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                  });
                }
                if (response && response.ok) {
                  showToast(`Product ${productModalMode} successful`, 'success');
                  fetchData();
                  handleProductFormCancel();
                } else {
                  const error = response ? await response.json() : {};
                  showToast(error.message || `Failed to ${productModalMode} product`, 'error');
                }
              } catch (error) {
                showToast(`Error ${productModalMode} product`, 'error');
              }
            }}
            onCancel={handleProductFormCancel}
            actionType={productModalMode}
            categories={categories}
          />
        ) : null}
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

      {/* Order Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`${actionType === 'update-status' ? 'Update Order Status' : 'Cancel Order'}`}
      >
        {actionType === 'cancel' ? (
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 mb-4">
                Are you sure you want to cancel order <strong>#{selectedOrder?.orderNumber}</strong>?
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOrderSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </label>
              <div className="space-y-4">
                <select
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({...orderForm, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                {!autoModeEnabled && selectedOrder && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaClock className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Manual Mode Active
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            Minimum waiting times still apply:
                          </p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Pending → Processing: {orderConfig?.pendingToProcessingSeconds || 30} seconds</li>
                            <li>Processing → Shipped: {orderConfig?.processingToShippedSeconds || 60} seconds</li>
                            <li>Shipped → Delivered: {orderConfig?.shippedToDeliveredSeconds || 90} seconds</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <FaSave className="w-4 h-4 mr-2" />
                Update Status
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderDetailsModal}
        onClose={() => setShowOrderDetailsModal(false)}
        title={`Order Details - #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-8">
            {/* Order Header with Gradient Background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Order #{selectedOrder.orderNumber}</h2>
                    <p className="text-blue-100 text-sm">
                      {(() => {
                        try {
                          if (selectedOrder.orderDate) {
                            return new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          } else if (selectedOrder.createdAt) {
                            return new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          }
                          return 'Date not available';
                        } catch (error) {
                          return 'Invalid Date';
                        }
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-1">
                      ${(() => {
                        try {
                          if (selectedOrder.totalAmount !== null && selectedOrder.totalAmount !== undefined) {
                            return parseFloat(selectedOrder.totalAmount).toFixed(2);
                          }
                          return '0.00';
                        } catch (error) {
                          return '0.00';
                        }
                      })()}
                    </div>
                    <p className="text-blue-100 text-sm">Total Amount</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
                    selectedOrder.status === 'PENDING' 
                      ? 'bg-yellow-400 text-yellow-900'
                      : selectedOrder.status === 'PROCESSING'
                      ? 'bg-blue-400 text-blue-900'
                      : selectedOrder.status === 'SHIPPED'
                      ? 'bg-purple-400 text-purple-900'
                      : selectedOrder.status === 'DELIVERED'
                      ? 'bg-green-400 text-green-900'
                      : 'bg-red-400 text-red-900'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedOrder.status === 'PENDING' 
                        ? 'bg-yellow-700'
                        : selectedOrder.status === 'PROCESSING'
                        ? 'bg-blue-700'
                        : selectedOrder.status === 'SHIPPED'
                        ? 'bg-purple-700'
                        : selectedOrder.status === 'DELIVERED'
                        ? 'bg-green-700'
                        : 'bg-red-700'
                    }`}></div>
                    {selectedOrder.status}
                  </span>
                  <div className="text-blue-100 text-sm">
                    {(() => {
                      const items = selectedOrder.items || selectedOrder.orderItems || [];
                      return `${items.length} item${items.length !== 1 ? 's' : ''}`;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Customer Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden border border-gray-300 dark:border-gray-700">
                        {selectedOrder.user?.imageUrl ? (
                          <img
                            src={getImageUrl(selectedOrder.user.imageUrl)}
                            alt={selectedOrder.user?.firstName + ' ' + selectedOrder.user?.lastName}
                            className="w-12 h-12 object-cover"
                            onError={e => { e.target.src = getPlaceholderUrl(); }}
                          />
                        ) : (
                          <span>{selectedOrder.user?.firstName?.charAt(0)}{selectedOrder.user?.lastName?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 truncate">{selectedOrder.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Shipping Address
                      </h5>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  Order Items ({(() => {
                    const items = selectedOrder.items || selectedOrder.orderItems || [];
                    return items.length;
                  })()})
                </h3>
              </div>
              <div className="p-6">
                {(() => {
                  const items = selectedOrder.items || selectedOrder.orderItems || [];
                  if (items.length === 0) {
                    return (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaBox className="w-8 h-8 opacity-50" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">No items found</h4>
                        <p className="text-sm">This order doesn't contain any items</p>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 relative">
                              <img
                                src={item.productImage || 'https://via.placeholder.com/80x80?text=No+Image'}
                                alt={item.productName}
                                className="w-20 h-20 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                              />
                              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {item.quantity || 0}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.productName || 'Unknown Product'}
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Product ID: <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">{item.productId || 'N/A'}</span>
                              </p>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ${(() => {
                                      try {
                                        if (item.price !== null && item.price !== undefined) {
                                          return parseFloat(item.price).toFixed(2);
                                        }
                                        return '0.00';
                                      } catch (error) {
                                        return '0.00';
                                      }
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Quantity:</span>
                                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {item.quantity || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                  ${(() => {
                                    try {
                                      const price = parseFloat(item.price || 0);
                                      const quantity = parseInt(item.quantity || 0);
                                      return (price * quantity).toFixed(2);
                                    } catch (error) {
                                      return '0.00';
                                    }
                                  })()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Order Summary */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Order Total</span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${(() => {
                              try {
                                if (selectedOrder.totalAmount !== null && selectedOrder.totalAmount !== undefined) {
                                  return parseFloat(selectedOrder.totalAmount).toFixed(2);
                                }
                                return '0.00';
                              } catch (error) {
                                return '0.00';
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-6">
              <button
                onClick={() => setShowOrderDetailsModal(false)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Close Order Details
              </button>
            </div>
          </div>
        )}
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