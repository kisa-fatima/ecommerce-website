import React from 'react';
import DashboardTitleBar from '../components/DashboardTitleBar';
import DashboardOverviewCard from '../components/DashboardOverviewCard';

const AdminDashboard = () => {
  return (
    <div>
      <DashboardTitleBar />
      <div style={{ marginTop: 24 }}>
        <DashboardOverviewCard />
      </div>
    </div>
  );
}

export default AdminDashboard;