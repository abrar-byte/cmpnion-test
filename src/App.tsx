import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/pages/AuthPages/SignIn";
import NotFound from "@/pages/OtherPage/NotFound";
import AppLayout from "@/layout/AppLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Dashboard/Home";
import Orders from "@/pages/Dashboard/Orders";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}
