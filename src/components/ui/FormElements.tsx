'use client';

import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FiAlertCircle } from 'react-icons/fi';

// Form Group
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

// Form Label
interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

export function FormLabel({ htmlFor, children, className, required }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

// Form Input
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-md text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent',
            icon && 'pl-10',
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            props.disabled && 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-75',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="mt-1 text-sm text-red-500 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// Form Textarea
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            'w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-md text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent',
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            props.disabled && 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-75',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <div className="mt-1 text-sm text-red-500 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// Form Select
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <div>
        <select
          className={cn(
            'w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-md text-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent',
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            props.disabled && 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-75',
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="mt-1 text-sm text-red-500 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// Form Checkbox
interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className={cn(
              'w-4 h-4 text-primary bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-primary dark:focus:ring-primary-light',
              error && 'border-red-500 dark:border-red-500',
              props.disabled && 'opacity-60 cursor-not-allowed',
              className
            )}
            ref={ref}
            {...props}
          />
          <label
            htmlFor={props.id}
            className={cn(
              'ml-2 text-sm text-gray-700 dark:text-gray-300',
              props.disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <div className="mt-1 text-sm text-red-500 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

// Form Radio
interface FormRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormRadio = forwardRef<HTMLInputElement, FormRadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center">
          <input
            type="radio"
            className={cn(
              'w-4 h-4 text-primary bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-primary-light',
              error && 'border-red-500 dark:border-red-500',
              props.disabled && 'opacity-60 cursor-not-allowed',
              className
            )}
            ref={ref}
            {...props}
          />
          <label
            htmlFor={props.id}
            className={cn(
              'ml-2 text-sm text-gray-700 dark:text-gray-300',
              props.disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <div className="mt-1 text-sm text-red-500 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormRadio.displayName = 'FormRadio';

// Form Helper Text
interface FormHelperTextProps {
  children: ReactNode;
  className?: string;
}

export function FormHelperText({ children, className }: FormHelperTextProps) {
  return (
    <p className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}

// Form Error Message
interface FormErrorProps {
  children: ReactNode;
  className?: string;
}

export function FormError({ children, className }: FormErrorProps) {
  return (
    <div className={cn('mt-1 text-sm text-red-500 flex items-center', className)}>
      <FiAlertCircle className="w-4 h-4 mr-1" />
      {children}
    </div>
  );
}
