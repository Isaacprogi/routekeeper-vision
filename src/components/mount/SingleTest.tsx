import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaInfoCircle, 
} from "react-icons/fa";
import { RouteSelector } from "../RoutesSelector";
import type { RouteTiming } from "../../../utils/type";

interface SingleTestProps {
  routes: string[] | unknown;
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  testingMode?: boolean;
  toggleTestingMode?: () => void;
}

export const SingleTest: React.FC<SingleTestProps> = ({
  routes,
  timingRecords,
  // testingMode,
  // toggleTestingMode
}) => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Get latest test record for the selected route
  const getLatestTestRecord = () => {
    if (!selectedRoute) return null;
    
    const filteredRecords = timingRecords.filter(record => 
      record.intendedPath === selectedRoute 
    );
    
    if (filteredRecords.length === 0) return null;
    
    // Sort by timestamp descending (newest first) and return the first one
    return filteredRecords.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  const latestTestRecord = getLatestTestRecord();

  // Filter to show only the latest test record when a route is selected
  const displayRecords =  latestTestRecord 
    ? [latestTestRecord] 
    : [];

  // Sort all records by timestamp (newest first)
  const sortedRecords = [...displayRecords].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleTestRoute = () => {
    if (!selectedRoute) return;
    
    setIsTesting(true);
    navigate(selectedRoute);
    
    // Reset testing state after navigation
    setTimeout(() => setIsTesting(false), 1000);
  };

  const getLoadTimeClass = (time: number) => {
    if (time < 100) return "text-[#4caf50]";
    if (time < 500) return "text-[#ff9800]";
    return "text-[#ef5350]";
  };

  const getLoadTimeBgClass = (time: number) => {
    if (time < 100) return "bg-[#4caf50]/10";
    if (time < 500) return "bg-[#ff9800]/10";
    return "bg-[#ef5350]/10";
  };

  return (
    <div className="rk-bg-[#1a1a1f] rk-min-h-screen">
      <div className="rk-space-y-4">
        {/* Route Selector Component */}
        <RouteSelector
          routes={Array.isArray(routes) ? routes : []}
          selectedRoute={selectedRoute}
          onRouteChange={(route) => {
            setSelectedRoute(route);
          }}
          onTestRoute={handleTestRoute}
          isTesting={isTesting}
          timingRecords={timingRecords}
        />

        {/* Timing Records Section */}
        <div className="rk-bg-[#1a1a1f] rk-rounded rk-p-4">
          {timingRecords.length === 0 ? (
            <div className="rk-flex rk-flex-col rk-items-center rk-justify-center rk-p-8 rk-text-center rk-border rk-border-[#2a2a2a] rk-rounded rk-bg-[#0f0f12]">
              <FaInfoCircle className="rk-w-8 rk-h-8 rk-text-[#888] rk-mb-3" />
              <p className="rk-text-sm rk-text-[#888]">No timing records yet. Navigate to routes to collect data.</p>
            </div>
          ) : (
            <div className="">
              {/* Records List */}
              <div className="rk-space-y-3">
                {!isTesting && sortedRecords.map((record, index) => (
                  <div 
                    key={index} 
                    className={`rk-border rk-rounded rk-p-4 rk-transition-colors ${
                      record.redirected 
                        ? 'rk-border-[#9c27b0] rk-bg-[#2a2a35]' 
                        : record.loadTime > 500 
                          ? 'rk-border-[#ff9800] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55]' 
                          : 'rk-border-[#2a2a2a] rk-bg-[#2a2a35] hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] hover:rk--translate-y-0.5 active:rk-translate-y-0'
                    }`}
                  > 
                    <div className="rk-flex rk-gap-4 rk-mb-3">
                      <div className="rk-space-y-2">
                        <div className="rk-flex rk-flex-col">
                          <span className="rk-text-xs rk-text-[#a0a0a0]">Path</span>
                          <code className="rk-text-sm rk-text-[#e0e0e0] rk-font-mono rk-truncate">
                            {record.path}
                          </code>
                        </div>
                        
                        {record.intendedPath && (
                          <div className="rk-flex rk-flex-col">
                            <span className="rk-text-xs rk-text-[#a0a0a0]">Intended Path</span>
                            <code className="rk-text-sm rk-text-[#9c27b0] rk-font-mono rk-truncate">
                              {record.intendedPath}
                            </code>
                          </div>
                        )}
                      </div>
                      
                      <div className="rk-space-y-2">
                        <div className="rk-flex rk-flex-col">
                          <span className="rk-text-xs rk-text-[#a0a0a0]">Load Time</span>
                          <div className={`rk-inline-flex rk-items-center rk-px-2 rk-py-1 rk-rounded rk-text-sm rk-font-mono ${getLoadTimeBgClass(record.loadTime)} ${getLoadTimeClass(record.loadTime)}`}>
                            {record.loadTime} ms
                          </div>
                        </div>
                        
                        <div className="rk-flex rk-flex-col">
                          <span className="rk-text-xs rk-text-[#a0a0a0]">Redirected</span>
                          <span className={`rk-text-sm ${record.redirected ? 'rk-text-[#9c27b0]' : 'rk-text-[#4caf50]'}`}>
                            {record.redirected ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                      
                      {(record.metadata?.guard || record.metadata?.reason) && (
                        <div className="rk-space-y-2">
                          {record.metadata?.guard && (
                            <div className="rk-flex rk-flex-col">
                              <span className="rk-text-xs rk-text-[#a0a0a0]">Guard</span>
                              <span className="rk-text-sm rk-text-[#64b5f6]">{record.metadata.guard}</span>
                            </div>
                          )}
                          
                          {record.metadata?.reason && (
                            <div className="rk-flex rk-flex-col">
                              <span className="rk-text-xs rk-text-[#a0a0a0]">Reason</span>
                              <span className="rk-text-sm rk-text-[#ff9800]">{record.metadata.reason}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="rk-pt-3 rk-border-t rk-border-[#2a2a2a] rk-text-xs rk-text-[#888]">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};