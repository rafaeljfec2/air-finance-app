import { ForwardRefExoticComponent, SVGProps } from 'react';

export type NavigationIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & { title?: string; titleId?: string }
>;

export interface NavigationLinkItem {
  name: string;
  href: string;
  icon: NavigationIcon;
}

export interface NavigationGroupItem {
  name: string;
  icon: NavigationIcon;
  children: NavigationLinkItem[];
}

export type NavigationItem = NavigationLinkItem | NavigationGroupItem;

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}
