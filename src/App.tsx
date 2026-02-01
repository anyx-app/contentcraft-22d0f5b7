import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';

// Placeholder components for other routes
const Posts = () => <div className="p-4 text-slate-500">Posts Page (Coming Soon)</div>;
const Media = () => <div className="p-4 text-slate-500">Media Library (Coming Soon)</div>;
const Subscribers = () => <div className="p-4 text-slate-500">Subscribers Page (Coming Soon)</div>;
const Settings = () => <div className="p-4 text-slate-500">Settings Page (Coming Soon)</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<Posts />} />
        <Route path="media" element={<Media />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
