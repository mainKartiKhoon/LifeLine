import React, { useState } from 'react'
import gif from "../assets/login/sick.gif"
import logo from "../assets/mainLogo.jpg"
import axios from "axios"
import { loginUser, registerUser } from '../api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userInfoAtom } from '../context/atom'



const Login = () => {


    const [isLoginModal, setIsLoginModal] = useState(true);
    const [role, setRole] = useState("patient");

    const setUserData = useSetRecoilState(userInfoAtom);

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");



    async function handleRegister() {
        const registrationData = {
            name,
            email,
            password,
            role,
            phone: "000000000"
        }
        if (role == "patient") {
            registrationData.age = age;
            registrationData.gender = gender;
            registrationData.address = address;
        }
        try {
            const response = await registerUser(registrationData);
            toast('User Registered Successfully!',
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            setIsLoginModal(true);
        }
        catch (err) {

            toast('Some Error Occurred!',
                {
                    icon: '💀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }



    }


    async function handleLogin() {
        const registrationData = {
            email,
            password,
            role,

        }




        try {
            const response = await loginUser(registrationData);
            const token = response.data.token;
            localStorage.setItem("token", token);
            const userResponse = await axios.get("http://localhost:5555/api/v1/user/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userData = userResponse.data;
            console.log(userData);
            setUserData(userData);
            localStorage.setItem("role", userData.role);
            localStorage.setItem("name", userData.name);
            localStorage.setItem("id", userData._id);
            console.log("login successful");
            toast('Welcome To The HomePage!',
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            navigate("/home");
        }
        catch (err) {
            toast('Some Error Occurred!',
                {
                    icon: '💀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            console.log(err)
        }

    }




    return (

        <div className='bg-[#e5e5e5] h-[100vh] w-[100vw] flex justify-center items-center'>
            <div className=' flex items-center gap-[40px] bg-white rounded-2xl p-[20px]'>
                {/* Photo */}
                <div>
                    <img className='w-[500px] rounded-2xl' src={gif} alt="LifeLine" />
                </div>

                {/* Content */}
                <div className='w-[600px]'>
                    {/* logo and name */}
                    <div className='text-center'>
                        <img className='m-auto w-[100px] mb-[10px]' src={logo} alt="" />
                        <div className='text-[#131b43] text-3xl font-bold'>LIFELINE HOSPITAL</div>
                    </div>
                    {
                        isLoginModal ? (<div className=" mx-auto bg-white p-8 rounded-lg space-y-6">
                            {/* <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2> */}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-base font-bold text-gray-800">Email</label>
                                    <input
                                        type="text"
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email id"
                                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-base font-bold text-gray-800">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleLogin}
                                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                                >
                                    Login
                                </button>
                            </div>

                            <div className="text-center font-semibold text-sm text-gray-800">
                                New to our website?{' '}
                                <span
                                    onClick={() => setIsLoginModal(false)}
                                    className="ml-[6px] font-bold text-base text-indigo-600 cursor-pointer hover:text-indigo-700"
                                >
                                    Click here to Register Now!
                                </span>
                            </div>
                        </div>
                        ) : (<div className="mx-auto bg-white p-8 rounded-lg space-y-6">
                            {/* <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2> */}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-base font-bold text-gray-800">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    />
                                </div>
                                <div className='flex items-center w-full gap-4'>
                                    <div className='w-[50%]'>
                                        <label htmlFor="email" className="block text-base font-bold text-gray-800">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email id"
                                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        />
                                    </div>

                                    <div className='w-[50%]'>
                                        <label htmlFor="password" className="block text-base font-bold text-gray-800">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label htmlFor="role" className="block text-base font-bold text-gray-800">Role:</label>
                                    <select
                                        id="role"
                                        name="role"
                                        defaultValue="patient"
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="patient">Patient</option>
                                    </select>
                                </div>

                                {role === "patient" && (
                                    <div className="mt-4 space-y-4 flex items-center w-full gap-3">
                                        <div className='w-[50%]'>
                                            <label htmlFor="age" className="block text-base font-bold text-gray-800">Age</label>
                                            <input
                                                type="number"
                                                id="age"
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="Enter your age"
                                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                            />
                                        </div>

                                        <div className='w-[50%]'>
                                            <label className="block text-base font-bold text-gray-800">Gender:</label>
                                            <div className="mt-2 flex gap-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="male"
                                                        name="gender"
                                                        onChange={(e) => setGender(e.target.value)}
                                                        value="male"
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor="male" className="text-sm text-gray-800">Male</label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id="female"
                                                        name="gender"
                                                        value="female"
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor="female" className="text-sm text-gray-800">Female</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleRegister}
                                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
                                >
                                    Register
                                </button>
                            </div>

                            <div className="text-center text-sm text-gray-800 font-semibold">
                                Already registered?
                                <span
                                    onClick={() => setIsLoginModal(true)}
                                    className="ml-[6px] font-bold text-base text-indigo-600 cursor-pointer hover:text-indigo-700"
                                >
                                    Click here to Login now!
                                </span>
                            </div>
                        </div>
                        )
                    }






                </div>
            </div>
        </div>
    )
}

export default Login
