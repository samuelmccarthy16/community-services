import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'events': 'Events',
  'gallery': 'Gallery',
  'contact': 'Contact',
  'donate': 'Donate',
  'volunteer': 'Volunteer',
  'shop': 'Shop',
  'checkout': 'Checkout',
  'partners': 'Partners',
  'student-portal': 'Student Portal',
  'admin': 'Admin',
  'order-confirmation': 'Order Confirmation',
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generatedItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Check if it's a dynamic segment (like event ID)
      const isNumeric = !isNaN(Number(segment));
      const label = isNumeric 
        ? 'Details' 
        : routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      generatedItems.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return generatedItems;
  })();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1 flex-shrink-0" />
              )}
              
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  <span className={isFirst ? 'sr-only sm:not-sr-only' : ''}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span 
                  className="text-gray-900 font-medium truncate max-w-[200px]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
