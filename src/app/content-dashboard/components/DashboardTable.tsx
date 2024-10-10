"use client";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

interface DashboardItem {
  articleId: string;
  audience: string;
  contentType: string;
  createdAt: string;
  funnelStage: string;
  model: string;
  objectUrl: string;
  temperature: number;
}

const DashboardTable: React.FC = () => {
  const [data, setData] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-dashboard-info`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary" />
        <p className="ml-4 text-lg text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger p-6 border border-danger rounded bg-red-50">
        <p className="font-bold mb-2">Error:</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-12 text-lg">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="dashboard-table">
        <thead className="bg-gray-100">
          <tr>
            <th>Article ID</th>
            <th>Object URL</th>
            <th>Content Type</th>
            <th>Audience</th>
            <th>Created At</th>
            <th>Funnel Stage</th>
            <th>Model</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr
              key={item.articleId}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td>{item.articleId}</td>
              <td>
                <a
                  href={item.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark hover:underline transition-colors duration-200"
                >
                  View
                </a>
              </td>
              <td>{item.contentType}</td>
              <td>{item.audience}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{item.funnelStage}</td>
              <td>{item.model}</td>

              <td>{item.temperature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
