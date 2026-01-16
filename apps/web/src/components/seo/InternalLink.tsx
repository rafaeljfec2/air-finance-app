import { Link } from 'react-router-dom';
import React from 'react';

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function InternalLink({ to, children, className }: Readonly<InternalLinkProps>) {
  return (
    <Link to={to} className={className || 'text-primary-500 hover:text-primary-600 underline'}>
      {children}
    </Link>
  );
}
