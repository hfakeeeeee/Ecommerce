import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaBox, FaTruck, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
            const response = await fetch('/api/orders', {
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
            yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
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
            const response = await fetch(`/api/orders/${selectedOrderNumber}/cancel`, {
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

    // Cancel Dialog Component
    const CancelDialog = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Cancel Order
                </h3>
                <div className="space-y-3">
                    {CANCELLATION_REASONS.map((reason) => (
                        <div
                            key={reason.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                cancelReason === reason.id
                                    ? 'bg-red-100 dark:bg-red-900 border-2 border-red-500'
                                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setCancelReason(reason.id)}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-4 h-4 rounded-full border-2 ${
                                        cancelReason === reason.id
                                            ? 'border-red-500 bg-red-500'
                                            : 'border-gray-400'
                                    }`}>
                                        {cancelReason === reason.id && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                        {reason.label}
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => {
                            setShowCancelDialog(false);
                            setCancelReason('');
                            setSelectedOrderNumber(null);
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleCancelOrder}
                        disabled={!cancelReason}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/catalog')}
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            {showCancelDialog && <CancelDialog />}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order History</h1>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                    >
                        Continue Shopping
                    </button>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
                    <AnimatePresence>
                        {orders.map((order, index) => {
                            const { Icon, className } = getStatusDetails(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Order #{order.orderNumber}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {formatDate(order.orderDate)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${className}`}>
                                                    <Icon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => openCancelDialog(order.orderNumber)}
                                                        className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm font-medium"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, itemIndex) => (
                                                <motion.div
                                                    key={itemIndex}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                                                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                                                >
                                                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {item.productName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Total Amount
                                                </span>
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    ${order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                    Shipping Address
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
} 