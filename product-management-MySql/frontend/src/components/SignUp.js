import React, { useState } from 'react';
import axios from 'axios';
import { baseurl } from '../URL/url';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        validateField(name, value);
    };

    const evaluatePasswordStrength = (password) => {
        if (password.length < 6) return 'weak';
        if (!/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'normal';
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) return 'medium';
        return 'strong';
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Name is required';
                else if (!/^[a-zA-Z\s]*$/.test(value)) error = 'Only alphabets are allowed';
                break;

            case 'email':
                if (!value.trim()) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
                break;

            case 'password':
                if (!value) {
                    error = 'Password is required';
                    setPasswordStrength('');
                } else {
                    const strength = evaluatePasswordStrength(value);
                    setPasswordStrength(strength);

                    switch (strength) {
                        case 'weak':
                            error = 'Weak: Must be at least 6 characters';
                            break;
                        case 'normal':
                            error = 'Normal: Add a number & special character';
                            break;
                        case 'medium':
                            error = 'Medium: Add both uppercase & lowercase';
                            break;
                        case 'strong':
                            error = 'Strong: Good password!';
                            break;
                        default:
                            break;
                    }
                }
                break;

            case 'confirmPassword':
                if (!value) error = 'Confirm Password is required';
                else if (value !== formData.password) error = 'Passwords do not match';
                break;

            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        Object.keys(formData).forEach((key) => {
            validateField(key, formData[key]);
        });

        Object.keys(formData).forEach((key) => {
            if (!formData[key].trim()) {
                formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        if (passwordStrength === 'weak') {
            toast.error('Please enter a stronger password!');
            return;
        }

        try {
            const response = await axios.post(`${baseurl}/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            }, { withCredentials: true });

            toast.success(response.data.message);
           
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setLoading(true);
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
          
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const serverErrors = error.response.data.errors;
                let formErrors = {};
                serverErrors.forEach(err => {
                    formErrors[err.param] = err.msg;
                });
                setErrors(formErrors);
            } else {
                console.error('Signup Error:', error.response ? error.response.data : error.message);
                setErrors({general:error.response?.data?.message || 'Server error'});
            }
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'weak': return 'text-red-500';
            case 'normal': return 'text-orange-500';
            case 'medium': return 'text-yellow-500';
            case 'strong': return 'text-green-500';
            default: return 'text-red-500';
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-40">
                    <div className="loader"></div>
                </div>
            )}
            <div className="flex justify-center items-center bg-gray-100 h-screen bg-cover bg-center" style={{ backgroundImage: "url('./signup.jpg')" }}>
                <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
                    <div className="text-center mb-6">
                        <img
                            src="./ProductManagementIcon.icon"
                            className="h-14 pb-2 inline"
                            alt="ProductManagement Logo"
                        />
                        <h1 className="text-2xl font-bold text-blue-700">Product Management</h1>
                    </div>
                    <h2 className="text-lg font-semibold mb-6 text-center text-gray-700">Create Your Account</h2>
                    {errors.general && <p className="text-center text-red-600 mb-4">{errors.general}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <p className={`text-sm ${getStrengthColor()}`}>{errors.password}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-2 rounded-lg font-semibold text-white transition duration-200
                            ${passwordStrength === 'weak' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}
                        `}
                        disabled={passwordStrength === 'weak'}
                    >
                        Sign Up
                    </button>

                    <p className="text-center mt-4 text-gray-600">
                        Already have an account? <a href="/signin" className="text-blue-700 font-semibold">Log in</a>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </>
    );
};

export default Signup;
