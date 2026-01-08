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
} from "../../src/components/simulate/functions";
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
  issues,setIssues,testingMode,toggleTestingMode
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
    <div className="font-['Fira_Code','JetBrains_Mono','Source_Code_Pro','Roboto_Mono',monospace] h-screen flex flex-col bg-[#0f0f12] text-[#e0e0e0] font-medium text-sm leading-relaxed">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1f] sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="" className="h-8 w-8 rounded-lg" />
          <h2 className="m-0 flex hidden gap-5 lg:block text-white font-semibold text-lg">
           <span className="text-purple-300"> RouteKeeper</span>  <span className="text-purple-300">Vision</span>
          </h2>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-3">
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "vertical"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-purple-300 font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("vertical")}
              title="Vertical Tree View"
            >
               <span className="hidden md:block">Tree Diagram</span>
              <FaSitemap className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "tree"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-purple-300 font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("tree")}
              title="Tree View"
            >
             <span className="hidden md:block"> List View</span>
              <FaList className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "simulate"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-purple-300 font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("simulate")}
              title="Simulation View"
            >
              <span className="hidden md:block">Simulation</span>
              <FaPlayCircle className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "mount"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-purple-300 font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("mount")}
              title="Mount View"
            >
              <span className="hidden md:block">Test</span>
              <FaHeartbeat className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "issues"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-purple-300 shadow-md font-semibold "
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("issues")}
              title="Issues View"
            >
              <span className="hidden md:block">Issues</span>
              <FaExclamationCircle className="mode-icon" />
            </button>

             <button
              className={`
                flex lg:hidden items-center justify-center
                w-10 h-10 text-[#e0e0e0]
                border border-[#2a2a2a] rounded-lg
                cursor-pointer
                transition-all duration-200
                bg-[#1a1a1f] hover:bg-[#2a2a35]
                hover:border-[#3a3a45] hover:text-white
                active:scale-95
                p-3
                focus:outline-none focus:ring-2 focus:ring-[#64b5f6]/50
                shadow-sm hover:shadow-md
                ${!condition ? "" : ""}
              `}
              onClick={togglePanel}
              aria-label={condition ? "Collapse panel" : "Expand panel"}
              title={condition ? "Collapse Panel" : "Expand Panel"}
            >
              {condition ? (
                <FaChevronRight className="w-4 h-4" />
              ) : (
                <FaChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: MAIN CONTENT */}
        <div
          className={`bg-[#1a1a1f] relative transition-all duration-300 ease-in-out overflow-hidden ${
            condition ? "w-full lg:w-[calc(100%-30rem)]" : "w-full"
          }`}
        >
          <div className="h-full overflow-y-auto border-r border-[#2a2a2a] pr-1">
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
          className={` fixed z-[400] inset-0 top-[4.3rem]  lg:hidden bg-[#1a1a1f] overflow-y-auto transition-all duration-300 ease-in-out border-l border-[#2a2a2a] ${
            condition
              ? "w-full opacity-100 shadow-lg"
              : `${keepWidth ? "w-[0rem] opacity-100" : "w-[0rem] opacity-0"}`
          }`}
          >
          

          <div className={`mt-2 ${condition ? "block" : "hidden"}`}>
            {selectedNode ? (
              <RouteEditor
                node={selectedNode}
              />
            ) : (
              <div className="h-full flex flex-col mt-[2rem] items-center justify-center p-10 text-center">
                <div className="text-5xl mb-4 opacity-30">
                  {viewMode === "vertical" ? "🌳" : "📋"}
                </div>
                <h3 className="m-0 mb-2 text-[#a0a0a0] font-semibold">Select a Route</h3>
                <p className="m-0 text-sm text-[#888] max-w-[80%]">
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
          className={`flex-shrink-0 hidden lg:block bg-[#1a1a1f] overflow-y-auto transition-all duration-300 ease-in-out border-l border-[#2a2a2a] ${
            condition
              ? "w-[30rem] opacity-100 shadow-lg"
              : `${keepWidth ? "w-[4rem] opacity-100" : "w-[0rem] opacity-0"}`
          }`}
          >
          <div
            className={`
              flex items-center bg-[#202025]  justify-between py-3 px-3
              ${
                !condition
                  ? "h-full flex-col gap-4"
                  : "border-b border-[#2a2a2a]"
              }
            `}
          >
            <button
              className={`
                flex items-center justify-center
                w-10 h-10 text-[#e0e0e0]
                border border-[#2a2a2a] rounded-lg
                cursor-pointer
                transition-all duration-200
                bg-[#1a1a1f] hover:bg-[#2a2a35]
                hover:border-[#3a3a45] hover:text-white
                active:scale-95
                p-3
                focus:outline-none focus:ring-2 focus:ring-[#64b5f6]/50
                shadow-sm hover:shadow-md
                ${!condition ? "" : ""}
              `}
              onClick={togglePanel}
              aria-label={condition ? "Collapse panel" : "Expand panel"}
              title={condition ? "Collapse Panel" : "Expand Panel"}
            >
              {condition ? (
                <FaChevronRight className="w-4 h-4" />
              ) : (
                <FaChevronLeft className="w-4 h-4" />
              )}
            </button>

            {!condition && (
              <div
                className="text-4xl transition-opacity duration-200 opacity-70 hover:opacity-100 cursor-default"
                title={`View mode: ${viewMode === "vertical" ? "Tree" : "List"}`}
              >
                {viewMode === "vertical" ? "🌳" : "📋"}
              </div>
            )}
          </div>

          <div className={` ${condition ? "block" : "hidden"}`}>
            {selectedNode ? (
              <RouteEditor
                node={selectedNode}
              />
            ) : (
              <div className="h-full flex flex-col mt-[2rem] items-center justify-center p-10 text-center">
                <div className="text-5xl mb-4 opacity-30">
                  {viewMode === "vertical" ? "🌳" : "📋"}
                </div>
                <h3 className="m-0 mb-2 text-[#a0a0a0] font-semibold">Select a Route</h3>
                <p className="m-0 text-sm text-[#888] max-w-[80%]">
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