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
import type { Scenario } from "../../../utils/type";
import React, { useState } from "react";
import { LuRedo2 } from "react-icons/lu";

type Props = {
  routes: string|unknown[];
  unauthScenarios: Scenario[];
  authScenarios: Scenario[];
  onSelectRoute?: (route: string) => void;
};

type TabType = 'unauthenticated' | 'authenticated';


const mapIcon = (result?: { access: string }) => {
  if (!result) return <FaMinus className="rk-w-4 rk-h-4 rk-text-[#888]" />;
  if (result.access === "allow") return <FaCheckCircle className="rk-w-4 rk-h-4 rk-text-[#4caf50]" />;
  if (result.access === "redirect") return <LuRedo2  className="rk-w-4 rk-h-4 rk-text-[#9c27b0]" />;
  return <FaTimesCircle className="rk-w-4 rk-h-4 rk-text-[#ef5350]" />;
};

const ScenarioHeader: React.FC<{ label: string }> = ({ label }) => (
  <th 
    scope="col" 
    className="rk-px-3 rk-py-2.5 rk-text-sm rk-font-medium rk-text-[#a0a0a0] rk-uppercase rk-tracking-wider rk-border-l rk-border-[#2a2a2a] rk-min-w-[70px] rk-text-center rk-bg-[#202025]"
  >
    <div className="rk-truncate" title={label}>
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

  const bgColor = !result ? 'rk-bg-[#1a1a1f]' : 
    result.access === 'allow' ? 'rk-bg-[#4caf50]/10' : 
    result.access === 'redirect' ? 'rk-bg-[#9c27b0]/10' : 
    'rk-bg-[#ef5350]/10';

  const borderColor = !result ? 'rk-border-[#2a2a2a]' : 
    result.access === 'allow' ? 'rk-border-[#4caf50]/30' : 
    result.access === 'redirect' ? 'rk-border-[#9c27b0]/30' : 
    'rk-border-[#ef5350]/30';

  return (
    <td className="rk-px-3 rk-py-2 rk-border-l rk-border-[#2a2a2a] rk-text-center rk-align-middle">
      <div
        className={`rk-inline-flex rk-items-center rk-justify-center rk-p-1.5 rk-rounded rk-border ${bgColor} ${borderColor} hover:rk-opacity-90 rk-transition-opacity`}
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
    <section className="rk-space-y-4">
      {/* Section Header */}
      <div className="rk-bg-[#1a1a1f] rk-border rk-border-[#2a2a2a] rk-rounded rk-p-3">
        <div className="rk-flex rk-items-center rk-justify-between rk-mb-2">
          <div className="rk-flex rk-items-center rk-gap-3">
            <span className={`rk-inline-flex rk-items-center rk-gap-1.5 rk-px-3 rk-py-1.5 rk-rounded-full rk-text-sm rk-font-semibold ${
              badge === "unauthenticated" 
                ? "rk-bg-[#ef5350]/10 rk-text-[#ef5350] rk-border rk-border-[#ef5350]/30" 
                : "rk-bg-[#4caf50]/10 rk-text-[#4caf50] rk-border rk-border-[#4caf50]/30"
            }`}>
              {badge === "unauthenticated" ? (
                <FaUser className="rk-w-3.5 rk-h-3.5" />
              ) : (
                <FaUserCheck className="rk-w-3.5 rk-h-3.5" />
              )}
              {title}
            </span>
            <span className="rk-text-sm rk-text-[#888]">
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {scenarios.length > 0 && !selectedRoute && (
            <div className="rk-text-xs rk-text-[#888] rk-px-2 rk-py-1 rk-bg-[#2a2a35] rk-rounded">
              {routes.length} routes
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="rk-text-sm rk-text-[#a0a0a0]">{subtitle}</p>
        )}
      </div>

      {/* Table */}
      {scenarios.length > 0 ? (
        <div className="rk-border rk-border-[#2a2a2a] rk-rounded rk-overflow-hidden rk-bg-[#1a1a1f]">
          <div className="rk-overflow-x-auto">
            <table className="rk-min-w-full rk-divide-y rk-divide-[#2a2a2a]">
              <thead className="rk-bg-[#202025]">
                <tr>
                  <th 
                    scope="col" 
                    className="rk-px-4 rk-py-3 rk-text-left rk-text-sm rk-font-medium rk-text-[#a0a0a0] rk-uppercase rk-tracking-wider rk-w-[200px] rk-border-r rk-border-[#2a2a2a]"
                  >
                    <div className="rk-flex rk-items-center rk-gap-2">
                      <FaRoute className="rk-w-4 rk-h-4" />
                      <span>Route Path</span>
                    </div>
                  </th>
                  {scenarios.map((scenario) => (
                    <ScenarioHeader key={scenario.label} label={scenario.label} />
                  ))}
                </tr>
              </thead>
              <tbody className="rk-divide-y rk-divide-[#2a2a2a]">
                {Array.isArray(displayRoutes) && displayRoutes.map((route:any,index:number) => (
                  <tr 
                    key={route} 
                    className={`hover:rk-bg-[#202025] rk-transition-colors ${index % 2 === 0 ? 'rk-bg-[#1a1a1f]' : 'rk-bg-[#17171c]'}`}
                  >
                    <td className="rk-px-4 rk-py-3 rk-whitespace-nowrap rk-border-r rk-border-[#2a2a2a]">
                      <div className="rk-flex rk-items-center">
                        <code 
                          className="rk-text-sm rk-text-[#e0e0e0] rk-font-mono rk-truncate rk-max-w-[180px] hover:rk-text-white rk-transition-colors"
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
        <div className="rk-flex rk-flex-col rk-items-center rk-justify-center rk-p-6 rk-text-center rk-border rk-border-[#2a2a2a] rk-rounded rk-bg-[#1a1a1f]">
          <FaInfoCircle className="rk-w-8 rk-h-8 rk-text-[#888] rk-mb-3" />
          <p className="rk-text-sm rk-text-[#888] rk-mb-1">No scenarios for {title.toLowerCase()} state</p>
          <p className="rk-text-xs rk-text-[#666]">Configure scenarios to see route behaviors</p>
        </div>
      )}
    </section>
  );
};

const Legend: React.FC = () => (
  <div className="rk-bg-[#1a1a1f] rk-border rk-border-[#2a2a2a] rk-rounded rk-p-4 rk-mt-4">
    <div className="rk-grid rk-grid-cols-2 md:rk-grid-cols-4 rk-gap-3">
      {[
        { icon: FaCheckCircle, color: '#4caf50', label: 'Allow', bg: 'rk-bg-[#4caf50]/10', border: 'rk-border-[#4caf50]/30' },
        { icon: LuRedo2 , color: '#9c27b0', label: 'Redirect', bg: 'rk-bg-[#9c27b0]/10', border: 'rk-border-[#9c27b0]/30' },
        { icon: FaTimesCircle, color: '#ef5350', label: 'Deny', bg: 'rk-bg-[#ef5350]/10', border: 'rk-border-[#ef5350]/30' },
        { icon: FaMinus, color: '#888', label: 'Missing', bg: 'rk-bg-[#2a2a35]', border: 'rk-border-[#2a2a2a]' }
      ].map((item) => (
        <div key={item.label} className="rk-flex rk-items-center rk-gap-3 rk-p-2 rk-rounded rk-bg-[#202025] rk-border rk-border-[#2a2a2a]">
          <div className={`rk-p-2 rk-rounded ${item.bg} rk-border ${item.border}`}>
            {React.createElement(item.icon, { className: `rk-w-4 rk-h-4`, style: { color: item.color } })}
          </div>
          <div>
            <span className="rk-text-sm rk-font-medium rk-text-[#e0e0e0]">{item.label}</span>
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
  <div className="rk-w-full rk-border-b rk-border-[#2a2a2a] rk-bg-[#1a1a1f]">
     <div className="rk-w-full rk-flex rk-items-center rk-gap-1">
      <button
      className={`rk-flex rk-items-center rk-gap-2 rk-px-4 rk-py-3 rk-text-sm rk-font-medium rk-border-b-2 rk-transition-all ${
        activeTab === 'unauthenticated' 
          ? 'rk-border-[#ef5350] rk-text-[#ef5350]' 
          : 'rk-border-transparent rk-text-[#888] hover:rk-text-[#e0e0e0] hover:rk-bg-[#202025]'
      }`}
      onClick={() => onTabChange('unauthenticated')}
    >
      <FaUser className="rk-w-4 rk-h-4" />
      <span>Unauth</span>
      <span className={`rk-px-2 rk-py-0.5 rk-rounded rk-text-xs rk-font-medium ${
        activeTab === 'unauthenticated' 
          ? 'rk-bg-[#ef5350]/20 rk-text-[#ef5350]' 
          : 'rk-bg-[#2a2a35] rk-text-[#888]'
      }`}>
        {unauthCount}
      </span>
    </button>
    
    <button
      className={`rk-flex rk-items-center rk-gap-2 rk-px-4 rk-py-3 rk-text-sm rk-font-medium rk-border-b-2 rk-transition-all ${
        activeTab === 'authenticated' 
          ? 'rk-border-[#4caf50] rk-text-[#4caf50]' 
          : 'rk-border-transparent rk-text-[#888] hover:rk-text-[#e0e0e0] hover:rk-bg-[#202025]'
      }`}
      onClick={() => onTabChange('authenticated')}
    >
      <FaUserCheck className="rk-w-4 rk-h-4" />
      <span>Auth</span>
      <span className={`rk-px-2 rk-py-0.5 rk-rounded rk-text-xs rk-font-medium ${
        activeTab === 'authenticated' 
          ? 'rk-bg-[#4caf50]/20 rk-text-[#4caf50]' 
          : 'rk-bg-[#2a2a35] rk-text-[#888]'
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
  <div className="rk-bg-[#1a1a1f] rk-border rk-border-[#2a2a2a] rk-rounded-lg rk-p-4 rk-mb-4">
    <div className="rk-flex rk-items-center rk-justify-between rk-mb-2">
      <h3 className="rk-text-sm rk-font-medium rk-text-[#e0e0e0] rk-flex rk-items-center rk-gap-2">
        <FaRoute className="rk-w-4 rk-h-4 rk-text-[#64b5f6]" />
      </h3>
      <span className="rk-text-xs rk-text-[#888] rk-bg-[#2a2a35] rk-px-2 rk-py-1 rk-rounded">
        {routes.length} routes
      </span>
    </div>
    
    <div className="rk-flex rk-gap-2">
      <select
        className="rk-flex-1 rk-bg-[#202025] rk-border rk-border-[#2a2a2a] rk-rounded rk-px-3 rk-py-2 rk-text-sm rk-text-[#e0e0e0] rk-font-mono focus:rk-outline-none focus:rk-border-[#64b5f6] focus:rk-ring-1 focus:rk-ring-[#64b5f6]"
        value={selectedRoute}
        onChange={(e) => onRouteChange(e.target.value)}
      >
        <option value="" className="rk-bg-[#1a1a1f]">All Routes</option>
        {Array.isArray(routes) && routes.map((route:any) => (
          <option key={route} value={route} className="rk-bg-[#1a1a1f] rk-font-mono">
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
  <div className="rk-grid rk-grid-cols-2 sm:rk-grid-cols-4 rk-gap-3 rk-mb-4">
    {[
      { icon: FaRoute, value: totalRoutes, label: 'Total Routes', color: '#64b5f6', bg: 'rk-bg-[#64b5f6]/10', border: 'rk-border-[#64b5f6]/30' },
      { icon: FaChartBar, value: totalScenarios, label: 'Scenarios', color: '#9c27b0', bg: 'rk-bg-[#9c27b0]/10', border: 'rk-border-[#9c27b0]/30' },
      { icon: FaUser, value: unauthCount, label: 'Unauth', color: '#ef5350', bg: 'rk-bg-[#ef5350]/10', border: 'rk-border-[#ef5350]/30' },
      { icon: FaUserCheck, value: authCount, label: 'Auth', color: '#4caf50', bg: 'rk-bg-[#4caf50]/10', border: 'rk-border-[#4caf50]/30' }
    ].map((stat) => (
      <div 
        key={stat.label} 
        className={`rk-border rk-rounded-lg rk-p-3 ${stat.bg} rk-border rk-border-[#2a2a2a]`}
      >
        <div className="rk-flex rk-items-center rk-gap-3">
          <div className={`rk-p-2 rk-rounded ${stat.bg.replace('/10', '/20')} rk-border rk-border-[#2a2a2a] `}>
            <stat.icon className="rk-w-4 rk-h-4" style={{ color: stat.color }} />
          </div>
          <div className="rk-flex rk-items-center rk-gap-2">
            <div className="rk-text-xl rk-font-bold rk-text-[#e0e0e0]">{stat.value}</div>
            <div className="rk-text-xs rk-text-[#a0a0a0] rk-mt-0.5">{stat.label}</div>
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
    <div className="rk-bg-[#1a1a1f] rk-min-h-screen">
      <div className="rk-max-w-[95%] rk-mx-auto rk-py-4">
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
        <div className="rk-mt-4 rk-space-y-6">
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