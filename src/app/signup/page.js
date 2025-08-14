"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import SuccessModal from '@/components/SuccessModal';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await signup(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );

    setLoading(false);

    if (result.success) {
      setShowSuccessModal(true);
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <>
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/');
        }}
        title="Success!"
        message="Your account has been created."
      />
      <div className="min-h-screen mt-20 bg-white flex flex-col justify-center py-12 px-4">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          {/* <div className="text-center mb-12">
            <h1 className="text-3xl font-bold" style={{fontFamily: 'serif', color: '#56193f'}}>GlarmourGlow Fashion</h1>
            <p className="text-xs text-gray-400 mt-1">GLAMORE</p>
          </div> */}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-center text-2xl font-medium text-gray-900 mb-2">Sign Up</h2>
            
            <div className="text-center mb-6">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Log in
              </Link>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="XXXXXXX"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 ${
                    errors.firstName ? 'border-red-300' : ''
                  }`}
                  onFocus={(e) => e.target.style.borderColor = '#56193f'}
                  onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="XXXXXXX"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 ${
                    errors.lastName ? 'border-red-300' : ''
                  }`}
                  onFocus={(e) => e.target.style.borderColor = '#56193f'}
                  onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="XXXXXXX"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  onFocus={(e) => e.target.style.borderColor = '#56193f'}
                  onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="XXXXXXX"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 pr-10 ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  onFocus={(e) => e.target.style.borderColor = '#56193f'}
                  onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-9 text-gray-400 hover:text-gray-600"
                >
{showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="XXXXXXX"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 pr-10 ${
                    errors.confirmPassword ? 'border-red-300' : ''
                  }`}
                  onFocus={(e) => e.target.style.borderColor = '#56193f'}
                  onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-9 text-gray-400 hover:text-gray-600"
                >
{showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 px-4 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{backgroundColor: '#56193f', borderColor: '#56193f'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3d1230'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#56193f'}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}