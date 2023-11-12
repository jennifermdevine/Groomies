// // CreateProfile.jsx

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabaseClient';
// import { useUser } from '../components/UserContext';

// export default function CreateProfile() {
//     const navigate = useNavigate();
//     const { user: authUser, loading } = useUser();
//     const [formData, setFormData] = useState({
//         fullName: '',
//         userName: '',
//         email: '',
//     });

//     // console.log("AuthUser on component mount:", authUser);
//     // console.log("Loading state on component mount:", loading);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             // console.log("AuthUser inside fetchUserData:", authUser); // Log inside fetchUserData
//             // console.log("Loading state inside fetchUserData:", loading); // Log inside fetchUserData

//             if (!authUser || authUser.id === undefined) {
//                 console.error('No user logged in or user ID is undefined');
//                 return;
//             }

//             try {
//                 const { data, error } = await supabase
//                     .from('users')
//                     .select('email, fullName, userName')
//                     .eq('authUserId', authUser.id)
//                     .single();

//                 if (error) throw error;

//                 if (data) {
//                     setFormData({
//                         fullName: data.fullName || '',
//                         userName: data.userName || '',
//                         email: data.email || '',
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };

//         if (!loading && authUser && authUser.id !== undefined) {
//             fetchUserData();
//         }
//     }, [authUser, loading]);

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // console.log("User on form submit:", authUser);

//         if (!authUser) {
//             console.error('No user logged in');
//             return;
//         }

//         // Update or create profile in your Supabase table
//         try {
//             const { data, error } = await supabase
//                 .from('users')
//                 .upsert({ ...formData, userId: authUser.id });
//             console.log('Form submission data:', data);

//             if (error) throw error;

//             navigate(`/user-profile/${authUser.id}`);
//         } catch (error) {
//             console.error('Error in form submission:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Create Your Profile</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     name="fullName"
//                     placeholder="Full Name"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                 />
//                 <input
//                     type="text"
//                     name="userName"
//                     placeholder="Username"
//                     value={formData.userName}
//                     onChange={handleInputChange}
//                 />
//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                 />
//                 {/* Add other input fields as necessary */}
//                 <button type="submit">Save Profile</button>
//             </form>
//         </div>
//     );
// };
