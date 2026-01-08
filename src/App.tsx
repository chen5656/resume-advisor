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
            } catch (e) {
                console.error("Failed to parse annotations", e);
            }
        }
    }, [savedAnnotations]);

    if (!resumeData) {
        return <div className="loading-screen">Loading Resume...</div>;
    }

    return (
        <div className="app-main">
            <Toolbar
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
            />

            <div className="resume-viewer-container">
                <ResumeRender
                    resume={resumeData}
                    selectedTool={selectedTool}
                    shapes={shapes}
                    onShapesChange={setShapes}
                />
            </div>

            <PageToolbar shapes={shapes} onReset={() => setShapes([])} />
            <Toaster />
        </div>
    );
}

export default App;

