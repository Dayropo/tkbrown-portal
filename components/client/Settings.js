import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import axios from "axios"
import { useState } from "react"
import Swal from "sweetalert2"

const Settings = ({ user }) => {
  //form styles
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"
  const [inputType, setInputType] = useState("password")

  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({
    password: "",
    confirmPassword: "",
  })

  const validateUpdatePassword = () => {
    let isValid = true

    if (password?.new) {
      const pattern = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      if (pattern.test(password?.new)) {
        setPasswordErrors(prevState => ({
          ...prevState,
          password: "",
        }))
      } else {
        isValid = false
        setPasswordErrors(prevState => ({
          ...prevState,
          password:
            "Password must contain a minimun of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        }))
      }
    } else {
      isValid = false
      setPasswordErrors(prevState => ({
        ...prevState,
        password: "This field is required",
      }))
    }

    if (password.confirm) {
      if (password?.confirm === password?.new) {
        setPasswordErrors(prevState => ({
          ...prevState,
          confirmPassword: "",
        }))
      } else {
        isValid = false
        setPasswordErrors(prevState => ({
          ...prevState,
          confirmPassword: "Password and confirm password mismatch",
        }))
      }
    } else {
      isValid = false
      setPasswordErrors(prevState => ({
        ...prevState,
        confirmPassword: "This field is required",
      }))
    }

    return isValid
  }

  const updatePassword = async e => {
    e.preventDefault()

    const validation = validateUpdatePassword()
    if (validation) {
      const res = await axios
        // .put(`/api/clients/${clientId}`, {
        .put(`/api/v2/clients?email=${user?.email}`, {
          password: password.new,
        })
        .catch(error =>
          Swal.fire({
            toast: true,
            icon: "error",
            title: error?.response?.data?.message,
            position: "top",
            timer: 5000,
            showConfirmButton: false,
          })
        )
      if (res?.status === 201) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: res?.data?.message,
          position: "top",
          timer: 5000,
          showConfirmButton: false,
        })
        setPassword({
          new: "",
          confirm: "",
        })
        setPasswordErrors({
          password: "",
          confirmPassword: "",
        })
      }
    }
  }

  return (
    <div className="py-4">
      {/**change password */}
      <div className="py-4">
        <span className="text-lg font-semibold">Change Password</span>
        <form className="w-full mt-8">
          <div className="flex w-full">
            <div className="w-1/2 pr-4 relative">
              <input
                type={inputType}
                id="password"
                placeholder="Password *"
                required
                autoComplete="off"
                className={inputStyles}
                value={password.new}
                onChange={e => {
                  setPasswordErrors({
                    password: "",
                    confirmPassword: "",
                  })
                  setPassword({ ...password, new: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {passwordErrors?.password}
              </p>
              <span className="absolute text-gray-600 top-2.5 right-8 z-10">
                {inputType === "password" ? (
                  <FaRegEye size={16} onClick={() => setInputType("text")} />
                ) : (
                  <FaRegEyeSlash
                    size={16}
                    onClick={() => setInputType("password")}
                  />
                )}
              </span>
            </div>
            <div className="w-1/2 pl-4 relative">
              <input
                type={inputType}
                id="confirm"
                placeholder="Confirm Password *"
                required
                autoComplete="off"
                className={inputStyles}
                value={password.confirm}
                onChange={e => {
                  setPasswordErrors({
                    password: "",
                    confirmPassword: "",
                  })
                  setPassword({ ...password, confirm: e.target.value })
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {passwordErrors?.confirmPassword}
              </p>
              <span className="absolute text-gray-600 top-2.5 right-4 z-10">
                {inputType === "password" ? (
                  <FaRegEye size={16} onClick={() => setInputType("text")} />
                ) : (
                  <FaRegEyeSlash
                    size={16}
                    onClick={() => setInputType("password")}
                  />
                )}
              </span>
            </div>
          </div>
          <button
            className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
            onClick={e => updatePassword(e)}
          >
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </div>
  )
}

export default Settings
