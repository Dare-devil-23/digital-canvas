import { useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Image, Transformer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { KonvaEventObject } from 'konva/lib/Node';
import { RootState } from '../store/store';
import { addImage, selectElement, setActiveTool } from '../store/canvasSlice';
import { ToolType, Point } from '../types/canvas';
import { useDrawing } from '../hooks/useDrawing';
import useImage from 'use-image';

// Custom KonvaImage component to work with URLs
const KonvaImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
  const [image] = useImage(src);
  return <Image image={image} {...props} />;
};

export default function Canvas() {
  const dispatch = useDispatch();
  const { 
    activeTool, 
    selectedColor, 
    strokeWidth, 
    zoomLevel,
    elements,
    selectedElement,
    pan
  } = useSelector((state: RootState) => state.canvas);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  
  // Set up drawing handlers
  useDrawing({
    activeTool,
    canvasRef,
    selectedColor
  });
  
  // Update cursor based on active tool
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.classList.remove(
      'cursor-crosshair',
      'cursor-grab',
      'cursor-grabbing',
      'cursor-text',
      'cursor-eraser'
    );
    
    switch (activeTool) {
      case ToolType.SELECT:
        canvas.style.cursor = 'default';
        break;
      case ToolType.HAND:
        canvas.classList.add('cursor-grab');
        break;
      case ToolType.PEN:
      case ToolType.MARKER:
      case ToolType.SHAPES:
        canvas.classList.add('cursor-crosshair');
        break;
      case ToolType.ERASER:
        canvas.classList.add('cursor-eraser');
        break;
      case ToolType.TEXT:
        canvas.classList.add('cursor-text');
        break;
      default:
        canvas.style.cursor = 'default';
    }
  }, [activeTool]);
  
  // Listen for image uploads
  useEffect(() => {
    const handleImageUpload = (e: CustomEvent) => {
      const { src, width, height } = e.detail;
      
      if (canvasRef.current && stageRef.current) {
        const stage = stageRef.current;
        const pointerPosition = stage.getPointerPosition();
        const { x, y } = pointerPosition || { x: stage.width() / 2, y: stage.height() / 2 };
        
        // Calculate scaled dimensions to fit within a reasonable size
        const maxDimension = 500;
        let scaledWidth = width;
        let scaledHeight = height;
        
        if (width > height && width > maxDimension) {
          scaledWidth = maxDimension;
          scaledHeight = (height / width) * maxDimension;
        } else if (height > maxDimension) {
          scaledHeight = maxDimension;
          scaledWidth = (width / height) * maxDimension;
        }
        
        dispatch(addImage({
          point: { x, y },
          src,
          width: scaledWidth,
          height: scaledHeight
        }));
      }
    };
    
    document.addEventListener('image-upload', handleImageUpload as EventListener);
    
    return () => {
      document.removeEventListener('image-upload', handleImageUpload as EventListener);
    };
  }, [dispatch]);
  
  // Update transformer node when selection changes
  useEffect(() => {
    if (selectedElement && transformerRef.current && stageRef.current) {
      const stage = stageRef.current;
      const transformer = transformerRef.current;
      
      // Find the node by name (which is set to the element ID)
      const node = stage.findOne(`.${selectedElement}`);
      
      if (node) {
        transformer.nodes([node]);
        transformer.getLayer().batchDraw();
      } else {
        transformer.nodes([]);
        transformer.getLayer().batchDraw();
      }
    }
  }, [selectedElement, elements]);
  
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Deselect when clicking on empty space
    if (e.target === e.currentTarget) {
      dispatch(selectElement(null));
    }
  };
  
  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full canvas-grid bg-canvas dark:bg-gray-900"
    >
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleStageClick}
        scaleX={zoomLevel / 100}
        scaleY={zoomLevel / 100}
        x={pan.x}
        y={pan.y}
      >
        <Layer>
          {elements.map((element) => {
            if ('points' in element) {
              // Line or freehand drawing
              return (
                <Line
                  key={element.id}
                  points={element.points.flatMap(point => [point.x, point.y])}
                  stroke={element.color}
                  strokeWidth={element.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  opacity={element.opacity || 1}
                  name={element.id}
                  onClick={() => dispatch(selectElement(element.id))}
                />
              );
            } else if ('type' in element) {
              // Shape
              if (element.type === 'rectangle') {
                return (
                  <Rect
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    opacity={element.opacity || 1}
                    name={element.id}
                    onClick={() => dispatch(selectElement(element.id))}
                    draggable={activeTool === ToolType.SELECT}
                  />
                );
              } else if (element.type === 'circle') {
                return (
                  <Circle
                    key={element.id}
                    x={element.x + element.width / 2}
                    y={element.y + element.height / 2}
                    radius={Math.max(Math.abs(element.width), Math.abs(element.height)) / 2}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    opacity={element.opacity || 1}
                    name={element.id}
                    onClick={() => dispatch(selectElement(element.id))}
                    draggable={activeTool === ToolType.SELECT}
                  />
                );
              } else if (element.type === 'arrow') {
                return (
                  <Arrow
                    key={element.id}
                    points={[
                      element.x, element.y,
                      element.x + element.width, element.y + element.height
                    ]}
                    pointerLength={10}
                    pointerWidth={10}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    opacity={element.opacity || 1}
                    name={element.id}
                    onClick={() => dispatch(selectElement(element.id))}
                    draggable={activeTool === ToolType.SELECT}
                  />
                );
              }
            } else if ('text' in element) {
              // Text
              return (
                <Text
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  text={element.text}
                  fill={element.color}
                  fontSize={element.fontSize}
                  width={element.width}
                  name={element.id}
                  onClick={() => {
                    dispatch(selectElement(element.id));
                    dispatch(setActiveTool(ToolType.TEXT));
                  }}
                  draggable={activeTool === ToolType.SELECT}
                  onDblClick={() => {
                    // In a real app, this would open a text editor
                    console.log('Edit text');
                  }}
                />
              );
            } else if ('src' in element) {
              // Image
              return (
                <KonvaImage
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  src={element.src}
                  name={element.id}
                  onClick={() => dispatch(selectElement(element.id))}
                  draggable={activeTool === ToolType.SELECT}
                />
              );
            }
            return null;
          })}
          
          {/* Transformer for selected elements */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize to a minimum size
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
