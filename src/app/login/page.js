"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      router.push('/'); // Redirect to home page after successful login
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4">
      <div className="max-w-sm mx-auto w-full">
        {/* Logo */}
        {/* <div className="text-center mb-12">
          <h1 className="text-3xl font-bold" style={{fontFamily: 'serif', color: '#56193f'}}>GlarmourGlow Fashion</h1>
          <p className="text-xs text-gray-400 mt-1">GLAMORE</p>
        </div> */}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-center text-2xl font-bold text-gray-900 ">Login</h2>
          <p className="text-center text-sm text-gray-600 mb-8">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-8">
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
                style={{'--tw-ring-color': '#56193f'}}
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
                className={`w-full px-0 py-3 border-1 border-b px-4 rounded-md  border-gray-400 bg-transparent text-sm focus:outline-none placeholder-gray-400 pr-10 ${
                  errors.password ? 'border-red-300' : ''
                }`}
                style={{'--tw-ring-color': '#56193f'}}
                onFocus={(e) => e.target.style.borderColor = '#56193f'}
                onBlur={(e) => e.target.style.borderColor = '#9ca3af'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
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
            <div>
           
        

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#56193f] focus:ring-[#56193f]"
                style={{accentColor: '#56193f'}}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <div >
            <p className="text-sm mt-3 text-gray-600">
              <Link href="/reset-password" className="font-medium text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </p>
           
          </div>
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
            {loading ? 'Signing In...' : 'Login'}
          </button>

          
        </form>
      </div>
    </div>
  );
}
