import { Sidebar } from "./components/sidebar";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <div className="flex m-w-[1480px] lg:gap-12 mx-auto">
      <Sidebar />
      <AppRoutes/>
    </div>
  );
}
