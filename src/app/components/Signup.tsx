"use client"

import React, { useState, useEffect } from 'react';
import UserPool from "../UserPool";
import { useRouter } from 'next/navigation';
import Dropdown2 from './Dropdown2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface CustomAlertProps {
  message: string;
  type: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [message]);

  const alertClass = type === "success" ? "text-primary text-xl" : "text-red-500";

  return (
    <div
      className={`p-3 ${alertClass} ${
        isVisible ? "slide-in border bg-white mt-5" : "slide-out"
      }`}
    >
      {message}
    </div>
  );
};

const SignUp: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("");

  const showAlert = (message: string, type: string) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [ATC2, setATC2] = useState<string[]>([]);
  const [company, setCompany] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [countries, setCountries] = useState<{ [key: string]: boolean }>({
    nigeria: false,
    ghana: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleDropdownChange = (selected: string[]) => {
    setATC2(selected);
  };

  const handleCountryChange = (country: string) => {
    setCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  const signUp = async () => {
    const selectedCountries = Object.keys(countries)
      .filter(country => countries[country])
      .join(', ');

    if (!selectedCountries) {
      showAlert('Please select at least one country', 'error');
      return;
    }

    try {
      const signUpResponse = await UserPool.signUp(email, password, [
        { Name: 'custom:ATC2', Value: JSON.stringify(ATC2) },
        { Name: 'custom:company', Value: company },
        { Name: 'custom:country', Value: selectedCountries }
      ], null, (err: { message: string; }, data: { user: { getUsername: () => string; }; }) => {
        if (err) {
          console.error(err);
          showAlert(err.message, 'error');
        } else {
          const userEmail = data.user.getUsername();
          showAlert('Sign-up successful. Confirmation code sent to:', userEmail);
          localStorage.setItem('userEmail', userEmail);
          router.push("/");
        }
      });
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError((error as unknown).message || "An error occurred");
      showAlert((error as Error).message, 'error');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp();
  };

  return (
    <main className="flex max-h-[100vh] flex-col items-center text-white justify-between">
      <CustomAlert message={alertMessage} type={alertType} />

      <div className='w-full flex flex-row'>
        <div className='p-20 w-1/2'>
          <div className='flex flex-col gap-5 my-10'>
            <div><h1 className='text-5xl font-extrabold'>Welcome To VERSUS&#8482;</h1></div>

            <section className='my-9 flex flex-col gap-9 w-[90%]'>
              <div className='flex flex-col gap-5'>
                <form onSubmit={onSubmit}>
                  <div className='flex flex-col mb-4'>
                    <label htmlFor='email' className='text-gray-700 font-semibold mb-1'>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className='border border-gray-300 w-full rounded-md py-3 px-3 focus:outline-none focus:border-blue-500'
                    />
                  </div>

                  <div className='flex flex-col mb-4'>
                    <label htmlFor='company' className='text-gray-700 font-semibold mb-1'>Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className='border border-gray-300 w-full rounded-md py-3 px-3 focus:outline-none focus:border-blue-500'
                    />
                  </div>

                  <div className='flex flex-col mb-4'>
                    <label className='text-gray-700 font-semibold mb-1'>Countries</label>
                    <div className='flex items-center'>
                      {Object.keys(countries).map((country) => (
                        <div key={country} className='mr-4'>
                          <input
                            type="checkbox"
                            id={country.toLowerCase()}
                            name={country}
                            checked={countries[country]}
                            onChange={() => handleCountryChange(country)}
                            className='mr-2'
                          />
                          <label htmlFor={country.toLowerCase()}>{country}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Dropdown2
                    selectedOptions={ATC2}
                    setSelectedOptions={handleDropdownChange}
                  />

                  <div className='flex flex-col mb-4'>
                    <label htmlFor='password' className='text-gray-700 font-semibold mb-1'>Password</label>
                    <div className="flex flex-row border justify-between border-gray-300 rounded-md py-3 px-3 focus:outline-none focus:border-blue-500">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full outline-none"
                      />
                      <button
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    </div>
                  </div>
                </form>

                <section className='flex flex-col my-9 w-full'>
                  <button
                    className='bg-primary py-3 text-white px-3 rounded-md'
                    onClick={onSubmit}
                    disabled={!email || !company || !password || (!countries.nigeria && !countries.ghana)}
                  >
                    Sign Up
                  </button>
                  <div><p> Don&apos;t have an account yet? Contact us</p></div>
                </section>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
