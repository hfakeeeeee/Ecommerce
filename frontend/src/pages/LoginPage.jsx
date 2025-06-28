import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { login, resetPassword } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isResetMode) {
            const result = await resetPassword(formData.email);
            if (result.success) {
                setResetSuccess(true);
            } else {
                setError(result.error);
            }
            return;
        }

        const result = await login(formData.email, formData.password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isResetMode ? 'Reset Password' : 'Welcome Back'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isResetMode ? 'Enter your email to reset password' : "Don't have an account?"}
                        {!isResetMode && (
                            <Link to="/register" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up now
                            </Link>
                        )}
                    </p>
                </div>

                {resetSuccess ? (
                    <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-green-800">
                            Password reset instructions have been sent to your email.
                        </p>
                        <button
                            onClick={() => {
                                setIsResetMode(false);
                                setResetSuccess(false);
                            }}
                            className="mt-4 text-sm font-medium text-green-600 hover:text-green-500"
                        >
                            Return to login
                        </button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {!isResetMode && (
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsResetMode(!isResetMode);
                                        setError('');
                                    }}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {isResetMode ? 'Back to login' : 'Forgot your password?'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isResetMode ? 'Send Reset Instructions' : 'Sign in'}
                            </motion.button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
} 