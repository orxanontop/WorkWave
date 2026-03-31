'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchCompanies(); }, [search]);

  const fetchCompanies = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', '20');
      const res = await fetch(`/api/companies?${params}`);
      const data = await res.json();
      if (data.success) {
        setCompanies(data.data.companies);
        setTotal(data.data.pagination.total);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
      <p className="text-gray-500 mb-8">{total} companies hiring on {`JobMarket`}</p>

      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="input pl-10" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="card p-6"><div className="skeleton h-12 w-12 rounded-xl mb-4"/><div className="skeleton h-5 w-32 mb-2"/><div className="skeleton h-4 w-24"/></div>)}</div>
      ) : companies.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="font-semibold text-gray-900 mb-1">No companies found</h3>
          <p className="text-sm text-gray-500">Try a different search term</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`} className="card-hover p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {company.logo ? <img src={company.logo} alt="" className="w-full h-full object-cover"/> : <span className="text-xl font-bold text-gray-400">{company.name[0]}</span>}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                  <p className="text-sm text-gray-500">{company.industry || 'Company'}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {company.city && <span>{company.city}{company.state ? `, ${company.state}` : ''}</span>}
                    <span className="text-primary-600 font-medium">{company._count?.jobs || 0} open jobs</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
