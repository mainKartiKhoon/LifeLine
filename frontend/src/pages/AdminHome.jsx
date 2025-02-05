import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import bluecube from "../assets/login/bluecube.png"
import { Modal, Button, Form } from "react-bootstrap";
import "./AdminHome.css"
import { FcBusinessman } from "react-icons/fc";
import { addDoctor, findDoctors, removeDoctor } from '../api';
import maledoc from "../assets/doctor/maledoc.webp"
import femaledoc from "../assets/doctor/femaledoc.webp"
import { IoCloseCircle } from "react-icons/io5";
import jsPDF from "jspdf";
import "jspdf-autotable";



const AdminHome = () => {

    const [show, setShow] = useState(false);

    const [doctors, setDoctors] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [phone, setPhone] = useState("");
    const [experience, setExperience] = useState("");



    const [username, setUsername] = useState(localStorage.getItem("name"));

    const [addedNewDoctor, setAddedNewDoctor] = useState(0);

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

    async function handleRemoveDoctorButton(doctorId) {
        try {
            const response = await removeDoctor(doctorId);  // Call the API to remove the doctor
            if (response.status === 200) {
                toast('Doctor removed successfully',
                    {
                        icon: '✅',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
                // Remove the doctor from the UI after successful deletion
                setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
            }
        } catch (error) {
            toast('Error while removing the doctor!',
                {
                    icon: '💀',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            console.log(error.message);
        }
    }

    async function handleSubmitSaveChanges() {
        const doctorData = {
            name,
            email,
            password,
            gender,
            specialization,
            phone,
            experience,
            role: "doctor"
        }

        try {
            let response = await addDoctor(doctorData);
            setShow(false);
            setAddedNewDoctor(addedNewDoctor + 1);
            toast('Doctor Added Successfully!',
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );

        }
        catch (err) {
            toast('Error While Adding Doctor',
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

    async function findAllDoctors() {
        try {
            const response = await findDoctors();
            // console.log(response.data.data);
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

    const exportDoctorsToPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Doctors Information", 14, 22);

        // Table Headers
        const headers = [["Name", "Specialization", "Experience", "Phone"]];

        // Table Rows
        const rows = doctors.map(doctor => [
            doctor.name,
            doctor.specialization,
            doctor.experience + " years",
            doctor.user?.phone || "N/A", // Handle possible undefined `user`
        ]);

        // Generate Table
        doc.autoTable({
            startY: 30,
            head: headers,
            body: rows,
        });

        // Save PDF
        doc.save("Doctors_List.pdf");
    };

    useEffect(() => {
        findAllDoctors();
    }, [])
    useEffect(() => {
        findAllDoctors();
    }, [addedNewDoctor])

    useEffect(() => {
        console.log(doctors);
    }, [doctors])

    return (
        <div className='bg-[#e5e5e5]'>
            <div className='lag flex justify-between p-[30px]'>
                <div className='text-4xl font-bold p-[10px]'>Admin's Portal</div>

                <div className='flex items-center gap-[35px]'>
                    <div className='flex items-center gap-2'>
                        <FcBusinessman size={38} />
                        <div className='text-xl font-bold'>{username}</div>
                    </div>
                    <button onClick={handleLogout} className='bg-red-600 text-white p-[15px] rounded-[12px] hover:bg-red-700 transition-all duration-150 font-bold ease-in-out text-lg'>Log out</button>
                </div>
            </div>

            {/* <img src={bluecube} className='animate1' width={70} alt="" /> */}


            {/* Cod ehere */}

            {/* Manage Doctors */}
            <div className='mx-[100px]  mt-[40px] flex flex-col gap-[30px]'>
                <div className='flex items-center justify-between'>
                    <div className='text-3xl font-bold'>MANAGE DOCTORS</div>
                    <div>

                        <Button variant="primary" className='bg-[#565acf] p-[10px] text-white font-semibold rounded-[12px] text-xl hover:bg-[#3a3ea4] transition-all duration-150' onClick={handleShow}>
                            Add Doctor
                        </Button>
                        <Button
                            variant="success"
                            className='bg-green-700 ml-[10px] p-[10px] text-white font-semibold rounded-[12px] text-xl hover:bg-green-900 transition-all duration-150'
                            onClick={exportDoctorsToPDF}
                        >
                            Download Doctor's List
                        </Button>
                    </div>
                </div>

                {/* Flexbox Layout for Doctors */}
                <div className='flex flex-wrap gap-6 justify-center'>
                    {doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className='bg-white shadow-md rounded-[14px] p-6 flex flex-col items-center text-center border hover:shadow-xl transition-all duration-150 relative'
                        >

                            <div className='rounded-full text-[#551c69] font-semibold bg-[#e2c9ea] p-1 text-sm px-3 absolute top-[20px] right-[20px]'>Exp: {doctor.experience} years</div>
                            <img
                                src={doctor.gender === "female" ? femaledoc : maledoc}
                                alt={doctor.name}
                                className='w-[350px] h-[250px] rounded-full object-cover object-top mb-4'
                            />
                            <h3 className='text-xl font-semibold mb-2'>{doctor.name}</h3>
                            <p className='text-red-800 font-semibold text-lg  mb-1'>Specialization: {doctor.specialization}</p>
                            {/* <p className='text-gray-600 text-sm mb-1'>Email: {doctor.email}</p> */}
                            <p className='text-gray-600 text-sm mb-4 font-semibold'>Phone: {doctor.user.phone}</p>
                            <button onClick={() => {
                                handleRemoveDoctorButton(doctor._id)
                            }}
                                className='bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition-all duration-150 text-sm'
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>





            {show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className='font-bold'>Add Doctor</h2>
                            <button className="close-btn hover:text-" onClick={handleClose}>
                                <IoCloseCircle color='red' size={30} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Doctor Name</label>
                                    <input
                                        type="text"
                                        placeholder="Dr. Samantha Queue"
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>

                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setGender(e.target.value)
                                            }}
                                            placeholder="male/female"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Specialization</label>
                                        <input
                                            type="email"
                                            onChange={(e) => {
                                                setSpecialization(e.target.value)
                                            }}
                                            placeholder="eg. Oncology"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setPhone(e.target.value)
                                            }}
                                            placeholder="eg. 9816878888"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Experience (Years)</label>
                                        <input
                                            type="email"
                                            onChange={(e) => {
                                                setExperience(e.target.value)
                                            }}
                                            placeholder="eg. 3"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="close-modal-btn hover:bg-[#9e343d] hover:text-white transition-all duration-150" onClick={handleClose}>
                                Close
                            </button>
                            <button className="save-btn hover:bg-[#341967] transition-all duration-150" onClick={handleSubmitSaveChanges}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}





        </div>
    )
}

export default AdminHome;
