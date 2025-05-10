import React, { useRef } from 'react';
import { Upload, Type, Save, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

interface CanvasToolbarProps {
  onAddImage: (file: File) => void;
  onAddText: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ 
  onAddImage, 
  onAddText,
  onSave,
  isSaved
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddImage(e.target.files[0]);
      e.target.value = ''; // Reset the input
    }
  };
  
  const handleButtonClick = (button: string) => {
    // Button press animation
    anime({
      targets: `.toolbar-btn-${button}`,
      scale: [1, 0.9, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
    
    if (button === 'image') {
      fileInputRef.current?.click();
    } else if (button === 'text') {
      onAddText();
    } else if (button === 'save') {
      onSave();
    }
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
          <MoveLeft size={20} className="mr-1" />
          <span>Back</span>
        </Link>
      </div>
      
      <div className="flex gap-3">
        <button 
          className={`toolbar-btn-image btn ${isSaved ? 'btn-outline' : 'btn-primary'}`}
          onClick={() => handleButtonClick('image')}
          disabled={isSaved}
        >
          <Upload size={18} />
          <span>Add Image</span>
        </button>
        
        <button 
          className={`toolbar-btn-text btn ${isSaved ? 'btn-outline' : 'btn-secondary'}`} 
          onClick={() => handleButtonClick('text')}
          disabled={isSaved}
        >
          <Type size={18} />
          <span>Add Text</span>
        </button>
        
        <button 
          className="toolbar-btn-save btn btn-accent" 
          onClick={() => handleButtonClick('save')}
          disabled={isSaved}
        >
          <Save size={18} />
          <span>{isSaved ? 'Saved' : 'Save Story'}</span>
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default CanvasToolbar;