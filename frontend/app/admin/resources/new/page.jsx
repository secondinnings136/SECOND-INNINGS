'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createResource } from '../../../../lib/adminApi';

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'for-students',
    excerpt: '',
    content: '',
    readTime: 5,
    author: 'Deepak Sogani',
    tags: '',
    isPublished: true
  });

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

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
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await createResource(dataToSubmit);
      router.push('/admin/resources');
    } catch (err) {
      setError(err.message || 'Failed to create resource');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create New Resource</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleTitleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none">
              <option value="for-students">For Students</option>
              <option value="for-parents">For Parents</option>
              <option value="frameworks-tools">Frameworks & Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
            <input type="number" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none" placeholder="education, career, future" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt * (Short summary)</label>
            <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" maxLength={300} className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none"></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content * (Markdown supported)</label>
            <textarea required name="content" value={formData.content} onChange={handleChange} rows="15" className="w-full p-2 border border-gray-300 rounded-md focus:border-[#2E4052] outline-none font-mono text-sm"></textarea>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
          <input type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-5 h-5 text-[#2E4052] rounded" />
          <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Published (Visible on site)</label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[#FFC857] hover:bg-[#ffbe3b] text-[#2E4052] font-bold rounded-xl shadow-sm transition-all disabled:opacity-70">
            {loading ? 'Creating...' : 'Create Resource'}
          </button>
        </div>
      </form>
    </div>
  );
}
