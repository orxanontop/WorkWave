'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return; }
    if ((session?.user as any)?.role !== 'ADMIN') { router.push('/dashboard'); return; }
  }, [status, session]);

  useEffect(() => {
    if ((session?.user as any)?.role === 'ADMIN') fetchUsers();
  }, [search, roleFilter, page, session]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: page.toString(), limit: '20' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.success) { setUsers(data.data.users); setTotal(data.data.pagination.total); }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const toggleUser = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !isActive }),
      });
      if (res.ok) { fetchUsers(); toast.success('User updated'); }
    } catch (err) { toast.error('Failed to update'); }
  };

  return (
    <div className="container-app py-8">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">Admin</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">Users</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users ({total})</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by email or name..." className="input flex-1" />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input w-auto">
          <option value="">All Roles</option>
          <option value="JOB_SEEKER">Job Seekers</option>
          <option value="EMPLOYER">Employers</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Applications</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1,2,3,4,5].map(i => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-5 w-full"/></td></tr>)
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.profile?.firstName} {user.profile?.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${user.role === 'ADMIN' ? 'badge-danger' : user.role === 'EMPLOYER' ? 'badge-primary' : user.role === 'RECRUITER' ? 'badge-warning' : 'badge-gray'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${user.subscriptionStatus === 'ACTIVE' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        {user.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user._count?.applications || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUser(user.id, user.isActive)}
                        className={`btn btn-sm ${user.isActive ? 'btn-ghost text-red-600' : 'btn-secondary text-green-600'}`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn btn-secondary btn-sm">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total/20)}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total/20)} className="btn btn-secondary btn-sm">Next</button>
        </div>
      )}
    </div>
  );
}
