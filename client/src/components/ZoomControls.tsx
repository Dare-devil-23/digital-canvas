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
      className="fixed bottom-4 right-4 flex items-center z-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Zoom Out */}
      <motion.button 
        className="p-1.5 w-9 h-9 flex items-center justify-center relative border-r border-gray-200 dark:border-gray-800"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.button>
      
      {/* Zoom Level */}
      <div className="flex items-center px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800">
        <span>{zoomLevel}%</span>
      </div>
      
      {/* Zoom In */}
      <motion.button 
        className="p-1.5 w-9 h-9 flex items-center justify-center relative"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.button>
    </motion.div>
  );
}
