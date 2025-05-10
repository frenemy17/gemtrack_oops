import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const SaveAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      
      anime({
        targets: '.save-progress-bar',
        width: ['0%', '100%'],
        duration: 3000,
        easing: 'easeInOutQuad'
      });
      
    
      anime({
        targets: '.loading-dot',
        translateY: [-5, 0, -5],
        delay: anime.stagger(150),
        loop: true,
        duration: 700,
        easing: 'easeInOutSine'
      });
      
    
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInOutQuad'
      });
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full mx-4">
        <h3 className="text-2xl font-bold text-center mb-6 font-heading">
          Saving your story
          <span className="loading-dot inline-block">.</span>
          <span className="loading-dot inline-block">.</span>
          <span className="loading-dot inline-block">.</span>
        </h3>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div className="save-progress-bar h-full bg-primary rounded-full w-0"></div>
        </div>
        
        <p className="text-gray-600 text-center">
          Please wait while we're saving your travel story...
        </p>
      </div>
    </div>
  );
};

export default SaveAnimation;