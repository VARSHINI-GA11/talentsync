// User & Authentication Types
export type UserRole = 'candidate' | 'college' | 'corporate' | 'admin';

export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    profile: CandidateProfile | CollegeProfile | CorporateProfile | AdminProfile;
    createdAt: string;
    lastLogin?: string;
}

// Candidate Types
export interface CandidateProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    photo?: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;

    // Education
    education: Education[];

    // Experience
    experience: Experience[];

    // Skills
    skills: string[];

    // Resume
    resumeUrl?: string;
    resumeScore?: number;

    // Certifications
    certifications: Certification[];

    // Projects
    projects: Project[];

    // Preferences
    preferredRoles?: string[];
    preferredLocations?: string[];
    expectedSalary?: number;
    noticePeriod?: string;

    // Scores
    aptitudeScore?: number;
    interviewScore?: number;

    // College (optional)
    collegeId?: string;

    // Verification
    isVerified: boolean;
    verificationDocuments?: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    location?: string;
    description?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    location?: string;
    description?: string;
    skills?: string[];
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
    url?: string;
    githubUrl?: string;
    imageUrl?: string;
}

// College Types
export interface CollegeProfile {
    id: string;
    userId: string;
    institutionName: string;
    type: 'university' | 'college' | 'institute';
    logo?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    website?: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    isVerified: boolean;
    verificationDocuments?: string[];
    establishedYear?: number;
    totalStudents?: number;
}

// Corporate Types
export interface CorporateProfile {
    id: string;
    userId: string;
    companyName: string;
    logo?: string;
    industry: string;
    companySize: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    hrName: string;
    hrEmail: string;
    hrPhone: string;
    isVerified: boolean;
    verificationDocuments?: string[];
    description?: string;
}

// Admin Types
export interface AdminProfile {
    id: string;
    userId: string;
    name: string;
    permissions: string[];
}

// Job Types
export type JobType = 'on-campus' | 'off-campus' | 'hybrid';
export type JobMode = 'on-site' | 'remote' | 'hybrid';
export type JobStatus = 'draft' | 'active' | 'closed' | 'archived';

export interface JobPosting {
    id: string;
    companyId: string;
    companyName: string;
    companyLogo?: string;

    title: string;
    description: string;
    responsibilities: string[];

    requiredSkills: string[];
    optionalSkills?: string[];

    qualifications: {
        minimumDegree: string;
        minimumGPA?: number;
        yearsOfExperience?: number;
        specificRequirements?: string[];
    };

    ctcMin: number;
    ctcMax: number;
    currency: string;

    location: string;
    workMode: JobMode;
    jobType: JobType;

    openings: number;

    // For on-campus jobs
    targetColleges?: string[];
    eligibleDepartments?: string[];

    // Automation settings
    autoAptitudeTest: boolean;
    autoAIInterview: boolean;
    customQuestions?: CustomQuestion[];

    status: JobStatus;
    postedDate: string;
    deadline?: string;

    // Statistics
    totalApplications: number;
    shortlisted: number;
    interviewed: number;
    offered: number;
    hired: number;
}

export interface CustomQuestion {
    id: string;
    type: 'mcq' | 'coding' | 'text' | 'video';
    question: string;
    options?: string[];
    correctAnswer?: string;
    timeLimit?: number;
}

// Application Types
export type ApplicationStatus =
    | 'applied'
    | 'screening'
    | 'resume-scored'
    | 'aptitude-pending'
    | 'aptitude-completed'
    | 'ai-interview-pending'
    | 'ai-interview-completed'
    | 'hr-review'
    | 'shortlisted'
    | 'rejected'
    | 'offer-sent'
    | 'offer-accepted'
    | 'hired';

export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhoto?: string;

    status: ApplicationStatus;
    timeline: ApplicationTimelineItem[];

    scores: {
        resumeScore?: number;
        aptitudeScore?: number;
        aiInterviewScore?: number;
        overallScore?: number;
    };

    feedback?: {
        round: string;
        reviewer: string;
        comments: string;
        rating?: number;
        date: string;
    }[];

    appliedDate: string;
    lastUpdated: string;
}

export interface ApplicationTimelineItem {
    status: ApplicationStatus;
    date: string;
    notes?: string;
}

// Test Types
export type TestCategory = 'quantitative' | 'logical' | 'verbal' | 'technical';
export type TestDifficulty = 'easy' | 'medium' | 'hard';

export interface AptitudeTest {
    id: string;
    candidateId: string;
    jobId?: string;
    category: TestCategory;
    difficulty: TestDifficulty;
    questions: TestQuestion[];
    answers: TestAnswer[];
    startTime: string;
    endTime?: string;
    duration: number; // in minutes
    score?: number;
    totalQuestions: number;
    correctAnswers?: number;
    analytics?: {
        topicWiseAccuracy: Record<string, number>;
        avgTimePerQuestion: number;
        strengthTopics: string[];
        weaknessTopics: string[];
    };
}

export interface TestQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    category: TestCategory;
    topic: string;
    difficulty: TestDifficulty;
    explanation?: string;
}

export interface TestAnswer {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}

// Interview Types
export type InterviewType = 'technical' | 'behavioral' | 'hr';

export interface AIInterview {
    id: string;
    candidateId: string;
    jobId?: string;
    type: InterviewType;
    questions: InterviewQuestion[];
    answers: InterviewAnswer[];
    startTime: string;
    endTime?: string;
    score?: number;
    feedback?: {
        strengths: string[];
        improvements: string[];
        overallAssessment: string;
    };
    recordingUrl?: string;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    type: InterviewType;
    expectedKeywords?: string[];
    idealAnswerLength?: number;
}

export interface InterviewAnswer {
    questionId: string;
    answer: string;
    audioUrl?: string;
    score?: number;
    keywords?: string[];
    analysis?: {
        relevance: number;
        confidence: number;
        completeness: number;
        keywordsMatched: string[];
    };
}

// Drive Types
export type DriveStatus = 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';

export interface CampusDrive {
    id: string;
    companyId: string;
    companyName: string;
    companyLogo?: string;
    collegeId: string;
    collegeName: string;

    jobs: string[]; // Job IDs

    invitationDate: string;
    status: DriveStatus;

    eligibilityCriteria: {
        minimumGPA?: number;
        departments?: string[];
        graduationYears?: number[];
        backlogs?: number;
    };

    schedule?: {
        date: string;
        timeline: {
            round: string;
            startTime: string;
            endTime: string;
            venue?: string;
        }[];
    };

    logistics?: {
        venue?: string;
        resources?: string[];
        coordinators?: string[];
    };

    registeredStudents: string[]; // Candidate IDs
    shortlistedStudents: string[];

    offersMade: number;
    offersAccepted: number;
}

// Document Types
export type DocumentType =
    | 'offer-letter'
    | 'joining-confirmation'
    | 'certificate'
    | 'nda'
    | 'mou'
    | 'consent-form'
    | 'verification-doc';

export interface Document {
    id: string;
    type: DocumentType;
    title: string;
    url: string;
    uploadedBy: string;
    uploadedByRole: UserRole;
    uploadedDate: string;
    relatedTo?: {
        entityType: 'candidate' | 'company' | 'college' | 'drive' | 'application';
        entityId: string;
    };
    status?: 'pending' | 'approved' | 'rejected';
    size?: number;
}

// Learning Types
export interface LearningPath {
    id: string;
    title: string;
    category: string;
    description: string;
    duration: string; // e.g., "8 weeks"
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: LearningStep[];
    thumbnail?: string;
}

export interface LearningStep {
    id: string;
    title: string;
    description: string;
    resources: LearningResource[];
    estimatedTime: string;
    isCompleted?: boolean;
}

export interface LearningResource {
    id: string;
    type: 'video' | 'article' | 'course' | 'practice' | 'book';
    title: string;
    url: string;
    provider?: string;
    duration?: string;
    isPremium?: boolean;
}

// Notification Types
export type NotificationChannel = 'email' | 'app' | 'whatsapp';
export type NotificationType =
    | 'job-match'
    | 'status-update'
    | 'reminder'
    | 'drive-invitation'
    | 'new-applicant'
    | 'offer'
    | 'message';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    channel: NotificationChannel[];
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, any>;
}

// Analytics Types
export interface PlacementAnalytics {
    placementRate: number;
    totalStudents: number;
    placedStudents: number;

    byCompany: {
        companyName: string;
        offered: number;
        accepted: number;
        avgCTC: number;
    }[];

    byDepartment: {
        department: string;
        placementRate: number;
        avgCTC: number;
        highestCTC: number;
    }[];

    salaryTrends: {
        avgCTC: number;
        highestCTC: number;
        lowestCTC: number;
        medianCTC: number;
    };

    skillGap: {
        skill: string;
        demand: number;
        supply: number;
        gap: number;
    }[];
}

export interface HiringAnalytics {
    timeToHire: number; // in days
    costPerHire: number;

    funnel: {
        stage: string;
        count: number;
        percentage: number;
    }[];

    candidateQuality: {
        avgResumeScore: number;
        avgAptitudeScore: number;
        avgInterviewScore: number;
    };

    sourceEffectiveness: {
        source: 'on-campus' | 'off-campus';
        applications: number;
        hired: number;
        conversionRate: number;
    }[];
}
