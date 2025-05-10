import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';
import { Element } from '../../types/canvas';

interface TravelStoryVideoProps {
  elements: Element[];
}

const TravelStoryVideo: React.FC<TravelStoryVideoProps> = ({ elements }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const duration = 10; // 10 seconds video

  const renderElement = (element: Element, index: number) => {
    // Calculate timing for each element
    const startFrame = index * (fps * 0.5); // Each element starts 0.5 seconds after the previous
    const endFrame = startFrame + (fps * 0.8); // Animation duration of 0.8 seconds

    // Spring animation for smooth motion
    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: {
        damping: 12,
        stiffness: 100,
      },
    });

    // Calculate position and scale
    const scale = interpolate(progress, [0, 1], [0.5, 1]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);
    const y = interpolate(progress, [0, 1], [50, 0]);

    // Calculate rotation with a slight bounce
    const rotation = interpolate(
      progress,
      [0, 0.5, 1],
      [-10, 5, 0]
    );

    const style = {
      position: 'absolute' as const,
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      transform: `scale(${scale}) translateY(${y}px) rotate(${rotation}deg)`,
      opacity,
      zIndex: element.zIndex,
    };

    if (element.type === 'image') {
      return (
        <div key={element.id} style={style}>
          <div className="polaroid">
            <div className="tape"></div>
            <img 
              src={element.content} 
              alt="Travel memory" 
              className="w-full h-full object-contain rounded"
            />
            <div className="tape" style={{ 
              right: -20, 
              left: 'auto', 
              top: 'auto',
              bottom: 20,
              transform: 'rotate(45deg)'
            }}></div>
          </div>
        </div>
      );
    } else if (element.type === 'text') {
      return (
        <div 
          key={element.id} 
          style={{
            ...style,
            color: element.style?.color || '#2C3E50',
            fontSize: `${element.style?.fontSize || 16}px`,
            fontFamily: element.style?.fontFamily || 'Patrick Hand, cursive',
          }}
        >
          {element.content}
        </div>
      );
    }

    return null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {elements.map((element, index) => renderElement(element, index))}
    </AbsoluteFill>
  );
};

export default TravelStoryVideo; 