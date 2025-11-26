import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            icon: Icon,
            iconPosition = 'left',
            className = '',
            type = 'text',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={type}
                        className={`
              w-full px-4 py-2.5 rounded-lg
              ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
              ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
              bg-white dark:bg-slate-800
              border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400
              focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-purple-500'}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
                        {...props}
                    />

                    {Icon && iconPosition === 'right' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {hint && !error && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>
                )}

                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            hint,
            rows = 4,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    rows={rows}
                    className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-slate-800
            border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-purple-500'}
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${className}
          `}
                    {...props}
                />

                {hint && !error && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>
                )}

                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            hint,
            options,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <select
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-slate-800
            border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}
            text-slate-900 dark:text-slate-100
            focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-purple-500'}
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {hint && !error && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hint}</p>
                )}

                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
