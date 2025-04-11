import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Asset {
  fileName: string;
  fileUrl: string;
  uploadedAt: any;
}

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false); // New loading state for upload
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'assets'));
      const assetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,  // Firestore document ID as the unique identifier
        ...doc.data(),
      })) as (Asset & { id: string })[];

      // Sort assetsData by uploadedAt in descending order
      assetsData.sort((a, b) => {
        return b.uploadedAt.toDate() - a.uploadedAt.toDate();
      });

      setAssets(assetsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !fileName) {
      alert('Please provide a file and a file name');
      return;
    }

    setLoadingUpload(true);
     

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    try {
      // Upload the file to the backend API
      const response = await axios.post('http://localhost:4000/api/assets-upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add the uploaded asset to the state
      setAssets([
        ...assets,
        {
          fileName: response.data.fileName,
          fileUrl: response.data.fileUrl,
          uploadedAt: response.data.uploadedAt,
        },
      ]);

      // Reset the form
      setFile(null);
      setFileName('');
      alert('Asset uploaded successfully!');
      fetchAssets();
    } catch (error) {
      console.error('Error uploading asset:', error);
      alert('Failed to upload asset.');
    } finally {
      setLoadingUpload(false);
      
      
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteDoc(doc(db, 'assets', id));
        fetchAssets(); // Refresh the asset list
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  // Loading state while fetching assets
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0d5524]">Assets</h1>
      </div>

      {/* Upload Asset Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Upload a new asset</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              placeholder="Enter asset file name"
              disabled={loadingUpload} // Disable input during upload
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Select File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              disabled={loadingUpload} // Disable input during upload
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded ${loadingUpload ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loadingUpload} // Disable button during upload
          >
            {loadingUpload ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              'Upload Asset'
            )}
          </button>
        </form>
      </div>

      {/* Display Uploaded Assets */}
      <h2 className="text-lg font-semibold mb-4">Uploaded Assets</h2>
      <div className="bg-white rounded-lg shadow"> 
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.fileName}>
                <td className="px-6 py-4">{asset.fileName}</td>
                <td className="px-6 py-4">{asset.fileUrl}</td>
                <td className="px-6 py-4">
                  <a
                    href={asset.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View
                  </a>
                </td>
                <td className="px-6 py-4">
                  {format(asset.uploadedAt.toDate(), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(asset.fileName)} // Using fileName as the key
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

export default Assets;
