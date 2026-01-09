import React from "react";
import { FaRoute } from "react-icons/fa";
import type { RouteTiming } from "../../utils/type";

interface RouteSelectorProps {
  routes: string[] | unknown[];
  selectedRoute: string;
  onRouteChange: (route: string) => void;
  onTestRoute: () => void;
  isTesting: boolean;
  timingRecords: Array<RouteTiming>;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({ 
  routes, 
  selectedRoute, 
  onRouteChange, 
  onTestRoute, 
  isTesting,
  timingRecords 
}) => {
  // Safely convert routes to string array
  const getStringRoutes = (): string[] => {
    if (!Array.isArray(routes)) return [];
    
    return routes.filter((route): route is string => {
      return typeof route === 'string' || typeof route === 'number';
    }).map(route => String(route));
  };

  const stringRoutes = getStringRoutes();

  // Check if a route has been tested
  const hasBeenTested = (route: string) => {
    return Array.isArray(timingRecords) && 
           timingRecords.some(record => record.intendedPath === route);
  };

  return (
    <div className="rk-bg-[#1a1a1f] rk-border rk-border-[#2a2a2a] rk-rounded-lg rk-p-4 rk-mb-4">
      <div className="rk-flex rk-items-center rk-justify-between rk-mb-2">
        <h3 className="rk-text-sm rk-font-medium rk-text-[#e0e0e0] rk-flex rk-items-center rk-gap-2">
          <FaRoute className="rk-w-4 rk-h-4 rk-text-[#64b5f6]" />
         
        </h3>
        <span className="rk-text-xs rk-text-[#888] rk-bg-[#2a2a35] rk-px-2 rk-py-1 rk-rounded">
          {stringRoutes.length} routes
        </span>
      </div>
      
      <div className="rk-flex rk-gap-2">
        <select
          className="rk-flex-1 rk-bg-[#202025] rk-border rk-border-[#2a2a2a] rk-rounded rk-px-3 rk-py-2 rk-text-sm rk-text-[#e0e0e0] rk-font-mono focus:rk-outline-none focus:rk-border-[#64b5f6] focus:rk-ring-1 focus:rk-ring-[#64b5f6]"
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
        >
          <option value="" className="rk-bg-[#1a1a1f]">All Routes</option>
          {stringRoutes.map((route) => {
            const tested = hasBeenTested(route);
            const displayText = tested ? `${route || "/"} ✓` : (route || "/");
            return (
              <option 
                key={route} 
                value={route} 
                className={`rk-bg-[#1a1a1f] rk-font-mono ${tested ? 'rk-text-green-400' : 'rk-text-[#e0e0e0]'}`}
                title={tested ? "This route has been tested" : ""}
              >
                {displayText}
              </option>
            );
          })}
        </select>
        
        <button
          className="rk-px-4 rk-py-2 rk-bg-[#2a2a35] rk-border rk-border-[#3a3a45] rk-text-[#e0e0e0] rk-rounded-lg rk-cursor-pointer rk-text-sm rk-font-medium rk-transition-all rk-duration-200 hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] hover:-rk-translate-y-0.5 active:rk-translate-y-0 rk-flex rk-items-center rk-gap-2 disabled:rk-opacity-50 disabled:rk-cursor-not-allowed"
          onClick={onTestRoute}
          disabled={isTesting || !selectedRoute}
        >
          {isTesting ? (
            <>
              <div className="rk-w-4 rk-h-4 rk-border-2 rk-border-white rk-border-t-transparent rk-rounded-full rk-animate-spin"></div>
              <span>Testing...</span>
            </>
          ) : (
            <>
              <span>Test Route</span>
            </>
          )}
        </button>
      </div>

      {/* Show tested routes summary below the selector */}
      {stringRoutes.length > 0 && (
        <div className="rk-mt-3 rk-text-xs rk-text-[#888] rk-flex rk-items-center rk-gap-2">
          <span>Tested routes:</span>
          <div className="rk-flex rk-items-center rk-gap-1 rk-flex-wrap">
            {stringRoutes
              .filter(route => hasBeenTested(route))
              .map((route) => (
                <code 
                  key={route} 
                  className="rk-text-green-400 rk-font-mono rk-bg-[#2a2a35] rk-px-1.5 rk-py-0.5 rk-rounded rk-border rk-border-green-400/20"
                  title="Tested"
                >
                  {route || "/"}
                </code>
              ))}
            {stringRoutes.filter(route => hasBeenTested(route)).length === 0 && (
              <span className="rk-text-[#666] rk-italic">None yet</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};