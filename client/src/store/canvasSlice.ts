import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { 
  ToolType, 
  ShapeType, 
  Point,
  Line,
  Shape,
  TextElement,
  ImageElement,
  CanvasElement,
  CanvasHistory
} from '../types/canvas';

interface CanvasState {
  activeTool: ToolType;
  selectedColor: string;
  strokeWidth: number;
  zoomLevel: number;
  shapesMenuOpen: boolean;
  selectedShape: ShapeType | null;
  isDrawing: boolean;
  lastPoint: Point | null;
  elements: CanvasElement[];
  history: CanvasHistory[];
  historyIndex: number;
  selectedElement: string | null;
  isPanning: boolean;
  pan: Point;
  editingText: string | null;
}

const initialState: CanvasState = {
  activeTool: ToolType.SELECT,
  selectedColor: '#0066FF',
  strokeWidth: 2,
  zoomLevel: 100,
  shapesMenuOpen: false,
  selectedShape: null,
  isDrawing: false,
  lastPoint: null,
  elements: [],
  history: [],
  historyIndex: -1,
  selectedElement: null,
  isPanning: false,
  pan: { x: 0, y: 0 },
  editingText: null
};

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<ToolType>) => {
      // If switching away from eraser, stop erasing
      if (state.activeTool === ToolType.ERASER && action.payload !== ToolType.ERASER) {
        state.editingText = null;
      }
      
      state.activeTool = action.payload;
      // Close shapes menu if a different tool is selected
      if (action.payload !== ToolType.SHAPES) {
        state.shapesMenuOpen = false;
      }
    },
    setSelectedColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
    setStrokeWidth: (state, action: PayloadAction<number>) => {
      state.strokeWidth = action.payload;
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = action.payload;
    },
    toggleShapesMenu: (state) => {
      state.shapesMenuOpen = !state.shapesMenuOpen;
    },
    selectShape: (state, action: PayloadAction<ShapeType>) => {
      state.selectedShape = action.payload;
      state.activeTool = ToolType.SHAPES;
      state.shapesMenuOpen = false;
    },
    startDrawing: (state, action: PayloadAction<Point>) => {
      state.isDrawing = true;
      state.lastPoint = action.payload;
      
      if (state.activeTool === ToolType.PEN || state.activeTool === ToolType.MARKER) {
        const newLine: Line = {
          id: nanoid(),
          tool: state.activeTool,
          color: state.selectedColor,
          strokeWidth: state.strokeWidth,
          points: [action.payload],
          opacity: state.activeTool === ToolType.MARKER ? 0.5 : 1
        };
        state.elements.push(newLine);
      } else if (state.activeTool === ToolType.SHAPES && state.selectedShape) {
        const newShape: Shape = {
          id: nanoid(),
          type: state.selectedShape,
          x: action.payload.x,
          y: action.payload.y,
          width: 0,
          height: 0,
          color: state.selectedColor,
          strokeWidth: state.strokeWidth
        };
        state.elements.push(newShape);
      }
    },
    continueDrawing: (state, action: PayloadAction<Point>) => {
      if (!state.isDrawing) return;
      
      if ((state.activeTool === ToolType.PEN || state.activeTool === ToolType.MARKER) && state.lastPoint) {
        const lastElement = state.elements[state.elements.length - 1] as Line;
        if (lastElement && 'points' in lastElement) {
          lastElement.points.push(action.payload);
        }
      } else if (state.activeTool === ToolType.SHAPES && state.selectedShape) {
        const lastElement = state.elements[state.elements.length - 1] as Shape;
        if (lastElement && 'type' in lastElement) {
          lastElement.width = action.payload.x - lastElement.x;
          lastElement.height = action.payload.y - lastElement.y;
        }
      }
      
      state.lastPoint = action.payload;
    },
    stopDrawing: (state) => {
      if (state.isDrawing) {
        // Save to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          elements: JSON.parse(JSON.stringify(state.elements)),
          selectedElement: state.selectedElement
        });
        state.historyIndex = state.history.length - 1;
      }
      
      state.isDrawing = false;
      state.lastPoint = null;
    },
    addText: (state, action: PayloadAction<{ point: Point, text: string }>) => {
      const id = nanoid();
      const newText: TextElement = {
        id,
        x: action.payload.point.x,
        y: action.payload.point.y,
        text: action.payload.text,
        color: state.selectedColor,
        fontSize: 14 + state.strokeWidth,
        width: 200,
        height: 30
      };
      state.elements.push(newText);
      state.selectedElement = id;
      state.editingText = id;
      
      // Save to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        elements: JSON.parse(JSON.stringify(state.elements)),
        selectedElement: state.selectedElement
      });
      state.historyIndex = state.history.length - 1;
    },
    
    startEditingText: (state, action: PayloadAction<string>) => {
      state.editingText = action.payload;
      state.selectedElement = action.payload;
    },
    
    updateTextElement: (state, action: PayloadAction<{ id: string, text: string, width?: number, height?: number }>) => {
      const textElement = state.elements.find(el => el.id === action.payload.id && 'text' in el) as TextElement | undefined;
      
      if (textElement) {
        textElement.text = action.payload.text;
        
        if (action.payload.width) {
          textElement.width = action.payload.width;
        }
        
        if (action.payload.height) {
          textElement.height = action.payload.height;
        }
        
        // Save to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push({
          elements: JSON.parse(JSON.stringify(state.elements)),
          selectedElement: state.selectedElement
        });
        state.historyIndex = state.history.length - 1;
      }
      
      state.editingText = null;
    },
    
    stopEditingText: (state) => {
      state.editingText = null;
    },
    addImage: (state, action: PayloadAction<{ point: Point, src: string, width: number, height: number }>) => {
      const newImage: ImageElement = {
        id: nanoid(),
        x: action.payload.point.x,
        y: action.payload.point.y,
        width: action.payload.width,
        height: action.payload.height,
        src: action.payload.src
      };
      state.elements.push(newImage);
      
      // Save to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        elements: JSON.parse(JSON.stringify(state.elements)),
        selectedElement: state.selectedElement
      });
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.elements = JSON.parse(JSON.stringify(state.history[state.historyIndex].elements));
        state.selectedElement = state.history[state.historyIndex].selectedElement;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.elements = JSON.parse(JSON.stringify(state.history[state.historyIndex].elements));
        state.selectedElement = state.history[state.historyIndex].selectedElement;
      }
    },
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElement = action.payload;
    },
    startPanning: (state, action: PayloadAction<Point>) => {
      state.isPanning = true;
      state.lastPoint = action.payload;
    },
    continuePanning: (state, action: PayloadAction<Point>) => {
      if (!state.isPanning || !state.lastPoint) return;
      
      const dx = action.payload.x - state.lastPoint.x;
      const dy = action.payload.y - state.lastPoint.y;
      
      state.pan = {
        x: state.pan.x + dx,
        y: state.pan.y + dy
      };
      
      state.lastPoint = action.payload;
    },
    stopPanning: (state) => {
      state.isPanning = false;
      state.lastPoint = null;
    },
    resetZoom: (state) => {
      state.zoomLevel = 100;
      state.pan = { x: 0, y: 0 };
    }
  },
});

export const { 
  setActiveTool,
  setSelectedColor,
  setStrokeWidth,
  setZoomLevel,
  toggleShapesMenu,
  selectShape,
  startDrawing,
  continueDrawing,
  stopDrawing,
  addText,
  addImage,
  undo,
  redo,
  selectElement,
  startPanning,
  continuePanning,
  stopPanning,
  resetZoom
} = canvasSlice.actions;

export default canvasSlice.reducer;
