// Resume Parser Utility
// Analyzes resume text and provides scoring

interface ResumeAnalysis {
    score: number;
    completeness: number;
    atsCompliance: number;
    keywords: number;
    grammar: number;
    strengths: string[];
    improvements: string[];
    presentKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
    sections: {
        hasContactInfo: boolean;
        hasSummary: boolean;
        hasExperience: boolean;
        hasEducation: boolean;
        hasSkills: boolean;
        hasProjects: boolean;
    };
}

// Industry keywords to check for
const INDUSTRY_KEYWORDS = {
    technical: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
        'C++', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker',
        'Kubernetes', 'Git', 'CI/CD', 'Agile', 'Scrum', 'REST API',
        'GraphQL', 'HTML', 'CSS', 'Angular', 'Vue', 'Next.js'
    ],
    soft: [
        'Leadership', 'Communication', 'Team', 'Collaboration', 'Problem Solving',
        'Critical Thinking', 'Project Management', 'Analytical', 'Creative'
    ],
    action: [
        'Developed', 'Implemented', 'Designed', 'Led', 'Managed', 'Created',
        'Built', 'Optimized', 'Improved', 'Achieved', 'Delivered', 'Coordinated'
    ]
};

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
    try {
        // Extract text from file
        const text = await extractTextFromFile(file);

        // Analyze sections
        const sections = detectSections(text);

        // Find keywords
        const foundKeywords = findKeywords(text);

        // Calculate scores
        const completeness = calculateCompleteness(sections);
        const atsCompliance = calculateATSCompliance(text, sections);
        const keywordScore = calculateKeywordScore(foundKeywords);
        const grammar = calculateGrammarScore(text);

        const overallScore = Math.round(
            (completeness * 0.3) +
            (atsCompliance * 0.3) +
            (keywordScore * 0.25) +
            (grammar * 0.15)
        );

        // Generate insights
        const strengths = generateStrengths(sections, foundKeywords, text);
        const improvements = generateImprovements(sections, foundKeywords, text);
        const suggestions = generateSuggestions(sections, atsCompliance);

        // Missing keywords
        const allKeywords = [
            ...INDUSTRY_KEYWORDS.technical,
            ...INDUSTRY_KEYWORDS.soft,
            ...INDUSTRY_KEYWORDS.action
        ];
        const missingKeywords = allKeywords
            .filter(k => !foundKeywords.some(fk => fk.toLowerCase() === k.toLowerCase()))
            .slice(0, 10);

        return {
            score: overallScore,
            completeness,
            atsCompliance,
            keywords: keywordScore,
            grammar,
            strengths,
            improvements,
            presentKeywords: foundKeywords,
            missingKeywords,
            suggestions,
            sections
        };
    } catch (error) {
        console.error('Resume analysis error:', error);
        throw error;
    }
}

async function extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                resolve(result);
            } else {
                // For binary files (PDF), extract as text
                resolve(new TextDecoder().decode(result as ArrayBuffer));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));

        // Try to read as text first
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else {
            // For PDF/Word, read as text (simplified - real parsing would need libraries)
            reader.readAsText(file);
        }
    });
}

function detectSections(text: string) {
    const lowerText = text.toLowerCase();

    return {
        hasContactInfo: /email|phone|linkedin|github|portfolio/.test(lowerText),
        hasSummary: /summary|objective|profile|about/.test(lowerText),
        hasExperience: /experience|work|employment|position|job/.test(lowerText),
        hasEducation: /education|degree|university|college|school/.test(lowerText),
        hasSkills: /skills|technologies|technical|proficient/.test(lowerText),
        hasProjects: /projects|portfolio|built|developed/.test(lowerText),
    };
}

function findKeywords(text: string): string[] {
    const allKeywords = [
        ...INDUSTRY_KEYWORDS.technical,
        ...INDUSTRY_KEYWORDS.soft,
        ...INDUSTRY_KEYWORDS.action
    ];

    const found: string[] = [];
    allKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text)) {
            found.push(keyword);
        }
    });

    return [...new Set(found)]; // Remove duplicates
}

function calculateCompleteness(sections: any): number {
    const sectionCount = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;
    return Math.round((sectionCount / totalSections) * 100);
}

function calculateATSCompliance(text: string, sections: any): number {
    let score = 0;

    // Check for standard sections (40 points)
    if (sections.hasContactInfo) score += 10;
    if (sections.hasExperience) score += 10;
    if (sections.hasEducation) score += 10;
    if (sections.hasSkills) score += 10;

    // Check for action verbs (20 points)
    const hasActionVerbs = INDUSTRY_KEYWORDS.action.some(verb =>
        new RegExp(`\\b${verb}\\b`, 'i').test(text)
    );
    if (hasActionVerbs) score += 20;

    // Check for quantifiable achievements (20 points)
    const hasNumbers = /\d+%|\d+\+|increased|decreased|improved by/.test(text);
    if (hasNumbers) score += 20;

    // Check length (20 points)
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 800) score += 20;

    return Math.min(score, 100);
}

function calculateKeywordScore(keywords: string[]): number {
    // Score based on number of relevant keywords found
    const score = Math.min((keywords.length / 15) * 100, 100);
    return Math.round(score);
}

function calculateGrammarScore(text: string): number {
    let score = 100;

    // Basic checks (this is simplified - real grammar checking needs NLP)
    const sentences = text.split(/[.!?]+/);

    // Check for capital letters at sentence starts
    let capitalErrors = 0;
    sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        if (trimmed && !/^[A-Z]/.test(trimmed)) {
            capitalErrors++;
        }
    });

    // Deduct points for errors
    score -= Math.min(capitalErrors * 2, 30);

    // Check for common errors
    if (/\s{2,}/.test(text)) score -= 5; // Multiple spaces
    if (/[a-z]\.[A-Z]/.test(text)) score -= 5; // Missing space after period

    return Math.max(score, 60);
}

function generateStrengths(sections: any, keywords: string[], text: string): string[] {
    const strengths: string[] = [];

    if (sections.hasContactInfo) {
        strengths.push('Complete contact information included');
    }

    if (sections.hasSummary) {
        strengths.push('Professional summary present');
    }

    if (keywords.length >= 10) {
        strengths.push(`Strong keyword presence (${keywords.length} industry terms found)`);
    }

    if (INDUSTRY_KEYWORDS.action.some(verb => new RegExp(`\\b${verb}\\b`, 'i').test(text))) {
        strengths.push('Uses action verbs to describe achievements');
    }

    if (/\d+%|\d+\+|increased|decreased/.test(text)) {
        strengths.push('Includes quantified achievements with metrics');
    }

    if (sections.hasProjects) {
        strengths.push('Project experience highlighted');
    }

    return strengths.length > 0 ? strengths : ['Resume structure is clear and organized'];
}

function generateImprovements(sections: any, keywords: string[], text: string): string[] {
    const improvements: string[] = [];

    if (!sections.hasSummary) {
        improvements.push('Add a professional summary at the top');
    }

    if (!sections.hasContactInfo) {
        improvements.push('Include complete contact information');
    }

    if (keywords.length < 10) {
        improvements.push('Add more industry-relevant keywords');
    }

    if (!sections.hasProjects) {
        improvements.push('Include projects to showcase practical experience');
    }

    if (!/\d+%|\d+\+/.test(text)) {
        improvements.push('Quantify achievements with numbers and percentages');
    }

    const wordCount = text.split(/\s+/).length;
    if (wordCount < 300) {
        improvements.push('Expand content - resume seems too brief');
    } else if (wordCount > 800) {
        improvements.push('Condense content - keep to 1-2 pages');
    }

    if (improvements.length === 0) {
        improvements.push('Consider adding certifications if available');
    }

    return improvements;
}

function generateSuggestions(sections: any, atsScore: number): string[] {
    const suggestions: string[] = [];

    suggestions.push('Use a simple, clean format without tables or graphics');
    suggestions.push('Start bullet points with strong action verbs');

    if (atsScore < 70) {
        suggestions.push('Include industry-standard section headers (Experience, Education, Skills)');
    }

    suggestions.push('Tailor resume to each job posting');
    suggestions.push('Keep file format as PDF for best compatibility');
    suggestions.push('Use standard fonts like Arial, Calibri, or Times New Roman');

    return suggestions.slice(0, 5);
}
