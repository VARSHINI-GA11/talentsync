'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    category: string;
}

const APTITUDE_QUESTIONS: Question[] = [
    // Quantitative Aptitude
    { id: 1, question: "If 20% of a number is 40, what is 50% of that number?", options: ["80", "100", "120", "200"], correctAnswer: 1, category: "Quantitative" },
    { id: 2, question: "A train travels 60 km in 45 minutes. What is its speed in km/h?", options: ["70", "75", "80", "85"], correctAnswer: 2, category: "Quantitative" },
    { id: 3, question: "What is the next number in the sequence: 2, 6, 12, 20, 30, __?", options: ["40", "42", "44", "48"], correctAnswer: 1, category: "Quantitative" },
    { id: 4, question: "If the price of a product is increased by 20% and then decreased by 20%, what is the net change?", options: ["-4%", "0%", "2%", "4%"], correctAnswer: 0, category: "Quantitative" },
    { id: 5, question: "A person invests ₹10,000 at 10% simple interest per annum. What will be the amount after 2 years?", options: ["₹11,000", "₹12,000", "₹12,100", "₹13,000"], correctAnswer: 1, category: "Quantitative" },

    // Logical Reasoning
    { id: 6, question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.", options: ["True", "False", "Cannot say", "None"], correctAnswer: 0, category: "Logical" },
    { id: 7, question: "Complete the analogy: Book : Pages :: Tree : __?", options: ["Leaves", "Branches", "Roots", "Trunk"], correctAnswer: 0, category: "Logical" },
    { id: 8, question: "If CAT = 24, DOG = 26, then COW = ?", options: ["34", "30", "28", "32"], correctAnswer: 0, category: "Logical" },
    { id: 9, question: "If 5 workers can complete a job in 12 days, how many days will 3 workers take?", options: ["15", "18", "20", "24"], correctAnswer: 2, category: "Logical" },
    { id: 10, question: "Which number does not belong: 2, 3, 6, 7, 8, 14, 15, 30", options: ["6", "8", "14", "30"], correctAnswer: 1, category: "Logical" },

    // Verbal Reasoning
    { id: 11, question: "Choose the word most similar to 'Eloquent':", options: ["Fluent", "Silent", "Awkward", "Hesitant"], correctAnswer: 0, category: "Verbal" },
    { id: 12, question: "Find the odd one out:", options: ["Triangle", "Rectangle", "Circle", "Square"], correctAnswer: 2, category: "Verbal" },
    { id: 13, question: "Complete: Pen : Write :: Knife : __?", options: ["Cut", "Sharp", "Steel", "Handle"], correctAnswer: 0, category: "Verbal" },
    { id: 14, question: "Antonym of 'ABUNDANCE':", options: ["Plenty", "Scarcity", "Wealth", "Excess"], correctAnswer: 1, category: "Verbal" },
    { id: 15, question: "If ROPE is coded as ENOD, how is CHAIR coded?", options: ["ZIBFW", "DIBHS", "DIBJS", "EJBIS"], correctAnswer: 0, category: "Verbal" },

    // Data Interpretation
    { id: 16, question: "A pie chart shows Sales: 40%, Marketing: 30%, R&D: 20%, Others: 10%. If total budget is ₹100000, what is R&D budget?", options: ["₹15000", "₹20000", "₹25000", "₹30000"], correctAnswer: 1, category: "Data" },
    { id: 17, question: "If the average of 5 numbers is 40, and four of them are 38, 42, 45, and 35, what is the fifth number?", options: ["35", "40", "45", "50"], correctAnswer: 1, category: "Data" },
    { id: 18, question: "In a class, 60% are boys. If there are 24 girls, how many total students?", options: ["40", "50", "60", "80"], correctAnswer: 2, category: "Data" },
    { id: 19, question: "A shopkeeper marks up goods by 40% but gives 20% discount. What is his profit %?", options: ["10%", "12%", "15%", "20%"], correctAnswer: 1, category: "Data" },
    { id: 20, question: "If population grows at 5% per year, after 2 years 1000 becomes:", options: ["1100", "1102.5", "1105", "1150"], correctAnswer: 1, category: "Data" },

    // Coding & Technical  
    { id: 21, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, category: "Technical" },
    { id: 22, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], correctAnswer: 1, category: "Technical" },
    { id: 23, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], correctAnswer: 0, category: "Technical" },
    { id: 24, question: "In JavaScript, what is the result of: typeof null?", options: ["null", "undefined", "object", "number"], correctAnswer: 2, category: "Technical" },
    { id: 25, question: "Which HTTP method is used to update data?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: 2, category: "Technical" },

    // Pattern Recognition
    { id: 26, question: "What comes next: 1, 4, 9, 16, 25, __?", options: ["30", "35", "36", "49"], correctAnswer: 2, category: "Pattern" },
    { id: 27, question: "Complete: A1, B2, C6, D24, E__?", options: ["48", "96", "120", "144"], correctAnswer: 2, category: "Pattern" },
    { id: 28, question: "What is missing: 3, 6, 11, 18, 27, __?", options: ["36", "38", "39", "40"], correctAnswer: 1, category: "Pattern" },
    { id: 29, question: "Continue the series: Z, Y, X, W, V, __?", options: ["T", "U", "S", "R"], correctAnswer: 1, category: "Pattern" },
    { id: 30, question: "Pattern: 5, 10, 20, 40, 80, __?", options: ["120", "140", "160", "200"], correctAnswer: 2, category: "Pattern" },

    // Problem Solving
    { id: 31, question: "A clock shows 3:15. What is the angle between hour and minute hands?", options: ["0°", "7.5°", "15°", "22.5°"], correctAnswer: 1, category: "Problem" },
    { id: 32, question: "How many squares are there on a chess board?", options: ["64", "84", "100", "204"], correctAnswer: 3, category: "Problem" },
    { id: 33, question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["5 min", "20 min", "100 min", "500 min"], correctAnswer: 0, category: "Problem" },
    { id: 34, question: "A bat and ball cost ₹110 total. The bat costs ₹100 more than the ball. How much does the ball cost?", options: ["₹5", "₹10", "₹15", "₹20"], correctAnswer: 0, category: "Problem" },
    { id: 35, question: "You have 12 balls. One is heavier. Minimum weighings on a balance to find it?", options: ["2", "3", "4", "5"], correctAnswer: 1, category: "Problem" },

    // General Knowledge (Tech)
    { id: 36, question: "Who is known as the father of Computer Science?", options: ["Steve Jobs", "Bill Gates", "Alan Turing", "Tim Berners-Lee"], correctAnswer: 2, category: "GK" },
    { id: 37, question: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], correctAnswer: 2, category: "GK" },
    { id: 38, question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Protocol Interface"], correctAnswer: 0, category: "GK" },
    { id: 39, question: "Which company developed the Java programming language?", options: ["Microsoft", "Sun Microsystems", "Oracle", "IBM"], correctAnswer: 1, category: "GK" },
    { id: 40, question: "What is the full form of HTML?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, category: "GK" },

    // Mixed Advanced
    { id: 41, question: "If 3x + 5 = 20, what is x?", options: ["3", "4", "5", "6"], correctAnswer: 2, category: "Quantitative" },
    { id: 42, question: "The sum of three consecutive even numbers is 66. What is the largest number?", options: ["20", "22", "24", "26"], correctAnswer: 2, category: "Quantitative" },
    { id: 43, question: "A man can row 30 km downstream and 20 km upstream in 7 hours. Speed of stream is 5 km/h. What is his rowing speed in still water?", options: ["10", "12", "15", "20"], correctAnswer: 0, category: "Quantitative" },
    { id: 44, question: "If A:B = 2:3 and B:C = 4:5, then A:C = ?", options: ["8:15", "4:5", "2:3", "6:5"], correctAnswer: 0, category: "Logical" },
    { id: 45, question: "Which of the following is not a programming paradigm?", options: ["Object-Oriented", "Functional", "Procedural", "Sequential"], correctAnswer: 3, category: "Technical" },
    { id: 46, question: "What is recursion in programming?", options: ["A loop", "A function calling itself", "A data structure", "An algorithm"], correctAnswer: 1, category: "Technical" },
    { id: 47, question: "Find the odd one: Python, Java, C++, HTML, JavaScript", options: ["Python", "Java", "HTML", "JavaScript"], correctAnswer: 2, category: "Technical" },
    { id: 48, question: "What is cloud computing?", options: ["Internet storage", "On-demand computing resources", "Weather prediction", "Data encryption"], correctAnswer: 1, category: "Technical" },
    { id: 49, question: "Which company owns GitHub?", options: ["Google", "Facebook", "Microsoft", "Amazon"], correctAnswer: 2, category: "GK" },
    { id: 50, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 0, category: "GK" },
];

export default function AptitudeTestPage() {
    const [testStarted, setTestStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>(new Array(50).fill(-1));
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
    const [testCompleted, setTestCompleted] = useState(false);
    const [score, setScore] = useState(0);

    // Timer countdown
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testStarted, testCompleted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmitTest = () => {
        let correctCount = 0;
        answers.forEach((answer, index) => {
            if (answer === APTITUDE_QUESTIONS[index].correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setTestCompleted(true);
    };

    const restartTest = () => {
        setTestStarted(false);
        setCurrentQuestion(0);
        setAnswers(new Array(50).fill(-1));
        setTimeLeft(60 * 60);
        setTestCompleted(false);
        setScore(0);
    };

    if (!testStarted) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Aptitude Practice Test</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Test your skills with 50 aptitude questions
                    </p>
                </div>

                <Card className="max-w-3xl">
                    <div className="text-center py-12">
                        <Brain className="w-24 h-24 mx-auto mb-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Ready to Test Your Skills?
                        </h2>
                        <div className="space-y-4 mb-8 text-left max-w-xl mx-auto">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">50 Questions</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Covering Quantitative, Logical, Verbal, Data, and Technical aptitude
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">60 Minutes</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Timer will start automatically when you begin
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Instant Results</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Get your score immediately after submission
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setTestStarted(true)}
                            icon={Brain}
                        >
                            Start Test Now
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (testCompleted) {
        const percentage = (score / 50) * 100;
        const passed = percentage >= 60;

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Test Results</h1>
                </div>

                <Card className="max-w-3xl">
                    <div className="text-center py-12">
                        {passed ? (
                            <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
                        ) : (
                            <XCircle className="w-24 h-24 mx-auto mb-6 text-orange-500" />
                        )}

                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            {score}/50
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                            {percentage.toFixed(1)}% Score
                        </p>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-8">
                            <div
                                className={`h-4 rounded-full transition-all ${passed
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                        : 'bg-gradient-to-r from-orange-500 to-red-600'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <p className="text-2xl font-bold text-green-600">{score}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Correct</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                <p className="text-2xl font-bold text-red-600">{50 - score}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Incorrect</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button variant="primary" onClick={restartTest} icon={RotateCcw}>
                                Take Test Again
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const question = APTITUDE_QUESTIONS[currentQuestion];
    const answeredCount = answers.filter(a => a !== -1).length;

    return (
        <div className="space-y-6">
            {/* Header with Timer */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Aptitude Test</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Question {currentQuestion + 1} of 50 • {answeredCount} answered
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / 50) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <Card>
                <div className="space-y-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                            {question.category}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {question.question}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion] === index
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-slate-300'
                                        }`}>
                                        {answers[currentQuestion] === index && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>

                <div className="flex gap-2">
                    {currentQuestion === 49 ? (
                        <Button
                            variant="primary"
                            onClick={handleSubmitTest}
                        >
                            Submit Test
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                        >
                            Next Question
                        </Button>
                    )}
                </div>
            </div>

            {/* Question Navigator */}
            <Card>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Question Navigator</h3>
                <div className="grid grid-cols-10 gap-2">
                    {APTITUDE_QUESTIONS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestion(index)}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${index === currentQuestion
                                    ? 'bg-blue-600 text-white'
                                    : answers[index] !== -1
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
