import { useEffect } from "react";
import { ToolType } from "../types/canvas";
import { useDispatch } from "react-redux";
import {
  setActiveTool,
  undo,
  redo,
  setZoomLevel,
  resetZoom,
} from "../store/canvasSlice";

export function useKeyboardShortcut(zoomLevel: number) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when user is typing in an input or text element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).contentEditable === "true"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "v":
          dispatch(setActiveTool(ToolType.SELECT));
          break;
        case "h":
          dispatch(setActiveTool(ToolType.HAND));
          break;
        case "p":
          dispatch(setActiveTool(ToolType.PEN));
          break;
        case "m":
          dispatch(setActiveTool(ToolType.MARKER));
          break;
        case "e":
          dispatch(setActiveTool(ToolType.ERASER));
          break;
        case "s":
          dispatch(setActiveTool(ToolType.SHAPES));
          break;
        case "t":
          dispatch(setActiveTool(ToolType.TEXT));
          break;
        case "i":
          dispatch(setActiveTool(ToolType.IMAGE));
          break;
        // Zoom controls
        case "=":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch(setZoomLevel(Math.min(zoomLevel + 25, 300)));
          }
          break;
        case "-":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch(setZoomLevel(Math.max(zoomLevel - 25, 25)));
          }
          break;
        case "0":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch(resetZoom());
          }
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch(undo());
          }
          break;
        case "y":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch(redo());
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, zoomLevel]);
}
