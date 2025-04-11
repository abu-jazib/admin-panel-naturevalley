import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import { onAuthStateChanged } from 'firebase/auth';  
import { auth } from './lib/firebase';  
import Login from './pages/Login';  
import Dashboard from './pages/Dashboard';  
import Blogs from './pages/Blogs';  
import Subscribers from './pages/Subscribers';  
import Forms from './pages/Forms';  
import Layout from './components/Layout';  
import CreateBlog from './pages/CreateBlog';  
import EditBlog from './pages/EditBlog';
import Assets from './pages/assets';
  
function App() {  
  const [user, setUser] = useState<any>(null);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, (user) => {  
      setUser(user);  
      setLoading(false);  
    });  
    return () => unsubscribe();  
  }, []);  
  
  if (loading) {  
    return (  
      <div className="min-h-screen flex items-center justify-center">  
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>  
      </div>  
    );  
  }  
  
  return (  
    <Router>  
      <Routes>  
        <Route  
          path="/login"  
          element={user ? <Navigate to="/dashboard" /> : <Login />}  
        />  
        <Route  
          path="/"  
          element={user ? <Layout /> : <Navigate to="/login" />}  
        >  
          <Route path="/dashboard" element={<Dashboard />} />  
          <Route path="/blogs" element={<Blogs />} />  
          <Route path="/subscribers" element={<Subscribers />} />  
          <Route path="/forms" element={<Forms />} />  
          <Route path="/" element={<Navigate to="/dashboard" />} />  
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/edit/:id" element={<EditBlog />} /> 
          <Route path="/assets" element={<Assets />} />
        </Route>  
      </Routes>  
    </Router>  
  );  
}  
  
export default App;  