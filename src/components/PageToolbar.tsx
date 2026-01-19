import React from 'react';
import { toast } from "sonner";
import { useMutation } from "convex/react";
// @ts-ignore
import { api } from "../../convex/_generated/api";
import { Shape } from '../utils/annotationTypes';

interface PageToolbarProps {
    shapes: Shape[];
    onReset: () => void;
}

export default function PageToolbar({ shapes, onReset }: PageToolbarProps) {
    const [savedLink, setSavedLink] = React.useState<string | null>(null);

    // We wrap usage in try/catch or conditional in case API not generated yet? 
    // Actually useMutation hook might crash if api object is undefined.
    // But let's assume valid environment or handle it.
    let saveAnnotations: any = () => { };
    try {
        saveAnnotations = useMutation(api.annotations.save);
    } catch (e) {
        console.warn("Convex API not ready");
    }

    const handleSave = async () => {
        if (!shapes.length) {
            toast.error("No suggestions to save.");
            return;
        }
        try {
            // Generate a unique ID for this save
            const newId = Math.random().toString(36).substring(2, 15);

            await saveAnnotations({
                resumeId: newId,
                shapes: JSON.stringify(shapes)
            });

            // Create shareable link
            const url = new URL(window.location.href);
            const externalUrl =
                url.searchParams.get('page') ||
                url.searchParams.get('target') ||
                url.searchParams.get('url');

            if (externalUrl) {
                url.searchParams.set('page', externalUrl);
                url.searchParams.delete('target');
                url.searchParams.delete('url');
            }

            url.searchParams.set("id", newId);
            setSavedLink(url.toString());

        } catch (e) {
            console.error(e);
            toast.error('Failed to save. Ensure backend is running.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="page-toolbar">
                <button onClick={onReset} className="page-btn reset">
                    Reset
                </button>
                <button onClick={handlePrint} className="page-btn print">
                    Print
                </button>
                <button onClick={handleSave} className="page-btn save">
                    Share Suggestions
                </button>
            </div>

            {savedLink && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Suggestions Saved!</h3>
                        <p>Share this link to show your suggestions:</p>
                        <div className="link-box">
                            <input readOnly value={savedLink} onClick={(e) => e.currentTarget.select()} />
                            <button onClick={() => {
                                navigator.clipboard.writeText(savedLink);
                                toast.success("Copied to clipboard!");
                            }}>Copy</button>
                        </div>
                        <div className="modal-actions">
                            <a href={savedLink} className="open-link-btn">Open Annotations</a>
                            <button onClick={() => setSavedLink(null)} className="close-btn">Close</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .page-toolbar {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    display: flex;
                    gap: 12px;
                    z-index: 1000;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    border: 1px solid rgba(0,0,0,0.1);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .page-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: inherit;
                }
                .page-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .page-btn:active {
                    transform: translateY(0);
                }
                .reset {
                    background: #f1f5f9;
                    color: #475569;
                }
                .reset:hover {
                    background: #e2e8f0;
                    color: #ef4444;
                }
                .print {
                    background: #e0f2fe;
                    color: #0284c7;
                }
                .print:hover {
                    background: #bae6fd;
                }
                .save {
                    background: #10b981;
                    color: white;
                }
                .save:hover {
                    background: #059669;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }
                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .modal-content h3 {
                    margin-top: 0;
                    color: #1e293b;
                }
                .link-box {
                    display: flex;
                    gap: 8px;
                    margin: 16px 0;
                }
                .link-box input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: #f8fafc;
                }
                .link-box button {
                    padding: 8px 16px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-top: 20px;
                }
                .open-link-btn {
                    padding: 8px 16px;
                    background: #10b981;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                }
                .close-btn {
                    padding: 8px 16px;
                    background: #64748b;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                @media print {
                    .page-toolbar, .toolbar-container, .modal-overlay {
                        display: none !important;
                    }
                    .resume-viewer-container {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }
                    .app-main {
                        background: white;
                    }
                }
            `}</style>
        </>
    );
}
