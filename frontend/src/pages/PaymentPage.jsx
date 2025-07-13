import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaSpinner, FaCheck, FaTimes, FaShippingFast, FaUser, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import Toast from '../components/Toast';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51RfHKTDGjgknPqtPnU07aiEbHLA0Awz1VZVu8qRTahPr8usnGluqQMCqPkxbFeG4j6ROaCHBTQWUW7apnPRrawci00mMDyyuuP');

// Stripe Card Element styles
const getCardStyle = (isDark) => ({
    style: {
        base: {
            color: isDark ? '#f3f4f6' : '#32325d',
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: isDark ? '#d1d5db' : '#32325d',
            },
            backgroundColor: isDark ? '#374151' : '#fff',
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
});

// Checkout form component that uses Stripe
function CheckoutForm({ shippingInfo, setLoading, showToast, removeSelectedItems, navigate, token, isDark, shippingFee, getCartTotalWithShipping, validateShippingInfo, selectedItems }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!token) {
            showToast('Please log in to continue with payment', 'error');
            navigate('/login', { state: { from: '/payment' } });
        }
    }, [token, navigate, showToast]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements || isProcessing) {
            return;
        }

        if (!token) {
            showToast('Please log in to continue with payment', 'error');
            navigate('/login', { state: { from: '/payment' } });
            return;
        }

        // Validate shipping information before proceeding
        if (!validateShippingInfo()) {
            return;
        }

        setIsProcessing(true);
        setLoading(true);

        try {
            // Create payment intent on your server
            const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: getCartTotalWithShipping() * 100, // Convert to cents
                    currency: 'usd',
                    shipping: shippingInfo,
                    items: selectedItems.map(item => ({
                        id: item.productId,
                        name: item.productName,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.productImage
                    }))
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Payment failed');
            }

            const data = await response.json();

            // Confirm card payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                            email: shippingInfo.email,
                            address: {
                                line1: shippingInfo.address,
                                city: shippingInfo.city,
                                state: shippingInfo.state,
                                postal_code: shippingInfo.zipCode,
                                country: shippingInfo.country
                            }
                        }
                    }
                }
            );

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            if (paymentIntent.status === 'succeeded') {
                // Remove only the selected items from cart after successful payment
                const selectedProductIds = selectedItems.map(item => item.productId);
                await removeSelectedItems(selectedProductIds);
                // Clear session storage
                sessionStorage.removeItem('selectedCartItems');
                showToast('Payment successful! Thank you for your purchase.', 'success');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            showToast(error.message || 'Payment failed. Please try again.', 'error');
        } finally {
            setIsProcessing(false);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <FaCreditCard className="mr-3 text-indigo-600 dark:text-indigo-400" />
                    Payment Information
                </h2>
                <div className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 shadow-lg">
                    <CardElement options={getCardStyle(isDark)} />
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaLock className="w-5 h-5 mr-3 text-green-500" />
                    <span className="text-sm font-medium">Secure Payment with Stripe</span>
                </div>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {isProcessing ? (
                        <>
                            <FaSpinner className="animate-spin mr-3" />
                            Processing Payment...
                        </>
                    ) : (
                        <>
                            <FaCheck className="mr-3" />
                            Pay ${getCartTotalWithShipping().toFixed(2)}
                        </>
                    )}
                </button>
            </motion.div>
        </form>
    );
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const { items, getCartTotal, removeSelectedItems } = useCart();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [mounted, setMounted] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/payment' } });
            return;
        }
    }, [token, navigate]);

    // Load selected items from session storage
    useEffect(() => {
        const storedSelectedItems = sessionStorage.getItem('selectedCartItems');
        if (storedSelectedItems) {
            try {
                const parsedItems = JSON.parse(storedSelectedItems);
                setSelectedItems(parsedItems);
            } catch (error) {
                console.error('Error parsing selected cart items:', error);
                // Fallback to all cart items if parsing fails
                setSelectedItems(items);
            }
        } else {
            // If no selected items stored, use all cart items (fallback)
            setSelectedItems(items);
        }
    }, [items]);

    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'VN',
    });

    useEffect(() => {
        setMounted(true);
        if (user) {
            setShippingInfo(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
            }));
        }
        return () => setMounted(false);
    }, [user]);

    const showToast = (message, type = 'success') => {
        if (mounted) {
            setToast({ message, type, visible: true });
            setTimeout(() => {
                if (mounted) {
                    setToast(prev => ({ ...prev, visible: false }));
                }
            }, 3000);
        }
    };

    const handleShippingInfoChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateShippingInfo = () => {
        // Address: required, min 5 chars
        if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 5) {
            showToast('Please enter a valid address (at least 5 characters)', 'error');
            return false;
        }
        // City: required, min 2 chars, only letters, spaces, hyphens, apostrophes
        if (!shippingInfo.city.trim() || shippingInfo.city.trim().length < 2 || !/^[a-zA-Z\s\-']+$/.test(shippingInfo.city.trim())) {
            showToast('Please enter a valid city (letters, spaces, hyphens, apostrophes only)', 'error');
            return false;
        }
        // State: required, min 2 chars, letters, spaces, hyphens, apostrophes, and numbers
        if (!shippingInfo.state.trim() || shippingInfo.state.trim().length < 2 || !/^[a-zA-Z0-9\s\-']+$/.test(shippingInfo.state.trim())) {
            showToast('Please enter a valid state (letters, numbers, spaces, hyphens, apostrophes only)', 'error');
            return false;
        }
        // ZIP Code: required, format depends on country
        if (shippingInfo.zipCode.trim().length < 5) {
            showToast('Please enter a ZIP/Postal code', 'error');
            return false;
        }
        if (shippingInfo.country === 'US') {
            if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode.trim())) {
                showToast('Please enter a valid US ZIP code (12345 or 12345-6789)', 'error');
                return false;
            }
        } else {
            if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(shippingInfo.zipCode.trim())) {
                showToast('Please enter a valid postal code (3-10 alphanumeric characters)', 'error');
                return false;
            }
        }
        // All other fields (firstName, lastName, email) already checked for non-empty
        for (const [key, value] of Object.entries(shippingInfo)) {
            if (!value.trim() && !['address','city','state','zipCode'].includes(key)) {
                showToast(`Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }
        return true;
    };

    // Country dropdown options
    const countryOptions = [
        { label: 'Vietnam', value: 'VN' },
        { label: 'United States', value: 'US' },
        { label: 'Singapore', value: 'SG' },
        { label: 'Malaysia', value: 'MY' },
    ];

    // Shipping fee logic
    let shippingFee = 0;
    if (shippingInfo.country === 'US') shippingFee = 50.0;
    else if (shippingInfo.country === 'MY' || shippingInfo.country === 'SG') shippingFee = 20.0;
    else shippingFee = 0;

    // Calculate totals based on selected items
    const getSelectedItemsTotal = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartTotalWithShipping = () => getSelectedItemsTotal() + shippingFee;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Secure Checkout
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Complete your purchase with confidence
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <FaShippingFast className="mr-3 text-indigo-600 dark:text-indigo-400" />
                                Order Summary
                            </h2>
                            <div className="space-y-4">
                                {selectedItems.map((item) => (
                                    <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.productName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-base font-medium text-gray-900 dark:text-white">Subtotal</span>
                                        <span className="text-base font-medium text-gray-900 dark:text-white">${getSelectedItemsTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-base font-medium text-gray-900 dark:text-white">Shipping</span>
                                        <span className="text-base font-medium text-gray-900 dark:text-white">{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${getCartTotalWithShipping().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            {/* Shipping Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="mb-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <FaUser className="mr-3 text-indigo-600 dark:text-indigo-400" />
                                    Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingInfo.firstName}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingInfo.lastName}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingInfo.email}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State/Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingInfo.state}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ZIP/Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                            <FaGlobe className="mr-2 text-indigo-600 dark:text-indigo-400" />
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={shippingInfo.country}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            required
                                        >
                                            {countryOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stripe Elements */}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    shippingInfo={shippingInfo}
                                    setLoading={setLoading}
                                    showToast={showToast}
                                    removeSelectedItems={removeSelectedItems}
                                    navigate={navigate}
                                    token={token}
                                    isDark={isDark}
                                    shippingFee={shippingFee}
                                    getCartTotalWithShipping={getCartTotalWithShipping}
                                    validateShippingInfo={validateShippingInfo}
                                    selectedItems={selectedItems}
                                />
                            </Elements>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 