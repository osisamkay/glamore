"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function CustomMeasurementModal({ isOpen, onClose, productName, onSaveMeasurements }) {
  const [unit, setUnit] = useState('INCH');
  const [measurements, setMeasurements] = useState({
    height: '',
    neckCircumference: '',
    bustChestCircumference: '',
    underBustCircumference: '',
    waistCircumference: '',
    hipsCircumference: '',
    thighCircumference: '',
    kneeCircumference: '',
    upperArmCircumference: ''
  });

  const measurementLabels = {
    height: 'Height',
    neckCircumference: 'Neck Circumference',
    bustChestCircumference: 'Bust/Chest Circumference',
    underBustCircumference: 'Under Bust Circumference',
    waistCircumference: 'Waist Circumference',
    hipsCircumference: 'Hips Circumference',
    thighCircumference: 'Thigh Circumference',
    kneeCircumference: 'Knee Circumference',
    upperArmCircumference: 'Upper Arm Circumference'
  };

  const handleInputChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate that at least some measurements are filled
    const filledMeasurements = Object.values(measurements).filter(value => value.trim() !== '');
    if (filledMeasurements.length === 0) {
      alert('Please enter at least one measurement.');
      return;
    }

    onSaveMeasurements({
      ...measurements,
      unit,
      productName
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset measurements
    setMeasurements({
      height: '',
      neckCircumference: '',
      bustChestCircumference: '',
      underBustCircumference: '',
      waistCircumference: '',
      hipsCircumference: '',
      thighCircumference: '',
      kneeCircumference: '',
      upperArmCircumference: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto bg-cover bg bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/image.png)',
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Custom Measurement Profile</h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid w-[80%] mx-auto gap-8">
            {/* Left Side - Form */}
            <div>
              {/* Product Name */}
              <div className="mb-6">
                <input
                  type="text"
                  value={productName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>

              {/* Units Selection */}
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">Units</span>
                  <button
                    onClick={() => setUnit('INCH')}
                    className={`px-4 py-1 text-xs font-medium rounded ${
                      unit === 'INCH' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    INCH
                  </button>
                  <button
                    onClick={() => setUnit('CM')}
                    className={`px-4 py-1 text-xs font-medium rounded ${
                      unit === 'CM' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    CM
                  </button>
                </div>
                <div className="mb-4">
                <button className="text-sm text-[#56193F] hover:text-[#56193F]/80 underline">
                  View Size Chart
                </button>
              </div>
              </div>

              {/* Measurements Table */}
              <div className="">
                <div className="grid grid-cols-2 gap-4 bg-[#56193F] text-white p-3 rounded-t">
                  <div className="font-medium text-sm">Points Of Measure</div>
                  <div className="font-medium text-sm text-center">Measurements</div>
                </div>

                {Object.entries(measurementLabels).map(([field, label]) => (
                  <div key={field} className="grid grid-cols-2 justify-between bg-[#F9F9F9] items-center gap-4 p-3 border-b border-gray-200">
                    <div className="flex items-center justify-between  gap-2">
                      <span className="text-sm text-gray-700">{label}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <input
                        type="number"
                        step="0.1"
                        placeholder={`0.0 ${unit.toLowerCase()}`}
                        value={measurements[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full max-w-[100px]  text-center px-3 py-2 border border-gray-300 rounded text-sm text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Measurements Link */}
              <div className="mt-4">
                <button className="text-sm text-[#56193F] hover:text-[#56193F]/80 underline">
                  Save My Measurements
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#56193F] text-white py-3 px-6 rounded font-medium hover:bg-[#56193F]/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
