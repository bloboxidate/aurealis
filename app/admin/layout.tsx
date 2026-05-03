import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Auréalis — Admin',
  description: 'Internal dashboard',
  robots: { index: false, follow: false },
};

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aurealis-admin" data-app="admin">
      {children}
    </div>
  );
}
