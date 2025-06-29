import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaSpinner, FaCheck, FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaEdit, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfilePage() {
    const { user, updateProfile, updatePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const data = await response.json();
            updateProfile({ ...user, imageUrl: data.imageUrl });
            setMessage({ text: 'Profile picture updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ text: error.message || 'Failed to upload image', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isChangingPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setMessage({ text: 'Passwords do not match', type: 'error' });
                    return;
                }
                await updatePassword(formData.currentPassword, formData.newPassword);
                setMessage({ text: 'Password updated successfully!', type: 'success' });
                setIsChangingPassword(false);
            } else {
                await updateProfile({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                });
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setIsEditing(false);
            }
        } catch (error) {
            setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-700"
                                >
                                    {user?.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = ''; // Clear the source
                                                // Show the default user icon instead
                                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500"><svg class="text-white w-16 h-16" ... /></div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                                            <FaUserCircle className="text-white w-16 h-16" />
                                        </div>
                                    )}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                                    disabled={loading}
                                >
                                    <FaCamera size={16} />
                                </motion.button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-6 px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                    {user?.email}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                            >
                                <FaEdit className="w-4 h-4" />
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Message Toast */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-lg shadow-md ${
                                message.type === 'success' 
                                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                        >
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <FaCheck className="w-5 h-5 mr-2" />
                                ) : (
                                    <FaTimes className="w-5 h-5 mr-2" />
                                )}
                                {message.text}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isChangingPassword ? (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pr-10"
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center pt-6">
                            {!isChangingPassword ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <FaLock className="w-4 h-4 mr-2" />
                                        Change Password
                                    </motion.button>
                                    {isEditing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <FaSpinner className="animate-spin w-5 h-5 mr-2" />
                                            ) : (
                                                <FaCheck className="w-5 h-5 mr-2" />
                                            )}
                                            Save Changes
                                        </motion.button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setFormData(prev => ({
                                                ...prev,
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            }));
                                        }}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <FaSpinner className="animate-spin w-5 h-5 mr-2" />
                                        ) : (
                                            <FaCheck className="w-5 h-5 mr-2" />
                                        )}
                                        Update Password
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
} 