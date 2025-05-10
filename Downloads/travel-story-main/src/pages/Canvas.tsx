import React, { useState, useRef, useEffect } from 'react';
import CanvasToolbar from '../components/canvas/CanvasToolbar';
import CanvasElement from '../components/canvas/CanvasElement';
import TextEditor from '../components/canvas/TextEditor';
import SaveAnimation from '../components/canvas/SaveAnimation';
import ExportOptions from '../components/canvas/ExportOptions';
import { Element, ElementType } from '../types/canvas';
import { generateUniqueId } from '../utils/helpers';
import anime from 'animejs';

const Canvas: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const newElement: Element = {
          id: generateUniqueId(),
          type: ElementType.IMAGE,
          content: e.target.result as string,
          position: { x: 100, y: 100 },
          size: { width: 300, height: 200 },
          zIndex: elements.length,
          rotation: 0
        };
        
        setElements([...elements, newElement]);
        
        // Animate the new element
        setTimeout(() => {
          anime({
            targets: `#element-${newElement.id}`,
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .6)'
          });
        }, 0);
      }
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const newElement: Element = {
      id: generateUniqueId(),
      type: ElementType.TEXT,
      content: 'Add your text here',
      position: { x: 100, y: 100 },
      style: {
        color: '#000000',
        fontSize: 18,
        fontFamily: 'Montserrat, sans-serif'
      },
      size: { width: 200, height: 100 },
      zIndex: elements.length,
      rotation: 0
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setShowTextEditor(true);
    
    // Animate the new element
    setTimeout(() => {
      anime({
        targets: `#element-${newElement.id}`,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad'
      });
    }, 0);
  };

  const updateElement = (updatedElement: Element) => {
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ));
  };

  const removeElement = (id: string) => {
    // Animate element before removing
    anime({
      targets: `#element-${id}`,
      scale: [1, 0],
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInQuad',
      complete: () => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElement === id) {
          setSelectedElement(null);
          setShowTextEditor(false);
        }
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Save animation will play for 2 seconds
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 2000);
  };

  const selectElement = (id: string | null) => {
    setSelectedElement(id);
    if (id) {
      const element = elements.find(el => el.id === id);
      setShowTextEditor(element?.type === ElementType.TEXT);
    } else {
      setShowTextEditor(false);
    }
  };

  // Handle click outside elements to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (canvasRef.current && canvasRef.current.contains(e.target as Node)) {
        const targetId = (e.target as HTMLElement).id || 
                         (e.target as HTMLElement).parentElement?.id;
                         
        if (!targetId || !targetId.startsWith('element-')) {
          selectElement(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <CanvasToolbar 
        onAddImage={addImage} 
        onAddText={addText} 
        onSave={handleSave}
        isSaved={isSaved}
      />
      
      <div className="flex-grow relative overflow-hidden bg-gray-100">
        <div 
          ref={canvasRef}
          className="absolute inset-0 m-auto bg-white shadow-lg rounded-lg"
          style={{ 
            width: 'calc(100% - 100px)', 
            height: 'calc(100% - 80px)', 
            maxWidth: '1600px',
            maxHeight: '900px'
          }}
        >
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() => selectElement(element.id)}
              onUpdate={updateElement}
              onRemove={() => removeElement(element.id)}
            />
          ))}
        </div>
      </div>
      
      {showTextEditor && selectedElement && (
        <TextEditor
          element={elements.find(el => el.id === selectedElement) as Element}
          onUpdate={updateElement}
          onClose={() => setShowTextEditor(false)}
        />
      )}
      
      {isSaving && <SaveAnimation />}
      
      {isSaved && !isSaving && <ExportOptions elements={elements} />}
    </div>
  );
};

export default Canvas;