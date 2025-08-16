'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cartItems: items, clearCart } = useCart();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    deliveryType: 'normal'
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    paymentMethod: 'card', // 'card' or 'paypal'
    giftCard: ''
  });

  const [giftCardData, setGiftCardData] = useState({
    code: '',
    balance: 0,
    appliedAmount: 0,
    isApplied: false,
    error: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate totals with gift card
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return acc + (price * quantity);
  }, 0);
  
  const giftCardDiscount = giftCardData.appliedAmount || 0;
  const discountedSubtotal = Math.max(0, subtotal - giftCardDiscount);
  const salesTax = discountedSubtotal * 0.13;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = discountedSubtotal + salesTax + shipping;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    const newShippingData = { ...shippingData, [name]: value };
    setShippingData(newShippingData);
    
    // Auto-progress to payment tab when shipping is complete
    if (validateShippingData(newShippingData)) {
      setTimeout(() => setActiveTab('payment'), 500);
    }
  };

  const validateShippingData = (data = shippingData) => {
    const required = ['firstName', 'lastName', 'address', 'zipCode', 'city', 'province', 'phone', 'email'];
    return required.every(field => data[field].trim() !== '');
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (type) => {
    setShippingData(prev => ({ ...prev, deliveryType: type }));
  };

  const handleGiftCardValidation = async () => {
    if (!paymentData.giftCard.trim()) {
      setGiftCardData(prev => ({ ...prev, error: 'Please enter a gift card code' }));
      return;
    }

    try {
      const response = await fetch(`/api/gift-cards?code=${paymentData.giftCard.trim()}`);
      const data = await response.json();

      if (data.success) {
        const maxApplicable = Math.min(data.giftCard.balance, total);
        setGiftCardData({
          code: data.giftCard.code,
          balance: data.giftCard.balance,
          appliedAmount: maxApplicable,
          isApplied: true,
          error: ''
        });
        setPaymentData(prev => ({ ...prev, giftCard: '' }));
      } else {
        setGiftCardData(prev => ({ 
          ...prev, 
          error: data.error || 'Invalid gift card code',
          isApplied: false 
        }));
      }
    } catch (error) {
      setGiftCardData(prev => ({ 
        ...prev, 
        error: 'Failed to validate gift card. Please try again.',
        isApplied: false 
      }));
    }
  };

  const handleRemoveGiftCard = () => {
    setGiftCardData({
      code: '',
      balance: 0,
      appliedAmount: 0,
      isApplied: false,
      error: ''
    });
  };

  const validateShipping = () => {
    return validateShippingData();
  };

  const validatePayment = () => {
    if (paymentData.paymentMethod === 'paypal') {
      return true; // PayPal validation handled externally
    }
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    return required.every(field => paymentData[field].trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateShipping()) {
      alert('Please fill in all shipping information');
      setActiveTab('shipping');
      return;
    }

    if (!validatePayment()) {
      alert('Please fill in all payment information');
      setActiveTab('payment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        shipping: shippingData,
        payment: {
          method: paymentData.paymentMethod,
          giftCardCode: giftCardData.isApplied ? giftCardData.code : null,
          giftCardAmount: giftCardData.appliedAmount
        },
        items: items.map(item => ({
          productId: item.product?.id || item.id,
          name: item.product?.name || item.name,
          price: item.product?.price || item.price,
          quantity: item.quantity,
          color: item.selectedColor || item.color,
          size: item.selectedSize || item.size,
          image: item.product?.image || item.image
        })),
        totals: {
          subtotal,
          giftCardDiscount,
          salesTax,
          shipping,
          total: total + (shippingData.deliveryType === 'expedited' ? 10 : 0)
        }
      };

      // Save order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        clearCart();
        setShowConfirmation(true);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container max-w-[1324px] mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#56193F] text-white px-6 py-3 rounded-lg hover:bg-[#56193F]-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout type="nobottom">
      <div className="mt-33 text-black py-4">
        <div className="container max-w-[1440px] mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Checkout</h1>
          <button 
            onClick={() => router.push('/cart')}
            className="text-black hover:text-gray-300"
          >
            ← Back to Cart
          </button>
        </div>
      </div>

      <div className="container max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'shipping' 
                    ? 'border-[#56193F] text-[#56193F]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ml-8 ${
                  activeTab === 'payment' 
                    ? 'border-[#56193F] text-[#56193F]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Payment
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                      placeholder="Street Address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="City"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province / State
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={shippingData.province}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="Province/State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F]-500"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Delivery Options</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="delivery"
                          checked={shippingData.deliveryType === 'normal'}
                          onChange={() => handleDeliveryChange('normal')}
                          className="mr-3"
                        />
                        <span>Normal Delivery (5-7 business days)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="delivery"
                          checked={shippingData.deliveryType === 'expedited'}
                          onChange={() => handleDeliveryChange('expedited')}
                          className="mr-3"
                        />
                        <span>Expedited Delivery (2-3 business days) - Additional $10</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-center mb-6 text-[#56193F]">Make Payment</h3>
                    
                    {/* Payment Method Selection */}
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VISA</span>
                        </div>
                        <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PayPal</span>
                      </div>
                      <div className="w-16 h-8 bg-black rounded flex items-center justify-center">
                        <span className="text-white text-xs">Gift Card</span>
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] bg-white"
                        placeholder=""
                        maxLength="19"
                        required={paymentData.paymentMethod === 'card'}
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] bg-white"
                          placeholder=""
                          maxLength="5"
                          required={paymentData.paymentMethod === 'card'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                          CV Code
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] bg-white"
                          placeholder=""
                          maxLength="4"
                          required={paymentData.paymentMethod === 'card'}
                        />
                      </div>
                    </div>

                    {/* Card Owner */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                        Card Owner
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] bg-white"
                        placeholder=""
                        required={paymentData.paymentMethod === 'card'}
                      />
                    </div>

                    {/* Gift Card Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                        Enter a Gift Card Voucher
                      </label>
                      
                      {/* Show applied gift card */}
                      {giftCardData.isApplied && (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-green-700 font-medium">{giftCardData.code}</span>
                              <p className="text-xs text-green-600">
                                Applied: ${giftCardData.appliedAmount.toFixed(2)} 
                                {giftCardData.balance > giftCardData.appliedAmount && 
                                  ` (Remaining: $${(giftCardData.balance - giftCardData.appliedAmount).toFixed(2)})`
                                }
                              </p>
                            </div>
                            <button 
                              type="button"
                              onClick={handleRemoveGiftCard}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {!giftCardData.isApplied && (
                        <div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="giftCard"
                              value={paymentData.giftCard}
                              onChange={handlePaymentChange}
                              className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56193F] bg-white"
                              placeholder="Enter gift card code"
                              onKeyPress={(e) => e.key === 'Enter' && handleGiftCardValidation()}
                            />
                            <button
                              type="button"
                              onClick={handleGiftCardValidation}
                              className="bg-[#56193F] text-white px-6 py-3 rounded-md hover:bg-[#3d1230] transition-colors uppercase text-sm font-medium"
                            >
                              Apply
                            </button>
                          </div>
                          {giftCardData.error && (
                            <p className="text-red-500 text-xs mt-1">{giftCardData.error}</p>
                          )}
                          
                          {/* Test gift cards hint */}
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Test codes: GIFT50, GIFT100, GIFT25</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Payment Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#56193F] text-white py-4 px-6 rounded-md font-medium hover:bg-[#3d1230] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Your Order</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center space-x-3">
                    <img
                      src={item.product?.image || item.image}
                      alt={item.product?.name || item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${((item.product?.price || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Sub total ({items.length} items):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Show gift card discount if applied */}
                {giftCardData.isApplied && giftCardData.appliedAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Gift Card ({giftCardData.code}):</span>
                    <span>-${giftCardData.appliedAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Sales Tax (13%):</span>
                  <span>${salesTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {shippingData.deliveryType === 'expedited' && (
                  <div className="flex justify-between">
                    <span>Expedited Delivery:</span>
                    <span>$10.00</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base border-t pt-3">
                  <span>Estimated Total:</span>
                  <span>${(total + (shippingData.deliveryType === 'expedited' ? 10 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-[#56193F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3d1230] transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
