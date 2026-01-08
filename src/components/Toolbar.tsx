import React from 'react';
import { AnnotationTool } from '../utils/annotationTypes';
import './Toolbar.css';

interface ToolbarProps {
    selectedTool: AnnotationTool;
    onSelectTool: (tool: AnnotationTool) => void;
}

export default function Toolbar({ selectedTool, onSelectTool }: ToolbarProps) {
    const tools: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
        {
            id: 'highlight',
            label: 'Select',
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: 'pen',
            label: 'Pen',
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                    {/* Simplified Pen path */}
                    <path d="M3 21v-3l11-11 3 3-11 11H3zM14.5 9.5L17 7" stroke="currentColor" />
                </svg>
            )
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
            id: 'circle',
            label: 'Circle',
            icon: (
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
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
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z" />
                    <line x1="17" y1="17" x2="11" y2="11" opacity="0.5" />
                </svg>
            )
        }
    ];

    // Better Pen Icon
    const PenIcon = () => (
        <svg viewBox="0 0 24 24">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
    );

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
                    {tool.id === 'pen' ? <PenIcon /> : tool.icon}
                </button>
            ))}
        </div>
    );
}
