import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';

interface MobileToolbarToggleProps {
  toolbarRef: React.RefObject<HTMLDivElement>;
  colorPaletteRef: React.RefObject<HTMLDivElement>;
}

export default function MobileToolbarToggle({ toolbarRef, colorPaletteRef }: MobileToolbarToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleToolbar = () => {
    setIsOpen(!isOpen);
    
    if (toolbarRef.current) {
      toolbarRef.current.classList.toggle('hidden');
    }
    
    if (colorPaletteRef.current) {
      colorPaletteRef.current.classList.toggle('hidden');
    }
  };
  
  return (
    <motion.button 
      className="lg:hidden fixed bottom-6 left-6 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleToolbar}
      aria-label="Toggle toolbar"
    >
      <Palette className="w-6 h-6" />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
