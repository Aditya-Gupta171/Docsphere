import { useEffect, useRef } from 'react';

const CURSOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

const CursorOverlay = ({ socket, quill }) => {
  const cursorsRef = useRef({});

  useEffect(() => {
    if (!socket || !quill) return;

    const updateCursor = (userId, cursor, userName) => {
      if (!cursorsRef.current[userId]) {
        const cursorElement = document.createElement('div');
        const color = CURSOR_COLORS[Object.keys(cursorsRef.current).length % CURSOR_COLORS.length];
        
        cursorElement.className = 'cursor-element';
        cursorElement.style.position = 'absolute';
        cursorElement.style.borderLeft = `2px solid ${color}`;
        cursorElement.style.height = '20px';
        cursorElement.style.zIndex = 1;

        const nameTag = document.createElement('div');
        nameTag.textContent = userName || 'Anonymous';
        nameTag.style.backgroundColor = color;
        nameTag.style.color = 'white';
        nameTag.style.padding = '2px 6px';
        nameTag.style.borderRadius = '3px';
        nameTag.style.fontSize = '12px';
        nameTag.style.position = 'absolute';
        nameTag.style.top = '-20px';
        nameTag.style.whiteSpace = 'nowrap';

        cursorElement.appendChild(nameTag);
        cursorsRef.current[userId] = cursorElement;
        quill.container.appendChild(cursorElement);
      }

      const bounds = quill.getBounds(cursor.index);
      const cursorElement = cursorsRef.current[userId];
      cursorElement.style.left = `${bounds.left}px`;
      cursorElement.style.top = `${bounds.top}px`;
    };

    socket.on('cursor-update', ({ userId, cursor, userName }) => {
      updateCursor(userId, cursor, userName);
    });

    return () => {
      socket.off('cursor-update');
      Object.values(cursorsRef.current).forEach(cursor => cursor.remove());
      cursorsRef.current = {};
    };
  }, [socket, quill]);

  return null;
};

export default CursorOverlay;