import React, { createContext, useContext } from 'react'
import { ToastContainer, toast, TypeOptions, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastFunction = (type?: TypeOptions, message?: string) => void

const showToast: ToastFunction = (type, message) => {
  if (message) {
    toast.dismiss()
    toast(message, { type })
  }
}

type ToastContextValue = {
  showToast: ToastFunction
}

const ToastContext = createContext<ToastContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showToast: () => {},
})

export const useToast = () => useContext(ToastContext)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <ToastContext.Provider value={{ showToast }}>
        {children}
      </ToastContext.Provider>
      <ToastContainer
        transition={Slide}
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}
