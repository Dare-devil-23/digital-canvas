import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  setActiveTool, 
  toggleShapesMenu, 
  selectShape 
} from '../store/canvasSlice';
import { ToolType, ShapeType } from '../types/canvas';
import ToolButton from './ToolButton';
import {
  MousePointer,
  Hand,
  Pen,
  Highlighter,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Triangle,
  Type,
  Image as ImageIcon,
  MoreHorizontal,
  Plus
} from 'lucide-react';

export default function ToolbarPanel() {
  const dispatch = useDispatch();
  const { activeTool, shapesMenuOpen } = useSelector((state: RootState) => state.canvas);
  
  const handleToolClick = (tool: ToolType) => {
    dispatch(setActiveTool(tool));
  };
  
  const handleShapesClick = () => {
    dispatch(toggleShapesMenu());
  };
  
  const handleShapeSelect = (shape: ShapeType) => {
    dispatch(selectShape(shape));
  };
  
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Handle image upload in the canvas component
            const fileUploadEvent = new CustomEvent('image-upload', {
              detail: {
                src: event.target?.result,
                width: img.width,
                height: img.height
              }
            });
            document.dispatchEvent(fileUploadEvent);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  
  return (
    <motion.div 
      className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center z-20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      {/* Left Tools Section */}
      <div className="flex items-center border-r border-gray-200 dark:border-gray-800 px-1.5 py-1.5">
        <div className="flex items-center">
          <motion.button
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.SELECT ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToolClick(ToolType.SELECT)}
          >
            <MousePointer className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.HAND ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToolClick(ToolType.HAND)}
          >
            <Hand className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Drawing Tools Section */}
      <div className="flex items-center px-1.5 py-1.5 border-r border-gray-200 dark:border-gray-800">
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.PEN ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToolClick(ToolType.PEN)}
        >
          <Pen className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.MARKER ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToolClick(ToolType.MARKER)}
        >
          <Highlighter className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.ERASER ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToolClick(ToolType.ERASER)}
        >
          <Eraser className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Shapes Section */}
      <div className="flex items-center border-r border-gray-200 dark:border-gray-800 px-1.5 py-1.5 relative">
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.SHAPES ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShapesClick}
        >
          <Square className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShapeSelect('circle')}
        >
          <Circle className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShapeSelect('triangle')}
        >
          <Triangle className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShapeSelect('arrow')}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Content Tools Section */}
      <div className="flex items-center px-1.5 py-1.5">
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.TEXT ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToolClick(ToolType.TEXT)}
        >
          <Type className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${activeTool === ToolType.IMAGE ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleImageUpload}
        >
          <ImageIcon className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 hover:bg-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
