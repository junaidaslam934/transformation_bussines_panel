"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSearchParams, useParams } from 'next/navigation';
import UserService from '@/services/userService';
import { IUserAssetGroupByDate } from '@/types/api';

const progressPics = [
  '/assets/images/progresspic1.png',
  '/assets/images/progresspic2.png',
  '/assets/images/progresspic3.png',
  '/assets/images/progresspic4.png',
];

// API-driven data

const tabs = ['Photos', 'Videos'];

const ProgressPictures = () => {
  const [activeTab, setActiveTab] = useState('Photos');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const userIdFromUrl = searchParams.get('userId') || (params as any)?.id || '';
  const [groups, setGroups] = useState<IUserAssetGroupByDate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!userIdFromUrl) return;
      try {
        setLoading(true);
        setError(null);
        const res = await UserService.getUserAssets({ userId: userIdFromUrl, assetType: 'IMAGE', page: 1, limit: 20 });
        if (res?.success) setGroups(res.data);
        else setGroups([]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load assets');
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userIdFromUrl]);

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    return groups
      .map(g => ({
        date: g._id,
        items: g.assets
          .filter(a => a.assetUrl.toLowerCase().includes(search.toLowerCase()) || g._id.toLowerCase().includes(search.toLowerCase()))
          .map(a => ({ img: a.assetUrl, date: new Date(a.createdAt).toLocaleDateString(), fraction: '' })),
      }))
      .filter(g => g.items.length > 0);
  }, [groups, search]);

  return (
    <div className="bg-white p-6  border border-[#eee] w-full">
      <div style={{ padding: 24 }}>
        {/* Tabs and Search */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              key="Photos"
              onClick={() => {}}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'Photos' ? '#F5CBA7' : '#F5F5F5',
                color: activeTab === 'Photos' ? '#222' : '#555',
                fontWeight: 500,
                cursor: 'pointer',
                marginRight: 8,
              }}
            >
              Photos
            </button>
            <button
              key="Videos"
              onClick={() => router.push(`/user-management/progress-Vid${userIdFromUrl ? `?userId=${userIdFromUrl}` : ''}`)}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                
                border: 'none',
                background: '#F5F5F5',
                color: '#555',
                fontWeight: 500,
                cursor: 'pointer',
                marginRight: 8,
              }}
            >
              Videos
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 300 }}>
            <Input
              placeholder="Search user..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-[5px] bg-white"
            />
          </div>
        </div>
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!loading && !error && filteredGroups.map(section => (
          <div key={section.date} style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{section.date}</div>
            <div
              className="progress-pictures-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 16,
                justifyItems: 'center',
              }}
            >
              {section.items.map((item, idx) => (
                <Card key={idx} className="relative overflow-hidden p-0" style={{ minHeight: 320, width: '100%', maxWidth: 260, border: 'none', boxShadow: 'none' }}>
                  <img
                    src={item.img}
                    alt={item.date}
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.src = '/assets/images/progresspic1.png';
                    }}
                    style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', backgroundColor: '#f0f0f0' }}
                  />
                  {/* Overlays */}
                  <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                    {item.date}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 1200px) {
          .progress-pictures-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .progress-pictures-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .progress-pictures-grid > :global(.relative) {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default ProgressPictures;
