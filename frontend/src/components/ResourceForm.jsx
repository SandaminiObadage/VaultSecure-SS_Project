import { useState } from 'react';
import PropTypes from 'prop-types';
//import { useAuthStore } from '../store/authStore.js';
import api from '../Services/api';

const ResourceForm = ({ resource, onSave }) => {
  
  const [title, setTitle] = useState(resource ? resource.title : '');
  const [content, setContent] = useState(resource ? resource.content : '');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      if (resource && resource.id) {
        // Update existing resource
        await api.put(`/resources/${resource.id}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new resource
        await api.post('/resources/create', { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {resource ? 'Edit Account' : 'Create Resource'}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
            Name
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 focus:outline-none ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

ResourceForm.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default ResourceForm;