import React from "react";
import DashboardTable from "./components/DashboardTable";

const ContentDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Content Dashboard
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <DashboardTable />
      </div>
    </div>
  );
};

export default ContentDashboard;
