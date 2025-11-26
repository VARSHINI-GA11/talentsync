-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'college', 'corporate', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidate profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    skills TEXT[],
    education JSONB,
    experience JSONB,
    projects JSONB,
    certifications JSONB,
    resume_url TEXT,
    resume_score INTEGER DEFAULT 0,
    aptitude_score INTEGER DEFAULT 0,
    interview_score INTEGER DEFAULT 0,
    preferred_roles TEXT[],
    preferred_locations TEXT[],
    expected_salary INTEGER,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create corporate profiles
CREATE TABLE IF NOT EXISTS corporate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    logo_url TEXT,
    industry TEXT,
    company_size TEXT,
    hr_name TEXT,
    hr_email TEXT,
    hr_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    website TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college profiles
CREATE TABLE IF NOT EXISTS college_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    total_students INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES corporate_profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[],
    required_skills TEXT[],
    optional_skills TEXT[],
    qualifications JSONB,
    ctc_min INTEGER NOT NULL,
    ctc_max INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    location TEXT NOT NULL,
    work_mode TEXT CHECK (work_mode IN ('remote', 'on-site', 'hybrid')),
    job_type TEXT CHECK (job_type IN ('on-campus', 'off-campus')),
    target_colleges TEXT[],
    eligible_departments TEXT[],
    openings INTEGER NOT NULL,
    auto_aptitude_test BOOLEAN DEFAULT true,
    auto_ai_interview BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed')),
    posted_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    total_applications INTEGER DEFAULT 0,
    shortlisted INTEGER DEFAULT 0,
    interviewed INTEGER DEFAULT 0,
    offered INTEGER DEFAULT 0,
    hired INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    candidate_name TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN (
        'applied', 'screening', 'resume-scored', 
        'aptitude-pending', 'aptitude-completed',
        'ai-interview-pending', 'ai-interview-completed',
        'shortlisted', 'hr-round', 'offered', 
        'offer-accepted', 'hired', 'rejected'
    )),
    scores JSONB,
    timeline JSONB,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can read their own data)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- RLS Policies for candidate profiles
CREATE POLICY "Candidates can view own profile" ON candidate_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Candidates can update own profile" ON candidate_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies for jobs (public read, corporate can create/update own)
CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (status = 'active');

CREATE POLICY "Companies can manage own jobs" ON jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM corporate_profiles
            WHERE corporate_profiles.id = jobs.company_id
            AND corporate_profiles.user_id::text = auth.uid()::text
        )
    );

-- RLS Policies for applications
CREATE POLICY "Candidates can view own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM candidate_profiles
            WHERE candidate_profiles.id = applications.candidate_id
            AND candidate_profiles.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Candidates can create applications" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM candidate_profiles
            WHERE candidate_profiles.id = applications.candidate_id
            AND candidate_profiles.user_id::text = auth.uid()::text
        )
    );
