import React, { useState, useMemo, useEffect } from "react";
import type { RouteConfig, VisualRouteNode } from "../../utils/type";
import { buildRouteGraph } from "./buildGraphRoute";
import { ListContainer } from "./list/ListContainer";
import { RouteTree } from "./tree/RouteTree";
import { RouteEditor } from "./RouteEditor";
import Logo from "../../asset/logo.jpg";
import { RouteSimulationTable } from "./simulate/RouteSimulationTable";
import RouteMountPanel from "./mount/RouteMountPanel";
import type { RouteTiming } from "../../utils/type";
import IssuesPanel from "./issues/issues";

import {
  FaChevronLeft,
  FaChevronRight,
  FaSitemap,
  FaList,
  FaPlayCircle,
  FaHeartbeat,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  routesUseRoles,
  buildScenarios,
  simulateRoutes,
  processSimulationResults,
} from "./simulate/functions";

type Props = {
  routes: RouteConfig[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
};

type ViewMode = "vertical" | "tree" | "simulate" | "mount" | "issues";

// Local storage keys
const STORAGE_KEYS = {
  VIEW_MODE: "routekeeper_view_mode",
  PANEL_STATE: "routekeeper_panel_state",
};

export const RouteKeeperVision: React.FC<Props> = ({
  routes,
  timingRecords,
  setTimingRecords,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as ViewMode) || "vertical";
  });

  const [openPanel, setOpenPanel] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PANEL_STATE);
    return saved ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PANEL_STATE, JSON.stringify(openPanel));
  }, [openPanel]);

  const togglePanel = () => setOpenPanel((prev) => !prev);

  // Simulation logic
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

  // Extract all unique route paths
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

  // For vertical view
  const [graph] = useState(() => buildRouteGraph(routes));
  const [selectedNode, setSelectedNode] = useState<VisualRouteNode | null>(
    null
  );

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "simulate" || mode === "mount") {
      setSelectedNode(null);
    }
  };

  // For vertical view only
  const handleNodeSelect = (node: VisualRouteNode) => {
    setSelectedNode(node);
  };

  const condition =
    openPanel &&
    viewMode !== "mount" &&
    viewMode !== "issues" &&
    viewMode !== "simulate";
  const keepWidth =
    viewMode !== "mount" && viewMode !== "issues" && viewMode !== "simulate";

  return (
    <div className="font-['Fira_Code','JetBrains_Mono','Source_Code_Pro','Roboto_Mono',monospace] h-screen flex flex-col bg-[#0f0f12] text-[#e0e0e0] font-medium text-sm leading-relaxed">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1f] sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="" className="h-8 w-8 rounded-lg" />
          <h2 className="m-0 text-white font-semibold text-lg">
            RouteKeeper Vision
          </h2>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-3">
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "vertical"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-[#64b5f6] font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("vertical")}
              title="Vertical Tree View"
            >
              Tree Diagram
              <FaSitemap className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "tree"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-[#64b5f6] font-semibold shadow-md "
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("tree")}
              title="Tree View"
            >
              List View
              <FaList className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "simulate"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-[#64b5f6] font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("simulate")}
              title="Simulation View"
            >
              Simulation
              <FaPlayCircle className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "mount"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-[#64b5f6] font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("mount")}
              title="Mount View"
            >
              Mount test
              <FaHeartbeat className="mode-icon" />
            </button>
            <button
              className={`p-3 flex items-center gap-2 border border-[#4a4a55] rounded-lg relative transition-all duration-200 ${
                viewMode === "issues"
                  ? "bg-gradient-to-br from-[#3a3a45] to-[#2a2a35] text-[#64b5f6] font-semibold shadow-md"
                  : "hover:bg-[#353540] hover:text-gray-300 text-[#a0a0a0] hover:shadow-md hover:border-[#5a5a65]"
              }`}
              onClick={() => handleViewModeChange("issues")}
              title="Issues View"
            >
              Issues
              <FaExclamationCircle className="mode-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: MAIN CONTENT */}
        <div
          className={`bg-[#1a1a1f] relative transition-all duration-300 ease-in-out overflow-hidden ${
            condition ? "w-[calc(100%-24rem)]" : "w-full"
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
              />
            ) : viewMode === "issues" ? (
              <IssuesPanel />
            ) : (
              <RouteTree
                routes={graph}
                selectedNodeId={selectedNode?.id}
                onSelect={handleNodeSelect}
              />
            )}
          </div>
        </div>

        {/* RIGHT: EDITOR PANEL */}
        <div
          className={`flex-shrink-0 bg-[#1a1a1f] overflow-y-auto transition-all duration-300 ease-in-out border-l border-[#2a2a2a] ${
            condition
              ? "w-96 opacity-100 shadow-lg"
              : `${keepWidth ? "w-[4rem] opacity-100" : "w-[0rem] opacity-0"}`
          }`}
        >
          <div
            className={`
              flex items-center justify-between py-3 px-3
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
                title={`View mode: ${
                  viewMode === "vertical" ? "Tree" : "List"
                }`}
              >
                {viewMode === "vertical" ? "🌳" : "📋"}
              </div>
            )}
          </div>

          <div className={`${condition ? "block" : "hidden"}`}>
            {selectedNode ? (
              <RouteEditor
                node={selectedNode}
                onUpdate={(updatedNode) => {
                  handleNodeSelect(updatedNode);
                }}
              />
            ) : (
              <div className="h-full flex flex-col mt-[2rem] items-center justify-center p-10 text-center">
                <div className="text-5xl mb-4 opacity-30">
                  {viewMode === "vertical" ? "🌳" : "📋"}
                </div>
                <h3 className="m-0 mb-2 text-[#a0a0a0] font-semibold">
                  Select a Route
                </h3>
                <p className="m-0 text-sm text-[#888] max-w-[80%]">
                  Click on any route in the tree to view and edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
