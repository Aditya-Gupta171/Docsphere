import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../components/editor/TextEditor";
import InviteModal from "../components/editor/InviteModal";
import api from '../api/axios';

const Editor = () => {
  const { id: documentId } = useParams();
  const [showInvite, setShowInvite] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Untitled Document');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${documentId}`);
        setDocument(res.data);
        setTitle(res.data.title);
      } catch (error) {
        setError("Failed to load document");
        console.error("Document fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const updateTitle = useCallback(async (newTitle) => {
    try {
      setIsSaving(true);
      await api.put(`/documents/${documentId}`, { title: newTitle });
      setDocument(prev => ({ ...prev, title: newTitle }));
    } catch (error) {
      setError("Failed to update title");
    } finally {
      setIsSaving(false);
    }
  }, [documentId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title !== document?.title) {
      updateTitle(title);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => navigate("/")} 
          className="mt-4 p-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-800 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="text-xl sm:text-2xl font-bold bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={50}
            />
          ) : (
            <h1 
              onClick={() => setIsEditingTitle(true)}
              className="text-xl sm:text-2xl font-bold text-white cursor-pointer hover:text-gray-300"
            >
              {title}
            </h1>
          )}
          {isSaving && (
            <span className="text-sm text-gray-400">Saving...</span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="flex-1 sm:flex-none px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            My Documents
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Invite
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <TextEditor 
          documentId={documentId} 
          onSaving={setIsSaving}
        />
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          documentId={documentId}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
};

export default Editor;