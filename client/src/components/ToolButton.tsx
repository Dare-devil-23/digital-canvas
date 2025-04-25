import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  name: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
  shortcut?: string;
}

export default function ToolButton({ name, icon: Icon, active = false, onClick, shortcut }: ToolButtonProps) {
  return (
    <motion.button
      className={cn(
        "toolbar-button rounded-lg p-2 mb-2.5 w-11 h-11 flex items-center justify-center relative",
        active ? "active bg-primary/10 text-primary shadow-sm" : "hover:bg-black/5 dark:hover:bg-white/10"
      )}
      whileHover={{ scale: active ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={name}
      style={{
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-gray-600 dark:text-gray-300")} />
      
      {shortcut && (
        <motion.div 
          className="toolbar-tooltip absolute left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md z-50"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 0, x: 8 }}
          exit={{ opacity: 0, x: 8 }}
        >
          {name} <span className="ml-1 opacity-75 bg-black/20 px-1.5 py-0.5 rounded">{shortcut}</span>
        </motion.div>
      )}
    </motion.button>
  );
}
