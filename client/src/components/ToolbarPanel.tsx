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
  Type,
  Image as ImageIcon,
  MoreHorizontal,
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
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-uibg rounded-xl shadow-md flex flex-col items-center py-3 px-2 z-10"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ToolButton
        name="Select"
        icon={MousePointer}
        active={activeTool === ToolType.SELECT}
        onClick={() => handleToolClick(ToolType.SELECT)}
        shortcut="V"
      />
      
      <ToolButton
        name="Hand"
        icon={Hand}
        active={activeTool === ToolType.HAND}
        onClick={() => handleToolClick(ToolType.HAND)}
        shortcut="H"
      />
      
      <ToolButton
        name="Pen"
        icon={Pen}
        active={activeTool === ToolType.PEN}
        onClick={() => handleToolClick(ToolType.PEN)}
        shortcut="P"
      />
      
      <ToolButton
        name="Marker"
        icon={Highlighter}
        active={activeTool === ToolType.MARKER}
        onClick={() => handleToolClick(ToolType.MARKER)}
        shortcut="M"
      />
      
      <ToolButton
        name="Eraser"
        icon={Eraser}
        active={activeTool === ToolType.ERASER}
        onClick={() => handleToolClick(ToolType.ERASER)}
        shortcut="E"
      />
      
      <div className="relative">
        <ToolButton
          name="Shapes"
          icon={MoreHorizontal}
          active={activeTool === ToolType.SHAPES}
          onClick={handleShapesClick}
          shortcut="S"
        />
        
        <AnimatePresence>
          {shapesMenuOpen && (
            <motion.div 
              className="absolute left-full ml-3 bg-white dark:bg-uibg rounded-lg shadow-md flex p-2"
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button 
                className="toolbar-button rounded-lg p-2 m-1 w-9 h-9 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShapeSelect('rectangle')}
              >
                <Square className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                className="toolbar-button rounded-lg p-2 m-1 w-9 h-9 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShapeSelect('circle')}
              >
                <Circle className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                className="toolbar-button rounded-lg p-2 m-1 w-9 h-9 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShapeSelect('arrow')}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ToolButton
        name="Text"
        icon={Type}
        active={activeTool === ToolType.TEXT}
        onClick={() => handleToolClick(ToolType.TEXT)}
        shortcut="T"
      />
      
      <ToolButton
        name="Image"
        icon={ImageIcon}
        active={activeTool === ToolType.IMAGE}
        onClick={handleImageUpload}
        shortcut="I"
      />
    </motion.div>
  );
}
