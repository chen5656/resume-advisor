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
    const frameLoadedRef = useRef(false);
    const [frameHeight, setFrameHeight] = useState<number | null>(null);
    const [heightSyncStatus, setHeightSyncStatus] = useState<'unknown' | 'ok' | 'blocked'>('unknown');
    const [frameLoadStatus, setFrameLoadStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
    const [frameBlockReason, setFrameBlockReason] = useState<'xfo' | 'timeout' | null>(null);
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

    const checkFrameBlocked = useCallback(() => {
        const iframe = iframeRef.current;
        if (!iframe?.contentWindow) return false;
        try {
            const frameHref = iframe.contentWindow.location.href;
            if (
                !frameHref ||
                frameHref === 'about:blank' ||
                frameHref === 'about:srcdoc' ||
                frameHref.startsWith('chrome-error://') ||
                frameHref.startsWith('edge-error://')
            ) {
                setFrameLoadStatus('blocked');
                setFrameBlockReason('xfo');
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
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

    const baseHeight = frameHeight ?? manualHeight;
    const heightInputValue = manualHeight ?? Math.round(frameHeight ?? 800);

    useEffect(() => {
        frameLoadedRef.current = false;
        setFrameHeight(null);
        setHeightSyncStatus('unknown');
        setFrameLoadStatus('loading');
        setFrameBlockReason(null);
    }, [url]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (!frameLoadedRef.current) {
                setFrameLoadStatus('blocked');
                setFrameBlockReason('timeout');
            }
        }, 8000);

        return () => window.clearTimeout(timeoutId);
    }, [url]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let resizeObserver: ResizeObserver | null = null;
        let resizeListenerAttached = false;

        const handleLoad = () => {
            frameLoadedRef.current = true;
            if (checkFrameBlocked()) {
                return;
            }
            setFrameLoadStatus('loaded');
            setFrameBlockReason(null);
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;

                // We do NOT hide overflow anymore, so inner scrollbars can work if needed
                // doc.documentElement.style.overflow = 'hidden'; 
                // doc.body.style.overflow = 'hidden';

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

        const handleError = () => {
            frameLoadedRef.current = false;
            setFrameLoadStatus('blocked');
            setFrameBlockReason('xfo');
        };

        iframe.addEventListener('load', handleLoad);
        iframe.addEventListener('error', handleError);
        return () => {
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (resizeListenerAttached) {
                window.removeEventListener('resize', updateHeight);
            }
        };
    }, [checkFrameBlocked, updateHeight, url]);

    const handleChangeUrl = () => {
        const baseUrl = new URL(window.location.href);
        baseUrl.search = '';
        baseUrl.hash = '';
        window.location.assign(baseUrl.toString());
    };

    const showHeightWarning = heightSyncStatus === 'blocked' && frameLoadStatus !== 'blocked';
    const blockedTitle = frameBlockReason === 'timeout'
        ? 'Unable to load this page in a frame.'
        : 'This site blocks embedding.';
    const blockedBody = 'It likely sets X-Frame-Options: DENY or a Content Security Policy frame-ancestors rule. Try another URL.';

    return (
        <div className="webpage-viewer">
            {frameLoadStatus === 'blocked' && (
                <div className="webpage-blocked" role="alert">
                    <div className="webpage-blocked-title">{blockedTitle}</div>
                    <div className="webpage-blocked-body">{blockedBody}</div>
                    <div className="webpage-blocked-actions">
                        <button type="button" onClick={handleChangeUrl}>
                            Try another URL
                        </button>
                        <a href={url} target="_blank" rel="noreferrer" className="webpage-blocked-link">
                            Open page directly
                        </a>
                    </div>
                </div>
            )}
            {showHeightWarning && (
                <div className="webpage-warning">
                    <div>Height sync is blocked. The page will scroll internally, or you can set a manual height.</div>
                    <div className="webpage-height-controls">
                        <label htmlFor="page-height-input">Iframe height (px)</label>
                        <input
                            id="page-height-input"
                            type="number"
                            min={400}
                            step={200}
                            value={heightInputValue}
                            placeholder="Auto"
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
                        {manualHeight && (
                            <button type="button" onClick={() => applyManualHeight(null)}>
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="webpage-viewport">
                <div
                    className="webpage-frame"
                    style={{ height: baseHeight ? `${baseHeight}px` : 'calc(100vh - 140px)' }}
                >
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
        </div>
    );
};

export default WebPageViewer;
