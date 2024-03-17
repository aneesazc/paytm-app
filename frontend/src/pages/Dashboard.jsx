import React, { useEffect, useState } from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import { Users } from '../components/Users'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [value, setValue] = useState(0)
    const [firstName, setFirstName] = useState("A")
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchBalance = async () => {
            const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setValue(response.data.balance.toFixed(2))
            setFirstName(response.data.firstName)

        }
        fetchBalance()

    })
    useEffect(() => {
        // Check if the token is not available in localStorage
        if (!localStorage.getItem("token")) {
            // Redirect to the sign-in page
            navigate("/signin");
        }
    }, [navigate]); // Dependency array, re-run if navigate changes

    // Check again before rendering, to handle direct accesses to the route
    if (!localStorage.getItem("token")) {
        // Render nothing or a loader while the redirection is being processed
        return <div>Loading...</div>
    }
    

    return <div>
        <Appbar name={firstName} />
        <div className="m-8">
            <Balance value={value} />
            <Users />
        </div>
    </div>
}

export default Dashboard