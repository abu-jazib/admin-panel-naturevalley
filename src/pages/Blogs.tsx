import React, { useState, useEffect } from 'react';  
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';  
import { db } from '../lib/firebase';  
import { Pencil, Trash2, Plus } from 'lucide-react';  
import { format } from 'date-fns';  
import { useNavigate } from 'react-router-dom';  
  
interface Blog {  
  id: string;  
  title: string;  
  content: string;  
  imageUrl: string | null;  
  author: string;  
  authorImageUrl: string | null;  
  authorDescription: string;  
  tags: string[];  
  createdAt: any;  
  updatedAt: any;  
}  
  
const Blogs = () => {  
  const [blogs, setBlogs] = useState<Blog[]>([]);  
  const navigate = useNavigate();  
  
  useEffect(() => {  
    fetchBlogs();  
  }, []);  
  
  const fetchBlogs = async () => {  
    try {  
      const querySnapshot = await getDocs(collection(db, "blogs"));  
      const blogsData = querySnapshot.docs.map((doc) => ({  
        id: doc.id,  
        ...doc.data(),  
      })) as Blog[];  
  
      // Sort blogsData by createdAt in descending order  
      blogsData.sort((a, b) => {  
        return b.createdAt.toDate() - a.createdAt.toDate();  
      });  
  
      setBlogs(blogsData);  
    } catch (error) {  
      console.error("Error fetching blogs:", error);  
    }  
  };  
  
  const handleEdit = (blog: Blog) => {  
    navigate(`/blogs/edit/${blog.id}`);  
  };  
  
  const handleDelete = async (id: string) => {  
    if (window.confirm('Are you sure you want to delete this blog?')) {  
      await deleteDoc(doc(db, 'blogs', id));  
      fetchBlogs();  
    }  
  };  
  
  return (  
    <div>  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-3xl font-bold text-[#0d5524]">Blogs</h1>  
        <button  
          onClick={() => navigate('/blogs/create')}  
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"  
        >  
          <Plus className="w-5 h-5 mr-2" /> New Blog  
        </button>  
      </div>  
      <div className="bg-white rounded-lg shadow">  
        <table className="min-w-full">  
          <thead>  
            <tr className="border-b">  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>  
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>  
            </tr>  
          </thead>  
          <tbody className="divide-y divide-gray-200">  
            {blogs.map((blog) => (  
              <tr key={blog.id}>  
                <td className="px-6 py-4">{blog.title}</td>  
                <td className="px-6 py-4">{blog.author}</td>  
                <td className="px-6 py-4">{format(blog.createdAt.toDate(), 'MMM dd, yyyy')}</td>  
                <td className="px-6 py-4">  
                  <button  
                    onClick={() => handleEdit(blog)}  
                    className="text-blue-600 hover:text-blue-800 mr-3"  
                  >  
                    <Pencil className="w-5 h-5" />  
                  </button>  
                  <button  
                    onClick={() => handleDelete(blog.id)}  
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
  
export default Blogs;  