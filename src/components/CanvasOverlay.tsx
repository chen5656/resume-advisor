import React, { useRef, useState, useEffect } from 'react';
import { AnnotationTool, Shape, Point } from '../utils/annotationTypes';

interface CanvasOverlayProps {
    tool: AnnotationTool;
    shapes: Shape[];
    onShapesChange: (shapes: Shape[]) => void;
    width?: number; // Optional, can derive from parent
    height?: number;
}

const CanvasOverlay: React.FC<CanvasOverlayProps> = ({ tool, shapes, onShapesChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);

    // Ref to track current shape in event handlers without stale closures
    const currentShapeRef = useRef<Shape | null>(null);

    // Configuration
    const strokeWidth = 2;
    const color = tool === 'eraser' ? 'rgba(0,0,0,0)' : '#ef4444'; // Red for annotations

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize canvas to parent
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        renderCanvas();
    }, [shapes, currentShape, tool]); // Re-render when shapes change

    const renderCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const drawShape = (shape: Shape) => {
            ctx.lineWidth = shape.strokeWidth;

            if (shape.type === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 20; // Eraser size
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = shape.color;
                ctx.fillStyle = shape.color;
            }

            if ((shape.type === 'pen' || shape.type === 'eraser') && shape.points && shape.points.length > 0) {
                ctx.beginPath();
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                ctx.stroke();
            } else if (shape.type === 'line' && shape.start && shape.end) {
                ctx.beginPath();
                ctx.moveTo(shape.start.x, shape.start.y);
                ctx.lineTo(shape.end.x, shape.end.y);
                ctx.stroke();
            } else if (shape.type === 'circle' && shape.start && shape.end) {
                const radius = Math.sqrt(
                    Math.pow(shape.end.x - shape.start.x, 2) +
                    Math.pow(shape.end.y - shape.start.y, 2)
                );
                ctx.beginPath();
                ctx.arc(shape.start.x, shape.start.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (shape.type === 'text' && shape.position && shape.text) {
                ctx.save();
                ctx.font = 'bold 16px sans-serif';
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText(shape.text, shape.position.x, shape.position.y);
                ctx.restore();
            }
        };

        shapes.forEach(drawShape);
        if (currentShape) {
            drawShape(currentShape);
        }

        // Reset composite op
        ctx.globalCompositeOperation = 'source-over';
    };

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        setIsDrawing(true);

        const newShape: Shape = {
            id: Date.now().toString(),
            type: tool,
            color: color,
            strokeWidth: strokeWidth,
            points: tool === 'pen' ? [pos] : undefined,
            start: tool !== 'pen' ? pos : undefined,
            end: tool !== 'pen' ? pos : undefined
        };

        if (tool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                onShapesChange([...shapes, { ...newShape, text, position: pos }]);
            }
            setIsDrawing(false); // Text is instant
        } else if (tool === 'eraser') {
            // Eraser acts like a pen but with destination-out
            const eraserShape: Shape = {
                id: Date.now().toString(),
                type: 'eraser',
                color: 'rgba(0,0,0,1)', // doesn't matter
                strokeWidth: 20,
                points: [pos]
            };
            setCurrentShape(eraserShape);
            currentShapeRef.current = eraserShape;
        } else {
            setCurrentShape(newShape);
            currentShapeRef.current = newShape;
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);

        if (tool === 'pen' || tool === 'eraser') {
            setCurrentShape(prev => {
                if (!prev || !prev.points) return prev;
                return {
                    ...prev,
                    points: [...prev.points, pos] // Naive appendment
                };
            });
        } else {
            setCurrentShape(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    end: pos
                };
            });
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentShape) {
            onShapesChange([...shapes, currentShape]);
            setCurrentShape(null);
            currentShapeRef.current = null;
        }
    };

    const isInteracting = tool !== 'cursor';

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-50 ${isInteracting ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
            style={{ width: '100%', height: '100%' }}
            onMouseDown={isInteracting ? handleMouseDown : undefined}
            onMouseMove={isInteracting ? handleMouseMove : undefined}
            onMouseUp={isInteracting ? handleMouseUp : undefined}
            onMouseLeave={isInteracting ? handleMouseUp : undefined}
        />
    );
};

export default CanvasOverlay;
