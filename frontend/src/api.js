import axios from "axios"

const API_URL = "http://localhost:5555/api/v1";

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/user/register`, userData);
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/user/login`, userData);
}

export const findDoctors = async () => {
    return await axios.get(`${API_URL}/user/doctors/details`);
}

export const removeDoctor = async (doctorId) => {
    try {
        const response = await axios.delete(`${API_URL}/user/doctors/${doctorId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`  // Include the token for authorization
            }
        });
        // console.log(response);
        return response;
    } catch (error) {
        console.log("Error was in api")
    }
};

export const addDoctor = async (doctorData) => {
    return await axios.post(`${API_URL}/user/register`, doctorData);
}

export const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
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
    }
}

export const bookAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(`${API_URL}/appointment/book`, appointmentData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return response.data;
    }
    catch (err) {
        console.error("Error while booking appointment:" + err, err);

    }
}

export const getAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointment/my-appointments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`, // Assuming you're storing the JWT in localStorage
            }
        });
        return response.data; // Return the appointments data from the response
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;  // Propagate the error to handle it in the component
    }
};

export const getDoctorAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointment/doctor-appointments`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    }
    catch (err) {
        console.log("Error fetching doctors appointments: " + err);
    }
}

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/appointment/update-status/${appointmentId}`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating appointment status:" + error);

    }
};
export const getDoctorPatients = async () => {
    try {
        const response = await fetch("/doctor/patients", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch patients');
        }
        return response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};
