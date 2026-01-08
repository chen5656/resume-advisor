export type AnnotationTool = 'cursor' | 'pen' | 'line' | 'circle' | 'text' | 'eraser' | 'highlight';

export interface Point {
    x: number;
    y: number;
}

export interface Shape {
    id: string;
    type: AnnotationTool;
    color: string;
    strokeWidth: number;
    points?: Point[]; // For pen
    start?: Point;    // For line/circle
    end?: Point;      // For line/circle
    text?: string;    // For text
    position?: Point; // For text
}

export interface AnnotationState {
    selectedTool: AnnotationTool;
    strokeColor: string;
    strokeWidth: number;
}
