import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, updateAppointmentStatus } from '../api';

const DoctorHome = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("name"));
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [statusMap, setStatusMap] = useState({}); 
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleStatusUpdate = async (appointmentId) => {
    const newStatus = statusMap[appointmentId]; 
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      //   toast.success("");
      toast('Appointment status updated!',
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (err) {
      //   toast.error("");
      toast('Error updating appointment status.',
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
  };

  function handleLogout() {
    localStorage.clear();
    toast('You have logged out successfully!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    navigate("/");
  }

  async function fetchDoctorAppointments() {
    try {
      const response = await getDoctorAppointments();
      setDoctorAppointments(response);
      console.log(response);
    } catch (err) {
      toast('Couldn\'t get appointments related to doctors', {
        icon: '🥲',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      const appointmentsForSelectedPatient = doctorAppointments.filter(
        (appointment) => appointment.patient._id === selectedPatient
      );
      setFilteredAppointments(appointmentsForSelectedPatient);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedPatient, doctorAppointments]);

  const handleStatusChange = (appointmentId, newStatus) => {
    setStatusMap(prevStatusMap => ({
      ...prevStatusMap,
      [appointmentId]: newStatus, // Update the status for this appointment
    }));
  };

  return (
    <div className="bg-[#e5e5e5] min-h-[100vh]">
      <div className="flex justify-between p-[30px] ">
        <div className="text-4xl font-bold p-[10px]">Doctor's Portal</div>
        <div className="flex items-center gap-[35px]">
          <div className="flex items-center gap-2">
            <div className="text-4xl">🧑‍⚕️</div>
            <div className="text-xl font-bold">{username}</div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold p-[15px] rounded-[12px] hover:bg-red-700 transition-all duration-150 ease-in-out text-lg"
          >
            Log out
          </button>
        </div>
      </div>


      {/* Appointments */}

      <div className="px-10 py-8">
        <h2 className="text-3xl font-bold mb-6 text-[#081a52]">YOUR APPOINTMENTS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorAppointments.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No appointments available at the moment.
            </p>
          ) : (
            doctorAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white hover:shadow-md transition-all duration-150 rounded-xl p-6 border-2 border-blue-300"
              >
                <h3 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
                  {appointment.patient.user.name}
                </h3>

                <div className="text-gray-800 text-lg space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-blue-800">📅 Date:</span>
                    <span className='text-bold font-semibold'>{new Date(appointment.date).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-blue-800">⏰ Time:</span>
                    <span className='text-bold font-semibold'>{appointment.time}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-blue-800">📝 Reason:</span>
                    <span className='text-bold font-semibold'>{appointment.reason || 'N/A'}</span>
                  </p>
                </div>
                <div className="mt-4 font-semibold text-blue-800 text-lg">
                  📊 Current Status: <span className="text-red-800">{appointment.status}</span>
                </div>
                <div className="mt-4">
                  <p className="flex items-center gap-2 text-lg">
                    <span className="font-semibold text-blue-800">📊 Set Status:</span>
                    <select
                      className="px-4 py-2 rounded-lg text-lg font-semibold tracking-wide bg-white border border-blue-300 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={statusMap[appointment._id] || appointment.status} // Default value from statusMap or current appointment status
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)} // Update statusMap with new value
                    >
                      <option value="completed">Completed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </p>
                </div>

                <button
                  onClick={() => handleStatusUpdate(appointment._id)} // Use status from statusMap for each appointment
                  className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-md  hover:scale-105  transform"
                >
                  Update Status
                </button>
              </div>
            ))
          )}
        </div>
      </div>




      {/* Medical Records */}
      <div className="flex items-center w-[100%] ">
        <div className="flex items-center w-[100%] ">
          <div className="container w-[30%] h-fit m-8 ml-[90px] p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-center text-3xl font-semibold text-gray-800 mb-4">Add A Medical Record</h2>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleAppointmentSubmit();
              }}
            >
              {/* Choose Patient */}
              <div className="flex flex-col mt-[20px]">
                <label htmlFor="patient" className="font-semibold text-xl mb-2">
                  Choose the patient
                </label>
                <select
                  id="patient"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="" disabled>
                    Select a patient
                  </option>
                  {/* Filter out duplicate patients */}
                  {doctorAppointments
                    .reduce((unique, appointment) => {
                      if (!unique.some(item => item.patient._id === appointment.patient._id)) {
                        unique.push(appointment);
                      }
                      return unique;
                    }, [])
                    .map((appointment) => (
                      <option key={appointment.patient._id} value={appointment.patient._id}>
                        {appointment.patient.user.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Choose Appointment */}
              <div className="flex flex-col mt-[20px]">
                <label htmlFor="appointment" className="font-semibold text-xl mb-2">
                  Choose the appointment
                </label>
                <select
                  id="appointment"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={!selectedPatient}
                >
                  <option value="" disabled>
                    Select an appointment
                  </option>
                  {filteredAppointments.map((appointment) => (
                    <option key={appointment._id} value={appointment._id}>
                      {appointment.reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div className="flex flex-col mt-[20px]">
                <label htmlFor="diagnosis" className="font-semibold text-xl mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  placeholder="Enter diagnosis"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Treatment */}
              <div className="flex flex-col mt-[20px]">
                <label htmlFor="treatment" className="font-semibold text-xl mb-2">
                  Treatment
                </label>
                <input
                  type="text"
                  id="treatment"
                  placeholder="Enter treatment"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col mt-[20px]">
                <label htmlFor="notes" className="font-semibold text-xl mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  placeholder="Enter any additional notes"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 text-xl text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-200"
              >
                Submit Medical Record
              </button>
            </form>
          </div>

          {/* Appointments Section */}
          <div className="my-8 w-[70%] flex flex-col p-4">
            <div className="text-3xl font-bold my-[30px] text-center">Your Medical Records</div>
            {filteredAppointments.length === 0 ? (
              <div className="text-center text-lg text-gray-500">No records available yet.</div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {/* {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl w-[350px] p-6 bg-gradient-to-r from-[#f9f9f9] via-[#f0f4f7] to-[#ffffff] shadow-lg flex flex-col items-center border border-gray-200 gap-3 hover:scale-105"
                  >
                    <div className="w-full text-center mb-2">
                      <h3 className="text-2xl font-semibold text-[#2c3e50]">
                        {appointment.patient.user.name}
                      </h3>
                    </div>

                    <div className="text-lg text-gray-700">
                      <span className="font-semibold">Reason:</span> {appointment.reason}
                    </div>

                    <div className="text-md text-gray-500 flex justify-around w-full">
                      <div className="flex flex-col items-center">
                        <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full">
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="bg-orange-200 text-orange-800 px-4 py-1 rounded-full">
                          {appointment.time}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`text-lg font-semibold text-white rounded-[7px] p-3 px-[30px] text-center mt-4 ${appointment.status === 'pending'
                          ? 'bg-yellow-500'
                          : appointment.status === 'confirmed'
                            ? 'bg-green-600'
                            : appointment.status === 'cancelled'
                              ? 'bg-red-600'
                              : appointment.status === 'completed'
                                ? 'bg-black'
                                : ''
                        }`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                ))} */}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DoctorHome;
