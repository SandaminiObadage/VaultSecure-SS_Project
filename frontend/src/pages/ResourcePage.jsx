import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResourceDetail from '../components/ResourceDetail';
import ResourceForm from '../components/ResourceForm';

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSave = () => {
    setEditingResource(null);
    fetchResources();
  };

  const handleDashboardNavigation = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Account Management
      </h1>
      
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-gray-700 hover:bg-gray-900 text-white py-2 px-4 rounded shadow-md transition duration-200"
          onClick={handleDashboardNavigation}
        >
          Go to Dashboard
        </button>
        
        {user && user.role === 'Admin' && (
          <button
            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded shadow-md transition duration-200"
            onClick={() => setEditingResource({ id: null, title: '', content: '' })}
          >
            Add New Account
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 py-3 px-4 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      
      {editingResource && (
        <ResourceForm resource={editingResource} onSave={handleSave} />
      )}
      
      {loading ? (
        <p className="text-center text-gray-500">Loading Accounts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceDetail
                key={resource._id}
                resource={resource}
                onEdit={() => setEditingResource(resource)}
                onDelete={() => setResources(resources.filter((r) => r._id !== resource._id))}
                fetchResources={fetchResources}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No accounts available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
