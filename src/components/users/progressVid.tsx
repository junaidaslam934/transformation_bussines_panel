"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
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

const ProgressVideos = () => {
  const [activeTab, setActiveTab] = useState('Videos');
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const userIdFromUrl = (searchParams.get('userId') || (params as any)?.id || '') as string;
  const [groups, setGroups] = useState<IUserAssetGroupByDate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokenByUrl, setBrokenByUrl] = useState<Record<string, boolean>>({});
  const [durationByUrl, setDurationByUrl] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!userIdFromUrl) return;
      try {
        setLoading(true);
        setError(null);
        const res = await UserService.getUserAssets({ userId: userIdFromUrl, assetType: 'VIDEO', page: 1, limit: 20 });
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
          .map(a => ({ img: a.assetUrl, date: new Date(a.createdAt).toLocaleDateString(), duration: '00:00' })),
      }))
      .filter(g => g.items.length > 0);
  }, [groups, search]);

  const formatVideoDuration = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="bg-white p-6  border border-[#eee] w-full">
      <div style={{ padding: 24 }}>
        {/* Tabs and Search */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              key="Photos"
              onClick={() => router.push(`/user-management/progress-pictures${userIdFromUrl ? `?userId=${userIdFromUrl}` : ''}`)}
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
              Photos
            </button>
            <button
              key="Videos"
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#F5CBA7',
                color: '#222',
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
        {!loading && !error && filteredGroups.map(section => {
          let items: (typeof section.items[0] | null)[] = [...section.items];
          if (!isMobile) {
            const emptySlots = 6 - items.length;
            for (let i = 0; i < emptySlots; i++) {
              items.push(null);
            }
          }
          return (
            <div key={section.date} style={{ marginBottom: 32 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{section.date}</div>
              <div
                className="progress-videos-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(6, 1fr)',
                  gap: 16,
                  justifyItems: 'center',
                }}
              >
                {items.map((item, idx) =>
                  item ? (
                    <Card key={idx} className="relative overflow-hidden p-0" style={{ minHeight: 320, width: '100%', maxWidth: 260, border: 'none', boxShadow: 'none' }}>
                      {!brokenByUrl[item.img] ? (
                        <video
                          src={item.img}
                          muted
                          playsInline
                          preload="metadata"
                          poster="/assets/images/progresspic1.png"
                          onLoadedMetadata={e => {
                            const el = e.currentTarget as HTMLVideoElement;
                            const duration = formatVideoDuration(el.duration);
                            setDurationByUrl(prev => ({ ...prev, [item.img]: duration }));
                          }}
                          onError={() => {
                            setBrokenByUrl(prev => ({ ...prev, [item.img]: true }));
                          }}
                          style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', backgroundColor: '#000' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: 320, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 12, opacity: 0.85 }}>Video unavailable</span>
                        </div>
                      )}
                      {/* Overlays */}
                      <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                        {item.date}
                      </div>
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>
                        {durationByUrl[item.img] || '00:00'}
                      </div>
                    </Card>
                  ) : (
                    !isMobile && <div key={idx} style={{ minHeight: 320, width: '100%', maxWidth: 260 }} />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @media (max-width: 1200px) {
          .progress-videos-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .progress-videos-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .progress-videos-grid > :global(.relative) {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
};

export default ProgressVideos;
