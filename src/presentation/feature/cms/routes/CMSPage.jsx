import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, 
    BookOpen, 
    Code2, 
    Calendar, 
    Image
} from 'lucide-react';
import { CMSSidebar } from '../components/CMSSidebar';
import { CMSActionBar } from '../components/CMSActionBar';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSPage: Orchestrates the modular management interface.
 * Follows SRP: Delegates UI logic to child components.
 */
export const CMSPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Courses');

    const sections = [
        { name: 'Courses', icon: BookOpen, count: 12 },
        { name: 'Articles', icon: FileText, count: 142 },
        { name: 'Problems', icon: Code2, count: 58 },
        { name: 'Events', icon: Calendar, count: 24 },
        { name: 'Media', icon: Image, count: 856 }
    ];

    const currentSection = sections.find(s => s.name === activeSection);

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col h-[calc(100vh-4rem)]">
            <CMSActionBar onExit={() => navigate(-1)} />

            <div className="flex-1 flex gap-0 border border-white/5 rounded-3xl overflow-hidden glass h-full">
                <CMSSidebar 
                    sections={sections} 
                    activeSection={activeSection} 
                    onSectionChange={setActiveSection} 
                />

                <div className="flex-1 p-8 overflow-y-auto bg-surface-dark/30 scrollbar-hide">
                    <CMSResourceTable 
                        sectionName={activeSection}
                        items={[1, 2, 3, 4, 5]}
                        icon={currentSection.icon}
                    />
                </div>
            </div>
        </div>
    );
};

export default CMSPage;
