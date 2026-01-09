import React from "react";
import type { VisualRouteNode } from "../../utils/type";

type Props = {
  node: VisualRouteNode;
};

export const RouteEditor: React.FC<Props> = ({ node }) => {
  const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rk-mb-6 rk-pb-5 rk-border-b rk-border-[#2a2a2a] last:rk-border-0 last:rk-mb-0">
      <h4 className="rk-m-0 rk-mb-4 rk-text-white rk-text-sm rk-uppercase rk-tracking-wider rk-font-semibold">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="rk-w-full rk-h-full rk-flex rk-flex-col rk-bg-[#1a1a1f]">
      
      <div className="rk-px-6 rk-py-5 rk-border-b rk-border-[#2a2a2a] rk-bg-[#25252d]">
        <h3 className="rk-m-0 rk-mb-1 rk-text-white rk-text-lg rk-flex rk-items-center rk-justify-between">
          {node.index ? 'Index Route' : node.path || 'Root'}
          <span className="rk-text-xs rk-text-[#888] rk-font-normal rk-ml-2">Route Details</span>
        </h3>
      </div>

      <div className="rk-flex-1 rk-overflow-y-auto rk-p-6">
        <PropertySection title="Basic Information">
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Path:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.path || '-'}</span>
          </div>
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Full Path:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.fullPath}</span>
          </div>
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Type:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.type}</span>
          </div>
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Index Route:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.index ? 'Yes' : 'No'}</span>
          </div>
        </PropertySection>

        <PropertySection title="Access Control">
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Route Roles:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">
              {node.roles.length > 0 ? node.roles.join(', ') : 'None'}
            </span>
          </div>
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Allowed Roles:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">
              {node.inheritedRoles.length > 0 ? node.inheritedRoles.join(', ') : 'None'}
            </span>
          </div>
        </PropertySection>

        <PropertySection title="Behavior">
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Lazy Loaded:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.lazy ? 'Yes' : 'No'}</span>
          </div>
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Redirect To:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.redirectTo?.pathname || 'None'}</span>
          </div>
        </PropertySection>

        <PropertySection title="Children">
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Children Count:</label>
            <span className="rk-text-white rk-text-sm rk-break-words rk-flex-1">{node.children.length}</span>
          </div>
          {node.children.length > 0 && (
            <div className="rk-mt-3">
              <h5 className="rk-m-0 rk-mb-2 rk-text-[#a0a0a0] rk-text-xs rk-font-semibold">Child Routes:</h5>
              <ul className="rk-p-0 rk-m-0 rk-list-none">
                {node.children.map(child => (
                  <li key={child.id} className="rk-flex rk-justify-between rk-items-center rk-px-2 rk-py-1.5 rk-bg-[#2a2a35] rk-rounded rk-mb-1 last:rk-mb-0">
                    <span className="rk-font-mono rk-text-xs rk-text-white">{child.path || '(index)'}</span>
                    <span className={`rk-px-2 rk-py-0.5 rk-rounded-full rk-text-xs rk-font-semibold rk-uppercase ${
                      child.type === 'private' 
                        ? 'rk-bg-[rgba(239,83,80,0.2)] rk-text-[#ef5350]' 
                        : child.type === 'public' 
                        ? 'rk-bg-[rgba(76,175,80,0.2)] rk-text-[#4caf50]' 
                        : 'rk-bg-[rgba(158,158,158,0.2)] rk-text-[#9e9e9e]'
                    }`}>
                      {child.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PropertySection>

        <PropertySection title="Metadata">
          <div className="rk-flex rk-items-start rk-mb-3 rk-text-sm">
            <label className="rk-w-36 rk-text-[#a0a0a0] rk-font-medium rk-flex-shrink-0 rk-pt-0.5">Node ID:</label>
            <span className="rk-font-mono rk-text-xs rk-text-white rk-break-words rk-flex-1">{node.id}</span>
          </div>
        </PropertySection>
      </div>
    </div>
  );
};