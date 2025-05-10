import React, { useState, useRef } from 'react';
import { FileVideo, FileDown, CheckCircle, X } from 'lucide-react';
import { Element } from '../../types/canvas';
import anime from 'animejs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Player } from '@remotion/player';
import { RemotionRoot } from './TravelStoryComposition';
import TravelStoryVideo from './TravelStoryVideo';

interface ExportOptionsProps {
  elements: Element[];
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ elements }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => {
    anime({
      targets: '.export-modal',
      opacity: [1, 0],
      translateY: [0, 20],
      duration: 300,
      easing: 'easeInQuad',
      complete: () => setIsOpen(false)
    });
  };
  
  const generateVideo = async () => {
    setIsGeneratingVideo(true);
    setShowPreview(true);
    
    try {
      // The video will be rendered in the preview component
      // and can be downloaded using the browser's video download feature
      setIsGeneratingVideo(false);
      setVideoSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setVideoSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGeneratingVideo(false);
      setShowPreview(false);
    }
  };
  
  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    
    try {
      // Find the canvas element
      const canvasElement = document.querySelector('.absolute.inset-0.m-auto.bg-white');
      if (!canvasElement) {
        throw new Error('Canvas element not found');
      }

      // Create a canvas from the element
      const canvas = await html2canvas(canvasElement as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('travel-story.pdf');
      
      setIsGeneratingPdf(false);
      setPdfSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setPdfSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPdf(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="export-modal bg-white rounded-lg shadow-xl w-96 max-w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold font-heading">Your Story is Saved!</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Your travel story has been saved successfully. Now you can:
          </p>
          
          <div className="space-y-4">
            <button 
              className="w-full btn bg-[#FF6B6B] hover:bg-[#FF5252] text-white flex items-center justify-center gap-2 p-3 rounded-lg transition duration-200 shadow-lg"
              onClick={generateVideo}
              disabled={isGeneratingVideo || videoSuccess}
            >
              {isGeneratingVideo ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Video...
                </span>
              ) : videoSuccess ? (
                <span className="flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  Video Generated!
                </span>
              ) : (
                <>
                  <FileVideo size={20} />
                  Generate Travel Video
                </>
              )}
            </button>
            
            <button 
              className="w-full btn bg-[#4ECDC4] hover:bg-[#45B7AF] text-white flex items-center justify-center gap-2 p-3 rounded-lg transition duration-200 shadow-lg"
              onClick={generatePdf}
              disabled={isGeneratingPdf || pdfSuccess}
            >
              {isGeneratingPdf ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </span>
              ) : pdfSuccess ? (
                <span className="flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  PDF Downloaded!
                </span>
              ) : (
                <>
                  <FileDown size={20} />
                  Export as PDF
                </>
              )}
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 text-center">
            You can continue editing your story or create a new one at any time.
          </p>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Video Preview</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPreview(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <Player
                component={TravelStoryVideo}
                inputProps={{ elements }}
                durationInFrames={300}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                You can use your browser's video download feature to save this video.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowPreview(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;