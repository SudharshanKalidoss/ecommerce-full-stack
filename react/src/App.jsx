import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TailwindTest from "./pages/TailwindTest";
import Home from "./pages/Home";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminProductCreate from "./pages/AdminProductCreate";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminUsers from "./pages/AdminUsers";
import AdminContact from "./pages/AdminContact";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />   {/* default */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contract" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductCreate />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/test" element={<TailwindTest />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;