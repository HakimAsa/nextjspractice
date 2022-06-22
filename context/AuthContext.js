import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { NEXT_URL } from "@/config/index";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const router = typeof window !== 'undefined' && useRouter()

    useEffect(() => checkUserLoggedIn(), [])

    // Register user
    const register = async(user) => {
        axios.post(`${NEXT_URL}/api/register`, {...user})
          .then(function (response) {
            if(response.status === 200){
                setUser(response.data.user)
                router.push('/account/dashboard')
            }else{
                setError(response.data.message)
                setError(null)
            }
          })
          .catch(function ({response}) {
            setError(response.data.message)
            setError(null)
          });
    }

    // Login user
    const login = async ({email: identifier, password}) => {
        if(!identifier || !password) throw new Error('identifier or passord cannot be undefined')
        axios.post(`${NEXT_URL}/api/login`, {
            identifier,
            password
          })
          .then(function (response) {
            if(response.status === 200){
                setUser(response.data.user)
                router.push('/account/dashboard')
            }else{
                setError(response.data.message)
                setError(null)
            }
          })
          .catch(function ({response}) {
            setError(response.data.message)
            setError(null)
          });
    }

    // Logout user
    const logout = async() => {
        axios.post(`${NEXT_URL}/api/logout`)
          .then(function (response) {
            if(response.status === 200){
                setUser(null)
                router.push('/')
            }else{
                setError(response.data.message)
                setError(null)
            }
          })
          .catch(function ({response}) {
            console.log(response.data.message)
            setError(response.data.message)
            setError(null)
          });
    }

    //check if user is logged in
    const checkUserLoggedIn = async(user) => {
        axios.get(`${NEXT_URL}/api/user`)
            .then(function (response) {
                if(response.status === 200){
                    setUser(response.data.user)
                }else{
                    setUser(null)
                }
            })
            .catch(function ({response}) {
                setUser(null)
            });
    }

    return (
        <AuthContext.Provider value={{user, error, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext

