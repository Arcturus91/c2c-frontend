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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-dashboard-info`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Error fetching dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl" />
        <p className="ml-2">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Article ID</th>
            <th className="px-4 py-2">Audience</th>
            <th className="px-4 py-2">Content Type</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Funnel Stage</th>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Object URL</th>
            <th className="px-4 py-2">Temperature</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.articleId} className="border-b">
              <td className="px-4 py-2">{item.articleId}</td>
              <td className="px-4 py-2">{item.audience}</td>
              <td className="px-4 py-2">{item.contentType}</td>
              <td className="px-4 py-2">
                {new Date(item.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2">{item.funnelStage}</td>
              <td className="px-4 py-2">{item.model}</td>
              <td className="px-4 py-2">
                <a
                  href={item.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              </td>
              <td className="px-4 py-2">{item.temperature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
