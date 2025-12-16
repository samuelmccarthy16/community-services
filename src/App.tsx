
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import { CourseProvider } from "@/contexts/CourseContext";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Gallery from "./pages/Gallery";
import Volunteer from "./pages/Volunteer";
import Admin from "./pages/Admin";
import Partners from "./pages/Partners";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import StudentPortal from "./pages/StudentPortal";
import CoursePaymentConfirmation from "./pages/CoursePaymentConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CourseProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/checkout" element={<Checkout />} />
                <Route path="/shop/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/student-portal" element={<StudentPortal />} />
                <Route path="/course-payment-confirmation" element={<CoursePaymentConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CourseProvider>
      </CartProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
