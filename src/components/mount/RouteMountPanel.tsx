import React from "react";
import { SingleTest } from "./SingleTest";
import type { RouteTiming } from "../../../utils/type";

interface RouteMountPanelProps {
  routes: string | unknown[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  testingMode: boolean;
  toggleTestingMode: () => void;
  auth: boolean;
}

export const RouteMountPanel: React.FC<RouteMountPanelProps> = ({
  routes,
  timingRecords,
  setTimingRecords,
  testingMode,
  toggleTestingMode,
  auth
}) => {

  const handleTest = () => {
    toggleTestingMode();
  };

  return (
    <div className="rk-bg-[#1a1a1f] rk-min-h-screen rk-p-6">
      <div className="rk-flex rk-items-center rk-justify-between rk-mb-6">
        <h1 className="rk-text-2xl rk-font-semibold rk-text-[#e0e0e0]">
          Route Performance Testing
        </h1>
        
        <button
          onClick={handleTest}
          className="rk-px-4 rk-py-2 rk-bg-[#2a2a35] rk-border rk-border-[#3a3a45] rk-text-[#e0e0e0] rk-rounded-lg rk-cursor-pointer rk-text-sm rk-font-medium rk-transition-all rk-duration-200 hover:rk-bg-[#3a3a45] hover:rk-border-[#4a4a55] hover:rk--translate-y-0.5 active:rk-translate-y-0 rk-flex rk-items-center rk-gap-2"
        >
          {testingMode ? (
            <>
              <svg 
                className="rk-w-4 rk-h-4" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6 14.586l9.293-9.293a1 1 0 011.414 0z" 
                  clipRule="evenodd"
                />
              </svg>
              Disable Testing Mode
            </>
          ) : (
            <>
              <svg 
                className="rk-w-4 rk-h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Enable Testing Mode
            </>
          )}
        </button>
      </div>

      {/* Auth/Unauth Banner */}
      <div className="rk-mb-6 rk-p-4 rk-bg-[#2a2a35] rk-border rk-border-[#3a3a45] rk-rounded-lg rk-text-sm">
        <div className="rk-flex rk-items-start rk-gap-3">
          <div className="rk-mt-0.5 rk-flex-shrink-0">
            <svg 
              className="rk-w-5 rk-h-5 rk-text-yellow-400" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="rk-font-medium rk-text-[#e0e0e0] rk-mb-1">
              Important: Authentication Context Affects Route Mounting.
              Public and Private Redirect are currently not accounted for.
            </p>
            <p className="rk-text-[#a0a0a0]">
              {auth ? (
                <>You are currently <span className="rk-text-green-400 rk-font-medium">authenticated</span>. 
                Public routes (login, register, etc.) will automatically redirect without mounting, 
                so they won't show timing records. Private routes will mount normally.</>
              ) : (
                <>You are currently <span className="rk-text-red-400 rk-font-medium">unauthenticated</span>. 
                Private routes will automatically redirect without mounting, 
                so they won't show timing records. Public routes will mount normally.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {testingMode ? (
        <SingleTest
          timingRecords={timingRecords}
          routes={routes}
          setTimingRecords={setTimingRecords}
          testingMode={testingMode}
          toggleTestingMode={toggleTestingMode}
        />
      ) : (
        <div className="rk-bg-[#2a2a35] rk-border rk-border-[#3a3a45] rk-rounded-xl rk-p-8 rk-text-center">
          <div className="rk-flex rk-flex-col rk-items-center rk-justify-center rk-space-y-4">
            <div className="rk-w-16 rk-h-16 rk-rounded-full rk-bg-[#1a1a1f] rk-border rk-border-[#3a3a45] rk-flex rk-items-center rk-justify-center">
              <svg 
                className="rk-w-8 rk-h-8 rk-text-[#e0e0e0]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="rk-text-xl rk-font-medium rk-text-[#e0e0e0]">
              Testing Mode is Disabled
            </h2>
            <p className="rk-text-[#a0a0a0] rk-max-w-md">
              Enable testing mode to render the component and start performance testing.
              This prevents accidental test runs and saves resources.
            </p>
            <button
              onClick={toggleTestingMode}
              className="rk-mt-4 rk-px-6 rk-py-3 rk-bg-purple-600 rk-border rk-border-blue-700 rk-text-white rk-rounded-lg rk-cursor-pointer rk-text-sm rk-font-medium rk-transition-all rk-duration-200 hover:rk-bg-blue-700 hover:rk-border-blue-800 hover:rk--translate-y-0.5 active:rk-translate-y-0 rk-flex rk-items-center rk-gap-2"
            >
              <svg 
                className="rk-w-4 rk-h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Enable Testing Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMountPanel;