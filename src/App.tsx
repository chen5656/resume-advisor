import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Toaster } from 'sonner';
import { parseResume } from './utils/resumeParser';
import ResumeRender from './components/ResumeRender';
import WebPageViewer from './components/WebPageViewer';
import Toolbar from './components/Toolbar';
import PageToolbar from './components/PageToolbar';
import { AnnotationTool, Shape } from './utils/annotationTypes';
import resumeMarkdown from './assets/Resume.md?raw';
import { ResumeConfig } from './utils/types';

import { useQuery } from "convex/react";
// @ts-ignore
import { api } from "../convex/_generated/api";

function App() {
    const [selectedTool, setSelectedTool] = useState<AnnotationTool>('pen');
    const [shapes, setShapes] = useState<Shape[]>([]);

    // Undo/Redo State
    const [history, setHistory] = useState<Shape[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const resumeId = searchParams.get('id') || 'default';
    const pageParam = searchParams.get('page') || searchParams.get('target') || searchParams.get('url');
    const externalUrl = useMemo(() => {
        if (!pageParam) return null;
        try {
            const parsed = new URL(pageParam, window.location.href);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return null;
            }
            return parsed.toString();
        } catch (error) {
            return null;
        }
    }, [pageParam]);

    const resumeData = useMemo<ResumeConfig | null>(() => {
        if (externalUrl || !resumeMarkdown) return null;
        return parseResume(resumeMarkdown);
    }, [externalUrl, resumeMarkdown]);

    const savedAnnotations = useQuery(api.annotations.load, { resumeId });

    const isExternalPage = Boolean(externalUrl);

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

    if (!isExternalPage && !resumeData) {
        return <div className="loading-screen">Loading Resume...</div>;
    }

    return (
        <div className={`app-main ${isExternalPage ? 'app-main--web' : ''}`}>
            <Toolbar
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
                onUndo={undo}
                onRedo={redo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
            />

            <div className="resume-viewer-container">
                {isExternalPage && externalUrl ? (
                    <WebPageViewer
                        url={externalUrl}
                        selectedTool={selectedTool}
                        shapes={shapes}
                        onShapesChange={handleShapesChange}
                    />
                ) : (
                    <ResumeRender
                        resume={resumeData!}
                        selectedTool={selectedTool}
                        shapes={shapes}
                        onShapesChange={handleShapesChange}
                    />
                )}
            </div>

            <PageToolbar shapes={shapes} onReset={() => handleShapesChange([])} />
            <Toaster />
        </div>
    );
}

export default App;
