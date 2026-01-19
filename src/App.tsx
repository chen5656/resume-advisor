import { useState, useEffect, useMemo, FormEvent } from 'react';
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
    const [landingUrl, setLandingUrl] = useState('');
    const [landingError, setLandingError] = useState<string | null>(null);

    // Undo/Redo State
    const [history, setHistory] = useState<Shape[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
    const resumeId = searchParams.get('id') || 'default';
    const hasResumeParam = searchParams.has('resume') || searchParams.has('id');
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
        if (externalUrl || !resumeMarkdown || !hasResumeParam) return null;
        return parseResume(resumeMarkdown);
    }, [externalUrl, resumeMarkdown, hasResumeParam]);

    const savedAnnotations = useQuery(api.annotations.load, { resumeId });

    const isExternalPage = Boolean(externalUrl);
    const isResumeView = Boolean(resumeData);
    const isLanding = !isExternalPage && !isResumeView;

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

    const normalizeExternalUrl = (value: string): string | null => {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const withProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
        try {
            const parsed = new URL(withProtocol);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return null;
            }
            return parsed.toString();
        } catch (error) {
            return null;
        }
    };

    const handleLandingSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const normalized = normalizeExternalUrl(landingUrl);
        if (!normalized) {
            setLandingError('Enter a valid http(s) URL.');
            return;
        }
        setLandingError(null);
        const destination = new URL(window.location.href);
        destination.search = '';
        destination.hash = '';
        destination.searchParams.set('page', normalized);
        const newTab = window.open(destination.toString(), '_blank', 'noopener,noreferrer');
        if (!newTab) {
            window.location.assign(destination.toString());
        }
    };

    if (!isExternalPage && hasResumeParam && !resumeData) {
        return <div className="loading-screen">Loading Resume...</div>;
    }

    if (isLanding) {
        return (
            <div className="app-main app-main--landing">
                <div className="landing-card">
                    <div className="landing-header">
                        <span className="landing-badge">Resume Advisor</span>
                        <h1 className="landing-title">Review web pages with live annotations.</h1>
                        <p className="landing-subtitle">
                            Paste a public URL to open a dedicated review tab with highlights, drawings, and notes.
                            Save your feedback and share a link when you are done.
                        </p>
                    </div>
                    <form className="landing-form" onSubmit={handleLandingSubmit} noValidate>
                        <label className="landing-label" htmlFor="landing-url">
                            Page URL
                        </label>
                        <div className="landing-input-row">
                            <input
                                id="landing-url"
                                type="url"
                                inputMode="url"
                                placeholder="https://example.com"
                                value={landingUrl}
                                onChange={(event) => {
                                    setLandingUrl(event.target.value);
                                    if (landingError) {
                                        setLandingError(null);
                                    }
                                }}
                                autoComplete="off"
                                spellCheck={false}
                                required
                                aria-invalid={Boolean(landingError)}
                                aria-describedby={landingError ? 'landing-url-error' : undefined}
                            />
                            <button type="submit" className="landing-submit">
                                Open review tab
                            </button>
                        </div>
                        {landingError && (
                            <div id="landing-url-error" className="landing-error" role="alert">
                                {landingError}
                            </div>
                        )}
                    </form>
                    <div className="landing-notes">
                        <div className="landing-note">
                            Tip: Use pages that are publicly accessible. Private or login-required pages may not load.
                        </div>
                        <div className="landing-note">
                            Some sites block embedding with X-Frame-Options or CSP rules. If you see a frame error,
                            try another URL.
                        </div>
                    </div>
                </div>
            </div>
        );
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
