import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  ArrowUpRight, 
  MoreHorizontal,
  Calendar,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const stats = [
    { label: 'Total Posts', value: '24', change: '+12%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Subscribers', value: '1,204', change: '+5.4%', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Views', value: '45.2k', change: '+18%', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const recentPosts = [
    { title: 'The Future of Content Creation', status: 'Published', date: 'Oct 24, 2023', views: '2.4k' },
    { title: '10 Tips for Better SEO', status: 'Draft', date: 'Last edited 2h ago', views: '-' },
    { title: 'Understanding React Hooks', status: 'Scheduled', date: 'Nov 01, 2023', views: '-' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4285F4] to-[#34A853] p-8 md:p-12 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Welcome back, Alex!</h2>
          <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed">
            Your audience is growing. You have <span className="font-semibold text-white">3 scheduled posts</span> coming up this week.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-black/5">
              Write New Post
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/20">
              View Analytics
            </button>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-green-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                {stat.change} <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800">Recent Content</h3>
            <button className="text-sm text-[#4285F4] font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPosts.map((post, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-[#4285F4] transition-colors cursor-pointer">{post.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-medium",
                        post.status === 'Published' && "bg-green-100 text-green-700",
                        post.status === 'Draft' && "bg-slate-100 text-slate-700",
                        post.status === 'Scheduled' && "bg-purple-100 text-purple-700",
                      )}>
                        {post.status}
                      </span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">{post.views}</p>
                    <p className="text-xs text-slate-400">Views</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips / Sidebar Widget */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="p-3 bg-white/10 w-fit rounded-xl mb-6 backdrop-blur-md">
              <Clock size={24} className="text-blue-300" />
            </div>
            <h3 className="text-xl font-bold mb-3">Content Strategy Tip</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Posting consistently on Tuesdays at 10 AM increases engagement by 40% based on your audience analytics.
            </p>
            <button className="w-full py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">
              Schedule Next Post
            </button>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
