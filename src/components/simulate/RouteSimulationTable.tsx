import { 
  FaCheckCircle, 
  FaTimesCircle,
  FaMinus,
  FaUser,
  FaUserCheck,
  FaRoute,
  FaChartBar,
  FaInfoCircle,
} from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import type { Scenario } from "../../../utils/type";
import React, { useState } from "react";

type Props = {
  routes: string|unknown[];
  unauthScenarios: Scenario[];
  authScenarios: Scenario[];
  onSelectRoute?: (route: string) => void;
};

type TabType = 'unauthenticated' | 'authenticated';


const mapIcon = (result?: { access: string }) => {
  if (!result) return <FaMinus className="w-4 h-4 text-[#888]" />;
  if (result.access === "allow") return <FaCheckCircle className="w-4 h-4 text-[#4caf50]" />;
  if (result.access === "redirect") return <HiOutlineArrowRight className="w-4 h-4 text-[#9c27b0]" />;
  return <FaTimesCircle className="w-4 h-4 text-[#ef5350]" />;
};

const ScenarioHeader: React.FC<{ label: string }> = ({ label }) => (
  <th 
    scope="col" 
    className="px-3 py-2.5 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider border-l border-[#2a2a2a] min-w-[70px] text-center bg-[#202025]"
  >
    <div className="truncate" title={label}>
      {label}
    </div>
  </th>
);

const ScenarioCell: React.FC<{
  scenario: Scenario;
  route: string;
}> = ({ scenario, route }) => {
  const result = scenario.results.find((r) => r.route === route);
  const icon = mapIcon(result);
  const tooltip = result
    ? `${route}: ${result.access} : ""}`
    : "Route not in scenario";

  const bgColor = !result ? 'bg-[#1a1a1f]' : 
    result.access === 'allow' ? 'bg-[#4caf50]/10' : 
    result.access === 'redirect' ? 'bg-[#9c27b0]/10' : 
    'bg-[#ef5350]/10';

  const borderColor = !result ? 'border-[#2a2a2a]' : 
    result.access === 'allow' ? 'border-[#4caf50]/30' : 
    result.access === 'redirect' ? 'border-[#9c27b0]/30' : 
    'border-[#ef5350]/30';

  return (
    <td className="px-3 py-2 border-l border-[#2a2a2a] text-center align-middle">
      <div
        className={`inline-flex items-center justify-center p-1.5 rounded border ${bgColor} ${borderColor} hover:opacity-90 transition-opacity`}
        title={tooltip}
        aria-label={tooltip}
      >
        {icon}
      </div>
    </td>
  );
};

const AuthSection: React.FC<{
  title: string;
  badge: "unauthenticated" | "authenticated";
  authInfo: string;
  subtitle: string;
  scenarios: Scenario[];
  routes: string | unknown[];
  isActive: boolean;
  selectedRoute?: string;
}> = ({ title, badge, subtitle, scenarios, routes, isActive, selectedRoute }) => {
  if (!isActive) return null;
  
  const displayRoutes = selectedRoute ? [selectedRoute] : routes;
  
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
              badge === "unauthenticated" 
                ? "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30" 
                : "bg-[#4caf50]/10 text-[#4caf50] border border-[#4caf50]/30"
            }`}>
              {badge === "unauthenticated" ? (
                <FaUser className="w-3.5 h-3.5" />
              ) : (
                <FaUserCheck className="w-3.5 h-3.5" />
              )}
              {title}
            </span>
            <span className="text-sm text-[#888]">
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {scenarios.length > 0 && !selectedRoute && (
            <div className="text-xs text-[#888] px-2 py-1 bg-[#2a2a35] rounded">
              {routes.length} routes
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-[#a0a0a0]">{subtitle}</p>
        )}
      </div>

      {/* Table */}
      {scenarios.length > 0 ? (
        <div className="border border-[#2a2a2a] rounded overflow-hidden bg-[#1a1a1f]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2a2a2a]">
              <thead className="bg-[#202025]">
                <tr>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-sm font-medium text-[#a0a0a0] uppercase tracking-wider w-[200px] border-r border-[#2a2a2a]"
                  >
                    <div className="flex items-center gap-2">
                      <FaRoute className="w-4 h-4" />
                      <span>Route Path</span>
                    </div>
                  </th>
                  {scenarios.map((scenario) => (
                    <ScenarioHeader key={scenario.label} label={scenario.label} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {Array.isArray(displayRoutes) && displayRoutes.map((route:any,index:number) => (
                  <tr 
                    key={route} 
                    className={`hover:bg-[#202025] transition-colors ${index % 2 === 0 ? 'bg-[#1a1a1f]' : 'bg-[#17171c]'}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap border-r border-[#2a2a2a]">
                      <div className="flex items-center">
                        <code 
                          className="text-sm text-[#e0e0e0] font-mono truncate max-w-[180px] hover:text-white transition-colors"
                          title={route}
                        >
                          {route || "/"}
                        </code>
                      </div>
                    </td>
                    {scenarios.map((scenario) => (
                      <ScenarioCell
                        key={scenario.label}
                        scenario={scenario}
                        route={route}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center border border-[#2a2a2a] rounded bg-[#1a1a1f]">
          <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
          <p className="text-sm text-[#888] mb-1">No scenarios for {title.toLowerCase()} state</p>
          <p className="text-xs text-[#666]">Configure scenarios to see route behaviors</p>
        </div>
      )}
    </section>
  );
};

const Legend: React.FC = () => (
  <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded p-4 mt-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: FaCheckCircle, color: '#4caf50', label: 'Allow', bg: 'bg-[#4caf50]/10', border: 'border-[#4caf50]/30' },
        { icon: HiOutlineArrowRight, color: '#9c27b0', label: 'Redirect', bg: 'bg-[#9c27b0]/10', border: 'border-[#9c27b0]/30' },
        { icon: FaTimesCircle, color: '#ef5350', label: 'Deny', bg: 'bg-[#ef5350]/10', border: 'border-[#ef5350]/30' },
        { icon: FaMinus, color: '#888', label: 'Missing', bg: 'bg-[#2a2a35]', border: 'border-[#2a2a2a]' }
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-3 p-2 rounded bg-[#202025] border border-[#2a2a2a]">
          <div className={`p-2 rounded ${item.bg} border ${item.border}`}>
            {React.createElement(item.icon, { className: `w-4 h-4`, style: { color: item.color } })}
          </div>
          <div>
            <span className="text-sm font-medium text-[#e0e0e0]">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TabButtons: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unauthCount: number;
  authCount: number;
}> = ({ activeTab, onTabChange, unauthCount, authCount }) => (
  <div className="w-full border-b border-[#2a2a2a] bg-[#1a1a1f]">
     <div className="w-full flex items-center gap-1">
      <button
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
        activeTab === 'unauthenticated' 
          ? 'border-[#ef5350] text-[#ef5350]' 
          : 'border-transparent text-[#888] hover:text-[#e0e0e0] hover:bg-[#202025]'
      }`}
      onClick={() => onTabChange('unauthenticated')}
    >
      <FaUser className="w-4 h-4" />
      <span>Unauth</span>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        activeTab === 'unauthenticated' 
          ? 'bg-[#ef5350]/20 text-[#ef5350]' 
          : 'bg-[#2a2a35] text-[#888]'
      }`}>
        {unauthCount}
      </span>
    </button>
    
    <button
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
        activeTab === 'authenticated' 
          ? 'border-[#4caf50] text-[#4caf50]' 
          : 'border-transparent text-[#888] hover:text-[#e0e0e0] hover:bg-[#202025]'
      }`}
      onClick={() => onTabChange('authenticated')}
    >
      <FaUserCheck className="w-4 h-4" />
      <span>Auth</span>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        activeTab === 'authenticated' 
          ? 'bg-[#4caf50]/20 text-[#4caf50]' 
          : 'bg-[#2a2a35] text-[#888]'
      }`}>
        {authCount}
      </span>
    </button>
     </div>
  </div>
);

const RouteSelector: React.FC<{
  routes: string|unknown[];
  selectedRoute: string;
  onRouteChange: (route: string) => void;
  onTestRoute: () => void;
  isTesting: boolean;
}> = ({ routes, selectedRoute, onRouteChange}) => (
  <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-[#e0e0e0] flex items-center gap-2">
        <FaRoute className="w-4 h-4 text-[#64b5f6]" />
      </h3>
      <span className="text-xs text-[#888] bg-[#2a2a35] px-2 py-1 rounded">
        {routes.length} routes
      </span>
    </div>
    
    <div className="flex gap-2">
      <select
        className="flex-1 bg-[#202025] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e0e0e0] font-mono focus:outline-none focus:border-[#64b5f6] focus:ring-1 focus:ring-[#64b5f6]"
        value={selectedRoute}
        onChange={(e) => onRouteChange(e.target.value)}
      >
        <option value="" className="bg-[#1a1a1f]">All Routes</option>
        {Array.isArray(routes) && routes.map((route:any) => (
          <option key={route} value={route} className="bg-[#1a1a1f] font-mono">
            {route || "/"}
          </option>
        ))}
      </select>
      
      
    </div>
  </div>
);

const StatsGrid: React.FC<{
  totalRoutes: number;
  totalScenarios: number;
  unauthCount: number;
  authCount: number;
}> = ({ totalRoutes, totalScenarios, unauthCount, authCount }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
    {[
      { icon: FaRoute, value: totalRoutes, label: 'Total Routes', color: '#64b5f6', bg: 'bg-[#64b5f6]/10', border: 'border-[#64b5f6]/30' },
      { icon: FaChartBar, value: totalScenarios, label: 'Scenarios', color: '#9c27b0', bg: 'bg-[#9c27b0]/10', border: 'border-[#9c27b0]/30' },
      { icon: FaUser, value: unauthCount, label: 'Unauth', color: '#ef5350', bg: 'bg-[#ef5350]/10', border: 'border-[#ef5350]/30' },
      { icon: FaUserCheck, value: authCount, label: 'Auth', color: '#4caf50', bg: 'bg-[#4caf50]/10', border: 'border-[#4caf50]/30' }
    ].map((stat) => (
      <div 
        key={stat.label} 
        className={`border rounded-lg p-3 ${stat.bg} border border-[#2a2a2a]`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${stat.bg.replace('/10', '/20')} border border-[#2a2a2a] `}>
            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-[#e0e0e0]">{stat.value}</div>
            <div className="text-xs text-[#a0a0a0] mt-0.5">{stat.label}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);


export const RouteSimulationTable: React.FC<Props> = ({
  routes,
  unauthScenarios,
  authScenarios,
  onSelectRoute
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('unauthenticated');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const totalRoutes = routes.length;
  const totalScenarios = unauthScenarios.length + authScenarios.length;

  const handleTestRoute = () => {
    if (!selectedRoute) return;
    
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      onSelectRoute?.(selectedRoute);
    }, 800);
  };

  return (
    <div className="bg-[#1a1a1f] min-h-screen">
      <div className="max-w-[95%] mx-auto py-4">
        {/* Stats Grid */}
        <StatsGrid
          totalRoutes={totalRoutes}
          totalScenarios={totalScenarios}
          unauthCount={unauthScenarios.length}
          authCount={authScenarios.length}
        />

        {/* Route Selector */}
        <RouteSelector
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteChange={setSelectedRoute}
          onTestRoute={handleTestRoute}
          isTesting={isTesting}
        />

        {/* Tabs */}
        <TabButtons
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unauthCount={unauthScenarios.length}
          authCount={authScenarios.length}
        />

        {/* Content */}
        <div className="mt-4 space-y-6">
          <AuthSection
            title="Unauthenticated"
            badge="unauthenticated"
            authInfo=""
            subtitle="User is not logged in - treated as 'Guest'"
            scenarios={unauthScenarios}
            routes={routes}
            isActive={activeTab === 'unauthenticated'}
            selectedRoute={selectedRoute}
          />

          <AuthSection
            title="Authenticated"
            badge="authenticated"
            authInfo=""
            subtitle={
              authScenarios.length > 1
                ? "Testing with different user roles"
                : "No role-based routes defined"
            }
            scenarios={authScenarios}
            routes={routes}
            isActive={activeTab === 'authenticated'}
            selectedRoute={selectedRoute}
          />

          <Legend />
        </div>
      </div>
    </div>
  );
};