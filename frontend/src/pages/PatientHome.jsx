import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { bookAppointment, findDoctors, getAppointments, getProfile } from '../api';
import { userInfoAtom } from '../context/atom';
import { useRecoilState } from 'recoil';
import fdoc from "../assets/doctor/femaledoc.webp"
import mdoc from "../assets/doctor/maledoc.webp"

const PatientHome = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem("name"));
    const [doctors, setDoctors] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [userInfo, setUserInfo] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [refreshAppointments, setRefreshAppointments] = useState(false);



    async function handleProfile() {
        try {
            const profileData = await getProfile();
            setUserInfo(profileData); // Update Recoil atom
            console.log(profileData)


        } catch (error) {
            toast('Error While Fetching The Profile!',
                {
                    icon: '💀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            console.error("Error fetching profile:", error);
        }
    }





    function handleLogout() {
        localStorage.clear();
        toast('Welcome Back!',
            {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        navigate("/");
    }

    async function findAllDoctors() {
        try {
            const response = await findDoctors();
            console.log(response.data.data);
            setDoctors(response.data.data);
            // console.log(doctors);
        }
        catch (err) {
            toast('Error While Fetching The Doctors!',
                {
                    icon: '💀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            console.log(err);
        }
    }

    async function handleAppointmentSubmit() {
        if (!selectedDoctor || !date || !time || !reason) {
            toast('Please fill in all fields before submitting!', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }

        const appointmentData = {
            patient: localStorage.getItem("id"),
            doctor: selectedDoctor._id,
            date,
            time,
            reason
        };

        try {
            const result = await bookAppointment(appointmentData);
            setRefreshAppointments(!refreshAppointments);
            console.log('Appointment booked:', result.app); // Log the result to check structure
            toast('Appointment Booked!', {
                icon: '🔥',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            // Ensure result.data contains the necessary appointment object
            if (result.data) {
                setAppointments((prevAppointments) => [...prevAppointments, result.app]);
            } else {
                console.error('No data in the response:', result);
            }
        } catch (err) {
            console.error('Error booking appointment:', err);
            toast('Failed to book appointment.', {
                icon: '💀',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    }



    useEffect(() => {
        findAllDoctors();
        handleProfile();
    }, [])


    useEffect(() => {
        // Fetch appointments after booking a new one
        const fetchAppointments = async () => {
            try {
                const appointmentsData = await getAppointments(); // Call an API to get appointments
                setAppointments(appointmentsData);
            } catch (err) {
                console.error('Error fetching appointments:' + err);
            }
        };

        fetchAppointments();
    }, [refreshAppointments]); // This will trigger every time appointments change




    return (
        <div className="bg-[#e5e5e5] min-h-[100vh] pb-[50px] ">
            {/* Header */}
            <div className="flex justify-between p-[30px]">
                <div className="text-4xl font-bold p-[10px]">Patient's Portal</div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="text-3xl">🤵</div>
                        <div className="text-xl font-bold">{username}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 font-bold py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                    >
                        Log out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex items-center w-[100%] '>
                <div className="container w-[30%] h-fit m-8 ml-[90px] p-6 bg-white shadow-lg rounded-lg ">
                    <h2 className="text-center text-3xl font-semibold text-gray-800 mb-4">Add An Appointment</h2>
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAppointmentSubmit();
                        }}
                    >
                        {/* Doctor */}
                        <div className="flex flex-col mt-[20px]">
                            <label htmlFor="doctor" className=" font-semibold text-xl mb-2">
                                Choose a Doctor
                            </label>
                            <select
                                id="doctor"
                                value={selectedDoctor._id || ""}
                                onChange={(e) => {
                                    const selected = doctors.find(doctor => doctor._id === e.target.value);
                                    setSelectedDoctor(selected);
                                }}
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="" disabled>
                                    Select a doctor
                                </option>
                                {doctors.map((doctor, index) => (
                                    <option key={index} value={doctor._id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Date */}
                        <div className="flex flex-col">
                            <label htmlFor="date" className="font-semibold text-xl mb-2">
                                Appointment Date
                            </label>
                            <input
                                type="text"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Enter appointment date (e.g., 20/11/2024)"
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Time */}
                        <div className="flex flex-col">
                            <label htmlFor="time" className="font-semibold text-xl mb-2">
                                Appointment Time
                            </label>
                            <input
                                type="text"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Enter appointment time (e.g., 10:30 AM)"
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>

                        {/* Reason */}
                        <div className="flex flex-col">
                            <label htmlFor="reason" className="font-semibold text-xl mb-2">
                                Reason for Appointment
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for your appointment"
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-blue-600 text-xl text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-200"
                        >
                            Submit Appointment
                        </button>
                    </form>

                </div>

                {/* For Shwoing Appointments */}
                {/* Appointments Section */}
                <div className="my-8 w-[70%] flex flex-col p-4">
                    <div className="text-3xl font-bold my-[30px] text-center">Your Appointments</div>
                    {appointments.length === 0 ? (
                        <div className="text-center text-lg text-gray-500">No appointments booked yet.</div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-8">
                            {appointments.map((appointment, index) => (
                                appointment ? (
                                    <div
                                        key={index}
                                        className="rounded-2xl w-[350px] p-6 bg-gradient-to-r from-[#f9f9f9] via-[#f0f4f7] to-[#ffffff] shadow-lg flex flex-col items-center border border-gray-200 gap-3 hover:scale-105"
                                    >
                                        {/* Doctor Name */}
                                        <div className="w-full text-center mb-2">
                                            <h3 className="text-2xl font-semibold text-[#2c3e50]">
                                                {appointment.doctor.name}
                                            </h3>
                                        </div>

                                        {/* Appointment Reason */}
                                        <div className="text-lg text-gray-700">
                                            <span className="font-semibold">Reason:</span> {appointment.reason}
                                        </div>

                                        {/* Date and Time */}
                                        <div className="text-md text-gray-500 flex justify-around w-full">
                                            <div className="flex flex-col items-center">
                                                {/* <span className="text-sm font-semibold">Date</span> */}
                                                <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full">{appointment.date.split("T")[0]}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                {/* <span className="text-sm font-semibold">Time</span> */}
                                                <span className="bg-orange-200 text-orange-800 px-4 py-1 rounded-full">{appointment.time}</span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className={`text-lg font-semibold text-white rounded-[7px] p-3 px-[30px] text-center mt-4 ${appointment.status === "pending" ? 'bg-yellow-500' : ''} ${appointment.status === "confirmed" ? 'bg-green-600' : ''} ${appointment.status === "cancelled" ? 'bg-red-600' : ''} ${appointment.status === "completed" ? 'bg-black' : ''}`}>
                                            {appointment.status}
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>



                    )}
                </div>



            </div>
        </div>
    )
}

export default PatientHome
