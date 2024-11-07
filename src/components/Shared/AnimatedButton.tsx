import React, { FC } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Using Font Awesome for the spinner icon

// Define the props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    disabled?: boolean;
}

// Make the Button component type-safe
const AnimatedButton: FC<ButtonProps> = ({
    loading = false,
    disabled = false,
    onClick,
    children,
    className = '',
    type = 'button',
    ...props // Spread other button attributes
}) => {
    return (
        <button
            type={type as "button" | "submit" | "reset"} // Ensures the type prop is one of the button types
            onClick={onClick}
            disabled={disabled || loading}
            className={`relative flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md 
                  ${loading || disabled ? 'bg-transparent cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                  ${className}`}
            {...props} // Spread additional props like aria-* or data-* attributes
        >
            {/* Button Text */}
            <span className={`${loading ? 'opacity-0' : ''}`}>
                {children}
            </span>

            {/* Loading Spinner */}
            {loading && (
                <FaSpinner className="absolute w-5 h-5 text-white animate-spin" />
            )}
        </button>
    );
};

export default AnimatedButton;
