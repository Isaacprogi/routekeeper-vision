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
          iconColor: 'rk-text-[#4caf50]',
          bgColor: 'rk-bg-[#4caf50]/10',
          borderColor: 'rk-border-[#4caf50]/30',
          countColor: 'rk-bg-[#4caf50]/20 rk-text-[#4caf50]'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          iconColor: 'rk-text-[#ff9800]',
          bgColor: 'rk-bg-[#ff9800]/10',
          borderColor: 'rk-border-[#ff9800]/30',
          countColor: 'rk-bg-[#ff9800]/20 rk-text-[#ff9800]'
        };
      case 'error':
      default:
        return {
          icon: FaTimesCircle,
          iconColor: 'rk-text-[#ef5350]',
          bgColor: 'rk-bg-[#ef5350]/10',
          borderColor: 'rk-border-[#ef5350]/30',
          countColor: 'rk-bg-[#ef5350]/20 rk-text-[#ef5350]'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="rk-bg-[#1a1a1f] rk-rounded-lg rk-border rk-border-[#2a2a2a] rk-overflow-hidden">
      {/* Header */}
      <div className="rk-px-4 rk-py-3 rk-border-b rk-border-[#2a2a2a] rk-bg-[#202025]">
        <div className="rk-flex rk-items-center rk-justify-between">
          <div className="rk-flex rk-items-center rk-gap-3">
            <Icon className={`rk-w-5 rk-h-5 ${config.iconColor}`} />
            <h3 className="rk-text-[#e0e0e0] rk-font-medium">{title}</h3>
            <span className={`rk-px-2 rk-py-1 rk-rounded rk-text-xs rk-font-medium ${config.countColor}`}>
              {issues.length}
            </span>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="rk-divide-y rk-divide-[#2a2a2a]">
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <div
              key={index}
              className={`rk-px-4 rk-py-3 hover:rk-bg-[#202025] rk-transition-colors ${onIssueClick ? 'rk-cursor-pointer' : 'rk-cursor-default'}`}
              onClick={() => onIssueClick?.(issue, index)}
            >
              <div className="rk-flex rk-items-start rk-gap-3">
                <div className={`rk-mt-0.5 rk-p-1 rk-rounded ${config.bgColor}`}>
                  <Icon className={`rk-w-3 rk-h-3 ${config.iconColor}`} />
                </div>
                <div className="rk-flex-1">
                  <p className="rk-text-[#e0e0e0] rk-text-sm rk-leading-relaxed">{issue}</p>
                  <div className="rk-flex rk-items-center rk-gap-2 rk-mt-2">
                    <span className="rk-text-xs rk-text-[#888]">
                      Issue #{index + 1}
                    </span>
                    <span className="rk-text-xs rk-text-[#888]">•</span>
                    <span className="rk-text-xs rk-text-[#888]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rk-px-4 rk-py-8 rk-text-center">
            <div className="rk-inline-flex rk-items-center rk-justify-center rk-w-12 rk-h-12 rk-rounded-full rk-bg-[#2a2a35] rk-mb-3">
              <FaCheckCircle className="rk-w-6 rk-h-6 rk-text-[#4caf50]" />
            </div>
            <p className="rk-text-[#888] rk-text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {issues.length > 0 && (
        <div className="rk-px-4 rk-py-3 rk-border-t rk-border-[#2a2a2a] rk-bg-[#202025]">
          <div className="rk-flex rk-items-center rk-justify-between">
            <p className="rk-text-xs rk-text-[#888]">
              {issues.length === 1 ? '1 issue found' : `${issues.length} issues found`}
            </p>
            {/* <div className="rk-flex rk-items-center rk-gap-2">
              <button className="rk-text-xs rk-px-3 rk-py-1 rk-rounded rk-border rk-border-[#2a2a2a] rk-text-[#888] hover:rk-text-[#e0e0e0] hover:rk-border-[#3a3a3a] rk-transition-colors">
                Export
              </button>
              <button className="rk-text-xs rk-px-3 rk-py-1 rk-rounded rk-bg-[#2a2a2a] rk-text-[#e0e0e0] hover:rk-bg-[#3a3a3a] rk-transition-colors">
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