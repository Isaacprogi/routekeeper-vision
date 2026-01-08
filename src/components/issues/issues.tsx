import React from 'react';
import IssuesCard from './IssuesList';

type IssuesPanelProps = {
  issues: string[];
  setIssues: React.Dispatch<React.SetStateAction<string[]>>;
};

const IssuesPanel = ({ issues}: IssuesPanelProps) => {
  const handleIssueClick = (issue: string, index: number) => {
    if(import.meta.env.MODE === 'development'){
      console.log(`Clicked issue ${index + 1}:`, issue);
    }
  };

  return (
    <div className="p-6">
      <div className="w-full">
        <IssuesCard
          issues={Array.isArray(issues) ? issues : []}
          title="Errors"
          type="error"
          onIssueClick={handleIssueClick}
        />
      </div>
    </div>
  );
};

export default IssuesPanel;
