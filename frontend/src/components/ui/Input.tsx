import { forwardRef } from 'react';
import { InputProps } from '@/types/components';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', fullWidth, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`block rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${fullWidth ? 'w-full' : ''} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input }; 