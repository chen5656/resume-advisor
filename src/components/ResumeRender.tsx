import React, { useMemo } from 'react';
import { ResumeConfig } from '../utils/types';
import config from '../config.json';

import { AnnotationTool, Shape } from '../utils/annotationTypes';
import CanvasOverlay from './CanvasOverlay';

interface Props {
    resume: ResumeConfig;
    selectedTool: AnnotationTool;
    shapes: Shape[];
    onShapesChange: (shapes: Shape[]) => void;
}

const ResumeRender: React.FC<Props> = ({ resume, selectedTool, shapes, onShapesChange }) => {
    const { name, title, professionalOverview, experience, education, skills, certifications, industries, expertises, contact } = resume;
    const { layout } = config;

    const styleVariables = useMemo(() => ({
        '--headerPt': layout.header.paddingTop,
        '--headerPb': layout.header.paddingBottom,
        '--headerMt': layout.header.marginTop,
        '--headerMb': layout.header.marginBottom,
        '--overviewPt': layout.overview.paddingTop,
        '--overviewPb': layout.overview.paddingBottom,
        '--overviewMt': layout.overview.marginTop,
        '--overviewMb': layout.overview.marginBottom,
        '--experiencePt': layout.experience.paddingTop,
        '--experiencePb': layout.experience.paddingBottom,
        '--experienceMt': layout.experience.marginTop,
        '--experienceMb': layout.experience.marginBottom,
        '--educationPt': layout.education.paddingTop,
        '--educationPb': layout.education.paddingBottom,
        '--educationMt': layout.education.marginTop,
        '--educationMb': layout.education.marginBottom,
        '--colGap': layout.experience.marginBottom // Using experience margin as gap proxy, matching Astro
    } as React.CSSProperties), [layout]);

    return (
        <div className="page" style={styleVariables}>
            <CanvasOverlay tool={selectedTool} shapes={shapes} onShapesChange={onShapesChange} />
            {/* Header */}
            <header className="header-sky dynamic-header border-b-2 border-gray-300">
                <div className="header-content flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold font-heading tracking-tight uppercase mb-2 text-gray-900">{name}</h1>
                        <p className="text-xl font-bold text-gray-700">{title}</p>
                    </div>
                    {/* Contact Info */}
                    <div className="contact-info text-sm space-y-1">
                        {contact?.phone && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-2.629 1.968a.49.49 0 00-.04.85c2.35 1.76 5.463 3.413 8.79 4.657a.49.49 0 00.6-.22l1.967-2.63a1.875 1.875 0 011.956-.693l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                                </svg>
                                <span>{contact.phone}</span>
                            </div>
                        )}
                        {contact?.email && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                </svg>
                                <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                            </div>
                        )}
                        {contact?.location && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                <span>{contact.location}</span>
                            </div>
                        )}
                        {contact?.linkedin && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 text-gray-700">
                                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                                </svg>
                                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{contact.linkedin}</a>
                            </div>
                        )}
                        {contact?.website && (
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.1c-.244.025-.486.056-.725.093l-.224.035a.75.75 0 10.233 1.482l.224-.035c.162-.025.326-.046.492-.062V9.5a.75.75 0 00.75.75h4.5a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-2.25v2.25A.75.75 0 0013.5 18v2.25c.166.016.33.025.492.025 3.328 0 6.035-2.695 6.035-6.025 0-2.072-1.127-3.92-2.825-4.975l.1-.1A2.25 2.25 0 0015 6h-2.25V6zM12 20.25a8.216 8.216 0 01-1.5-.137V18a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25v.14a8.23 8.23 0 01-1.5-4.39 8.25 8.25 0 018.25-8.25c2.357 0 4.47.994 5.96 2.592a.75.75 0 00.914.075 2.25 2.25 0 00-.814-3.953A9.75 9.75 0 0012 2.25z" clipRule="evenodd" />
                                </svg>
                                <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noreferrer" className="hover:underline">
                                    {contact.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="resume-container">
                {/* Section 1: Top Content (Overview & Experience) */}
                <div className="top-section">
                    {/* Professional Overview */}
                    {professionalOverview && (
                        <section className="layout-overview">
                            <div className="section-header">
                                <span className="section-title text-xl text-sky-800">Professional Overview</span>
                            </div>
                            <p
                                className="text-gray-800 text-sm leading-relaxed text-justify"
                                dangerouslySetInnerHTML={{ __html: professionalOverview }}
                            />
                        </section>
                    )}

                    {/* Experience */}
                    <section className="layout-experience">
                        <div className="section-header">
                            <span className="section-title text-xl text-sky-800">Experience</span>
                        </div>

                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <React.Fragment key={i}>
                                    <div className="exp-item mb-4">
                                        <div className="exp-header flex justify-between items-baseline mb-2 md:ml-0">
                                            <div className="text-base font-bold font-heading text-gray-900 italic">
                                                <span dangerouslySetInnerHTML={{ __html: exp.company }} />
                                                {exp.role && (
                                                    <span className="not-italic text-gray-800" dangerouslySetInnerHTML={{ __html: ', ' + exp.role }} />
                                                )}
                                            </div>
                                            <span
                                                className="text-sm font-semibold font-mono text-gray-600 whitespace-nowrap"
                                                dangerouslySetInnerHTML={{ __html: '(' + exp.period + ')' }}
                                            />
                                        </div>
                                        <ul className="text-gray-800">
                                            {exp.highlights.map((point, index) => {
                                                const isSubItem = point.startsWith('  -');
                                                if (isSubItem) {
                                                    return <li key={index} className="exp-sub-item" dangerouslySetInnerHTML={{ __html: point.replace('  - ', '') }} />;
                                                } else {
                                                    return (
                                                        <li
                                                            key={index}
                                                            className={`exp-highlight-major text-sm leading-relaxed ${index > 0 ? 'mt-3' : 'mt-1'}`}
                                                            dangerouslySetInnerHTML={{ __html: point }}
                                                        />
                                                    );
                                                }
                                            })}
                                        </ul>
                                    </div>
                                    {exp.hasPageBreak && <div className="break-page" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Section 2: Bottom Content (Education, Certification, Skills, Industries) */}
                <div className="layout-education-container grid grid-cols-2 gap-6 border-t-2 border-gray-200">

                    {/* Left Column: Education & Certification */}
                    <div className="dynamic-col-gap">
                        {/* Education */}
                        <section>
                            <div className="section-header mt-0">
                                <span className="section-title text-xl text-sky-800">Education</span>
                            </div>
                            <ul className="education-list space-y-4">
                                {education.map((edu, i) => (
                                    <li key={i}>
                                        <span className="font-bold block text-sm leading-tight text-gray-900" dangerouslySetInnerHTML={{ __html: edu.degree }} />
                                        <span className="text-sm text-gray-800 block" dangerouslySetInnerHTML={{ __html: edu.institution }} />
                                        <span className="text-sm text-gray-800 block" dangerouslySetInnerHTML={{ __html: edu.period }} />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Certification */}
                        {certifications && (
                            <section>
                                <div className="section-header mt-0">
                                    <span className="section-title text-xl text-sky-800">Certification</span>
                                </div>
                                <ul className="certification-list space-y-3">
                                    {certifications.map((cert, i) => (
                                        <li key={i} className="text-sm text-gray-800 leading-snug" dangerouslySetInnerHTML={{ __html: cert.replace(', ', '<br/>') }} />
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Skills & Industries */}
                    <div className="dynamic-col-gap">
                        {/* Skills */}
                        <section>
                            <div className="section-header mt-0">
                                <span className="section-title text-xl text-sky-800">Skills</span>
                            </div>
                            <div className="space-y-3">
                                {skills.map((skillGroup, i) => (
                                    <div key={i}>
                                        <span
                                            className="font-bold text-sm block border-b border-gray-200 mb-1"
                                            dangerouslySetInnerHTML={{ __html: skillGroup.category + ':' }}
                                        />
                                        <div className="text-sm leading-relaxed text-gray-800">
                                            {skillGroup.items.map((skill, index) => (
                                                <React.Fragment key={index}>
                                                    <span
                                                        className="text-xs border-b border-gray-400 leading-tight font-mono"
                                                        dangerouslySetInnerHTML={{ __html: skill }}
                                                    />
                                                    {index < skillGroup.items.length - 1 && ", "}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Industries */}
                        {(expertises || industries) && (
                            <section>
                                <div className="section-header mt-0">
                                    <span className="section-title text-xl text-sky-800">Industries</span>
                                </div>
                                <div className="space-y-2">
                                    {expertises && (
                                        <div>
                                            <span className="text-xs text-gray-500 font-bold block">Expertise</span>
                                            <span className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: expertises.join(', ') }} />
                                        </div>
                                    )}
                                    {industries && (
                                        <div className={expertises ? "mt-2" : ""}>
                                            <ul className="industry-list list-none space-y-1">
                                                {industries.map((ind, i) => (
                                                    <li key={i} className="text-sm text-gray-800">{ind}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResumeRender;
