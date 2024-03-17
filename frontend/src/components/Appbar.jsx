import React from 'react'
import { useNavigate } from 'react-router-dom'

const Appbar = ({name}) => {
    // also create logout button
    const navigate = useNavigate()
    return (
    <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <button onClick={(e) => {
                localStorage.removeItem("token")
                navigate("/signin")
            }}
                className="flex flex-col justify-center h-full mr-4">
                Logout
            </button>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {name[0]}
                </div>
            </div>
        </div>
    </div>
    )
}

export default Appbar