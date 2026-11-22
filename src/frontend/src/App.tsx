import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import GamePage from "./pages/GamePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MainMenuPage from "./pages/MainMenuPage";
import ResultsPage from "./pages/ResultsPage";
import ShopPage from "./pages/ShopPage";
import StoryPage from "./pages/StoryPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  ),
});

// Pathless layout route: everything except /play gets the neon shell + top bar.
const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const menuRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/",
  component: MainMenuPage,
});
const resultsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/results",
  component: ResultsPage,
});
const shopRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/shop",
  component: ShopPage,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});
const storyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/story",
  component: StoryPage,
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play",
  component: GamePage,
});

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    menuRoute,
    resultsRoute,
    shopRoute,
    leaderboardRoute,
    storyRoute,
  ]),
  playRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
