// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   FaInfoCircle, 
//   FaPlay,
//   FaSpinner,
//   FaFilter,
//   FaSortAmountDown,
//   FaSortAmountUp,
//   FaExclamationTriangle,
//   FaCheckCircle
// } from "react-icons/fa";

// import type { RouteTiming } from "../../../utils/type";

// interface MultipleTestProps {
//   routes: string[];
//   timingRecords: RouteTiming[];
//   setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
// }

// type SortField = 'timestamp' | 'loadTime' | 'path' | 'intendedPath';
// type SortDirection = 'asc' | 'desc';

// export const MultipleTest: React.FC<MultipleTestProps> = ({
//   routes,
//   timingRecords,
//   setTimingRecords
// }) => {
//   const navigate = useNavigate();
//   const [isTestingAll, setIsTestingAll] = useState(false);
//   const [currentRouteIndex, setCurrentRouteIndex] = useState<number | null>(null);
//   const [sortField, setSortField] = useState<SortField>('timestamp');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
//   const [filter, setFilter] = useState<string>('all');

//   // Group records by route
//   const groupedByRoute: Record<string, RouteTiming[]> = {};
//   timingRecords.forEach(record => {
//     const route = record.intendedPath || record.path;
//     if (!groupedByRoute[route]) groupedByRoute[route] = [];
//     groupedByRoute[route].push(record);
//   });

//   // Get latest test for each route
//   const latestTests = Object.keys(groupedByRoute).map(route => {
//     const tests = groupedByRoute[route];
//     return tests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
//   });

//   // Apply filter
//   const filteredTests = latestTests.filter(test => {
//     if (filter === 'all') return true;
//     if (filter === 'success') return !test.redirected && test.loadTime <= 500;
//     if (filter === 'redirected') return test.redirected;
//     if (filter === 'slow') return test.loadTime > 500 && !test.redirected;
//     return true;
//   });

  

//   // Apply sorting
//   const sortedTests = [...filteredTests].sort((a, b) => {
//     let aValue: any = a[sortField];
//     let bValue: any = b[sortField];

//     if (sortField === 'timestamp') {
//       aValue = new Date(a.timestamp).getTime();
//       bValue = new Date(b.timestamp).getTime();
//     }

//     if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
//     return aValue < bValue ? 1 : -1;
//   });

//   // -------------------
//   // Sequential testing
//   // -------------------
//   const handleTestAllRoutes = () => {
//     if (!routes || routes.length === 0) return;
//     if (isTestingAll) return;

//     setIsTestingAll(true);
//     setCurrentRouteIndex(0);
//     navigate(routes[0]);
//   };

//   useEffect(() => {
//     if (!isTestingAll || currentRouteIndex === null) return;

//     const currentRoute = routes[currentRouteIndex];

//     const hasRecord = timingRecords.some(
//       record => record.intendedPath === currentRoute
//     );

//     if (hasRecord) {
//       const nextIndex = currentRouteIndex + 1;
//       if (nextIndex < routes.length) {
//         setCurrentRouteIndex(nextIndex);
//         navigate(routes[nextIndex]);
//       } else {
//         // All done
//         setIsTestingAll(false);
//         setCurrentRouteIndex(null);
//       }
//     }
//   }, [timingRecords, currentRouteIndex, routes, navigate, isTestingAll]);

//   // Test single route manually
//   const handleTestSingleRoute = (route: string) => {
//     navigate(route);

//     setTimingRecords(prev => {
//       const newRecord: RouteTiming = {
//         path: window.location.pathname,
//         intendedPath: route,
//         loadTime: Math.random() * 1000, // Simulated
//         redirected: false,
//         timestamp: new Date().toISOString(),
//       };
//       return [...prev, newRecord];
//     });
//   };

//   // -------------------
//   // Helper functions
//   // -------------------
//   const getLoadTimeClass = (time: number) => {
//     if (time < 100) return "text-[#4caf50]";
//     if (time < 500) return "text-[#ff9800]";
//     return "text-[#ef5350]";
//   };

//   const getLoadTimeBgClass = (time: number) => {
//     if (time < 100) return "bg-[#4caf50]/10";
//     if (time < 500) return "bg-[#ff9800]/10";
//     return "bg-[#ef5350]/10";
//   };

//   const getTestStatus = (test: RouteTiming) => {
//     if (test.redirected) return { label: 'Redirected', color: 'bg-[#9c27b0]/20', text: 'text-[#9c27b0]', icon: FaExclamationTriangle };
//     if (test.loadTime > 500) return { label: 'Slow', color: 'bg-[#ff9800]/20', text: 'text-[#ff9800]', icon: FaExclamationTriangle };
//     return { label: 'Success', color: 'bg-[#4caf50]/20', text: 'text-[#4caf50]', icon: FaCheckCircle };
//   };

//   const handleSort = (field: SortField) => {
//     if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     else {
//       setSortField(field);
//       setSortDirection('desc');
//     }
//   };

//   // -------------------
//   // Statistics
//   // -------------------
//   const totalRoutes = routes.length;
//   const testedRoutes = latestTests.length;
//   const successTests = latestTests.filter(t => !t.redirected && t.loadTime <= 500).length;
//   const redirectedTests = latestTests.filter(t => t.redirected).length;
//   const slowTests = latestTests.filter(t => t.loadTime > 500 && !t.redirected).length;
//   const averageLoadTime = latestTests.length > 0 
//     ? Math.round(latestTests.reduce((acc, t) => acc + t.loadTime, 0) / latestTests.length)
//     : 0;

//   // -------------------
//   // Render
//   // -------------------
//   return (
//     <div className="bg-[#1a1a1f] min-h-screen">
//       <div className="space-y-4">
//         {/* Header with Test All */}
//         <div className="bg-[#1a1a1f] border-b border-[#2a2a2a]">
//           <div className="flex justify-between items-center py-3 max-w-[95%] mx-auto">
//             <h3 className="text-lg font-semibold text-[#e0e0e0]">Multiple Route Tests</h3>
//             <button
//               onClick={handleTestAllRoutes}
//               disabled={isTestingAll || !routes.length}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isTestingAll ? <><FaSpinner className="w-4 h-4 animate-spin" /> Testing...</> 
//                             : <><FaPlay className="w-3 h-3" /> Test All Routes</>}
//             </button>
//           </div>
//         </div>

//         {/* Test Results */}
//         <div className="bg-[#1a1a1f] rounded p-4">
//           {sortedTests.length === 0 ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded bg-[#0f0f12]">
//               <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
//               <p className="text-sm text-[#888]">
//                 {timingRecords.length === 0 
//                   ? "No test results yet. Run tests to see results."
//                   : "No tests match the current filter."
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {sortedTests.map((test, index) => {
//                 const status = getTestStatus(test);
//                 const StatusIcon = status.icon;

//                 return (
//                   <div key={index} className="border rounded p-4 transition-all hover:-translate-y-0.5 active:translate-y-0">
//                     <div className="flex justify-between mb-3">
//                       <div>
//                         <code className="text-sm text-[#e0e0e0] font-mono truncate">{test.intendedPath || test.path}</code>
//                         {test.path !== test.intendedPath && (
//                           <div className="text-xs text-[#9c27b0] font-mono truncate">Actual: {test.path}</div>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono ${getLoadTimeBgClass(test.loadTime)} ${getLoadTimeClass(test.loadTime)}`}>
//                           {test.loadTime} ms
//                         </div>
//                         <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${status.color} ${status.text}`}>
//                           <StatusIcon className="w-3 h-3" />
//                           <span className="text-xs font-medium">{status.label}</span>
//                         </div>
//                         <button
//                           className="px-3 py-1 text-xs bg-[#2a2a35] border border-[#2a2a2a] text-[#a0a0a0] rounded hover:bg-[#3a3a45] hover:border-[#3a3a45] transition-colors"
//                           // onClick={() => handleTestSingleRoute(test.intendedPath || test.path)}
//                           onClick={()=>setTimingRecords([])}
//                         >
//                           Test Again
//                         </button>
//                       </div>
//                     </div>
//                     <div className="text-xs text-[#888] border-t border-[#2a2a2a] pt-2 flex justify-between">
//                       <span>Tested: {new Date(test.timestamp).toLocaleString()}</span>
//                       <span>Load: {test.loadTime} ms</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MultipleTest;


import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

interface MultipleTestProps {
  routes: string[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
}

export interface RouteTiming {
  path: string;
  intendedPath?: string;
  loadTime: number;
  redirected?: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const MultipleTest: React.FC<MultipleTestProps> = ({
  routes,
  timingRecords,
}) => {
  const [currentRouteIndex, setCurrentRouteIndex] = React.useState(0);
  const navigate = useNavigate();
  const currentRoute = routes[currentRouteIndex];

  useEffect(() => {
    handleTestAllRoutes();
  }, [currentRoute]);

  useEffect(() => {
    if (timingRecords[currentRouteIndex]) {
      setTimeout(() => {
        setCurrentRouteIndex(prev => prev + 1);
      }, 4000);
    }
  }, [timingRecords]);

  const handleTestAllRoutes = () => {
    navigate(currentRoute);
  };

  // const currentRecord = timingRecords[currentRouteIndex];
  const progressPercentage = routes.length > 0 ? ((currentRouteIndex + 1) / routes.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Route Performance Testing</h1>
          <p className="text-gray-400">Automatically testing routes for performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Testing Progress</h2>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  {currentRouteIndex + 1} / {routes.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">Started</span>
                  <span className="text-sm text-gray-400">Complete</span>
                </div>
              </div>

              {/* Current Route Card */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-300">Currently Testing</span>
                  </div>
                  <span className="text-xs text-gray-400">Auto-advance in 4s</span>
                </div>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono text-white bg-gray-800 px-3 py-2 rounded-lg flex-1 mr-4 overflow-x-auto whitespace-nowrap">
                    {currentRoute}
                  </code>
                  <button
                    onClick={handleTestAllRoutes}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-95 whitespace-nowrap"
                  >
                    Test Now
                  </button>
                </div>
              </div>
            </div>

          
          </div>

          {/* Right Column - Route List */}
          <div className="space-y-6">
            {/* Route List Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Route Queue</h3>
                <p className="text-sm text-gray-400 mt-1">Routes to be tested in order</p>
              </div>
              <div className="divide-y divide-gray-700 max-h-[500px] overflow-y-auto">
                {routes.map((route, index) => {
                  const isCurrent = index === currentRouteIndex;
                  const isTested = index < currentRouteIndex;

                  return (
                    <div
                      key={index}
                      className={`px-6 py-4 transition-all ${
                        isCurrent 
                          ? 'bg-blue-500/10 border-l-4 border-blue-500' 
                          : isTested
                          ? 'bg-gray-900/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Indicator */}
                        <div className="flex-shrink-0">
                          {isCurrent ? (
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                          ) : isTested ? (
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          ) : (
                            <div className="w-3 h-3 bg-gray-600 rounded-full" />
                          )}
                        </div>

                        {/* Route Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium ${
                              isCurrent ? 'text-blue-400' : isTested ? 'text-gray-300' : 'text-gray-400'
                            }`}>
                              Route #{index + 1}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                                Testing
                              </span>
                            )}
                            {isTested && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                Complete
                              </span>
                            )}
                          </div>
                          <code className={`text-sm font-mono block truncate ${
                            isCurrent ? 'text-white' : isTested ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {route}
                          </code>
                          
                          {/* Timing Display for tested routes */}
                          {isTested && timingRecords[index] && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {timingRecords[index].loadTime}ms
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className={`text-xs ${
                                timingRecords[index].redirected ? 'text-yellow-500' : 'text-green-500'
                              }`}>
                                {timingRecords[index].redirected ? 'Redirected' : 'Direct'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Footer */}
              <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Routes</p>
                    <p className="text-xl font-bold text-white">{routes.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-green-400">{currentRouteIndex}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Remaining</p>
                    <p className="text-xl font-bold text-blue-400">{routes.length - currentRouteIndex}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Testing Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Route Index</span>
                  <span className="text-2xl font-bold text-white">{currentRouteIndex}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Auto-advance Delay</span>
                  <span className="text-xl font-semibold text-cyan-400">4 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-xl font-semibold text-blue-400">{progressPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};