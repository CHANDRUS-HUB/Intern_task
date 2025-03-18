import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { baseurl } from '../URL/url';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
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
        const trimmedValue = value.trim();
    
        // Regex for name validation (only alphabets, max 10 characters)
        const nameRegex = /^[A-Za-z\s]{1,10}$/;
    
        // Regex for email validation (standard email format)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (name === 'name') {
            if (!nameRegex.test(trimmedValue)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'Name must be alphabetic and max 10 characters.'
                }));
                return;
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: ''
                }));
            }
        }
     
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: trimmedValue
        }));
    };
        
    
    

    const evaluatePasswordStrength = (password) => {
        if (password.length < 6) return 'weak';
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) return 'medium';
        if (password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'strong';
        
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
        setLoading(true); 
        try {
            const response = await axios.post(`${baseurl}/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            }, { withCredentials: true });

            toast.success(response.data.message);
           
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
          
        } catch (error) {
            if (error?.response?.data?.errors) {
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

            setLoading(false )
        }
    };

    const getStrengthColor = () => {
        const strengthColors = {
            weak: 'text-red-500',
            normal: 'text-orange-500',
            medium: 'text-yellow-500',
            strong: 'text-green-500'
        };
        return strengthColors[passwordStrength] || '';
    };
    
    const ErrorMessage = ({ message }) => (
        <p className="text-red-500 text-sm">{message}</p>
    );
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f9f3f8] p-4">
            <div className="bg-white shadow-lg rounded-lg flex flex-col-reverse md:flex-row w-full max-w-4xl">
                
                {/* Left Side - Sign In Form */}
                <div className="md:w-1/2 flex flex-col justify-center p-8">
                    <h2 className="text-2xl font-bold text-purple-700 mb-4">Sign Up</h2>
                    
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <label className="text-sm font-semibold">Name</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Enter your name" 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                      {errors.name && <ErrorMessage message={errors.name} />}

                        
                        <label className="text-sm font-semibold">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="user@email.com" 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                         {errors.email && <ErrorMessage message={errors.email} />}

                        
                        <label className="text-sm font-semibold">Password</label>
                        <div className="relative">
                            <input 
                                placeholder="Password" 
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type={passwordVisible ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPasswordStrength(evaluatePasswordStrength(e.target.value));
                                }}
                            />
                            <span className="absolute right-3 top-3 cursor-pointer" onClick={togglePasswordVisibility}
                               aria-label={passwordVisible ? 'Hide password' : 'Show password'}>
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <ErrorMessage message={errors.password} />}
                        <p className={`text-sm ${getStrengthColor()}`}>{passwordStrength}</p>
                        
                        <label className="text-sm font-semibold">Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Confirm Password" 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}

                        <div className="flex justify-center">
                            <button 
                                className={`bg-purple-700 mt-4 mb-1 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition transition-transform transform hover:scale-105
                                    ${passwordStrength === 'weak' ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-blue-800'}
                                `}
                                disabled={passwordStrength === 'weak'||loading}
                            >
                             {loading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side - Welcome Section */}
                <div className="md:w-1/2 bg-purple-600 text-white flex flex-col items-center justify-start md:justify-center rounded-t-lg md:rounded-r-lg md:rounded-bl-none p-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome</h1>
                    <p className="text-center text-sm font-mono mb-6">
                        Sign in to Access Your Account And Manage Your Products.
                    </p>
                    <button
                        onClick={() => navigate("/signIn")}
                        className="bg-white text-purple-700 py-2 px-6 rounded-full font-medium hover:bg-gray-200 transition transition-transform transform hover:scale-105"
                    >
                        Sign In
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default SignUp;
