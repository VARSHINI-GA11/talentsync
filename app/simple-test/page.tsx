'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SimpleAuthTest() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testSignup = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            // Try to sign up with a simple test account
            const { data, error } = await supabase.auth.signUp({
                email: 'test' + Date.now() + '@test.com',
                password: 'password123456',
            });

            if (error) {
                setResult('❌ ERROR: ' + error.message);
            } else {
                setResult('✅ SUCCESS! Auth is working!\n\nUser ID: ' + data.user?.id);
            }
        } catch (err: any) {
            setResult('❌ EXCEPTION: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Simple Auth Test</h1>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-4">
                    <h2 className="text-xl font-bold mb-4">Test Supabase Auth Directly</h2>

                    <button
                        onClick={testSignup}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold mb-4"
                    >
                        {loading ? 'Testing...' : '🧪 Test Signup'}
                    </button>

                    {result && (
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                        </div>
                    )}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">What this tests:</h3>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                        <li>• Direct connection to Supabase Auth</li>
                        <li>• Network connectivity</li>
                        <li>• API credentials validity</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
