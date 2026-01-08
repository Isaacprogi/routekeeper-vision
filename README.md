# RouteKeeper Vision -RouteKeeper Visual Debugger / Inspector

> _Route visualization, simplified for React._

The **RouteKeeper Vision** is a developer-focused plugin designed to help you
**understand, inspect, and reason about your React Router configuration using routekeeper**.

### Installation

```bash

npm install routekeeper-vision


yarn add routekeeper-vision


pnpm add routekeeper-vision
```

## Setup

This is used with routekeeper

```tsx
import React, { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";

import { RouteKeeper,defineConfig } from "routekeeper";
import { RouteKeeperVision } from "routekeeper-vision";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const userIsLoggedIn = true;
const isLoading = false;

export default function App() {
  const routes = defineConfig([
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
        guestOnly: true,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        protected: true,
      },
    ],
  );

  return (
    <BrowserRouter>
      <RouteKeeper
        routes={routes}
        auth={userIsLoggedIn}
        loading={isLoading}
        visualizer={{
          enabled: true,
          render: () => <RouteKeeperVision routes={routes} />,
        }}
      />
    </BrowserRouter>
  );
}

```

--

## Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. 🍴 Fork it
2. 🌟 Star it (pretty please?)
3. 🔧 Fix it
4. 📤 PR it
5. 🎉 Celebrate!

Please ensure your code follows the existing style and includes clear commit messages.

---

## Documentation

Full docs, examples, and advanced usage are available on the [documentation site](https://github.com/Isaacprogi/routekeeper/docs/).

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Credits

Built by Isaac Anasonye, designed to simplify and standardize routing in React applications.

RouteKeeper – Protecting your routes since 2025!

---

<div align="center">

**Made something awesome with RouteKeeper and RoutekeeperVision?**

[⭐ Star on GitHub](https://github.com/Isaacprogi/routekeeper-vision) |
[📢 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20RouteVision!) |
[💬 Join the Discussion](https://github.com/Isaacprogi/routekeeper-vision/discussions) |
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/isaacanasonye)

</div>
