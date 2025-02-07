import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const JoinDocument = () => {
  const { documentId, token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const joinDocument = async () => {
      try {
        if (!user) {
          navigate('/signin', { 
            state: { redirect: `/join/${documentId}/${token}` }
          });
          return;
        }

        await api.post(`/documents/${documentId}/join`, { token });
        navigate(`/document/${documentId}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to join document');
        setLoading(false);
      }
    };

    joinDocument();
  }, [documentId, token, navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Joining document...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <button
          onClick={() => navigate('/signin')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Sign in to join document
        </button>
      </div>
    </div>
  );
};

export default JoinDocument;