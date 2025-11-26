// Supabase database helper functions
import { supabase } from './supabase/client';

// Fetch all active jobs
export async function getActiveJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }

    return data || [];
}

// Fetch jobs for a specific company
export async function getJobsByCompany(companyId: string) {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching company jobs:', error);
        return [];
    }

    return data || [];
}

// Create a new job
export async function createJob(jobData: any) {
    const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

    if (error) {
        console.error('Error creating job:', error);
        throw error;
    }

    return data;
}

// Get applications for a candidate
export async function getCandidateApplications(candidateId: string) {
    const { data, error } = await supabase
        .from('applications')
        .select(`
      *,
      jobs (
        id,
        title,
        company_name,
        location,
        ctc_min,
        ctc_max
      )
    `)
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications:', error);
        return [];
    }

    return data || [];
}

// Submit job application
export async function submitApplication(applicationData: any) {
    const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

    if (error) {
        console.error('Error submitting application:', error);
        throw error;
    }

    // Update job application count
    if (data) {
        await supabase.rpc('increment_job_applications', {
            job_id: applicationData.job_id
        });
    }

    return data;
}

// Get candidate profile
export async function getCandidateProfile(userId: string) {
    const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching candidate profile:', error);
        return null;
    }

    return data;
}

// Get corporate profile
export async function getCorporateProfile(userId: string) {
    const { data, error } = await supabase
        .from('corporate_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching corporate profile:', error);
        return null;
    }

    return data;
}

// Get college profile
export async function getCollegeProfile(userId: string) {
    const { data, error } = await supabase
        .from('college_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching college profile:', error);
        return null;
    }

    return data;
}

// Calculate match score based on skills
export function calculateMatchScore(jobSkills: string[], candidateSkills: string[]): number {
    if (!jobSkills || !candidateSkills || jobSkills.length === 0) return 0;

    const matchedSkills = jobSkills.filter(skill =>
        candidateSkills.some(cSkill =>
            cSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(cSkill.toLowerCase())
        )
    );

    return Math.round((matchedSkills.length / jobSkills.length) * 100);
}
