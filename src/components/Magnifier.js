'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function Magnifier({ src, alt }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setMousePosition] = useState([0, 0]);
  const containerRef = useRef(null);
  const imageRef = useRef(null); // Ref para a imagem real

  // Configurações da Lupa
  const zoomLevel = 3;    // Aumentei o nível de zoom
  const lensSize = 250;   // Aumentei o tamanho da lupa

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const isMouseOverImage = 
      e.clientX >= imageRect.left &&
      e.clientX <= imageRect.right &&
      e.clientY >= imageRect.top &&
      e.clientY <= imageRect.bottom;

    if (isMouseOverImage) {
      const xPos = e.clientX - containerRect.left;
      const yPos = e.clientY - containerRect.top;
      setMousePosition([xPos, yPos]);
      setShowMagnifier(true);
    } else {
      setShowMagnifier(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div ref={imageRef} className="relative w-full h-full">
        <Image 
          src={src} 
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          className="rounded-lg"
          priority
        />
      </div>

      <div
        style={{
          // Lógica da animação de surgimento
          transform: `scale(${showMagnifier ? 1 : 0.8})`,
          opacity: showMagnifier ? 1 : 0,
          transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',

          // Posicionamento e estilo da lupa
          position: 'absolute',
          left: `${x - lensSize / 2}px`,
          top: `${y - lensSize / 2}px`,
          pointerEvents: 'none',
          height: `${lensSize}px`,
          width: `${lensSize}px`,
          border: '3px solid white',
          borderRadius: '50%',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          
          // Lógica do Zoom
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${(containerRef.current?.clientWidth || 0) * zoomLevel}px auto`,
          backgroundPosition: `-${(x * zoomLevel) - lensSize / 2}px -${(y * zoomLevel) - lensSize / 2}px`,
        }}
      />
    </div>
  );
}