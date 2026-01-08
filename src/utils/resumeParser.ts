import type { ResumeConfig, ExperienceItem, EducationItem, SkillCategory } from './types';

// Helper to convert markdown syntax to HTML
const cleanText = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .trim();
};

export function parseResume(fileContent: string): ResumeConfig {
    const lines = fileContent.split('\n').map(l => l.trim());

    const resume: Partial<ResumeConfig> = {};

    // 1. Header (Name | Title)
    // Assuming the first H1 is the name line: "# HUAJUN CHEN | ArcGIS · Python · React"
    // 1. Header (Name | Title) & Contact Info
    const headerLine = lines.find(l => l.startsWith('# '));
    if (headerLine) {
        const rawHeader = headerLine.replace('# ', '');
        const parts = rawHeader.split('|').map(p => p.trim());
        resume.name = parts[0];
        resume.title = parts.slice(1).join(' | ');
    }

    // 1.5 Contact Info (Line starting with >)
    // > Phone: ... | Email: ...
    const contactLine = lines.find(l => l.trim().startsWith('> '));
    if (contactLine) {
        resume.contact = {};
        const cleanContact = contactLine.replace('> ', '').trim();
        const parts = cleanContact.split('|').map(p => p.trim());

        parts.forEach(part => {
            if (part.startsWith('Phone:')) resume.contact!.phone = part.replace('Phone:', '').trim();
            if (part.startsWith('Email:')) resume.contact!.email = part.replace('Email:', '').trim();
            if (part.startsWith('Website:')) resume.contact!.website = part.replace('Website:', '').trim();
            if (part.startsWith('Location:')) resume.contact!.location = part.replace('Location:', '').trim();
            if (part.startsWith('LinkedIn:')) resume.contact!.linkedin = part.replace('LinkedIn:', '').trim();
        });
    }

    // 2. Sections
    // We split by H1 headers "# SECTION NAME"
    const sections = fileContent.split(/^# /m).slice(1); // Skip the first empty split before first header

    sections.forEach(sectionRaw => {
        const lines = sectionRaw.trim().split('\n');
        const sectionTitle = lines[0].trim().toUpperCase();
        const contentLines = lines.slice(1);

        // Skip the main header (Name) which we handled
        if (sectionTitle.includes(resume.name?.toUpperCase() || 'HUAJUN CHEN')) return;

        if (sectionTitle === 'PROFESSIONAL OVERVIEW') {
            resume.professionalOverview = contentLines.join(' ').trim();
        }
        else if (sectionTitle === 'EXPERIENCE') {
            resume.experience = parseExperience(contentLines);
        }
        else if (sectionTitle === 'EDUCATION') {
            resume.education = parseEducation(contentLines);
        }
        else if (sectionTitle === 'CERTIFICATION') {
            resume.certifications = parseListSection(contentLines);
        }
        else if (sectionTitle === 'SKILLS') {
            resume.skills = parseSkills(contentLines);
        }
        else if (sectionTitle.includes('EXPERTISE')) {
            resume.expertises = parseListSection(contentLines);
        }
        else if (sectionTitle.includes('INDUSTRY')) {
            resume.industries = parseListSection(contentLines);
        }
    });

    return resume as ResumeConfig;
}

function parseExperience(lines: string[]): ExperienceItem[] {
    const experiences: ExperienceItem[] = [];
    let currentExp: ExperienceItem | null = null;

    lines.forEach(rawLine => {
        const line = rawLine.trim();
        if (!line) return;

        // H2 Line: "## Company | Role | Date"
        if (line.startsWith('## ')) {
            if (currentExp) experiences.push(currentExp);

            const cleanLine = line.replace('## ', '');
            // Expected format: Company | Role | Date
            // Sometimes it might be formatted differently, allowing resilience
            const parts = cleanLine.split('|').map(s => s.trim());

            currentExp = {
                company: cleanText(parts[0] || ''),
                role: parts[1] ? cleanText(parts[1]) : '',
                period: parts[2] ? cleanText(parts[2]) : '',
                highlights: []
            };
        }
        // Bullet points
        else if (line.startsWith('* ') || line.startsWith('- ')) {
            const content = cleanText(line.replace(/^[\*\-] /, ''));
            if (content === 'BREAK' && currentExp) {
                currentExp.hasPageBreak = true;
                return;
            }

            // Check actual indentation from the raw line (before trim)
            // If it starts with spaces (usually 2 or 4) or a tab, it's nested
            const isNested = rawLine.startsWith('  ') || rawLine.startsWith('\t');

            if (currentExp && !isNested) { // Top level bullet
                currentExp.highlights.push(cleanText(line.replace(/^[\*\-] /, '')));
            } else if (currentExp && isNested) {
                // Handle nested bullets
                const masterText = cleanText(line.replace(/^[\*\-\s]+/, ''));
                if (currentExp.highlights.length > 0) {
                    // Distinct visual separator for sub-bullets in 'flat' string array
                    // This matches what index.astro expects: point.startsWith('  -')
                    currentExp.highlights.push(`  - ${masterText}`);
                }
            }
        }
    });

    if (currentExp) experiences.push(currentExp);
    return experiences;
}

function parseEducation(lines: string[]): EducationItem[] {
    const items: EducationItem[] = [];
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        // Format: **Degree** | Institution | Date
        if (line.includes('|')) {
            const parts = line.split('|').map(s => cleanText(s.trim()));
            items.push({
                degree: parts[0],
                institution: parts[1],
                period: parts[2]
            });
        }
    });
    return items;
}

function parseSkills(lines: string[]): SkillCategory[] {
    const categories: SkillCategory[] = [];
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        if (line.startsWith('* ')) {
            // * **Category**: Item, Item, Item
            const content = line.replace('* ', '');
            const parts = content.split(':');
            if (parts.length > 1) {
                categories.push({
                    category: cleanText(parts[0]),
                    items: parts[1].split(',').map(s => cleanText(s))
                });
            }
        }
    });
    return categories;
}

function parseListSection(lines: string[]): string[] {
    return lines
        .map(l => l.trim())
        .filter(l => l.startsWith('* ') || l.startsWith('- '))
        .map(l => cleanText(l.replace(/^[\*\-] /, '')));
}
