import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToolType, Point } from '../types/canvas';
import { 
  startDrawing, 
  continueDrawing, 
  stopDrawing, 
  addText,
  startPanning,
  continuePanning,
  stopPanning,
  startEditingText
} from '../store/canvasSlice';
import { getPointFromEvent } from '../lib/utils';
import { RootState } from '../store/store';

interface UseDrawingProps {
  activeTool: ToolType;
  canvasRef: React.RefObject<HTMLDivElement>;
  selectedColor: string;
}

export function useDrawing({ activeTool, canvasRef, selectedColor }: UseDrawingProps) {
  const dispatch = useDispatch();
  const isDrawingRef = useRef(false);
  const elements = useSelector((state: RootState) => state.canvas.elements);
  
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    
    const handleMouseDown = (e: any) => {
      const rect = canvasElement.getBoundingClientRect();
      const point = getPointFromEvent(e, rect);
      
      if (activeTool === ToolType.TEXT) {
        handleTextTool(point, e);
        return;
      }

      if (activeTool === ToolType.SELECT) {
        return;
      }
      
      if (activeTool === ToolType.HAND) {
        dispatch(startPanning(point));
        document.body.style.cursor = 'grabbing';
      } else if (activeTool === ToolType.ERASER) {
        dispatch(startDrawing({
          ...point,
          isEraser: true
        }));
        isDrawingRef.current = true;
      } else {
        const adjustedPoint = {
          ...point,
          strokeWidth: activeTool === ToolType.MARKER ? 8 : undefined
        };
        dispatch(startDrawing(adjustedPoint));
        isDrawingRef.current = true;
      }
    };
    
    const handleMouseMove = (e: any) => {
      const rect = canvasElement.getBoundingClientRect();
      const point = getPointFromEvent(e, rect);
      
      if (activeTool === ToolType.HAND) {
        dispatch(continuePanning(point));
      } else if (isDrawingRef.current) {
        if (activeTool === ToolType.ERASER) {
          dispatch(startDrawing({
            ...point,
            isEraser: true
          }));
        } else {
          dispatch(continueDrawing(point));
        }
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
    
    const handleTextTool = (point: Point, event: any) => {
      // Check if we clicked on an existing text element
      const clickedElement = elements.find(element => {
        if ('text' in element) {
          // Check if the point is within this text element's bounds
          return (
            point.x >= element.x && 
            point.x <= element.x + element.width && 
            point.y >= element.y && 
            point.y <= element.y + element.height
          );
        }
        return false;
      });
      
      if (clickedElement) {
        // If we clicked on an existing text element, start editing it immediately
        dispatch(startEditingText(clickedElement.id));
      } else {
        // Otherwise create a new text element
        const placeholderText = "Text";
        dispatch(addText({ point, text: placeholderText }));
      }
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
  }, [canvasRef, dispatch, activeTool, selectedColor, elements]);
}
