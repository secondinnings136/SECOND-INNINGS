'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createOpportunity } from '../../../../lib/adminApi';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'internships',
    bestFor: '',
    eligibility: '',
    whatItOffers: '',
    locationMode: 'hybrid',
    location: '',
    deadline: '',
    costOrFunding: '',
    officialSource: '',
    whyUseful: '',
    suggestedNextStep: '',
    isActive: true,
    isFeatured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createOpportunity(formData);
      router.push('/admin/opportunities');
    } catch (err) {
      setError(err.message || 'Failed to create opportunity');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create New Opportunity</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name / Title *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none">
              <option value="internships">Internships</option>
              <option value="fellowships">Fellowships</option>
              <option value="scholarships">Scholarships</option>
              <option value="courses">Courses</option>
              <option value="higher-education">Higher Education</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="social-impact">Social Impact</option>
              <option value="professional-exposure">Professional Exposure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
            <select name="locationMode" value={formData.locationMode} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none">
              <option value="physical">Physical (On-site)</option>
              <option value="online">Online / Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (if physical/hybrid)</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Best For (e.g. 'Class 11 Science Students')</label>
            <input type="text" name="bestFor" value={formData.bestFor} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost / Funding</label>
            <input type="text" name="costOrFunding" value={formData.costOrFunding} onChange={handleChange} placeholder="e.g. Fully Funded, $500, Free" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Official Source (URL)</label>
            <input type="url" name="officialSource" value={formData.officialSource} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" />
          </div>
        </div>

        <div className="space-y-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Detailed Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What It Offers *</label>
            <textarea required name="whatItOffers" value={formData.whatItOffers} onChange={handleChange} rows="4" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" placeholder="Describe the opportunity details..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
            <textarea name="eligibility" value={formData.eligibility} onChange={handleChange} rows="3" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why Useful</label>
            <textarea name="whyUseful" value={formData.whyUseful} onChange={handleChange} rows="3" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" placeholder="Why should a student apply for this?"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Next Step</label>
            <textarea name="suggestedNextStep" value={formData.suggestedNextStep} onChange={handleChange} rows="2" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-[#2E4052] outline-none" placeholder="e.g. Prepare resume and apply via portal"></textarea>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-[#2E4052] rounded border-gray-300 focus:ring-[#2E4052]" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible to users)</label>
          </div>
          
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-[#FFC857] rounded border-gray-300 focus:ring-[#FFC857]" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured (Highlights on main pages)</label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-xl shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
