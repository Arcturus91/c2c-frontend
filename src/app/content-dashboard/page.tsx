import React from "react";
import DashboardTable from "./components/DashboardTable";

const ContentDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Dashboard</h1>
      <DashboardTable />
    </div>
  );
};

export default ContentDashboard;
