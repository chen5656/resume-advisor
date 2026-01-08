export interface ResumeConfig {
    name: string;
    title: string;
    professionalOverview: string;
    experience: ExperienceItem[];
    education: EducationItem[];
    certifications: string[];
    skills: SkillCategory[];
    expertises: string[];
    industries: string[];
    contact: ContactInfo;
}

export interface ContactInfo {
    phone?: string;
    email?: string;
    location?: string;
    linkedin?: string;
    website?: string;
}


export interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    highlights: string[]; // The bullet points
    hasPageBreak?: boolean;
    subHighlights?: ExperienceItem[]; // For nested roles if any, or flat structure
}

export interface EducationItem {
    degree: string;
    institution: string;
    period: string;
}

export interface SkillCategory {
    category: string;
    items: string[];
}
