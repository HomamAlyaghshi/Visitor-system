import { useState } from 'react';
import { Search, Filter, X, Users, Building } from 'lucide-react';
import type { Invitation } from '../types';

interface SearchFilterProps {
  invitations: Invitation[];
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusChange: (status: string) => void;
}

export default function SearchFilter({ invitations, searchTerm, statusFilter, onSearchChange, onStatusChange }: SearchFilterProps) {
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [directorateFilter, setDirectorateFilter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);


  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('');
    setDateFilter('all');
    setDirectorateFilter('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter) count++;
    if (dateFilter !== 'all') count++;
    if (directorateFilter) count++;
    return count;
  };


  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">البحث والتصفية</h3>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-500">
            {getActiveFiltersCount()} فلتر نشط
          </span>
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border-gray-300 border rounded-lg hover:bg-gray-50"
          >
            <X className="w-4 h-4 inline ml-1" />
            مسح الكل
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            البحث بالاسم
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن زائر..."
              className="w-full pr-10 pl-3 py-2 border-gray-300 border rounded-lg"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            الحالة
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border-gray-300 border rounded-lg"
          >
            <option value="">جميع الحالات</option>
            <option value="PENDING">في الانتظار</option>
            <option value="CHECKED_IN">تم تسجيل الدخول</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
            التاريخ
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full px-3 py-2 border-gray-300 border rounded-lg"
          >
            <option value="all">جميع التواريخ</option>
            <option value="today">اليوم فقط</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="w-full">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border-gray-300 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 inline ml-2" />
            {showAdvanced ? 'إخفاء المتقدم' : 'عرض المتقدم'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="w-full mt-4 pt-4 border-gray-200 border-t">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                <Building className="w-4 h-4 inline ml-2" />
                الإدارة
              </label>
              <input
                type="text"
                value={directorateFilter}
                onChange={(e) => setDirectorateFilter(e.target.value)}
                placeholder="ابحث عن إدارة..."
                className="w-full px-3 py-2 border-gray-300 border rounded-lg"
              />
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-500 ml-2" />
                <span className="text-sm text-gray-600">
                  إجمالي النتائج: <span className="font-semibold text-gray-900">{invitations.length}</span> دعوة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
