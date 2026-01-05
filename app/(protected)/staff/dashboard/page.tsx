// app/dashboard/page.tsx (exemplo simples)
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import DashboardPage from '@/components/shared/dashboard';

export default function UserDashboard() {  
  const [userInfo, setUserInfo] = useState<any>(null);

  return (
    <DashboardPage/>
  );
}