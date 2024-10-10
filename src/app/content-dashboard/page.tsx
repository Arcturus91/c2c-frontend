import React from "react";
import DashboardTable from "./components/DashboardTable";

const ContentDashboard: React.FC = () => {
  return (
    <div className="container-dashboard mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Content Dashboard
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <DashboardTable />
      </div>
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Generate New Content
        </button>
      </div>
    </div>
  );
};

export default ContentDashboard;
