import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToolType, Point } from '../types/canvas';
import { 
  startDrawing, 
  continueDrawing, 
  stopDrawing, 
  addText,
  startPanning,
  continuePanning,
  stopPanning
} from '../store/canvasSlice';
import { getPointFromEvent } from '../lib/utils';

interface UseDrawingProps {
  activeTool: ToolType;
  canvasRef: React.RefObject<HTMLDivElement>;
  selectedColor: string;
}

export function useDrawing({ activeTool, canvasRef, selectedColor }: UseDrawingProps) {
  const dispatch = useDispatch();
  const isDrawingRef = useRef(false);
  
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const point = getPointFromEvent(e, rect);
      
      if (activeTool === ToolType.TEXT) {
        handleTextTool(point);
        return;
      }

      if (activeTool === ToolType.SELECT) {
        return;
      }
      
      if (activeTool === ToolType.HAND) {
        dispatch(startPanning(point));
        document.body.style.cursor = 'grabbing';
      } else {
        const adjustedPoint = {
          ...point,
          strokeWidth: activeTool === ToolType.MARKER ? 8 : undefined
        };
        dispatch(startDrawing(adjustedPoint));
        isDrawingRef.current = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const point = getPointFromEvent(e, rect);
      
      if (activeTool === ToolType.HAND) {
        dispatch(continuePanning(point));
      } else if (isDrawingRef.current) {
        dispatch(continueDrawing(point));
      }
    };
    
    const handleMouseUp = () => {
      if (activeTool === ToolType.HAND) {
        dispatch(stopPanning());
        document.body.style.cursor = 'grab';
      } else {
        dispatch(stopDrawing());
        isDrawingRef.current = false;
      }
    };
    
    const handleTextTool = (point: Point) => {
      const placeholderText = "Text";
      dispatch(addText({ point, text: placeholderText }));
    };
    
    // Mouse events
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    canvasElement.addEventListener('touchstart', handleMouseDown, { passive: false });
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp, { passive: false });
    
    // Prevent default touch behavior to avoid scrolling
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.target === canvasElement) {
        e.preventDefault();
      }
    };
    
    canvasElement.addEventListener('touchstart', preventDefaultTouch, { passive: false });
    canvasElement.addEventListener('touchmove', preventDefaultTouch, { passive: false });
    
    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      canvasElement.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      
      canvasElement.removeEventListener('touchstart', preventDefaultTouch);
      canvasElement.removeEventListener('touchmove', preventDefaultTouch);
    };
  }, [canvasRef, dispatch, activeTool, selectedColor]);
}
