import { useState } from 'react';
import api from '../Services/api';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommentForm = ({ resourceId, fetchResources }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/resources/comment', { resourceId, text }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setText('');
      fetchResources();

      toast.success('👍 Comment added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('👎 Error adding comment. Try again!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Comment Input */}
        <div className="relative">
          <textarea
            id="comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="peer block w-full p-4 text-gray-700 bg-gray-100 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            placeholder=" "
            required
          />
          <label
            htmlFor="comment"
            className="absolute left-4 -top-3.5 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-600"
          >
            Your Comment
          </label>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 focus:outline-none ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          ) : (
            'Post Comment'
          )}
        </button>
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  resourceId: PropTypes.string.isRequired,
  fetchResources: PropTypes.func.isRequired,
};

export default CommentForm;
