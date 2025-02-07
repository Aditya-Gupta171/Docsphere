import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const createNewDocument = async () => {
    try {
      const res = await api.post('/documents', {
        title: 'Untitled Document',
        content: ''
      });
      navigate(`/document/${res.data._id}`);
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(docs => docs.filter(doc => doc._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-white">My Documents</h2>
        <button
          onClick={createNewDocument}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          New Document
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div 
                onClick={() => navigate(`/document/${doc._id}`)}
                className="cursor-pointer flex-1"
              >
                <h3 className="text-lg text-white mb-2">{doc.title}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Last modified: {new Date(doc.lastModified).toLocaleDateString()}</span>
                  <span>{doc.collaborators?.length || 0} collaborators</span>
                </div>
              </div>
              <button
                onClick={() => setDeleteId(doc._id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No documents yet. Create your first one!
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg text-white mb-4">Delete Document?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;