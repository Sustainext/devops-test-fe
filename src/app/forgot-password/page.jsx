'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { MdKey } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    const url = `${process.env.BACKEND_API_URL}/api/auth/password/reset/`;
    const data = { email };

    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Response:', response.data);
      if (response.data.detail === 'Password reset e-mail has been sent.') {
        setSent(true);
      }
    } catch (error) {
    // Check if error is AxiosError and has a response (API error)
    if (error.response) {
      if (error.response.status === 404) {
        toast.error(error.response.data.detail );
      } else {
        toast.error(`Error: ${error.response.data.detail || 'Request failed'}`);
      }
    } else {
      // Network or unexpected error  
      toast.error('An unexpected error occurred');
    }
   } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className='min-h-[125vh] grid place-items-center bg-[#f2f2f2]'>
      <div className='bg-white w-80 rounded-md'>
        {sent ? (
          <>
            <div className='w-12 h-12 bg-purple-50 rounded-full mx-auto mt-8'>
            <MdKey style={{height: '100%', width: '100%'}} className='mx-auto py-2 z-50 text-black w-8 h-8' />
            </div>
            <div className='mt-2'>
              <h2 className='text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                Check your mail
              </h2>
              <p className='text-center px-8 mt-2 text-sm'>
                We sent a password reset link to your Registered Email
              </p>
            </div>
            <div className='my-5'>
              <p className='text-center px-8 mt-2 text-sm'>
                Didn&apos;t receive the email?
                <button
                  onClick={() => setSent(false)}
                  className='font-semibold text-[#a855f7] hover:text-[#a855f7] ml-1'
                >
                  Click to resend
                </button>
              </p>
            </div>
            <div>
              <Link href='/'>
                <p className='text-center mb-5 text-sm flex items-center justify-center'>
                  <IoArrowBack className="mr-1" /> Back to log in
                </p>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className='p-4'>
              <Link href='/'>
                <p className='text-center flex items-center space-x-3 text-sm'>
                  <IoArrowBack />
                  <span>Back to Login</span>
                </p>
              </Link>
            </div>
            <div className='w-12 h-12 bg-purple-50 rounded-full mx-auto mt-8'>
            <MdKey style={{height: '100%', width: '100%'}} className='mx-auto py-2 z-50 text-black w-8 h-8' />
            </div>
            <div className='mt-2'>
              <h2 className='text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
                Forgotten password
              </h2>
              <p className='text-center px-1 mt-2 text-sm'>
                No worries, we&apos;ll send you reset instructions
              </p>
            </div>
            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm justify-center px-2 py-2 lg:px-5'>
              <form className='space-y-6' onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
                    Email
                  </label>
                  <div className='relative mt-2 rounded-md shadow-sm' id='app-title'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-[#364161] to-[#06081f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-5'
                  >
                    {loading ? 'Sending mail...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Forgotpassword;