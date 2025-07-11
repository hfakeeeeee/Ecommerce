import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, [token]);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    imageUrl: data.imageUrl || null,
                    role: data.role
                });
            } else {
                // If token is invalid, clear everything
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            const newToken = data.token;
            
            localStorage.setItem('token', newToken);
            setToken(newToken);
            
            // Set user data directly from login response
            setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                imageUrl: data.imageUrl || null,
                role: data.role
            });
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Profile update failed');
            }

            setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                imageUrl: data.imageUrl
            });

            return { success: true };
        } catch (error) {
            console.error('Profile update failed:', error);
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password update failed');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If the response is not JSON, create a default error message
                data = { message: 'Invalid server response' };
            }

            if (!response.ok) {
                return { 
                    success: false, 
                    error: data.message || `Password reset failed (${response.status})` 
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Password reset request failed:', error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token,
            loading,
            login,
            logout,
            register,
            updateProfile,
            updatePassword,
            resetPassword,
            isAuthenticated: !!user && !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}