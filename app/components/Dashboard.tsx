import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserManagement } from './admin/UserManagement';
import { CategoryManagement } from './admin/CategoryManagement';
import { DepartmentManagement } from './admin/DepartmentManagement';
import { AssetManagement } from './admin/AssetManagement';
import { UserDashboard } from '../components/user/UserDashboard';
import { MyAssets } from '../components/user/MyAssets';
import { CreateAsset } from '../components/user/CreateAsset';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAssetCreated = () => {
    // This will be handled by the individual components
  };

  const handleNavigateToAssets = () => {
    setActiveTab('my-assets');
  };

  const renderContent = () => {
    if (isAdmin) {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <UserManagement />;
        case 'categories': return <CategoryManagement />;
        case 'departments': return <DepartmentManagement />;
        case 'assets': return <AssetManagement />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <UserDashboard />;
        case 'my-assets': return <MyAssets />;
        case 'create-asset': return <CreateAsset onSuccess={handleAssetCreated} onNavigateToAssets={handleNavigateToAssets} />;
        default: return <UserDashboard />;
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
