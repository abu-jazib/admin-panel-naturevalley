import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc  } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FileText, Users, MessageSquare } from 'lucide-react';


const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    subscribers: 0,
    forms: 0,
    visitors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const blogsCount = (await getDocs(collection(db, 'blogs'))).size;
      const subscribersCount = (await getDocs(collection(db, 'subscribers'))).size;
      const formsCount = (await getDocs(collection(db, 'forms'))).size;
      
      const counterDocRef = doc(db, 'visitor_count', 'counter');
    const counterSnap = await getDoc(counterDocRef);
    const visitorsCount = counterSnap.exists() ? counterSnap.data().count : 0;

      setStats({
        blogs: blogsCount,
        subscribers: subscribersCount,
        forms: formsCount,
        visitors: visitorsCount, // Placeholder for visitors count
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Total Blogs</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.blogs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Subscribers</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.subscribers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Form Submissions</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.forms}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-700">Visitors</h2>
              <p className="text-3xl font-bold text-gray-900">{stats.visitors}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

