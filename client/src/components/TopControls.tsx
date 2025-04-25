import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { undo, redo } from '../store/canvasSlice';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Share } from 'lucide-react';

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
      className="absolute top-4 right-4 flex items-center gap-3 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Undo/Redo */}
      <div className="bg-white dark:bg-uibg rounded-lg shadow-md flex">
        <motion.button 
          className="toolbar-button rounded-l-lg p-2 w-10 h-10 flex items-center justify-center relative border-r border-uiborder"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUndo}
          aria-label="Undo"
        >
          <Undo className="w-5 h-5" />
        </motion.button>
        
        <motion.button 
          className="toolbar-button rounded-r-lg p-2 w-10 h-10 flex items-center justify-center relative"
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRedo}
          aria-label="Redo"
        >
          <Redo className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Share Button */}
      <Button 
        className="gap-2"
        onClick={handleShare}
      >
        <Share className="w-4 h-4" />
        Share
      </Button>
      
      {/* User Avatar */}
      <motion.div 
        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-medium shadow-md cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        JS
      </motion.div>
    </motion.div>
  );
}
