import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSelectedColor, setStrokeWidth } from '../store/canvasSlice';
import { ToolType } from '../types/canvas';

const COLORS = [
  '#FF6B00', // Primary Orange,
  '#FFD700', // Gold
  '#0066FF', // blue
  '#22C55E', // Green
  '#F43F5E', // Red
  '#000000', // Black
];

const STROKE_WIDTHS = [2, 4, 6];

export default function ColorPalette() {
  const dispatch = useDispatch();
  const { activeTool, selectedColor, strokeWidth, shapesMenuOpen } = useSelector((state: RootState) => state.canvas);
  
  const isDrawingTool = 
    activeTool === ToolType.PEN || 
    activeTool === ToolType.MARKER || 
    activeTool === ToolType.TEXT ||
    activeTool === ToolType.SHAPES ||
    activeTool === ToolType.ERASER;
  
  if (!isDrawingTool || shapesMenuOpen) return null;
  
  return (
    <motion.div 
      className="absolute left-20 bottom-1/4 md:bottom-4 transform -translate-y-1/2 bg-background dark:bg-uibg rounded-xl shadow-md flex flex-col items-center py-3 px-2 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {COLORS.map((color) => (
        <motion.button
          key={color}
          className="w-6 h-6 rounded-full m-1 relative"
          style={{ 
            backgroundColor: color,
            outline: `2px solid ${selectedColor === color ? 'rgba(0,0,0,0.1)' : 'transparent'}`,
            outlineOffset: '2px',
            pointerEvents: activeTool === ToolType.ERASER ? 'none' : 'auto',
            opacity: activeTool === ToolType.ERASER ? 0.2 : 1,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(setSelectedColor(color))}
          
        >
          {selectedColor === color && (
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-gray-800 dark:border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
      
      <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-2" />
      
      {STROKE_WIDTHS.map((width) => (
        <motion.button
          key={width}
          className={`w-full h-8 flex items-center justify-center my-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 
            ${activeTool === ToolType.MARKER && strokeWidth === width * 2 ? 'bg-primary/10 text-primary' : activeTool === ToolType.PEN && strokeWidth === width ? 'bg-primary/10 text-primary' : ''}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(setStrokeWidth(activeTool === ToolType.MARKER ? width * 2 : width))}
        >
          <motion.div 
            className="bg-current rounded-full"
            style={{ 
              height: `${width * 2}px`, 
              width: `${width}px`, 
              // opacity: strokeWidth === width ? 1 : 0.6,
            }}
            animate={{ 
              scale: strokeWidth === width ? 1.1 : 1,
            }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
