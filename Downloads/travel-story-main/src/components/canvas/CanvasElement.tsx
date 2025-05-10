import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Move } from 'lucide-react';
import { Element, ElementType } from '../../types/canvas';
import anime from 'animejs';

interface CanvasElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: Element) => void;
  onRemove: () => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      if (elementRef.current?.parentElement) {
        const parentRect = elementRef.current.parentElement.getBoundingClientRect();
        const elementRect = elementRef.current.getBoundingClientRect();
        
        const boundedX = Math.max(0, Math.min(newX, parentRect.width - elementRect.width));
        const boundedY = Math.max(0, Math.min(newY, parentRect.height - elementRect.height));
        
        onUpdate({
          ...element,
          position: { x: boundedX, y: boundedY }
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Playful drop animation
      if (elementRef.current) {
        anime({
          targets: elementRef.current,
          scale: [1.05, 1],
          rotate: [
            element.rotation || 0,
            (element.rotation || 0) + (Math.random() * 10 - 5)
          ],
          duration: 600,
          easing: 'easeOutElastic(1, .5)'
        });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, element, onUpdate]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      
      // Pickup animation
      anime({
        targets: elementRef.current,
        scale: 1.05,
        rotate: [
          element.rotation || 0,
          (element.rotation || 0) + (Math.random() * 6 - 3)
        ],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  };
  
  const renderElementContent = () => {
    switch (element.type) {
      case ElementType.IMAGE:
        return (
          <div className="polaroid">
            <div className="tape"></div>
            <img 
              src={element.content} 
              alt="User uploaded" 
              className="w-full h-full object-contain rounded"
              draggable={false}
            />
            <div className="tape" style={{ 
              right: -20, 
              left: 'auto', 
              top: 'auto',
              bottom: 20,
              transform: 'rotate(45deg)'
            }}></div>
          </div>
        );
      case ElementType.TEXT:
        return (
          <div 
            className="text-element"
            style={{ 
              color: element.style?.color || '#2C3E50',
              fontSize: `${element.style?.fontSize || 16}px`,
              fontFamily: element.style?.fontFamily || 'Patrick Hand, cursive',
              pointerEvents: isSelected ? 'none' : 'auto'
            }}
          >
            {element.content}
            <div className="sticker" style={{ 
              right: -20, 
              bottom: -20,
              backgroundColor: `var(--color-${Math.random() > 0.5 ? 'accent' : 'primary-light'})`
            }}>
              Drag me!
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div
      id={`element-${element.id}`}
      ref={elementRef}
      className={`absolute cursor-move ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        zIndex: element.zIndex,
        transform: `rotate(${element.rotation || 0}deg)`,
        userSelect: 'none',
        transition: isDragging ? 'none' : 'transform 0.3s ease'
      }}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
    >
      {renderElementContent()}
      
      {isSelected && (
        <div className="absolute -top-12 right-0 flex bg-white rounded-full overflow-hidden shadow-lg border-2 border-dashed border-primary p-1">
          <button 
            className="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-full focus:outline-none transform transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              
              // Remove animation
              if (elementRef.current) {
                anime({
                  targets: elementRef.current,
                  scale: [1, 0],
                  rotate: [element.rotation || 0, (element.rotation || 0) + 20],
                  opacity: [1, 0],
                  duration: 400,
                  easing: 'easeOutQuad',
                  complete: () => onRemove()
                });
              }
            }}
          >
            <Trash2 size={20} />
          </button>
          <div 
            className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full cursor-grab"
            onMouseDown={handleMouseDown}
          >
            <Move size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasElement;