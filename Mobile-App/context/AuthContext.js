import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosServer } from '../utils/AxiosServer';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userData, setUserData] = useState(null)

  const login = async (userToken, userData) => {
    setIsLoading(true)
    setUserToken(userToken)
    setUserData(userData)
    await AsyncStorage.setItem('userToken', userToken)
    await AsyncStorage.setItem('userData', JSON.stringify(userData))
    AxiosServer.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)
    setUserToken(null)
    setUserData(null)
    await AsyncStorage.removeItem('userToken')
    await AsyncStorage.removeItem('userData')
    AxiosServer.defaults.headers.common['Authorization'] = undefined
    setIsLoading(false)
  }

  const isLoggedIn = async () => {
    setIsLoading(true)
    try{
      let userToken = await AsyncStorage.getItem('userToken')
      let userData = await AsyncStorage.getItem('userData')
      setUserToken(userToken)
      setUserData(JSON.parse(userData))
    } catch(err){
      console.log(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userData }}>
      { children }
    </AuthContext.Provider>
  );
}
