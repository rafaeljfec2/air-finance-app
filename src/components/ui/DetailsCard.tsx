import React from 'react';
import { Card } from './card';

interface DetailsCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({ title, children, className }) => (
  <Card className={`p-6 ${className || ''}`}>
    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
    <div>{children}</div>
  </Card>
);
