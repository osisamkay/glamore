"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
// Order Summary Component
const OrderSummary = ({ items }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Available promo codes
  const promoCodes = {
    'WELCOME10': { discount: 0.10, type: 'percentage', description: '10% off your order' },
    'SAVE20': { discount: 0.20, type: 'percentage', description: '20% off your order' },
    'FREESHIP': { discount: 5.99, type: 'shipping', description: 'Free shipping' },
    'NEWUSER': { discount: 15, type: 'fixed', description: '$15 off your order' },
    'STUDENT': { discount: 0.15, type: 'percentage', description: '15% student discount' }
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return acc + (price * quantity);
  }, 0);

  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    const promo = promoCodes[appliedPromo];
    if (promo.type === 'percentage') {
      discount = subtotal * promo.discount;
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.discount, subtotal); // Don't exceed subtotal
    } else if (promo.type === 'shipping') {
      discount = 0; // Handled separately for shipping
    }
  }

  const discountedSubtotal = subtotal - discount;
  const salesTax = discountedSubtotal * 0.13;
  const shipping = subtotal > 0 ? (appliedPromo && promoCodes[appliedPromo]?.type === 'shipping' ? 0 : 5.99) : 0;
  const total = discountedSubtotal + salesTax + shipping;

  const handleApplyPromo = () => {
    setPromoError('');
    const upperPromo = promoCode.toUpperCase().trim();
    
    if (!upperPromo) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (promoCodes[upperPromo]) {
      setAppliedPromo(upperPromo);
      setPromoCode('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  return (

    <div className="bg-gray-50 p-6 rounded-lg h-[100vh] overflow-y-auto max-h-[100vh] ">
      <h2 className="text-lg font-semibold mt-18 mb-4">Order Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Sub total ({items.length}):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {/* Show discount if applied */}
        {appliedPromo && discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoCodes[appliedPromo].description}):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Sales Tax (13%):</span>
          <span>${salesTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-semibold text-base">
          <span>Estimated Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-3">Apply Promo Code</h3>
        
        {/* Show applied promo code */}
        {appliedPromo && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-green-700 font-medium">{appliedPromo}</span>
                <p className="text-xs text-green-600">{promoCodes[appliedPromo].description}</p>
              </div>
              <button 
                onClick={handleRemovePromo}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        {!appliedPromo && (
          <div>
            <div className="flex">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-[#56193f]" 
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              <button 
                onClick={handleApplyPromo}
                className="bg-[#56193f] text-white px-4 py-2 rounded-r-md text-sm hover:bg-[#3d1230]"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-red-500 text-xs mt-1">{promoError}</p>
            )}
            
            {/* Available promo codes hint */}
            <div className="mt-2 text-xs text-gray-500">
              <p>Try: WELCOME10, SAVE20, FREESHIP, NEWUSER, STUDENT</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-3">
        <Link href="/checkout" className="block">
          <button className="w-full bg-[#56193f] text-white py-3 rounded-md font-medium hover:bg-[#3d1230]">
            Checkout
          </button>
        </Link>
        <Link href="/" className="block">
          <button className="w-full bg-white border-2 border-[#56193f] text-[#56193f] py-3 rounded-md font-medium hover:bg-gray-50">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
   
  );
};

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      <div className="w-[274px] h-[315px] rounded-md overflow-hidden flex-shrink-0">
        <Image 
          src={item.product?.image || item.image} 
          alt={item.product?.name || item.name} 
          width={274} 
          height={315} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-base">{item.product?.name || item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">Colour: {item.color}</p>
        <p className="text-sm text-gray-600">Size: {item.size}</p>
        
        <div className="mt-3">
          <select 
            value={item.quantity} 
            onChange={handleQuantityChange}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>Quantity {num}</option>
            ))}
          </select>
        </div>
        
        <div className="mt-40 flex items-center  gap-4">
          <div className="flex items-center gap-2">
            <input type="radio" id={`ship-${item.id}`} name={`delivery-${item.id}`} className="w-4 h-4" defaultChecked />
            <label htmlFor={`ship-${item.id}`} className="text-sm">Ship To An Address</label>
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-700">Save For Later</button>
          <button 
            onClick={handleRemove}
            className="text-sm text-red-600 hover:text-red-800 hover:underline"
          >
            Remove
          </button>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <input type="radio" id={`pickup-${item.id}`} name={`delivery-${item.id}`} className="w-4 h-4" />
          <label htmlFor={`pickup-${item.id}`} className="text-sm">Pick Up In Store</label>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-lg">${((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}</p>
        <p className="text-sm text-gray-600">${(item.product?.price || item.price || 0).toFixed(2)} each</p>
      </div>
    </div>
  );
};

export default function CartPage() {
  const { cartItems, loading, removeFromCart, updateCartItemQuantity } = useCart();

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    await updateCartItemQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(cartItemId);
    }
  };

  return (
    <Layout type="nobottom">
    <div className="container max-w-[1440px] mx-auto mt-23 px-4 py-8">
      {/* Header Navigation */}
      {/* <div className="flex items-center gap-8 text-sm text-gray-600 mb-8 border-b border-gray-200 pb-4">
        <Link href="/" className="text-black border-b-2 border-black pb-2">HOME</Link>
        <Link href="/women" className="hover:text-black">WOMEN</Link>
        <Link href="/men" className="hover:text-black">MEN</Link>
        <Link href="/kids" className="hover:text-black">KIDS</Link>
        <button className="hover:text-black">TAILORED</button>
        <button className="hover:text-black">ACCESSORIES</button>
      </div> */}

      

      {loading ? (
        <div className="text-center py-20">
          <p className="text-xl">Loading cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl mb-4">Your cart is empty.</p>
          <Link href="/" className="text-[#56193f] hover:underline font-semibold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-18">
          <div className="flex-1">
             {/* Header Navigation */}
      <div className="flex items-center gap-8 text-sm text-gray-600 mb-8 border-b border-gray-200 pb-4">
        <Link href="/" className="text-black border-b-2 border-black pb-2">HOME</Link>
        <Link href="/women" className="hover:text-black">WOMEN</Link>
        <Link href="/men" className="hover:text-black">MEN</Link>
        <Link href="/kids" className="hover:text-black">KIDS</Link>
        <button className="hover:text-black">TAILORED</button>
        <button className="hover:text-black">ACCESSORIES</button>
      </div>
            <h1 className="text-2xl font-semibold mb-6">My Cart ({cartItems.length} Items)</h1>
            {cartItems.map(item => (
              <CartItem 
                key={`${item.id}-${item.size}-${item.color}`} 
                item={item} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          <div className="w-full lg:w-80 h-full">
            <OrderSummary items={cartItems} />
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
