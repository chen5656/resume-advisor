import React, { useCallback, useEffect, useRef, useState } from 'react';
import CanvasOverlay from './CanvasOverlay';
import { AnnotationTool, Shape } from '../utils/annotationTypes';

interface WebPageViewerProps {
    url: string;
    selectedTool: AnnotationTool;
    shapes: Shape[];
    onShapesChange: (shapes: Shape[]) => void;
}

const WebPageViewer: React.FC<WebPageViewerProps> = ({ url, selectedTool, shapes, onShapesChange }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [frameHeight, setFrameHeight] = useState<number | null>(null);
    const [heightSyncStatus, setHeightSyncStatus] = useState<'unknown' | 'ok' | 'blocked'>('unknown');
    const [manualHeight, setManualHeight] = useState<number | null>(() => {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('height') || params.get('h');
        if (!raw) return null;
        const parsed = Number(raw);
        if (!Number.isFinite(parsed) || parsed <= 0) return null;
        return Math.round(parsed);
    });

    const updateHeight = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument;
            if (!doc) return;
            const nextHeight = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
            if (Number.isFinite(nextHeight) && nextHeight > 0) {
                setFrameHeight(nextHeight);
            }
        } catch (error) {
            setHeightSyncStatus('blocked');
        }
    }, []);

    const applyManualHeight = useCallback((next: number | null) => {
        setManualHeight(next);
        const currentUrl = new URL(window.location.href);
        if (next && Number.isFinite(next)) {
            currentUrl.searchParams.set('height', Math.round(next).toString());
        } else {
            currentUrl.searchParams.delete('height');
        }
        window.history.replaceState({}, '', currentUrl);
    }, []);

    const defaultHeight = Math.max(window.innerHeight, 1600);
    const appliedHeight = frameHeight ?? manualHeight ?? defaultHeight;
    const heightInputValue = manualHeight ?? Math.round(appliedHeight);

    useEffect(() => {
        setFrameHeight(null);
        setHeightSyncStatus('unknown');
    }, [url]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let resizeObserver: ResizeObserver | null = null;
        let resizeListenerAttached = false;

        const handleLoad = () => {
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;

                doc.documentElement.style.overflow = 'hidden';
                doc.body.style.overflow = 'hidden';

                updateHeight();
                setHeightSyncStatus('ok');

                if (typeof ResizeObserver !== 'undefined') {
                    if (resizeObserver) {
                        resizeObserver.disconnect();
                    }
                    resizeObserver = new ResizeObserver(() => updateHeight());
                    resizeObserver.observe(doc.documentElement);
                    resizeObserver.observe(doc.body);
                }

                if (!resizeListenerAttached) {
                    window.addEventListener('resize', updateHeight);
                    resizeListenerAttached = true;
                }
            } catch (error) {
                setHeightSyncStatus('blocked');
            }
        };

        iframe.addEventListener('load', handleLoad);
        return () => {
            iframe.removeEventListener('load', handleLoad);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (resizeListenerAttached) {
                window.removeEventListener('resize', updateHeight);
            }
        };
    }, [updateHeight, url]);

    const frameStyle = { height: `${Math.max(appliedHeight, 400)}px` };

    return (
        <div className="webpage-viewer">
            {heightSyncStatus === 'blocked' && (
                <div className="webpage-warning">
                    <div>Cross-origin page detected. Increase page height if content is clipped.</div>
                    <div className="webpage-height-controls">
                        <label htmlFor="page-height-input">Page height (px)</label>
                        <input
                            id="page-height-input"
                            type="number"
                            min={400}
                            step={200}
                            value={heightInputValue}
                            onChange={(event) => {
                                const next = Number(event.target.value);
                                if (!Number.isFinite(next) || next <= 0) {
                                    applyManualHeight(null);
                                    return;
                                }
                                applyManualHeight(next);
                            }}
                        />
                        <button type="button" onClick={() => applyManualHeight(heightInputValue + 600)}>
                            Taller
                        </button>
                        <button
                            type="button"
                            onClick={() => applyManualHeight(Math.max(400, heightInputValue - 600))}
                        >
                            Shorter
                        </button>
                    </div>
                </div>
            )}
            <div className="webpage-frame" style={frameStyle}>
                <iframe
                    ref={iframeRef}
                    className="webpage-iframe"
                    src={url}
                    title="External page"
                    loading="eager"
                />
                <CanvasOverlay
                    tool={selectedTool}
                    shapes={shapes}
                    onShapesChange={onShapesChange}
                    highlightBlendMode="source-over"
                />
            </div>
        </div>
    );
};

export default WebPageViewer;
