'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestConnection() {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState('🔄 Testing...');

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        setLogs([]);
        setStatus('🔄 Testing...');

        try {
            addLog('Starting connection test...');

            // Test 1: Check environment variables
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            addLog(`Supabase URL: ${url ? '✅ Found' : '❌ Missing'}`);
            addLog(`Supabase Key: ${key ? '✅ Found (length: ' + key.length + ')' : '❌ Missing'}`);

            if (!url || !key) {
                setStatus('❌ Environment variables missing!');
                addLog('ERROR: Please restart dev server after creating .env.local');
                return;
            }

            // Test 2: Check if client exists
            addLog('Checking Supabase client...');
            if (!supabase) {
                setStatus('❌ Supabase client failed to initialize');
                addLog('ERROR: Client is null');
                return;
            }
            addLog('✅ Supabase client exists');

            // Test 3: Try a simple query
            addLog('Attempting database query...');
            const { data, error } = await supabase
                .from('users')
                .select('id')
                .limit(1);

            if (error) {
                setStatus('❌ Database query failed');
                addLog(`ERROR: ${error.message}`);
                addLog(`Code: ${error.code || 'unknown'}`);
                return;
            }

            addLog('✅ Database query successful');
            addLog(`Found ${data?.length || 0} user(s)`);

            // Test 4: Check auth
            addLog('Checking auth session...');
            const { data: { session }, error: authError } = await supabase.auth.getSession();

            if (authError) {
                addLog(`Auth warning: ${authError.message}`);
            } else {
                addLog(session ? '✅ User is logged in' : 'ℹ️ No active session (normal)');
            }

            // All tests passed!
            setStatus('✅ All tests passed! Supabase is working!');
            addLog('🎉 Connection successful - you can now signup/login');

        } catch (err: any) {
            setStatus('❌ Unexpected error');
            addLog(`EXCEPTION: ${err.message || err}`);
            console.error('Full error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Debugging database connection...
                </p>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-4 border-2 border-blue-200 dark:border-blue-800">
                    <h2 className="text-2xl font-bold mb-4">{status}</h2>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 mb-4">
                    <h3 className="text-white font-bold mb-3">Detailed Logs:</h3>
                    <div className="space-y-1 font-mono text-sm">
                        {logs.length === 0 ? (
                            <p className="text-slate-400">No logs yet...</p>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className={`
                  ${log.includes('✅') ? 'text-green-400' : ''}
                  ${log.includes('❌') || log.includes('ERROR') ? 'text-red-400' : ''}
                  ${log.includes('ℹ️') ? 'text-blue-400' : ''}
                  ${!log.includes('✅') && !log.includes('❌') && !log.includes('ℹ️') ? 'text-slate-300' : ''}
                `}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <button
                    onClick={testConnection}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                    🔄 Test Again
                </button>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">💡 Common Issues:</h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                        <li>• If env vars are missing: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">Restart dev server</code></li>
                        <li>• If database query fails: Check Supabase dashboard is active</li>
                        <li>• If still broken: Check browser console (F12) for errors</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
