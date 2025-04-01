import React, { useState } from 'react';  
import { collection, addDoc } from 'firebase/firestore';  
import { db } from '../lib/firebase';  
import { useNavigate } from 'react-router-dom';  
import ReactQuill from 'react-quill';  
import 'react-quill/dist/quill.snow.css';  
  
const CreateBlog = () => {  
  const [formData, setFormData] = useState({  
    title: '',  
    content: '',  
    imageUrl: '',  
    author: '',  
    authorImageUrl: '',  
    authorDescription: '',  
    tags: [] as string[],  
  });  
  const [tagInput, setTagInput] = useState('');  
  const navigate = useNavigate();  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({ ...prev, [name]: value }));  
  };  
  
  const handleContentChange = (value: string) => {  
    setFormData(prev => ({ ...prev, content: value }));  
  };  
  
  const handleAddTag = (e: React.KeyboardEvent) => {  
    if (e.key === 'Enter' && tagInput.trim()) {  
      e.preventDefault();  
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));  
      setTagInput('');  
    }  
  };  
  
  const removeTag = (indexToRemove: number) => {  
    setFormData(prev => ({  
      ...prev,  
      tags: prev.tags.filter((_, index) => index !== indexToRemove)  
    }));  
  };  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    const blogData = {  
      ...formData,  
      imageUrl: formData.imageUrl || null,  
      authorImageUrl: formData.authorImageUrl || null,  
      authorDescription: formData.authorDescription || '',  
      createdAt: new Date(),  
      updatedAt: new Date(),  
    };  
  
    await addDoc(collection(db, 'blogs'), blogData);  
    navigate('/blogs'); // Redirect to blogs listing after submission  
  };  
  
  return (  
    <div className="p-8">  
      <h2 className="text-2xl font-bold text-[#0d5524] mb-4">Create New Blog</h2>  
      <form onSubmit={handleSubmit}>  
        <div className="grid grid-cols-1 gap-4">  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>  
            <input  
              type="text"  
              name="title"  
              value={formData.title}  
              onChange={handleInputChange}  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
              required  
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>  
            <ReactQuill  
              value={formData.content}  
              onChange={handleContentChange}    
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>  
            <input  
              type="url"  
              name="imageUrl"  
              value={formData.imageUrl}  
              onChange={handleInputChange}  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>  
            <input  
              type="text"  
              name="author"  
              value={formData.author}  
              onChange={handleInputChange}  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
              required  
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Author Image URL</label>  
            <input  
              type="url"  
              name="authorImageUrl"  
              value={formData.authorImageUrl}  
              onChange={handleInputChange}  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Author Description</label>  
            <textarea  
              name="authorDescription"  
              value={formData.authorDescription}  
              onChange={handleInputChange}  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />  
          </div>  
          <div>  
            <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>  
            <input  
              type="text"  
              value={tagInput}  
              onChange={(e) => setTagInput(e.target.value)}  
              onKeyDown={handleAddTag}  
              placeholder="Press Enter to add tag"  
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  
            />  
            <div className="flex flex-wrap gap-2 mt-2">  
              {formData.tags.map((tag, index) => (  
                <span  
                  key={index}  
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"  
                >  
                  {tag}  
                  <button  
                    type="button"  
                    onClick={() => removeTag(index)}  
                    className="ml-2 text-blue-600 hover:text-blue-800"  
                  >  
                    ×  
                  </button>  
                </span>  
              ))}  
            </div>  
          </div>  
        </div>  
        <div className="flex justify-end gap-4 mt-6">  
          <button  
            type="button"  
            onClick={() => navigate('/blogs')}  
            className="px-3 py-4 text-gray-600 hover:text-gray-800"  
          >  
            Cancel  
          </button>  
          <button  
            type="submit"  
            className="bg-[#0d5524] text-white py-3 px-4 rounded-lg hover:bg-[#176c3c] transition-colors" 
          >  
            Create  
          </button>  
        </div>  
      </form>  
    </div>  
  );  
};  
  
export default CreateBlog;  