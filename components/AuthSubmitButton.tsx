'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps {
    children: React.ReactNode;
    formAction: (formData: FormData) => Promise<void>;
    className?: string;
}

export default function AuthSubmitButton({ children, formAction, className }: AuthSubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            formAction={formAction}
            disabled={pending}
            className={`${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
        </button>
    );
}
