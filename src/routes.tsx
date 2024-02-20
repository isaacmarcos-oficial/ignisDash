import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Blog } from "./pages/blog";
import { PostCreate } from "./pages/blog/postCreate";
import { Users } from "./pages/users";
import { Courses } from "./pages/courses";
import { Post } from "./pages/blog/[slug]";
import { UserInfo } from "./pages/users/[slug]";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/blog" element={<Blog/>} />
        <Route path="/blog/:slug" element={<Post/>} />
        <Route path="/blog/create" element={<PostCreate/>} />

        <Route path="/users" element={<Users/>} />
        <Route path="/users/:slug" element={<UserInfo/>} />

        <Route path="/cursos" element={<Courses/>} />
      </Routes>
    </Router>
  )
}