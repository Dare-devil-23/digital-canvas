import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPointFromEvent(e: React.MouseEvent | React.TouchEvent | TouchEvent, rect: DOMRect) {
  const clientX = 'touches' in e 
    ? (e.touches[0] ? e.touches[0].clientX : (e as TouchEvent).changedTouches[0].clientX) 
    : (e as React.MouseEvent).clientX;
    
  const clientY = 'touches' in e 
    ? (e.touches[0] ? e.touches[0].clientY : (e as TouchEvent).changedTouches[0].clientY) 
    : (e as React.MouseEvent).clientY;
    
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  return { x, y };
}
