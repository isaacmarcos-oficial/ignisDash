import { Sidebar } from "./components/sidebar";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <div className="flex flex-1 m-w-[1480px] gap-12  mx-auto">
      <Sidebar />
      <AppRoutes/>
    </div>
  );
}
