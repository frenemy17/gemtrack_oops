import { Composition } from 'remotion';
import TravelStoryVideo from './TravelStoryVideo';
import { Element } from '../../types/canvas';

interface TravelStoryCompositionProps {
  elements: Element[];
}

export const RemotionRoot: React.FC<TravelStoryCompositionProps> = ({ elements }) => {
  return (
    <>
      <Composition
        id="TravelStory"
        component={TravelStoryVideo as React.ComponentType<{ elements: Element[] }>}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          elements,
        }}
      />
    </>
  );
}; 