import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { FaSpinner, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1); // 1: Email form, 2: Reset form
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    const passwordRules = [
        { label: "At least 8 characters long", test: (pass) => pass.length >= 8 },
        { label: "Contains uppercase letter", test: (pass) => /[A-Z]/.test(pass) },
        { label: "Contains lowercase letter", test: (pass) => /[a-z]/.test(pass) },
        { label: "Contains number", test: (pass) => /[0-9]/.test(pass) },
        { label: "Contains special character (!@#$%^&*)", test: (pass) => /[!@#$%^&*]/.test(pass) }
    ];

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            setStep(2);
        }
    }, [searchParams]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Show immediate feedback
        showToast('Password reset instructions will be sent to your email within 1-2 minutes. Please check your inbox and spam folder.', 'success');
        
        // Start the reset process in the background
        resetPassword(email).catch(error => {
            console.error('Failed to send reset email:', error);
        });

        // Navigate to login after a short delay
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    const isPasswordValid = (password) => {
        return passwordRules.every(rule => rule.test(password));
    };

    const handleCompleteReset = async (e) => {
        e.preventDefault();
        
        if (!isPasswordValid(newPassword)) {
            showToast('Please meet all password requirements', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/complete-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Password reset successful. You can now login.', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showToast(data.message || 'Failed to reset password', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Reset your password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {step === 1 ? (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                                            Sending Instructions...
                                        </>
                                    ) : (
                                        "Send Reset Instructions"
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleCompleteReset} className="space-y-6">
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reset Token
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="token"
                                        name="token"
                                        type="text"
                                        required
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        disabled={isLoading}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {passwordRules.map((rule, index) => (
                                        <div key={index} className="flex items-center text-sm">
                                            {rule.test(newPassword) ? (
                                                <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                                            ) : (
                                                <FaTimes className="h-4 w-4 text-red-500 mr-2" />
                                            )}
                                            <span className={`${rule.test(newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !isPasswordValid(newPassword)}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
} 