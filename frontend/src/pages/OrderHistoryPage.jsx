import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaBox, FaTruck, FaCheck, FaClock, FaExclamationTriangle, FaShoppingBag, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const ORDER_STATES = {
    PENDING: { next: 'PROCESSING', color: 'yellow', icon: FaClock },
    PROCESSING: { next: 'SHIPPED', color: 'blue', icon: FaBox },
    SHIPPED: { next: 'DELIVERED', color: 'green', icon: FaTruck },
    DELIVERED: { next: null, color: 'green', icon: FaCheck },
    CANCELLED: { next: null, color: 'red', icon: FaExclamationTriangle }
};

const CANCELLATION_REASONS = [
    { id: 'changed_mind', label: 'Changed my mind' },
    { id: 'wrong_item', label: 'Ordered wrong item' },
    { id: 'better_price', label: 'Found better price elsewhere' },
    { id: 'shipping_time', label: 'Shipping time too long' },
    { id: 'payment_issue', label: 'Payment issues' },
    { id: 'other', label: 'Other reason' }
];

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // Refresh orders periodically to get updated status from backend automation
    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                fetchOrders();
            }
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, [token]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusDetails = (status) => {
        const statusKey = status.toUpperCase();
        const StatusIcon = ORDER_STATES[statusKey]?.icon || FaBox;
        const color = ORDER_STATES[statusKey]?.color || 'gray';
        
        const colorClasses = {
            yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
            blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
            green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
            red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
            gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800'
        };

        return {
            Icon: StatusIcon,
            className: colorClasses[color]
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${selectedOrderNumber}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            const cancelledOrder = await response.json();
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderNumber === selectedOrderNumber ? cancelledOrder : order
                )
            );
            setShowCancelDialog(false);
            setCancelReason('');
            setSelectedOrderNumber(null);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const openCancelDialog = (orderNumber) => {
        setSelectedOrderNumber(orderNumber);
        setShowCancelDialog(true);
    };

    // Enhanced Cancel Dialog Component
    const CancelDialog = () => (
        <AnimatePresence>
            {showCancelDialog && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setShowCancelDialog(false);
                        setCancelReason('');
                        setSelectedOrderNumber(null);
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Cancel Order
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Please select a reason for cancellation
                            </p>
                        </div>
                        
                        <div className="space-y-3 mb-8">
                            {CANCELLATION_REASONS.map((reason) => (
                                <motion.div
                                    key={reason.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                                        cancelReason === reason.id
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-lg'
                                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
                                    }`}
                                    onClick={() => setCancelReason(reason.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                                            cancelReason === reason.id
                                                ? 'border-red-500 bg-red-500'
                                                : 'border-gray-400'
                                        }`}>
                                            {cancelReason === reason.id && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                            {reason.label}
                                        </label>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowCancelDialog(false);
                                    setCancelReason('');
                                    setSelectedOrderNumber(null);
                                }}
                                className="flex-1 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={!cancelReason}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-12 border border-red-200 dark:border-red-800">
                        <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Orders</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-16 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FaShoppingBag className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">No Orders Yet</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
                            You haven't placed any orders yet. Start shopping to see your order history here.
                        </p>
                        <motion.button
                            onClick={() => navigate('/catalog')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <FaShoppingBag />
                            Start Shopping
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
            <CancelDialog />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 mb-6">
                        <FaShoppingBag className="w-12 h-12 text-blue-600" />
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400">
                            Order History
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Track your orders and view your purchase history
                    </p>
                </motion.div>

                {/* Orders Grid */}
                <div className="space-y-8">
                    <AnimatePresence>
                        {orders.map((order, index) => {
                            const { Icon, className } = getStatusDetails(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                    <FaBox className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        Order #{order.orderNumber}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                                                        <FaCalendarAlt className="w-4 h-4" />
                                                        <span>{formatDate(order.orderDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${className}`}>
                                                    <Icon className="w-4 h-4" />
                                                    <span className="font-semibold">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {order.status === 'PENDING' && (
                                                    <motion.button
                                                        onClick={() => openCancelDialog(order.orderNumber)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 font-semibold border border-red-200 dark:border-red-800"
                                                    >
                                                        Cancel Order
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-6">
                                        {/* Order Items */}
                                        <div className="space-y-4 mb-8">
                                            {order.items.map((item, itemIndex) => (
                                                <motion.div
                                                    key={itemIndex}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                                                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                                >
                                                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-xl shadow-md">
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                            {item.productName}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            Quantity: <span className="font-semibold">{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            ${item.price.toFixed(2)} each
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Total Amount */}
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-700 dark:text-green-300 font-semibold mb-1">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                                                            ${order.totalAmount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                                        <FaCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <FaMapMarkerAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                                                            Shipping Address
                                                        </h4>
                                                        <p className="text-blue-800 dark:text-blue-200 whitespace-pre-line leading-relaxed">
                                                            {order.shippingAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Continue Shopping Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mt-16"
                >
                    <motion.button
                        onClick={() => navigate('/catalog')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <FaShoppingBag />
                        Continue Shopping
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}