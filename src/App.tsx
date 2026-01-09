import { useState, useEffect } from 'react';
import './App.css';
import { Toaster } from 'sonner';
import { parseResume } from './utils/resumeParser';
import ResumeRender from './components/ResumeRender';
import Toolbar from './components/Toolbar';
import PageToolbar from './components/PageToolbar';
import { AnnotationTool, Shape } from './utils/annotationTypes';
import resumeMarkdown from './assets/Resume.md?raw';
import { ResumeConfig } from './utils/types';

import { useQuery } from "convex/react";
// @ts-ignore
import { api } from "../convex/_generated/api";

function App() {
    const [resumeData, setResumeData] = useState<ResumeConfig | null>(null);
    const [selectedTool, setSelectedTool] = useState<AnnotationTool>('pen');
    const [shapes, setShapes] = useState<Shape[]>([]);

    // Undo/Redo State
    const [history, setHistory] = useState<Shape[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Get resumeId from URL or default to "default"
    const params = new URLSearchParams(window.location.search);
    const resumeId = params.get('id') || 'default';

    const savedAnnotations = useQuery(api.annotations.load, { resumeId });

    useEffect(() => {
        if (resumeMarkdown) {
            const parsed = parseResume(resumeMarkdown);
            setResumeData(parsed);
        }
    }, []);

    useEffect(() => {
        if (savedAnnotations?.shapes) {
            try {
                const loaded = JSON.parse(savedAnnotations.shapes);
                setShapes(loaded);
                setHistory([loaded]);
                setHistoryIndex(0);
            } catch (e) {
                console.error("Failed to parse annotations", e);
            }
        }
    }, [savedAnnotations]);

    const handleShapesChange = (newShapes: Shape[]) => {
        setShapes(newShapes);

        // Add to history
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, newShapes]);
        setHistoryIndex(newHistory.length);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setShapes(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setShapes(history[newIndex]);
        }
    };

    if (!resumeData) {
        return <div className="loading-screen">Loading Resume...</div>;
    }

    return (
        <div className="app-main">
            <Toolbar
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
                onUndo={undo}
                onRedo={redo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
            />

            <div className="resume-viewer-container">
                <ResumeRender
                    resume={resumeData}
                    selectedTool={selectedTool}
                    shapes={shapes}
                    onShapesChange={handleShapesChange}
                />
            </div>

            <PageToolbar shapes={shapes} onReset={() => handleShapesChange([])} />
            <Toaster />
        </div>
    );
}

export default App;

