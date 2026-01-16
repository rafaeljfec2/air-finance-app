import { ForwardRefExoticComponent, SVGProps } from 'react';
import { UserRole } from './user';

export type NavigationIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & { title?: string; titleId?: string }
>;

export interface NavigationLinkItem {
  name: string;
  href: string;
  icon: NavigationIcon;
  roles?: UserRole[];
}

export interface NavigationGroupItem {
  name: string;
  icon: NavigationIcon;
  children: NavigationLinkItem[];
  roles?: UserRole[];
}

export type NavigationItem = NavigationLinkItem | NavigationGroupItem;

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}
