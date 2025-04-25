import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setZoomLevel, resetZoom } from '../store/canvasSlice';
import { Minus, Plus, Search } from 'lucide-react';

export default function ZoomControls() {
  const dispatch = useDispatch();
  const { zoomLevel } = useSelector((state: RootState) => state.canvas);
  
  const handleZoomIn = () => {
    dispatch(setZoomLevel(Math.min(zoomLevel + 25, 300)));
  };
  
  const handleZoomOut = () => {
    dispatch(setZoomLevel(Math.max(zoomLevel - 25, 25)));
  };
  
  const handleResetZoom = () => {
    dispatch(resetZoom());
  };
  
  return (
    <motion.div 
      className="absolute bottom-4 right-4 flex items-center gap-3 z-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Zoom Level */}
      <div className="bg-background dark:bg-uibg rounded-lg shadow-md flex items-center px-3 py-2 text-sm">
        <span>{zoomLevel}%</span>
      </div>
      
      {/* Zoom Controls */}
      <div className="bg-background dark:bg-uibg rounded-lg shadow-md flex">
        {/* Zoom Out */}
        <motion.button 
          className="toolbar-button rounded-l-lg p-2 w-10 h-10 flex items-center justify-center relative border-r border-uiborder"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </motion.button>
        
        {/* Zoom Reset */}
        <motion.button 
          className="toolbar-button p-2 w-10 h-10 flex items-center justify-center relative border-r border-uiborder"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetZoom}
          aria-label="Reset zoom"
        >
          <Search className="w-5 h-5" />
        </motion.button>
        
        {/* Zoom In */}
        <motion.button 
          className="toolbar-button rounded-r-lg p-2 w-10 h-10 flex items-center justify-center relative"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
