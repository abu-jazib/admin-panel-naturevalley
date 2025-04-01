import React, { useState, useEffect } from 'react';  
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';  
import { db } from '../lib/firebase';  
import { Trash2 } from 'lucide-react';  
import { format } from 'date-fns';  
  
interface Subscriber {  
  id: string;  
  email: string;  
  subscribedAt: any;  
}  
  
const Subscribers = () => {  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);  
  
  useEffect(() => {  
    fetchSubscribers();  
  }, []);  
  
  const fetchSubscribers = async () => {  
    const querySnapshot = await getDocs(collection(db, 'subscribers'));  
    const subscribersData = querySnapshot.docs.map(doc => {  
      const data = doc.data();  
      return {  
        id: doc.id,  
        email: data.email,  
        subscribedAt: data.subscribedAt ? data.subscribedAt : new Date(), // Fallback to current date if subscribedAt is undefined  
      };  
    }) as Subscriber[];  
  
    // Sort subscribersData by subscribedAt in descending order  
    subscribersData.sort((a, b) => {  
      return b.subscribedAt.toDate() - a.subscribedAt.toDate();  
    });  
  
    setSubscribers(subscribersData);  
  };  
  
  const handleDelete = async (id: string) => {  
    if (window.confirm('Are you sure you want to delete this subscriber?')) {  
      await deleteDoc(doc(db, 'subscribers', id));  
      fetchSubscribers();  
    }  
  };  
  
  return (  
    <div>  
      <h1 className="text-3xl font-bold text-[#0d5524] mb-6">Subscribers</h1>  
      <div className="bg-white rounded-lg shadow">  
        <table className="min-w-full">  
          <thead>  
            <tr className="border-b">  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed At</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>  
            </tr>  
          </thead>  
          <tbody className="divide-y divide-gray-200">  
            {subscribers.map((subscriber) => (  
              <tr key={subscriber.id}>  
                <td className="px-6 py-4">{subscriber.email}</td>  
                <td className="px-6 py-4">  
                  {subscriber.subscribedAt ? format(subscriber.subscribedAt.toDate(), 'MMM dd, yyyy HH:mm:ss') : 'N/A'}  
                </td>  
                <td className="px-6 py-4">  
                  <button  
                    onClick={() => handleDelete(subscriber.id)}  
                    className="text-red-600 hover:text-red-800"  
                  >  
                    <Trash2 className="w-5 h-5" />  
                  </button>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
      </div>  
    </div>  
  );  
};  
  
export default Subscribers;  