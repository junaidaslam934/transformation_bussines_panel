"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import Pagination from "../common/pagination"

import {
  Search, Filter, MoreVertical, Edit3, Trash2, Eye,
  ChevronDown, ChevronUp, Users, Calendar, Mail, UserCheck
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import {userData,SortConfig} from "../../utils/Userinfo";
import { IUser } from "@/types/api";
import UserService from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import ICONS from '@/assets/icons';

const UserTable = () =>  {

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);


// Fetch users data
const fetchUsers = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await UserService.getUsers(currentPage, itemsPerPage);
    setUsers(response.data);
    setTotalUsers(response.total);
  } catch (err) {
    setError('Failed to fetch users');
    console.error('Error fetching users:', err);
  } finally {
    setLoading(false);
  }
};

// Fetch users on component mount and when page changes
useEffect(() => {
  fetchUsers();
}, [currentPage, itemsPerPage]);

// Reset to page 1 when search term or filter changes
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, filterType]);

// Transform API data to match the expected format
const transformedUserData = users.map((user, index) => ({
  id: index + 1,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  advisor: user.advisorDetails ? `${user.advisorDetails.firstName} ${user.advisorDetails.lastName}` : '-',
  joinDate: new Date(user.createdAt).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }),
  role: user.role,
  avatar: user.firstName.charAt(0).toUpperCase()
}));


 // Client-side filtering for search and role filters
 const filteredData = transformedUserData.filter((user: any) => {
   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.advisor.toLowerCase().includes(searchTerm.toLowerCase());

   const matchesFilter = filterType === 'all' ||
     (filterType === 'admin' && user.role === 'ADMIN') ||
     (filterType === 'user' && user.role === 'USER') ||
     (filterType === 'advisor' && user.role === 'ADVISOR') ||
     (filterType === 'with-advisor' && user.advisor !== '-') ||
     (filterType === 'without-advisor' && user.advisor === '-');

   return matchesSearch && matchesFilter;
 });

 // Use the filtered data directly since we're doing server-side pagination
 const paginatedData = filteredData;

function ActionDropdown({ userId, userData }: { userId: number; userData: any }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      // Find the actual user from the users array
      const actualUser = users.find(u => `${u.firstName} ${u.lastName}` === userData.name);
      if (actualUser) {
        await UserService.deleteUser(actualUser._id);
        // Refresh the users list
        fetchUsers();
      }
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleting(false);
    }
  };

    useEffect(() => {
      if (activeDropdown !== userId) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown, userId]);

    return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setActiveDropdown(prev => (prev === userId ? null : userId))}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="More actions"
        >
          <MoreVertical size={16} className="text-gray-500" />
        </button>

        {activeDropdown === userId && (
          <div className="absolute right-0 mt-1 w-40 bg-gray-100 dark:bg-gray-800 rounded-[7px] shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <Button
              className="w-full px-4 py-3 text-left text-sm font-light hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-start gap-2 rounded-t-lg border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                const actualUser = users.find(u => `${u.firstName} ${u.lastName}` === userData.name);
                if (actualUser) {
                  router.push(`/user-management/user-details-info/${actualUser._id}`);
                }
              }}
            >
              View
            </Button>
            <Button          
              className="w-full px-4 py-3 text-left text-sm font-light hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-start gap-2 border-b border-gray-200 dark:border-gray-600"
              onClick={() => {
                const actualUser = users.find(u => `${u.firstName} ${u.lastName}` === userData.name);
                if (actualUser) {
                  router.push(`/user-management/user-edit/${actualUser._id}`);
                }
              }}
            >
              Edit
            </Button>
            <Button
              className="w-full px-4 py-3 text-left text-sm font-light text-destructive dark:hover:bg-red-900 flex items-center justify-start gap-2 rounded-b-lg"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-[340px] !rounded-[2rem] p-6 text-center shadow-lg border-0 bg-white" hideClose>
          <div className="flex flex-col items-center  justify-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
              <img src={ICONS.question} alt="question" className="w-10 h-10" />
            </div>
            <DialogTitle className="font-adelle text-[17px] font-medium text-gray-800">Are you sure</DialogTitle>
            <DialogDescription className="mb-7 text-lightGray text-base">Do you want to Delete this user?</DialogDescription>
            <div className="flex gap-3 w-full">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1 py-2 rounded-[7px] border border-black bg-white text-black font-semibold shadow-none">Cancel</Button>
              </DialogClose>
              <Button 
                className="flex-1 py-2 rounded-[7px] bg-lightBrown text-black font-bold hover:bg-lightBrown border-none shadow-none"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
    </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

  return (
      <div>
          <main className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header with integrated search */}
        <div className="mb-6 pl-4 pt-3">
        <div className="flex flex-col gap-4">
            {/* Top row with title and search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1
  className="font-bold flex items-center gap-2 text-[20px] leading-[100%] tracking-[0] mb-[2px] text-gray-900 dark:text-white"
  style={{ fontFamily: 'Adelle, serif' }}
>
  {loading ? 'Loading...' : `${totalUsers} Users`}
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pr-4">
                {/* Compact Search Bar */}
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
  <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-9 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[5px] focus:outline-none"
                />
</div>
              </div>
            </div>
          </div>
        </div>
        {/* TODO use shadcn table and butoons */}
        {/* Table Container with horizontal scrolling for all screen sizes */}
<div className="bg-white dark:bg-gray-900 px-0 pt-2 sm:pt-1 lg:pt-4">
  <div className="overflow-x-auto scrollbar-hide lg:min-h-[384px]">
  <table className="w-full min-w-[600px] sm:min-w-[800px] border-b border-gray-200 dark:border-gray-700">

   <thead className="bg-white dark:bg-gray-700">
              <tr>
              <th className="px-6 py-3 text-left min-w-[200px]">User</th>
   
    <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Assigned Advisor</th>
                <th className="px-4 py-3 text-left">Joining Date</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

<TableBody className="bg-white dark:bg-gray-800 w-full">
  {loading ? (
    <TableRow>
      <TableCell colSpan={6} className="px-4 py-8 text-center text-sm text-lightGray dark:text-gray-400">
        <span className="px-6">Loading users...</span>
      </TableCell>
    </TableRow>
  ) : error ? (
    <TableRow>
      <TableCell colSpan={6} className="px-4 py-8 text-center text-sm text-red-500 dark:text-red-400">
        <span className="px-6">{error}</span>
      </TableCell>
    </TableRow>
  ) : paginatedData.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} className="px-4 py-4 text-center text-sm text-lightGray dark:text-gray-400">
        <span className="px-6">No users found</span>
      </TableCell>
    </TableRow>
  ) : (
    paginatedData.map((user) => (
      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700">
        <TableCell className="px-6 py-4 whitespace-nowrap text-left">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-lightBrown rounded-full flex items-center justify-center text-black-800 font-medium">
              {user.avatar}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-lightGray dark:text-white">{user.name}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-4 whitespace-nowrap text-left text-sm text-lightGray dark:text-gray-400">
          <span className="truncate">{user.email}</span>
        </TableCell>
        <TableCell className="px-4 py-4 whitespace-nowrap text-left text-sm text-lightGray dark:text-white">
          {user.advisor === '-' ? (
            <span className="text-gray-400"> --</span>
          ) : (
            <span className="truncate">{user.advisor}</span>
          )}
        </TableCell>
        <TableCell className="px-4 py-4 whitespace-nowrap text-left text-sm text-lightGray dark:text-gray-300">
          <span>{user.joinDate}</span>
        </TableCell>
        <TableCell className="px-4 py-4 whitespace-nowrap text-left text-lightGray">
          <span>{user.role}</span>
        </TableCell>
        <TableCell className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center items-center">
          <ActionDropdown userId={user.id} userData={user} />
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
          </table>
        </div>
      </div>



</main>
<div className="flex justify-end w-full mt-2">
  <Pagination
    currentPage={currentPage}
    totalPages={Math.ceil(totalUsers / itemsPerPage)}
    totalItems={totalUsers}
    itemsPerPage={itemsPerPage}
    onPageChange={setCurrentPage}
    itemName="results"
    showInfo={false}
  />
        </div>
        {/* Pagination using reusable component */}
        
    </div>
  );
};

export default UserTable;
