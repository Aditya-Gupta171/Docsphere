import { useCallback, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import io from "socket.io-client";
import api from "../../api/axios";
import CursorOverlay from "./CursorOverlay";

const SAVE_INTERVAL_MS = 2000;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = ({ documentId, onSaving }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const socketRef = useRef();
  const saveTimeoutRef = useRef();
  const user = JSON.parse(localStorage.getItem('user'));

  // Initialize Quill
  useEffect(() => {
    if (!editorRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      placeholder: "Start typing...",
    });

    // Load initial content
    const loadDocument = async () => {
      try {
        const { data } = await api.get(`/documents/${documentId}`);
        if (data.content) {
          quillRef.current.setContents(JSON.parse(data.content));
        }
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    };
    
    loadDocument();

    return () => {
      if (quillRef.current) {
        const toolbar = quillRef.current.getModule('toolbar');
        toolbar?.container?.remove();
        quillRef.current = null;
      }
    };
  }, [documentId]);

  // Auto-save changes
  useEffect(() => {
    if (!documentId || !quillRef.current) return;

    const saveDocument = async () => {
      try {
        onSaving?.(true);
        await api.put(`/documents/${documentId}`, {
          content: JSON.stringify(quillRef.current.getContents())
        });
      } catch (err) {
        console.error("Save failed:", err);
      } finally {
        onSaving?.(false);
      }
    };

    const handleChange = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(saveDocument, SAVE_INTERVAL_MS);
    };

    quillRef.current.on('text-change', handleChange);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (quillRef.current) {
        quillRef.current.off('text-change', handleChange);
      }
    };
  }, [documentId, onSaving]);

  // Real-time collaboration
  useEffect(() => {
    if (!documentId || !quillRef.current) return;

    socketRef.current = io(import.meta.env.VITE_WS_URL);
    const socket = socketRef.current;

    socket.emit('join-document', {
      documentId,
      user: {
        id: user.id,
        name: user.name
      }
    });

    socket.on('receive-changes', (delta) => {
      quillRef.current.updateContents(delta);
    });

    const handleChange = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta, documentId);
    };

    const handleSelectionChange = (range, oldRange, source) => {
      if (source === 'user' && range) {
        socket.emit('cursor-move', {
          documentId,
          cursor: range,
          userName: user.name
        });
      }
    };

    quillRef.current.on('text-change', handleChange);
    quillRef.current.on('selection-change', handleSelectionChange);

    return () => {
      socket.disconnect();
      if (quillRef.current) {
        quillRef.current.off('text-change', handleChange);
        quillRef.current.off('selection-change', handleSelectionChange);
      }
    };
  }, [documentId, user]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-white relative">
        <div ref={editorRef} className="h-full" />
        <CursorOverlay socket={socketRef.current} quill={quillRef.current} />
      </div>
    </div>
  );
};

export default TextEditor;