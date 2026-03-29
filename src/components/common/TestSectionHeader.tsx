import React from 'react';

interface TestSectionHeaderProps {
  number: number;
  title: string;
  theme: {
    gradient: string;
    border: string;
    titleColor: string;
    badgeBg: string;
    badgeColor: string;
  };
}

export const TestSectionHeader: React.FC<TestSectionHeaderProps> = ({
  number,
  title,
  theme,
}) => (
  <div className={`bg-gradient-to-r ${theme.gradient} px-6 py-3 border-b ${theme.border}`}>
    <h4 className={`${theme.titleColor} font-bold text-base flex items-center gap-2`}>
      <span
        className={`flex items-center justify-center w-5 h-5 rounded ${theme.badgeBg} ${theme.badgeColor} text-xs font-bold`}
      >
        {number}
      </span>
      {title}
    </h4>
  </div>
);
