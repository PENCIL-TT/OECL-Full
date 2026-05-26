
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import OverviewPage from "./dashboard/Overview";
import ShipmentsPage from "./dashboard/Shipments";
import DocumentsPage from "./dashboard/Documents";
import PaymentsPage from "./dashboard/Payments";
import SettingsPage from "./dashboard/Settings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && <OverviewPage />}
            {activeTab === "shipments" && <ShipmentsPage />}
            {activeTab === "documents" && <DocumentsPage />}
            {activeTab === "payments" && <PaymentsPage />}
            {activeTab === "settings" && <SettingsPage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
