import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import Toast from '../components/Toast';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
function CheckoutForm({ shippingInfo, setLoading, showToast, clearCart, navigate, token, isDark, shippingFee, getCartTotalWithShipping, validateShippingInfo }) {
    const stripe = useStripe();
    const elements = useElements();
    const { items, getCartTotal } = useCart();
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
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: getCartTotalWithShipping() * 100, // Convert to cents
                    currency: 'usd',
                    shipping: shippingInfo,
                    items: items.map(item => ({
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
                clearCart();
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
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Card Information</h2>
                <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    <CardElement options={getCardStyle(isDark)} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaLock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Secure Payment</span>
                </div>
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        `Pay $${getCartTotalWithShipping().toFixed(2)}`
                    )}
                </button>
            </div>
        </form>
    );
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const { items, getCartTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/payment' } });
            return;
        }
    }, [token, navigate]);

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
        // State: required, min 2 chars, only letters, spaces, hyphens, apostrophes
        if (!shippingInfo.state.trim() || shippingInfo.state.trim().length < 2 || !/^[a-zA-Z\s\-']+$/.test(shippingInfo.state.trim())) {
            showToast('Please enter a valid state (letters, spaces, hyphens, apostrophes only)', 'error');
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
    const getCartTotalWithShipping = () => getCartTotal() + shippingFee;

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={() => setToast(prev => ({ ...prev, visible: false }))}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Complete your purchase securely</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex items-center space-x-4">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-base font-medium text-gray-900 dark:text-white">Subtotal</span>
                                        <span className="text-base font-medium text-gray-900 dark:text-white">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-base font-medium text-gray-900 dark:text-white">Shipping</span>
                                        <span className="text-base font-medium text-gray-900 dark:text-white">{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">${getCartTotalWithShipping().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            {/* Shipping Information */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingInfo.firstName}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingInfo.lastName}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingInfo.email}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingInfo.state}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={shippingInfo.country}
                                            onChange={handleShippingInfoChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            {countryOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label} ({option.value})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Stripe Elements */}
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    shippingInfo={shippingInfo}
                                    setLoading={setLoading}
                                    showToast={showToast}
                                    clearCart={clearCart}
                                    navigate={navigate}
                                    token={token}
                                    isDark={isDark}
                                    shippingFee={shippingFee}
                                    getCartTotalWithShipping={getCartTotalWithShipping}
                                    validateShippingInfo={validateShippingInfo}
                                />
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 