'use client';

import { Home, Dumbbell, Apple, Droplet, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/(frontend)/lib/utils';
import { useAuth } from '@/app/(frontend)/context/auth';

export const RoutesConfig = {
  workout: '/workouts?tab=workout',
  addWorkout: '/workouts/add?tab=manual',
  editWorkout: '/workouts/edit',
  nutrition: '/nutrition',
  addNutrition: '/nutrition/add?tab=manual',
  hydration: '/hydration',
  history: '/history',
  settings: '/settings',
} as const;

export const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Hydration', href: '/hydration', icon: Droplet },
  { name: 'Nutrition', href: '/nutrition', icon: Apple },
  { name: 'History', href: '/history', icon: BarChart2 },
] as const;

//todo move to helpers
type NavigationItem = (typeof navItems)[number]['name'];

const getIconColor = (isActive: boolean, itemName: NavigationItem): string => {
  if (!isActive) return 'none';

  const name = itemName.toLowerCase();
  switch (true) {
    case name.startsWith('home'):
      return 'hsl(var(--quaternary))';
    case name.startsWith('workouts'):
      return 'hsl(var(--primary))';
    case name.startsWith('hydration'):
      return 'hsl(var(--quinary))';
    case name.startsWith('nutrition'):
      return 'hsl(var(--tertiary))';
    default:
      return 'none';
  }
};

export default function Navigation() {
  const pathname = usePathname();
  const { isUserAuthenticated } = useAuth();

  return (
    <div className="sm:max-w-md sm:mx-auto fixed bottom-0 left-0 right-0 border sm:rounded-md bg-white shadow-lg z-50">
      <nav className="flex justify-around items-center h-18 px-2">
        {navItems.map(item => {
          const isActive =
            (pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href;

          if (!isUserAuthenticated && item.name === 'History') return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-all duration-200',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              )}
            >
              <div className="p-2 rounded-full hover:stroke-secondary">
                <item.icon
                  className="h-6 w-6"
                  fill={getIconColor(isActive, item.name)}
                  strokeWidth={item.name === 'History' ? 3 : 1.5}
                />
              </div>
              <span className="text-sm">{item.name}</span>
              <span className={cn(isActive && 'w-3/4 h-1 bg-primary rounded')}></span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
