import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSelectedColor, setStrokeWidth } from '../store/canvasSlice';
import { ToolType } from '../types/canvas';

const COLORS = [
  '#6B66FF', // Purple
  '#4C9AFF', // Blue
  '#0BB580', // Green
  '#FF6B00', // Orange
  '#FF5630', // Red
  '#FFAA44', // Yellow
  '#FFFFFF', // White
  '#000000', // Black
];

const STROKE_WIDTHS = [2, 4, 6, 8];

export default function ColorPalette() {
  const dispatch = useDispatch();
  const { activeTool, selectedColor, strokeWidth } = useSelector((state: RootState) => state.canvas);
  
  // Always show the color palette in the top toolbar
  // We'll hide in CSS based on context if needed
  
  return (
    <motion.div 
      className="fixed top-3 right-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center px-2 py-1.5 z-20"
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-1 mr-1">
        {STROKE_WIDTHS.map((width) => (
          <motion.button
            key={width}
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${strokeWidth === width ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setStrokeWidth(width))}
          >
            <motion.div 
              className="bg-gray-800 dark:bg-gray-300 rounded-full"
              style={{ 
                height: `${width}px`, 
                width: `${Math.max(12, width * 3)}px`,
                opacity: strokeWidth === width ? 1 : 0.6 
              }}
            />
          </motion.button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
      
      <div className="flex items-center space-x-1">
        {COLORS.map((color) => (
          <motion.button
            key={color}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setSelectedColor(color))}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ 
                backgroundColor: color,
                border: color === '#FFFFFF' ? '1px solid #E0E0E0' : 'none'
              }}
            />
          </motion.button>
        ))}
        
        <motion.button
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500" />
        </motion.button>
      </div>
    </motion.div>
  );
}
