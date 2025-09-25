import { useState, useCallback } from "react";
import { getGlobalBackgroundImage } from "./useCanvasSetup";

interface Point {
  x: number;
  y: number;
}

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  brushSize: number;
  brushColor: string;
  isErasing: boolean;
  onSave: () => void;
}

export const useCanvasDrawing = ({
  canvasRef,
  brushSize,
  brushColor,
  isErasing,
  onSave
}: UseCanvasDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const getPointFromEvent = useCallback((e: React.MouseEvent | React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, [canvasRef]);

  const restoreBackgroundInArea = useCallback((x: number, y: number, width: number, height: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const backgroundImage = getGlobalBackgroundImage();
    
    if (!canvas || !ctx || !backgroundImage) return;

    // Create a clipping region and redraw background in that area
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    
    // Redraw the background image in the clipped area
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    ctx.restore();
  }, [canvasRef]);

  const startDrawing = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture the pointer to prevent other elements from receiving pointer events
    if ('setPointerCapture' in e.currentTarget && e.currentTarget instanceof HTMLElement) {
      try {
        e.currentTarget.setPointerCapture((e as React.PointerEvent).pointerId);
      } catch {
        // Ignore errors if pointer capture fails
      }
    }
    
    setIsDrawing(true);
    const point = getPointFromEvent(e);
    setLastPoint(point);
  }, [getPointFromEvent]);

  const draw = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPoint = getPointFromEvent(e);

    if (isErasing) {
      // For erasing, first erase the user content, then restore background
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Restore background in the erased area
      if (lastPoint && getGlobalBackgroundImage()) {
        const minX = Math.min(lastPoint.x, currentPoint.x) - brushSize;
        const minY = Math.min(lastPoint.y, currentPoint.y) - brushSize;
        const maxX = Math.max(lastPoint.x, currentPoint.x) + brushSize;
        const maxY = Math.max(lastPoint.y, currentPoint.y) + brushSize;
        
        restoreBackgroundInArea(minX, minY, maxX - minX, maxY - minY);
      }
    } else {
      // Normal drawing
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = brushColor;

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
    }

    setLastPoint(currentPoint);
  }, [isDrawing, getPointFromEvent, isErasing, brushSize, brushColor, lastPoint, canvasRef, restoreBackgroundInArea]);

  const stopDrawing = useCallback((e?: React.MouseEvent | React.PointerEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Release pointer capture if it was set
      if ('releasePointerCapture' in e.currentTarget && e.currentTarget instanceof HTMLElement) {
        try {
          e.currentTarget.releasePointerCapture((e as React.PointerEvent).pointerId);
        } catch {
          // Ignore errors if pointer capture release fails
        }
      }
    }
    
    if (isDrawing) {
      // Auto-save when drawing stops
      onSave();
    }
    setIsDrawing(false);
    setLastPoint(null);
  }, [isDrawing, onSave]);

  const canvasStyle: React.CSSProperties = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    display: 'block',
    touchAction: 'none', // Prevent all touch gestures
    WebkitTouchCallout: 'none', // Disable iOS callout
    WebkitTapHighlightColor: 'transparent' // Remove tap highlight on mobile
  };

  const canvasEventHandlers = {
    onMouseDown: startDrawing,
    onMouseMove: draw,
    onMouseUp: stopDrawing,
    onMouseLeave: stopDrawing,
    onPointerDown: startDrawing,
    onPointerMove: draw,
    onPointerUp: stopDrawing,
    onPointerLeave: stopDrawing,
    onPointerCancel: stopDrawing,
  };

  return {
    canvasStyle,
    canvasEventHandlers,
    isDrawing
  };
};
