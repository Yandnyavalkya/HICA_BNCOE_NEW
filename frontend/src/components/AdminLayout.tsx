import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at center, #1a1a1a, #000000)',
      padding: '120px 20px 40px',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#993fea' }}>
            {title}
          </h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link 
              to="/admin" 
              style={{
                padding: '10px 20px',
                background: '#2b0949',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                border: '1px solid #993fea'
              }}
            >
              ← Dashboard
            </Link>
            <Link 
              to="/" 
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(45deg, #ff00ff, #00d4ff)',
                borderRadius: '5px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              View Site
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

