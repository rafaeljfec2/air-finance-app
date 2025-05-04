import React from 'react';
import { Card } from './card';

interface FormCardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({ title, children, footer, className }) => (
  <Card className={`p-6 ${className || ''}`}>
    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
    <div>{children}</div>
    {footer && <div className="mt-6">{footer}</div>}
  </Card>
);
