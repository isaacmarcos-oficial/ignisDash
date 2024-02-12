import { Sidebar } from "./components/sidebar";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <div className="flex flex-1 m-w-[1480px] lg:gap-12 sm:gap-2  mx-auto">
      <Sidebar />
      <AppRoutes/>
    </div>
  );
}
