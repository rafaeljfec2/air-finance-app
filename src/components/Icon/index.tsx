import * as HeroIcons from '@heroicons/react/24/outline';

type IconName = keyof typeof HeroIcons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = '' }: Readonly<IconProps>) {
  const IconComponent = HeroIcons[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return <IconComponent width={size} height={size} className={className} />;
} 