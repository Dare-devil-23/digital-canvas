import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { undo, redo } from '../store/canvasSlice';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Share, Users, Download } from 'lucide-react';

export default function TopControls() {
  const dispatch = useDispatch();
  
  const handleUndo = () => {
    dispatch(undo());
  };
  
  const handleRedo = () => {
    dispatch(redo());
  };
  
  const handleShare = () => {
    // In a real app, this would handle the sharing functionality
    alert('Sharing feature would be implemented here');
  };
  
  return (
    <motion.div 
      className="fixed top-3 right-[calc(50%+300px)] flex items-center gap-3 z-20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Undo/Redo */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg flex border border-gray-100 dark:border-gray-800">
        <motion.button 
          className="p-1.5 w-9 h-9 flex items-center justify-center relative border-r border-gray-200 dark:border-gray-800"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUndo}
          aria-label="Undo"
        >
          <Undo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
        
        <motion.button 
          className="p-1.5 w-9 h-9 flex items-center justify-center relative"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRedo}
          aria-label="Redo"
        >
          <Redo className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </div>
      
      {/* Additional controls on right side of screen */}
      <div className="fixed top-3 right-[calc(2rem+160px)] flex items-center gap-2">
        <motion.button
          className="flex items-center justify-center h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
        >
          <Share className="w-4 h-4" />
          Share
        </motion.button>

        <motion.button
          className="flex items-center justify-center h-9 w-9 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.02)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Users className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="flex items-center justify-center h-9 w-9 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"  
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.02)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
        </motion.button>
        
        {/* User Avatar */}
        <motion.div 
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium">JS</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
