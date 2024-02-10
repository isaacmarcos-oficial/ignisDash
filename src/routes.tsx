import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Blog } from "./pages/blog";
import { PostCreate } from "./pages/blog/postCreate";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/create" element={<PostCreate/>} />
      </Routes>
    </Router>
  )
}