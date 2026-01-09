import React, { useState, useMemo, useEffect } from "react";
import type { RouteConfig, VisualRouteNode } from "../../utils/type";
import { buildRouteGraph } from "./buildGraphRoute";
import { ListContainer } from "./list/ListContainer";
import { RouteTree } from "./tree/RouteTree";
import { RouteEditor } from "./RouteEditor";
import {
  routesUseRoles,
  buildScenarios,
  simulateRoutes,
  processSimulationResults,
} from "./simulate/functions";
import { RouteSimulationTable } from "./simulate/RouteSimulationTable";
import RouteMountPanel from "./mount/RouteMountPanel";
import IssuesPanel from "./issues/issues";
import Logo from '../assets/logo.jpg'
import { useMobile } from "./hooks/useMobile";

import {
  FaChevronLeft,
  FaChevronRight,
  FaSitemap,
  FaList,
  FaPlayCircle,
  FaHeartbeat,
  FaExclamationCircle
} from "react-icons/fa";
import type { RouteVisionProps } from "../../utils/type";

type ViewMode = "vertical" | "tree" | "simulate" | "mount" | "issues";

// Local storage keys
const STORAGE_KEYS = {
  VIEW_MODE: "routekeeper_view_mode",
  PANEL_STATE: "routekeeper_panel_state",
};

export const RouteKeeperVision: React.FC<RouteVisionProps> = ({
  routes,
  timingRecords,
  setTimingRecords,
  issues,setIssues,testingMode,toggleTestingMode,auth
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as ViewMode) || "vertical";
  });

  const [graph] = useState(() => buildRouteGraph(routes));
  const [selectedNode, setSelectedNode] = useState<VisualRouteNode | null>(
    null
  );
  

  const [openPanel, setOpenPanel] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PANEL_STATE);
    return saved ? JSON.parse(saved) : true;
  });
  const isMobile = useMobile(1024);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PANEL_STATE, JSON.stringify(openPanel));
  }, [openPanel]);

  const togglePanel = () => setOpenPanel((prev) => !prev);


  const hasRoles = useMemo(() => routesUseRoles(routes), [routes]);
  const scenarios = useMemo(() => buildScenarios(hasRoles, routes), [hasRoles]);

  const simulationResults = useMemo(() => {
    const unauthResults = simulateRoutes(routes, scenarios.unauthenticated);
    const authResults = simulateRoutes(routes, scenarios.authenticated);

    return {
      unauthScenarios: processSimulationResults(unauthResults),
      authScenarios: processSimulationResults(authResults),
    };
  }, [routes, scenarios]);

  useEffect(()=>{
    if(!openPanel){
      setOpenPanel(true)
    }
  },[selectedNode])


  const routePaths = useMemo(() => {
    const paths = new Set();

    const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

    const extractPaths = (routeList: RouteConfig[], parentPath = "") => {
      for (const route of routeList) {
        let fullPath = "";

        if (route.index) {
          fullPath = parentPath || "/";
        } else if (route.path) {
          fullPath =
            parentPath +
            (route.path.startsWith("/") ? route.path : "/" + route.path);
        } else {
          fullPath = parentPath || "/";
        }

        paths.add(normalize(fullPath));

        if (route.children?.length) {
          extractPaths(route.children, normalize(fullPath));
        }
      }
    };

    extractPaths(routes);
    return Array.from(paths).sort();
  }, [routes]);


  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "simulate" || mode === "mount") {
      setSelectedNode(null);
    }
  };

  const handleNodeSelect = (node: VisualRouteNode) => {
    setSelectedNode(node);
  };

  const condition = openPanel && viewMode !== "mount" && viewMode !== "issues" && viewMode !== "simulate";
  const keepWidth = viewMode !== "mount" && viewMode !== "issues" && viewMode !== "simulate";

  return (
    <div className="rk-routekeeper-vision rk-font-['Fira_Code','JetBrains_Mono','Source_Code_Pro','Roboto_Mono',monospace] rk-h-screen rk-flex rk-flex-col rk-bg-[#0f0f12] rk-text-[#e0e0e0] rk-font-medium rk-text-sm rk-leading-relaxed">
      {/* HEADER */}
      <div className="rk-px-6 rk-py-4 rk-border-b rk-border-[#2a2a2a] rk-bg-[#1a1a1f] rk-sticky rk-top-0 rk-z-10 rk-flex rk-justify-between rk-items-center">
        <div className="rk-flex rk-items-center rk-gap-3">
          <img src={Logo} alt="" className="rk-h-8 rk-w-8 rk-rounded-lg" />
          <h2 className="rk-m-0 rk-flex rk-hidden rk-gap-5 lg:rk-block rk-text-white rk-font-semibold rk-text-lg">
           <span className="rk-text-purple-300"> RouteKeeper</span>  <span className="rk-text-purple-300">Vision</span>
          </h2>
        </div>

        <div className="rk-flex rk-gap-2">
          <div className="rk-flex rk-items-center rk-gap-3">
            <button
              className={`rk-p-3 rk-flex rk-items-center rk-gap-2 rk-border rk-border-[#4a4a55] rk-rounded-lg rk-relative rk-transition-all rk-duration-200 ${
                viewMode === "vertical"
                  ? "rk-bg-gradient-to-br rk-from-[#3a3a45] rk-to-[#2a2a35] rk-text-purple-300 rk-font-semibold rk-shadow-md"
                  : "hover:rk-bg-[#353540] hover:rk-text-gray-300 rk-text-[#a0a0a0] hover:rk-shadow-md hover:rk-border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("vertical")}
              title="Vertical Tree View"
            >
               <span className="rk-hidden md:rk-block">Tree Diagram</span>
              <FaSitemap className="rk-mode-icon" />
            </button>
            <button
              className={`rk-p-3 rk-flex rk-items-center rk-gap-2 rk-border rk-border-[#4a4a55] rk-rounded-lg rk-relative rk-transition-all rk-duration-200 ${
                viewMode === "tree"
                  ? "rk-bg-gradient-to-br rk-from-[#3a3a45] rk-to-[#2a2a35] rk-text-purple-300 rk-font-semibold rk-shadow-md"
                  : "hover:rk-bg-[#353540] hover:rk-text-gray-300 rk-text-[#a0a0a0] hover:rk-shadow-md hover:rk-border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("tree")}
              title="Tree View"
            >
             <span className="rk-hidden md:rk-block"> List View</span>
              <FaList className="rk-mode-icon" />
            </button>
            <button
              className={`rk-p-3 rk-flex rk-items-center rk-gap-2 rk-border rk-border-[#4a4a55] rk-rounded-lg rk-relative rk-transition-all rk-duration-200 ${
                viewMode === "simulate"
                  ? "rk-bg-gradient-to-br rk-from-[#3a3a45] rk-to-[#2a2a35] rk-text-purple-300 rk-font-semibold rk-shadow-md"
                  : "hover:rk-bg-[#353540] hover:rk-text-gray-300 rk-text-[#a0a0a0] hover:rk-shadow-md hover:rk-border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("simulate")}
              title="Simulation View"
            >
              <span className="rk-hidden md:rk-block">Simulation</span>
              <FaPlayCircle className="rk-mode-icon" />
            </button>
            <button
              className={`rk-p-3 rk-flex rk-items-center rk-gap-2 rk-border rk-border-[#4a4a55] rk-rounded-lg rk-relative rk-transition-all rk-duration-200 ${
                viewMode === "mount"
                  ? "rk-bg-gradient-to-br rk-from-[#3a3a45] rk-to-[#2a2a35] rk-text-purple-300 rk-font-semibold rk-shadow-md"
                  : "hover:rk-bg-[#353540] hover:rk-text-gray-300 rk-text-[#a0a0a0] hover:rk-shadow-md hover:rk-border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("mount")}
              title="Mount View"
            >
              <span className="rk-hidden md:rk-block">Test</span>
              <FaHeartbeat className="rk-mode-icon" />
            </button>
            <button
              className={`rk-p-3 rk-flex rk-items-center rk-gap-2 rk-border rk-border-[#4a4a55] rk-rounded-lg rk-relative rk-transition-all rk-duration-200 ${
                viewMode === "issues"
                  ? "rk-bg-gradient-to-br rk-from-[#3a3a45] rk-to-[#2a2a35] rk-text-purple-300 rk-shadow-md rk-font-semibold"
                  : "hover:rk-bg-[#353540] hover:rk-text-gray-300 rk-text-[#a0a0a0] hover:rk-shadow-md hover:rk-border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("issues")}
              title="Issues View"
            >
              <span className="rk-hidden md:rk-block">Issues</span>
              <FaExclamationCircle className="rk-mode-icon" />
            </button>

             <button
              className={`
                rk-flex lg:rk-hidden rk-items-center rk-justify-center
                rk-w-10 rk-h-10 rk-text-[#e0e0e0]
                rk-border rk-border-[#2a2a2a] rk-rounded-lg
                rk-cursor-pointer
                rk-transition-all rk-duration-200
                rk-bg-[#1a1a1f] hover:rk-bg-[#2a2a35]
                hover:rk-border-[#3a3a45] hover:rk-text-white
                active:rk-scale-95
                rk-p-3
                focus:rk-outline-none focus:rk-ring-2 focus:rk-ring-[#64b5f6]/50
                rk-shadow-sm hover:rk-shadow-md
                ${!condition ? "" : ""}
              `}
              onClick={togglePanel}
              aria-label={condition ? "Collapse panel" : "Expand panel"}
              title={condition ? "Collapse Panel" : "Expand Panel"}
            >
              {condition ? (
                <FaChevronRight className="rk-w-4 rk-h-4" />
              ) : (
                <FaChevronLeft className="rk-w-4 rk-h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="rk-flex rk-flex-1 rk-overflow-hidden">
        {/* LEFT: MAIN CONTENT */}
        <div
          className={`rk-bg-[#1a1a1f] rk-relative rk-transition-all rk-duration-300 rk-ease-in-out rk-overflow-hidden ${
            condition ? "rk-w-full lg:rk-w-[calc(100%-30rem)]" : "rk-w-full"
          }`}
        >
          <div className="rk-h-full rk-overflow-y-auto rk-border-r rk-border-[#2a2a2a] rk-pr-1">
            {viewMode === "tree" ? (
              <ListContainer
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                routes={routes}
              />
            ) : viewMode === "simulate" ? (
              <RouteSimulationTable
                routes={routePaths}
                unauthScenarios={simulationResults.unauthScenarios}
                authScenarios={simulationResults.authScenarios}
              />
            ) : viewMode === "mount" ? (
              <RouteMountPanel
                routes={routePaths}
                setTimingRecords={setTimingRecords}
                timingRecords={timingRecords}
                testingMode={testingMode}
                toggleTestingMode={toggleTestingMode}
                auth={auth}
            
              />
            ) : viewMode === "issues" ? (
              <IssuesPanel issues={issues} setIssues={setIssues} />
            ) : (
              <RouteTree
                routes={graph}
                selectedNodeId={selectedNode?.id}
                onSelect={handleNodeSelect}
              />
            )}
          </div>
        </div>
         {/* RIGHT PANEL MOBILE */}
        {
          isMobile &&
          <div
          className={`rk-fixed rk-z-[400] rk-inset-0 rk-top-[4.3rem] lg:rk-hidden rk-bg-[#1a1a1f] rk-overflow-y-auto rk-transition-all rk-duration-300 rk-ease-in-out rk-border-l rk-border-[#2a2a2a] ${
            condition
              ? "rk-w-full rk-opacity-100 rk-shadow-lg"
              : `${keepWidth ? "rk-w-[0rem] rk-opacity-100" : "rk-w-[0rem] rk-opacity-0"}`
          }`}
          >
          

          <div className={`rk-mt-2 ${condition ? "rk-block" : "rk-hidden"}`}>
            {selectedNode ? (
              <RouteEditor
                node={selectedNode}
              />
            ) : (
              <div className="rk-h-full rk-flex rk-flex-col rk-mt-[2rem] rk-items-center rk-justify-center rk-p-10 rk-text-center">
                <div className="rk-text-5xl rk-mb-4 rk-opacity-30">
                  {viewMode === "vertical" ? "🌳" : "📋"}
                </div>
                <h3 className="rk-m-0 rk-mb-2 rk-text-[#a0a0a0] rk-font-semibold">Select a Route</h3>
                <p className="rk-m-0 rk-text-sm rk-text-[#888] rk-max-w-[80%]">
                  Click on any route in the tree to view and edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
        }

        {/* RIGHT: EDITOR PANEL */}
        {
          !isMobile &&
          <div
          className={`rk-flex-shrink-0 rk-hidden lg:rk-block rk-bg-[#1a1a1f] rk-overflow-y-auto rk-transition-all rk-duration-300 rk-ease-in-out rk-border-l rk-border-[#2a2a2a] ${
            condition
              ? "rk-w-[30rem] rk-opacity-100 rk-shadow-lg"
              : `${keepWidth ? "rk-w-[4rem] rk-opacity-100" : "rk-w-[0rem] rk-opacity-0"}`
          }`}
          >
          <div
            className={`
              rk-flex rk-items-center rk-bg-[#202025] rk-justify-between rk-py-3 rk-px-3
              ${
                !condition
                  ? "rk-h-full rk-flex-col rk-gap-4"
                  : "rk-border-b rk-border-[#2a2a2a]"
              }
            `}
          >
            <button
              className={`
                rk-flex rk-items-center rk-justify-center
                rk-w-10 rk-h-10 rk-text-[#e0e0e0]
                rk-border rk-border-[#2a2a2a] rk-rounded-lg
                rk-cursor-pointer
                rk-transition-all rk-duration-200
                rk-bg-[#1a1a1f] hover:rk-bg-[#2a2a35]
                hover:rk-border-[#3a3a45] hover:rk-text-white
                active:rk-scale-95
                rk-p-3
                focus:rk-outline-none focus:rk-ring-2 focus:rk-ring-[#64b5f6]/50
                rk-shadow-sm hover:rk-shadow-md
                ${!condition ? "" : ""}
              `}
              onClick={togglePanel}
              aria-label={condition ? "Collapse panel" : "Expand panel"}
              title={condition ? "Collapse Panel" : "Expand Panel"}
            >
              {condition ? (
                <FaChevronRight className="rk-w-4 rk-h-4" />
              ) : (
                <FaChevronLeft className="rk-w-4 rk-h-4" />
              )}
            </button>

            {!condition && (
              <div
                className="rk-text-4xl rk-transition-opacity rk-duration-200 rk-opacity-70 hover:rk-opacity-100 rk-cursor-default"
                title={`View mode: ${viewMode === "vertical" ? "Tree" : "List"}`}
              >
                {viewMode === "vertical" ? "🌳" : "📋"}
              </div>
            )}
          </div>

          <div className={`${condition ? "rk-block" : "rk-hidden"}`}>
            {selectedNode ? (
              <RouteEditor
                node={selectedNode}
              />
            ) : (
              <div className="rk-h-full rk-flex rk-flex-col rk-mt-[2rem] rk-items-center rk-justify-center rk-p-10 rk-text-center">
                <div className="rk-text-5xl rk-mb-4 rk-opacity-30">
                  {viewMode === "vertical" ? "🌳" : "📋"}
                </div>
                <h3 className="rk-m-0 rk-mb-2 rk-text-[#a0a0a0] rk-font-semibold">Select a Route</h3>
                <p className="rk-m-0 rk-text-sm rk-text-[#888] rk-max-w-[80%]">
                  Click on any route in the tree to view and edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
        }
      </div>
    </div>
  );
};