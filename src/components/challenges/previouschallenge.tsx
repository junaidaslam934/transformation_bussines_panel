"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Pagination from "../common/pagination"; // Import the reusable pagination component
import { useChallenges } from "@/hooks/useChallenges";
import { IActiveChallenge } from "@/types/api";

// TDOD Function type
// TODO Use all colors from tailwind config/ globally 
//  TODO make pagination reusable 
const PreviousChallenges = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { challenges: apiChallenges, loading, error } = useChallenges();

  // Transform API data to component format
  const transformedChallenges = apiChallenges.map((challenge: IActiveChallenge) => ({
    name: challenge.title,
    startDate: new Date(challenge.startDate).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    endDate: new Date(challenge.endDate).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }),
    winner: 'No winner', // Winner data not available in current API
  }));

  const totalPages = Math.ceil(transformedChallenges.length / itemsPerPage);
  const paginatedChallenges = transformedChallenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <span className="ml-3 text-gray-600">Loading challenges...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-sm text-red-500">Failed to load challenges</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 pt-6">Challenge</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 pt-6">Start Date</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 pt-6">End Date</TableHead>
                <TableHead className="px-6 py-4 text-left text-sm font-semibold text-gray-700 pt-6">Winner</TableHead>
              </TableRow>
            </TableHeader>

                         <TableBody>
               {paginatedChallenges.map((challenge: any, index: number) => (
                <TableRow
                  key={index}
                  className={`hover:bg-gray-50 bg-white ${index !== 0 ? "border-t border-gray-200" : ""}`}
                >
                  <TableCell className="px-6 py-6 text-gray-500">{challenge.name}</TableCell>
                  <TableCell className="px-6 py-6 text-gray-600">{challenge.startDate}</TableCell>
                  <TableCell className="px-6 py-6 text-gray-600">{challenge.endDate}</TableCell>
                  <TableCell className="px-6 py-6 text-gray-600">{challenge.winner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}


        {/* Replace the old pagination with the reusable Pagination component */}
    
      </div>
      {!loading && !error && transformedChallenges.length > 0 && (
      <div className="p-6 border-t border-gray-200 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={transformedChallenges.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemName="challenges"
            showInfo={false}
            className="mt-0"
          />
        </div>
      )}
    </div>
  );
};

export default PreviousChallenges;
