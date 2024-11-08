import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthStore } from "../store/authStore";
import api from "../Services/api";
import CommentForm from "./CommentForm";
import Reaction from "./Reaction";
import { FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ResourceDetail = ({ resource, fetchResources }) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(resource.title);
  const [content, setContent] = useState(resource.content);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments] = useState(resource.comments);
  const token = localStorage.getItem("authToken");
  const [likes] = useState(
    resource.reactions.filter((r) => r.type === "like").length
  );
  const [unlikes] = useState(
    resource.reactions.filter((r) => r.type === "unlike").length
  );

  useEffect(() => {
    if (resource.reactions.some((reaction) => reaction.user === user?._id)) {
      setHasLiked(true);
    }
  }, [resource.reactions, user]);

  const handleDelete = async () => {
    try {
      await api.delete(`/resources/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/resources/${resource._id}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditing(false);
      fetchResources();
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-300 max-w-3xl mx-auto">
      {isEditing ? (
        <>
          <h3 className="text-2xl font-semibold mb-4">Edit Resource</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg w-full py-2 px-4 mb-3"
            placeholder="Resource Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-lg w-full py-2 px-4 mb-3"
            rows="3"
            placeholder="Resource Content"
          />
          <div className="flex justify-between mt-3">
            <button
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {resource.title}
          </h2>
          <p className="text-gray-700 mb-4">{resource.content}</p>
          <p className="text-sm text-gray-500 mb-4">
            Posted by: <strong>{resource.createdBy.name}</strong>
          </p>

          <div className="flex items-center mb-4">
            <span className="text-green-600 mr-4 flex items-center">
              <FaThumbsUp className="mr-1" />
              {likes} {likes === 1 ? "Like" : "Likes"}
            </span>
            <span className="text-red-600 flex items-center">
              <FaThumbsDown className="mr-1" />
              {unlikes} {unlikes === 1 ? "Unlike" : "Unlikes"}
            </span>
          </div>

          {user && user.role === "Admin" && (
            <div className="flex space-x-2 mb-4">
              <button
                className="bg-blue-500 text-white font-semibold py-1 px-4 rounded-lg"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white font-semibold py-1 px-4 rounded-lg"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}

          <h4
            className="text-lg font-semibold text-gray-800 cursor-pointer mt-4 flex items-center"
            onClick={() => setCommentsVisible(!commentsVisible)}
          >
            Comments
            {commentsVisible ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </h4>

          {commentsVisible && (
            <>
              <CommentForm
                resourceId={resource._id}
                fetchResources={fetchResources}
              />
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-gray-200 py-2"
                  >
                    <p className="text-gray-700">{comment.text}</p>
                    <p className="text-sm text-gray-500">
                      <strong>{comment.user.name}</strong> on{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              You can like to this Account
            </h4>
            <Reaction resourceId={resource._id} fetchResources={fetchResources} />
          </div>
        </>
      )}
    </div>
  );
};

ResourceDetail.propTypes = {
  resource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    }).isRequired,
    reactions: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          _id: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  fetchResources: PropTypes.func.isRequired,
};

export default ResourceDetail;
