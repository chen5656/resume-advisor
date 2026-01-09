import React from 'react';
import { AnnotationTool } from '../utils/annotationTypes';
import './Toolbar.css';

import { LuHighlighter, LuEraser, LuPencil, LuUndo, LuRedo } from 'react-icons/lu';

interface ToolbarProps {
    selectedTool: AnnotationTool;
    onSelectTool: (tool: AnnotationTool) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export default function Toolbar({
    selectedTool,
    onSelectTool,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}: ToolbarProps) {
    const tools: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
        {
            id: 'highlight',
            label: 'Highlight',
            icon: <LuHighlighter />
        },
        {
            id: 'pen',
            label: 'Pen',
            icon: <LuPencil />
        },
        {
            id: 'line',
            label: 'Line',
            icon: (
                <svg viewBox="0 0 24 24">
                    <line x1="5" y1="19" x2="19" y2="5" />
                </svg>
            )
        },
        {
            id: 'text',
            label: 'Text',
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                </svg>
            )
        },
        {
            id: 'eraser',
            label: 'Eraser',
            icon: <LuEraser />
        }
    ];

    return (
        <div className="toolbar-container">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    className={`toolbar-btn ${selectedTool === tool.id ? 'active' : ''}`}
                    onClick={() => onSelectTool(tool.id)}
                    aria-label={tool.label}
                    title={tool.label}
                >
                    {tool.icon}
                </button>
            ))}

            <div className="toolbar-divider" />

            <button
                className="toolbar-btn"
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
                title="Undo"
            >
                <LuUndo />
            </button>
            <button
                className="toolbar-btn"
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
                title="Redo"
            >
                <LuRedo />
            </button>
        </div>
    );
}
