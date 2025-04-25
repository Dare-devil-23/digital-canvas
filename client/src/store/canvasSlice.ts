import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import {
  ToolType,
  ShapeType,
  GridType,
  Point,
  Line,
  Shape,
  TextElement,
  ImageElement,
  CanvasElement,
  CanvasHistory,
} from "../types/canvas";

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
  gridType: GridType;
  isErasing: boolean;
}

const initialState: CanvasState = {
  activeTool: ToolType.HAND,
  selectedColor: "#FF6B00",
  strokeWidth: 2,
  zoomLevel: 100,
  shapesMenuOpen: false,
  selectedShape: null,
  isDrawing: false,
  lastPoint: null,
  elements: [],
  history: [{
    elements: [],
    selectedElement: null
  }],
  historyIndex: 0,
  selectedElement: null,
  isPanning: false,
  pan: { x: 0, y: 0 },
  editingText: null,
  gridType: GridType.LINED,
  isErasing: false,
};

// Helper function to handle erasing elements
const handleErasing = (state: CanvasState, point: Point) => {
  const { x, y } = point;
  const eraserRadius = state.strokeWidth * 4; // Size of eraser brush
  const newElements: CanvasElement[] = [];
  let modified = false;

  state.elements.forEach((element) => {
    if ("points" in element) {
      // For lines - split them if touched by eraser
      const points = element.points;
      const segments: Point[][] = [];
      let currentSegment: Point[] = [];

      // Check if line is touched by eraser
      let lineTouched = false;

      // Check each point and each segment between points
      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        // Check if this point is under the eraser
        const distance = Math.sqrt(
          Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
        );

        const pointErased = distance < eraserRadius;

        // If point is not erased, add to current segment
        if (!pointErased) {
          currentSegment.push(point);
        } else {
          lineTouched = true;

          // Close the segment if it has points and start a new one
          if (currentSegment.length > 0) {
            segments.push([...currentSegment]);
            currentSegment = [];
          }
        }

        // If we have consecutive points, also check if eraser crosses the line between them
        if (i > 0 && !pointErased && !lineTouched) {
          const prevPoint = points[i - 1];
          // Simple line segment intersection with circle (eraser)
          // This is a simplified approach - just checking a few points along the line
          const steps = 5;
          for (let j = 1; j < steps; j++) {
            const t = j / steps;
            const checkX = prevPoint.x + (point.x - prevPoint.x) * t;
            const checkY = prevPoint.y + (point.y - prevPoint.y) * t;
            const checkDistance = Math.sqrt(
              Math.pow(checkX - x, 2) + Math.pow(checkY - y, 2)
            );

            if (checkDistance < eraserRadius) {
              lineTouched = true;
              // Split the current segment
              if (currentSegment.length > 0) {
                segments.push([...currentSegment]);
                currentSegment = [];
              }
              break;
            }
          }
        }
      }

      // Add the last segment if it has points
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      // If line wasn't touched by eraser or all segments were erased
      if (!lineTouched) {
        newElements.push(element);
      } else {
        modified = true;
        // Create new line elements for each segment with at least 2 points
        segments.forEach(segment => {
          if (segment.length >= 2) {
            const newLine: Line = {
              id: nanoid(),
              tool: element.tool,
              color: element.color,
              strokeWidth: element.strokeWidth,
              points: segment,
              opacity: element.opacity || 1,
            };
            newElements.push(newLine);
          }
        });
      }
    } else if ("x" in element && "width" in element && "height" in element && "type" in element) {
      // For shapes - more precise hit detection using distance from center for circles 
      // and precise edge detection for rectangles
      let shapeHit = false;

      if (element.type === 'rectangle') {
        // For rectangles, check if point is inside with some margin for edge detection
        const inBounds =
          x >= element.x - eraserRadius &&
          x <= element.x + element.width + eraserRadius &&
          y >= element.y - eraserRadius &&
          y <= element.y + element.height + eraserRadius;

        // If inside bounds, check if point is close to any edge
        if (inBounds) {
          // Check if near the edges
          const nearLeftEdge = Math.abs(x - element.x) < eraserRadius;
          const nearRightEdge = Math.abs(x - (element.x + element.width)) < eraserRadius;
          const nearTopEdge = Math.abs(y - element.y) < eraserRadius;
          const nearBottomEdge = Math.abs(y - (element.y + element.height)) < eraserRadius;

          shapeHit = nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge;

          // If point is deep inside (not just near edges), consider it a hit too
          const deepInside =
            x > element.x + eraserRadius &&
            x < element.x + element.width - eraserRadius &&
            y > element.y + eraserRadius &&
            y < element.y + element.height - eraserRadius;

          shapeHit = shapeHit || deepInside;
        }
      } else if (element.type === 'circle') {
        // For circles, check distance from center
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        const radius = Math.max(element.width, element.height) / 2;

        const distanceFromCenter = Math.sqrt(
          Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
        );

        shapeHit = distanceFromCenter <= radius + eraserRadius;
      } else {
        // For other shapes like triangles, use the bounding box approach for now
        const inBounds =
          x >= element.x - eraserRadius &&
          x <= element.x + element.width + eraserRadius &&
          y >= element.y - eraserRadius &&
          y <= element.y + element.height + eraserRadius;

        shapeHit = inBounds;
      }

      if (!shapeHit) {
        newElements.push(element);
      } else {
        modified = true;
      }
    } else if ("x" in element && "width" in element && "height" in element) {
      // For other elements with dimensions (text, images)
      // Use a more precise check - only erase if clicking directly on it
      const inBounds =
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height;

      if (!inBounds) {
        newElements.push(element);
      } else {
        modified = true;
      }
    } else {
      // For other elements, keep them
      newElements.push(element);
    }
  });

  // If anything was modified, update elements
  if (modified) {
    // Update elements with the new filtered list
    state.elements = newElements;
    return true;
  }

  return false;
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<ToolType>) => {
      // If switching away from eraser, stop erasing
      if (
        state.activeTool === ToolType.ERASER &&
        action.payload !== ToolType.ERASER
      ) {
        state.editingText = null;
        state.isErasing = false;
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
    startDrawing: (
      state,
      action: PayloadAction<Point & { isEraser?: boolean }>,
    ) => {
      state.isDrawing = true;
      state.lastPoint = action.payload;

      if (action.payload.isEraser) {
        state.isErasing = true;
        // Create a copy of elements array for history tracking
        const oldElements = JSON.parse(JSON.stringify(state.elements));

        // Use the helper function for erasing
        const modified = handleErasing(state, action.payload);

        // If elements were modified, save to history
        if (modified) {
          // Save to history immediately after each eraser action
          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push({
            elements: oldElements,
            selectedElement: state.selectedElement,
          });
          state.historyIndex = state.history.length - 1;
        }
      } else if (
        state.activeTool === ToolType.PEN ||
        state.activeTool === ToolType.MARKER
      ) {
        const newLine: Line = {
          id: nanoid(),
          tool: state.activeTool,
          color: state.selectedColor,
          strokeWidth: state.strokeWidth,
          points: [action.payload],
          opacity: state.activeTool === ToolType.MARKER ? 0.5 : 1,
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
          strokeWidth: state.strokeWidth,
        };
        state.elements.push(newShape);
      }
    },
    continueDrawing: (state, action: PayloadAction<Point>) => {
      if (!state.isDrawing) return;

      if (state.isErasing) {
        // Handle continuous erasing while moving the eraser
        handleErasing(state, action.payload);
      } else if (
        (state.activeTool === ToolType.PEN ||
          state.activeTool === ToolType.MARKER) &&
        state.lastPoint
      ) {
        const lastElement = state.elements[state.elements.length - 1] as Line;
        if (lastElement && "points" in lastElement) {
          lastElement.points.push(action.payload);
        }
      } else if (state.activeTool === ToolType.SHAPES && state.selectedShape) {
        const lastElement = state.elements[state.elements.length - 1] as Shape;
        if (lastElement && "type" in lastElement) {
          lastElement.width = action.payload.x - lastElement.x;
          lastElement.height = action.payload.y - lastElement.y;
        }
      }

      state.lastPoint = action.payload;
    },
    stopDrawing: (state) => {
      if (state.isDrawing) {
        // Save to history
        if (state.isErasing) {
          state.isErasing = false;
        } else {
          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push({
            elements: JSON.parse(JSON.stringify(state.elements)),
            selectedElement: state.selectedElement,
          });
          state.historyIndex = state.history.length - 1;
        }
      }

      state.isDrawing = false;
      state.lastPoint = null;
    },
    addText: (state, action: PayloadAction<{ point: Point; text: string }>) => {
      const id = nanoid();
      const newText: TextElement = {
        id,
        x: action.payload.point.x,
        y: action.payload.point.y,
        text: action.payload.text,
        color: state.selectedColor,
        fontSize: 14 + state.strokeWidth,
        width: 200,
        height: 30,
      };
      state.elements.push(newText);
      state.selectedElement = id;
      state.editingText = id;

      // Save to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        elements: JSON.parse(JSON.stringify(state.elements)),
        selectedElement: state.selectedElement,
      });
      state.historyIndex = state.history.length - 1;
    },

    startEditingText: (state, action: PayloadAction<string>) => {
      state.editingText = action.payload;
      state.selectedElement = action.payload;
    },

    updateTextElement: (
      state,
      action: PayloadAction<{
        id: string;
        text: string;
        width?: number;
        height?: number;
      }>,
    ) => {
      const textElement = state.elements.find(
        (el) => el.id === action.payload.id && "text" in el,
      ) as TextElement | undefined;

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
          selectedElement: state.selectedElement,
        });
        state.historyIndex = state.history.length - 1;
      }

      state.editingText = null;
    },

    stopEditingText: (state) => {
      state.editingText = null;
    },
    addImage: (
      state,
      action: PayloadAction<{
        point: Point;
        src: string;
        width: number;
        height: number;
      }>,
    ) => {
      const newImage: ImageElement = {
        id: nanoid(),
        x: action.payload.point.x,
        y: action.payload.point.y,
        width: action.payload.width,
        height: action.payload.height,
        src: action.payload.src,
      };
      state.elements.push(newImage);

      // Save to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push({
        elements: JSON.parse(JSON.stringify(state.elements)),
        selectedElement: state.selectedElement,
      });
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.elements = JSON.parse(
          JSON.stringify(state.history[state.historyIndex].elements),
        );
        state.selectedElement =
          state.history[state.historyIndex].selectedElement;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.elements = JSON.parse(
          JSON.stringify(state.history[state.historyIndex].elements),
        );
        state.selectedElement =
          state.history[state.historyIndex].selectedElement;
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
        y: state.pan.y + dy,
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
    },
    setGridType: (state, action: PayloadAction<GridType>) => {
      state.gridType = action.payload;
    },
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
  resetZoom,
  setGridType,
  startEditingText,
  updateTextElement,
  stopEditingText
} = canvasSlice.actions;

export default canvasSlice.reducer;
