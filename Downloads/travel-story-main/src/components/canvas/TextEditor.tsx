import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Element } from '../../types/canvas';

interface TextEditorProps {
  element: Element;
  onUpdate: (element: Element) => void;
  onClose: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ element, onUpdate, onClose }) => {
  const [text, setText] = useState(element.content || '');
  const [fontSize, setFontSize] = useState(element.style?.fontSize || 18);
  const [fontColor, setFontColor] = useState(element.style?.color || '#000000');
  
  useEffect(() => {
    setText(element.content || '');
    setFontSize(element.style?.fontSize || 18);
    setFontColor(element.style?.color || '#000000');
  }, [element]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...element,
      content: text,
      style: {
        ...element.style,
        fontSize,
        color: fontColor
      }
    });
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Text</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <div className="flex items-center">
            <input
              id="fontSize"
              type="range"
              min="12"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 text-sm">{fontSize}px</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="fontColor" className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <input
            id="fontColor"
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>
        
        <div className="md:col-span-4 flex justify-end mt-2">
          <button 
            type="button" 
            className="btn btn-outline mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Update Text
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;