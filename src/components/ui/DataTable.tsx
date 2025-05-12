'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FiChevronDown, FiChevronUp, FiSearch, FiFilter, FiX } from 'react-icons/fi';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  rowClassName?: string | ((row: T) => string);
  isLoading?: boolean;
}

export default function DataTable<T>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  pagination = true,
  pageSize = 10,
  className,
  emptyState,
  onRowClick,
  rowClassName,
  isLoading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = searchable && searchQuery
    ? data.filter((row) => {
        return searchKeys.some((key) => {
          const value = row[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchQuery);
          }
          return false;
        });
      })
    : data;

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aValue = typeof columns.find(col => 
          col.accessorKey === sortColumn)?.accessorKey === 'function'
          ? (columns.find(col => col.accessorKey === sortColumn)?.accessorKey as any)(a)
          : a[sortColumn as keyof T];
        const bValue = typeof columns.find(col => 
          col.accessorKey === sortColumn)?.accessorKey === 'function'
          ? (columns.find(col => col.accessorKey === sortColumn)?.accessorKey as any)(b)
          : b[sortColumn as keyof T];

        if (aValue === bValue) return 0;
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      })
    : filteredData;

  // Paginate data
  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  // Handle sort
  const handleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }

    if (typeof column.accessorKey === 'function') {
      return column.accessorKey(row);
    }

    return row[column.accessorKey] as ReactNode;
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700', className)}>
      {/* Table header with search */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={clearSearch}
              >
                <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    'px-6 py-3 font-medium',
                    column.sortable && 'cursor-pointer select-none',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.accessorKey as keyof T)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.accessorKey && (
                      <span>
                        {sortDirection === 'asc' ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse bg-gray-50 dark:bg-gray-800">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              // Data rows
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    typeof rowClassName === 'function' ? rowClassName(row) : rowClassName,
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={cn('px-6 py-4', column.className)}>
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiFilter className="w-8 h-8 mb-2" />
                      <p className="text-lg font-medium">No data found</p>
                      {searchQuery && (
                        <p className="text-sm mt-1">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage > 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              )}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <button
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                currentPage < totalPages
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              )}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
