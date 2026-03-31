'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return; }
    if ((session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard'); return; }
    fetchStats();
  }, [status, session]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  if (isLoading) return <div className="container-app py-8"><div className="skeleton h-10 w-48 mb-8"/><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="card p-6"><div className="skeleton h-8 w-16"/></div>)}</div></div>;
  if (!stats) return null;

  const o = stats.overview;
  const statCards = [
    { label: 'Total Users', value: o.totalUsers.toLocaleString(), change: `+${o.newUsersThisMonth} this month`, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'blue' },
    { label: 'Active Jobs', value: o.activeJobs.toLocaleString(), change: `${o.totalJobs} total`, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'green' },
    { label: 'Applications', value: o.totalApplications.toLocaleString(), change: `${o.applicationsThisMonth} this month`, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'purple' },
    { label: 'Revenue', value: `$${o.totalRevenue.toLocaleString()}`, change: `${o.premiumUsers} premium users`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { label: 'Premium Users', value: o.premiumUsers.toLocaleString(), change: `${Math.round((o.premiumUsers / o.totalUsers) * 100) || 0}% conversion`, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', color: 'pink' },
    { label: 'Companies', value: o.totalCompanies.toLocaleString(), change: 'verified', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'indigo' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600', amber: 'bg-amber-50 text-amber-600',
    pink: 'bg-pink-50 text-pink-600', indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="container-app py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/users" className="btn btn-secondary btn-sm">Manage Users</Link>
          <Link href="/admin/jobs" className="btn btn-secondary btn-sm">Manage Jobs</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[s.color]}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon}/></svg>
              </div>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <p className="text-xs text-gray-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts data summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User Growth (6 months)</h3>
          <div className="space-y-2">
            {stats.charts.userGrowth.map((item: any) => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(5, (item.count / Math.max(...stats.charts.userGrowth.map((g: any) => g.count))) * 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Jobs by Type</h3>
          <div className="space-y-3">
            {stats.charts.jobsByType.map((item: any) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.type.replace('_', ' ')}</span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
          <h3 className="font-semibold text-gray-900 mb-4 mt-6">Applications by Status</h3>
          <div className="space-y-3">
            {stats.charts.applicationsByStatus.map((item: any) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.status}</span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
