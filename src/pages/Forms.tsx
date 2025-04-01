import React, { useState, useEffect } from 'react';  
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';  
import { db } from '../lib/firebase';  
import { Trash2, Eye } from 'lucide-react';  
import { format } from 'date-fns';  
  
interface FormSubmission {  
  id: string;  
  name: string;  
  email: string;  
  message: string;  
  createdAt: any;  
  status: string; // Add status to the interface  
}  
  
const Forms = () => {  
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);  
  const [showModal, setShowModal] = useState(false);  
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);  
  
  useEffect(() => {  
    fetchSubmissions();  
  }, []);  
  
  const fetchSubmissions = async () => {  
    const querySnapshot = await getDocs(collection(db, 'forms'));  
    const submissionsData = querySnapshot.docs.map(doc => ({  
      id: doc.id,  
      ...doc.data(),  
    })) as FormSubmission[];  
    // Sort submissions by createdAt date in descending order  
    submissionsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());  
    setSubmissions(submissionsData);  
  };  
  
  const handleDelete = async (id: string) => {  
    if (window.confirm('Are you sure you want to delete this submission?')) {  
      await deleteDoc(doc(db, 'forms', id));  
      fetchSubmissions();  
    }  
  };  
  
  const handleView = (submission: FormSubmission) => {  
    setSelectedSubmission(submission);  
    setShowModal(true);  
  };  
  
  const handleStatusChange = async (id: string, newStatus: string) => {  
    const submissionRef = doc(db, 'forms', id);  
    await updateDoc(submissionRef, { status: newStatus });  
    fetchSubmissions();  
  };  
  
  return (  
    <div>  
      <h1 className="text-3xl font-bold mb-6">Form Submissions</h1>  
      <div className="bg-white rounded-lg shadow">  
        <table className="min-w-full">  
          <thead>  
            <tr className="border-b">  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>  
            </tr>  
          </thead>  
          <tbody className="divide-y divide-gray-200">  
            {submissions.map((submission) => (  
              <tr key={submission.id}>  
                <td className="px-6 py-4">{submission.name}</td>  
                <td className="px-6 py-4">{submission.email}</td>  
                <td className="px-6 py-4">{format(submission.createdAt.toDate(), 'MMM dd, yyyy')}</td>  
                <td className="px-6 py-4">{submission.status}</td>  
                <td className="px-6 py-4">  
                  <button onClick={() => handleView(submission)} className="text-blue-600 hover:text-blue-800 mr-3">  
                    <Eye className="w-5 h-5" />  
                  </button>  
                  <button onClick={() => handleDelete(submission.id)} className="text-red-600 hover:text-red-800">  
                    <Trash2 className="w-5 h-5" />  
                  </button>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
      </div>  
      {showModal && selectedSubmission && (  
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">  
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl">  
            <h2 className="text-2xl font-bold mb-4">Form Submission Details</h2>  
            <div className="space-y-4">  
              <div>  
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>  
                <p className="text-gray-900">{selectedSubmission.name}</p>  
              </div>  
              <div>  
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>  
                <p className="text-gray-900">{selectedSubmission.email}</p>  
              </div>  
              <div>  
                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>  
                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>  
              </div>  
              <div>  
                <label className="block text-gray-700 text-sm font-bold mb-2">Submitted At</label>  
                <p className="text-gray-900">{format(selectedSubmission.createdAt.toDate(), 'MMM dd, yyyy HH:mm:ss')}</p>  
              </div>  
              <div>  
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>  
                <p className="text-gray-900">{selectedSubmission.status}</p>  
                <select  
                  value={selectedSubmission.status}  
                  onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}  
                  className="mt-2 border border-gray-300 rounded p-2"  
                >  
                  <option value="pending">Pending</option>  
                  <option value="processed">Processed</option>  
                  <option value="completed">Completed</option>  
                </select>  
              </div>  
            </div>  
            <div className="mt-6 flex justify-end">  
              <button  
                onClick={() => {  
                  setShowModal(false);  
                  setSelectedSubmission(null);  
                }}  
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"  
              >  
                Close  
              </button>  
            </div>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
};  
  
export default Forms;  