// simulate/functions.ts
import type { RouteConfig, SimulationContext, SimulationResult, RouteOutcome, Scenario } from "../../../utils/type";

export function routesUseRoles(routes: RouteConfig[]): boolean {
  return routes.some((r) =>
    Boolean(
      (r.roles && r.roles.length > 0) ||
      (r.children && routesUseRoles(r.children))
    )
  );
}


export function buildScenarios(hasRoles: boolean, routes: RouteConfig[]) {
  const allRoles = getAllRouteRoles(routes);


  const unauthenticated = [
    {
      label: "Guest",
      auth: false,
      userRoles: [],
    },
  ];

  if (!hasRoles || allRoles.length === 0) {
    return {
      unauthenticated,
      authenticated: [
        {
          label: "User",
          auth: true,
          userRoles: [], // Authenticated but no role
        },
      ],
    };
  }

  // Start with an authenticated user with no roles
 const authenticated: SimulationContext[] = [
  {
    label: "User",
    auth: true,
    userRoles: [], // no roles
  },
  ...allRoles.map((role) => ({
    label: role.charAt(0).toUpperCase() + role.slice(1),
    auth: true,
    userRoles: [role],
  })),
];


  return {
    unauthenticated,
    authenticated,
  };
}


export function simulateRouteDecision(
  route: RouteConfig,
  ctx: SimulationContext,
  inheritedType?: "private" | "public" | "neutral",
  parentRoles: string[] = []
): RouteOutcome {
  const routeType = route.type || inheritedType || "public";
  
  const effectiveRoles =
    route.roles && route.excludeParentRole
      ? route.roles
      : [...new Set([...parentRoles, ...(route.roles ?? [])])];

  const hasRoleAccess =
    effectiveRoles.length === 0 ||
    ctx.userRoles.some((r) => effectiveRoles.includes(r));

  if (route.redirectTo) {
    return { type: "redirect", to: route.redirectTo.pathname };
  }

  if (route.path === "/") {
    return ctx.auth ? { type: "render" } : { type: "fallback" };
  }

  switch (routeType) {
    case "private":
      if (!ctx.auth) return { type: "redirect", to: "/login" };
      if (!hasRoleAccess) return { type: "unauthorized" };
      return { type: "render" };

    case "public":
      if (ctx.auth) return { type: "redirect", to: "/" };
      return { type: "render" };

    case "neutral":
      return { type: "render" };
  }
}

export function simulateRoutes(
  routes: RouteConfig[],
  contexts: SimulationContext[],
  parentPath = "",
  inheritedType?: "private" | "public" | "neutral",
  parentRoles: string[] = []
): SimulationResult[] {
  const results: SimulationResult[] = [];

  for (const route of routes) {
    const fullPath = route.index
      ? parentPath || "(index)"
      : route.path
      ? parentPath + route.path
      : parentPath;

    for (const ctx of contexts) {
      results.push({
        path: fullPath,
        context: ctx,
        outcome: simulateRouteDecision(
          route,
          ctx,
          inheritedType,
          parentRoles
        ),
      });
    }

    const nextRoles =
      route.roles && route.excludeParentRole
        ? route.roles
        : [...new Set([...parentRoles, ...(route.roles ?? [])])];

    if (route.children?.length) {
      results.push(
        ...simulateRoutes(
          route.children,
          contexts,
          fullPath.endsWith("/") ? fullPath : fullPath + "/",
          route.type || inheritedType,
          nextRoles
        )
      );
    }
  }

  return results;
}

export function processSimulationResults(results: SimulationResult[]): Scenario[] {
  const scenarios = new Map<string, Scenario>();
  
  for (const result of results) {
    const key = result.context.label;
    if (!scenarios.has(key)) {
      scenarios.set(key, {
        label: key,
        results: []
      });
    }
    
    const scenario = scenarios.get(key)!;
    
    // Convert outcome to simple access type
    let access: "allow" | "redirect" | "deny" = "allow";
    
    if (result.outcome.type === "redirect" || result.outcome.type === "fallback") {
      access = "redirect";
    } else if (result.outcome.type === "unauthorized") {
      access = "deny";
    }
    
    scenario.results.push({
      route: result.path,
      access
    });
  }
  
  return Array.from(scenarios.values());
}

/**
 * Extract all unique roles from a route tree as a flat array
 */
export function getAllRouteRoles(routes: RouteConfig[] | undefined): string[] {
  if (!Array.isArray(routes)) return []; 
  const rolesSet = new Set<string>();

  const traverse = (routesArray: RouteConfig[]) => {
    for (const route of routesArray) {
      if (route.roles) route.roles.forEach((r) => rolesSet.add(r));
      if (route.children) traverse(route.children);
    }
  };

  traverse(routes);
  return Array.from(rolesSet);
}
