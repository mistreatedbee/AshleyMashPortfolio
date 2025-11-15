import React, { useEffect } from 'react';

const CustomCursor: React.FC = () => {
  useEffect(() => {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    function move(e: MouseEvent) {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }
    function down(){ ring.classList.add('small') }
    function up(){ ring.classList.remove('small') }

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      ring.remove();
    }
  }, []);

  return null;
}

export default CustomCursor;
