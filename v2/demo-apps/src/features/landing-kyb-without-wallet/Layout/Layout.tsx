import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    header?: ReactNode;
}

export const Layout = ({ children, header }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-white" >
            {header && <header>{header} </header>
            }
            <main>
                {children}
            </main>
        </div>
    );
};
