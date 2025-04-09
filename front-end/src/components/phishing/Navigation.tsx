import React from 'react';
import { Phone, MessageCircle, Users } from 'lucide-react';
import NavItem from './NavItem';

interface Props {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: Props) {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-10 flex justify-around border-t border-gray-200 bg-white py-2">
      <NavItem
        label="보이스피싱"
        targetId="section1"
        icon={<Phone size={20} className={activeSection === 'section1' ? 'text-yellow-600' : 'text-gray-500'} />}
        isActive={activeSection === 'section1'}
        onClick={() => onSectionChange('section1')}
      />
      <NavItem
        label="스미싱"
        targetId="section2"
        icon={
          <MessageCircle size={20} className={activeSection === 'section2' ? 'text-yellow-600' : 'text-gray-500'} />
        }
        isActive={activeSection === 'section2'}
        onClick={() => onSectionChange('section2')}
      />
      <NavItem
        label="안전한 소통"
        targetId="section3"
        icon={<Users size={20} className={activeSection === 'section3' ? 'text-yellow-600' : 'text-gray-500'} />}
        isActive={activeSection === 'section3'}
        onClick={() => onSectionChange('section3')}
      />
    </nav>
  );
}
