import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface IssuesComponentProps {
  issues: string[];
  title?: string;
  type?: 'error' | 'warning' | 'success';
  emptyMessage?: string;
  onIssueClick?: (issue: string, index: number) => void;
}

const IssuesList: React.FC<IssuesComponentProps> = ({
  issues,
  title = "Issues",
  type = 'error',
  emptyMessage = "No issues found",
  onIssueClick
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          iconColor: 'text-[#4caf50]',
          bgColor: 'bg-[#4caf50]/10',
          borderColor: 'border-[#4caf50]/30',
          countColor: 'bg-[#4caf50]/20 text-[#4caf50]'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          iconColor: 'text-[#ff9800]',
          bgColor: 'bg-[#ff9800]/10',
          borderColor: 'border-[#ff9800]/30',
          countColor: 'bg-[#ff9800]/20 text-[#ff9800]'
        };
      case 'error':
      default:
        return {
          icon: FaTimesCircle,
          iconColor: 'text-[#ef5350]',
          bgColor: 'bg-[#ef5350]/10',
          borderColor: 'border-[#ef5350]/30',
          countColor: 'bg-[#ef5350]/20 text-[#ef5350]'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="bg-[#1a1a1f] rounded-lg border border-[#2a2a2a] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#202025]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
            <h3 className="text-[#e0e0e0] font-medium">{title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${config.countColor}`}>
              {issues.length}
            </span>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="divide-y divide-[#2a2a2a]">
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <div
              key={index}
              className={`px-4 py-3 hover:bg-[#202025] transition-colors cursor-pointer ${
                onIssueClick ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => onIssueClick?.(issue, index)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1 rounded ${config.bgColor}`}>
                  <Icon className={`w-3 h-3 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-[#e0e0e0] text-sm leading-relaxed">{issue}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[#888]">
                      Issue #{index + 1}
                    </span>
                    <span className="text-xs text-[#888]">•</span>
                    <span className="text-xs text-[#888]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2a2a35] mb-3">
              <FaCheckCircle className="w-6 h-6 text-[#4caf50]" />
            </div>
            <p className="text-[#888] text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {issues.length > 0 && (
        <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#202025]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#888]">
              {issues.length === 1 ? '1 issue found' : `${issues.length} issues found`}
            </p>
            {/* <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1 rounded border border-[#2a2a2a] text-[#888] hover:text-[#e0e0e0] hover:border-[#3a3a3a] transition-colors">
                Export
              </button>
              <button className="text-xs px-3 py-1 rounded bg-[#2a2a2a] text-[#e0e0e0] hover:bg-[#3a3a3a] transition-colors">
                Resolve All
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesList;