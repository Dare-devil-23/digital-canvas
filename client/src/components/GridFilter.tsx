import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setGridType } from '../store/canvasSlice';
import { GridType } from '../types/canvas';
import { RootState } from '../store/store';
import { Grid3x3, Grid, CircleDot, FileText, X } from 'lucide-react';

export default function GridFilter() {
  const dispatch = useDispatch();
  const { gridType } = useSelector((state: RootState) => state.canvas);
  const [isOpen, setIsOpen] = useState(false);

  const handleGridChange = (type: GridType) => {
    dispatch(setGridType(type));
    setIsOpen(false);
  };

  const getGridIcon = () => {
    switch (gridType) {
      case GridType.STANDARD:
        return <Grid className="w-4 h-4" />;
      case GridType.QUAD:
        return <Grid3x3 className="w-4 h-4" />;
      case GridType.DOTS:
        return <CircleDot className="w-4 h-4" />;
      case GridType.LINED:
        return <FileText className="w-4 h-4" />;
      case GridType.NONE:
        return <X className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="absolute top-4 left-4 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Toggle Button */}
        <motion.button
          className="bg-background dark:bg-uibg rounded-lg p-2 shadow-md flex items-center justify-center gap-2 w-10 h-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Grid Options"
        >
          {getGridIcon()}
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-full left-0 mt-2 bg-background dark:bg-uibg rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className="p-2 flex flex-col gap-1 min-w-[180px]">
                <button
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-sm ${gridType === GridType.LINED ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`}
                  onClick={() => handleGridChange(GridType.LINED)}
                >
                  <FileText className="w-4 h-4" />
                  <span>Notebook Paper</span>
                </button>

                <button
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-sm ${gridType === GridType.STANDARD ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`}
                  onClick={() => handleGridChange(GridType.STANDARD)}
                >
                  <Grid className="w-4 h-4" />
                  <span>Graph Paper</span>
                </button>

                <button
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-sm ${gridType === GridType.QUAD ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`}
                  onClick={() => handleGridChange(GridType.QUAD)}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span>Engineering Paper</span>
                </button>

                <button
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-sm ${gridType === GridType.DOTS ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`}
                  onClick={() => handleGridChange(GridType.DOTS)}
                >
                  <CircleDot className="w-4 h-4" />
                  <span>Dot Journal</span>
                </button>

                <button
                  className={`flex items-center gap-2 p-2 rounded-md text-left text-sm ${gridType === GridType.NONE ? 'bg-primary/10 text-primary' : 'hover:bg-black/5'}`}
                  onClick={() => handleGridChange(GridType.NONE)}
                >
                  <X className="w-4 h-4" />
                  <span>Blank Paper</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 