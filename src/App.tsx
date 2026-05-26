import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Services from "./pages/Services";
import AirFreight from "./pages/services/AirFreight";
import OceanFreight from "./pages/services/OceanFreight";
import Warehousing from "./pages/services/Warehousing";
import CustomsClearance from "./pages/services/CustomsClearance";
import LinerAgency from "./pages/services/LinerAgency";
import LiquidCargo from "./pages/services/LiquidCargo";
import ProjectCargo from "./pages/services/ProjectCargo";
import ThirdPartyLogistics from "./pages/services/ThirdPartyLogistics";
import Consolidation from "./pages/services/Consolidation";
import ServiceDetail from "./pages/ServiceDetail";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ThailandContact from "./pages/ThailandContact";
import AboutUs from "./pages/aboutus";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BlogAdmin from "./pages/BlogAdmin";
import BlogEditor from "./pages/BlogEditor";
import NotFound from "./pages/NotFound";
import IndiaHome from "./pages/IndiaHome";
import IndonesiaHome from "./pages/IndonesiaHome";
import MalaysiaHome from "./pages/MalaysiaHome";
import ThailandHome from "./pages/ThailandHome";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NewsDetailPage from "./pages/NewsDetailPage";
import Blog from "./pages/Blog";
import BlogDetail from "./components/BlogDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CountryRedirect from "./components/CountryRedirect";
import GlobalPresence from "./pages/GlobalPresence";
import SEOManager from "./components/SEOManager";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SEOManager />
            <CountryRedirect />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/air-freight" element={<AirFreight />} />
              <Route path="/services/ocean-freight" element={<OceanFreight />} />
              <Route path="/services/warehousing" element={<Warehousing />} />
              <Route path="/services/customs-clearance" element={<CustomsClearance />} />
              <Route path="/services/liner-agency" element={<LinerAgency />} />
              <Route path="/services/liquid-cargo" element={<LiquidCargo />} />
              <Route path="/services/project-cargo" element={<ProjectCargo />} />
              <Route path="/services/3pl" element={<ThirdPartyLogistics />} />
              <Route path="/services/consolidation" element={<Consolidation />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
             <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
            } />
              <Route path="/blog-admin" element={<BlogAdmin />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/global-presence" element={<GlobalPresence />} />

              {["india", "indonesia", "malaysia", "home", "thailand", "singapore"].flatMap(country => [
                <Route key={`${country}-services`} path={`/${country}/services`} element={<Services />} />,
                <Route key={`${country}-air-freight`} path={`/${country}/services/air-freight`} element={<AirFreight />} />,
                <Route key={`${country}-ocean-freight`} path={`/${country}/services/ocean-freight`} element={<OceanFreight />} />,
                <Route key={`${country}-warehousing`} path={`/${country}/services/warehousing`} element={<Warehousing />} />,
                <Route key={`${country}-customs-clearance`} path={`/${country}/services/customs-clearance`} element={<CustomsClearance />} />,
                <Route key={`${country}-liner-agency`} path={`/${country}/services/liner-agency`} element={<LinerAgency />} />,
                <Route key={`${country}-liquid-cargo`} path={`/${country}/services/liquid-cargo`} element={<LiquidCargo />} />,
                <Route key={`${country}-project-cargo`} path={`/${country}/services/project-cargo`} element={<ProjectCargo />} />,
                <Route key={`${country}-3pl`} path={`/${country}/services/3pl`} element={<ThirdPartyLogistics />} />,
                <Route key={`${country}-consolidation`} path={`/${country}/services/consolidation`} element={<Consolidation />} />,
                <Route key={`${country}-slug`} path={`/${country}/services/:slug`} element={<ServiceDetail />} />,
                <Route key={`${country}-about-us`} path={`/${country}/about-us`} element={<AboutUs />} />,
                <Route key={`${country}-global-presence`} path={`/${country}/global-presence`} element={<GlobalPresence />} />,
                <Route key={`${country}-blogs`} path={`/${country}/blogs`} element={<Blog />} />,
                <Route key={`${country}-privacy-policy`} path={`/${country}/privacy-policy`} element={<PrivacyPolicy />} />,
                <Route key={`${country}-terms`} path={`/${country}/terms-and-conditions`} element={<TermsAndConditions />} />
              ])}

              {["india", "malaysia", "home", "thailand", "singapore"].map(country => (
                <Route key={`contact-${country}`} path={`/${country}/contact`} element={<Contact />} />
              ))}
                 
               
                 <Route path="/gallery" element={<Gallery />} />
                 <Route path="/singapore/gallery" element={<Gallery />} />
                 <Route path="/india/gallery" element={<Gallery />} />
                 <Route path="/malaysia/gallery" element={<Gallery />} />
                 <Route path="/indonesia/gallery" element={<Gallery />} />
                 <Route path="/thailand/gallery" element={<Gallery />} />

                 <Route path="/india/home" element={<IndiaHome />} />
                 <Route path="/india" element={<IndiaHome />} />                                
                 <Route path="/indonesia/home" element={<IndonesiaHome />} />
                 <Route path="/indonesia/contact" element={<ThailandContact />} />  
                 <Route path="/indonesia" element={<IndonesiaHome />} />                              
                 <Route path="/malaysia/home" element={<MalaysiaHome />} />
                 <Route path="/malaysia" element={<MalaysiaHome />} />                                
                <Route path="/thailand/home" element={<ThailandHome />} />
                <Route path="/thailand" element={<ThailandHome />} />
                <Route path="/Singapore/home" element={<ThailandHome />} />
                <Route path="/Singapore" element={<ThailandHome />} />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
