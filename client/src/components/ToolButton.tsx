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
        "toolbar-button rounded-lg p-2 mb-2 w-10 h-10 flex items-center justify-center relative",
        active && "active"
      )}
      whileHover={{ scale: active ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={name}
    >
      <Icon className="w-5 h-5" />
      {shortcut && (
        <motion.div 
          className="toolbar-tooltip absolute left-full ml-1 bg-uiicondark text-white px-2 py-1 rounded text-xs whitespace-nowrap"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 0, x: 8 }}
          exit={{ opacity: 0, x: 8 }}
        >
          {name} ({shortcut})
        </motion.div>
      )}
    </motion.button>
  );
}
