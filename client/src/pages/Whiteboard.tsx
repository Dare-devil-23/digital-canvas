import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Canvas from '@/components/Canvas';
import ToolbarPanel from '@/components/ToolbarPanel';
import ColorPalette from '@/components/ColorPalette';
import TopControls from '@/components/TopControls';
import ZoomControls from '@/components/ZoomControls';
import GridFilter from '@/components/GridFilter';
import MobileToolbarToggle from '@/components/MobileToolbarToggle';
import QuestionPanel from '@/components/QuestionPanel';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export default function Whiteboard() {
  const { zoomLevel } = useSelector((state: RootState) => state.canvas);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorPaletteRef = useRef<HTMLDivElement>(null);
  
  // Set up keyboard shortcuts
  useKeyboardShortcut(zoomLevel);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      
      if (toolbarRef.current) {
        toolbarRef.current.classList.toggle('hidden', isMobile);
      }
      
      if (colorPaletteRef.current) {
        colorPaletteRef.current.classList.toggle('hidden', isMobile);
      }
    };
    
    // Initialize on mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Canvas />
      
      <div ref={toolbarRef}>
        <ToolbarPanel />
      </div>
      
      <div ref={colorPaletteRef}>
        <ColorPalette />
      </div>
      
      <GridFilter />
      <TopControls />
      <ZoomControls />
      <QuestionPanel />
      
      <MobileToolbarToggle 
        toolbarRef={toolbarRef}
        colorPaletteRef={colorPaletteRef}
      />
    </div>
  );
}
