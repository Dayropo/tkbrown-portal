import { FaUserCircle, FaUser } from "react-icons/fa"
import useSWR from "swr"
import axios from "axios"
import { useRouter } from "next/router"
import Image from "next/image"
import payPal from "../../public/paypal.png"
import { useState } from "react"

const MyAccount = () => {
  //form styles
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
  })

  // billings state
  const [paypal, setPaypal] = useState(false)
  const [paypalEmail, setPaypalEmail] = useState("")

  //input states
  const [bankDetails, setBankDetails] = useState({
    account_number: "",
    bank_name: "",
    bank_swift: "",
    bank_address: "",
  })

  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  })

  const toggleOptions = () => {
    setPaypal(prev => !prev)
  }
  const router = useRouter()
  const { clientId } = router.query

  const { data: client } = useSWR("client", async () => {
    const res = await axios.get(`/api/clients/${clientId}`).catch(error => {
      console.error(error?.response)
    })
    return res?.data
  })

  const addBillingTransfer = async e => {
    e.preventDefault()

    const res = await axios
      .put(`/api/billings/transfer/${clientId}`, {
        client_id: clientId,
        client_email: client?.email,
        bank_name: bankDetails.bank_name,
        account_number: bankDetails.account_number,
        bank_swift: bankDetails.bank_swift,
        bank_address: bankDetails.bank_address,
      })
      .catch(error => console.error(error?.response))
    if (res?.status === 201 || 204) {
      setBankDetails({
        account_number: "",
        bank_name: "",
        bank_swift: "",
        bank_address: "",
      })
    }
  }

  const addBillingPaypal = async e => {
    e.preventDefault()

    const res = await axios
      .put(`/api/billings/paypal/${clientId}`, {
        client_id: clientId,
        client_email: client?.email,
        paypal_email: paypalEmail,
      })
      .catch(error => console.error(error?.response))
    if (res?.status === 201 || 204) {
      setPaypalEmail("")
    }
  }

  const updatePassword = async e => {
    e.preventDefault()

    if (password.new === password.confirm) {
      const res = await axios
        .put(`/api/clients/${clientId}`, {
          password: password.new,
        })
        .catch(error => console.error(error?.response))
      if (res?.status === 201) {
        setPassword({
          new: "",
          confirm: "",
        })
        setErrors({
          password: false,
        })
      }
    }

    setErrors({
      ...errors,
      confirmPassword: true,
    })
  }

  return (
    <div className="py-4">
      <span className="font-semibold text-lg">My Account</span>
      {/**personal details */}
      <div className="xl:w-2/5 md:w-1/2 mt-5 bg-purple-500 py-6 px-8 rounded-xl text-white flex">
        <div className="rounded-full bg-gray-200 w-16 h-16 flex items-center justify-center mr-2.5">
          <FaUser size={24} />
        </div>
        <div className="mt-2.5">
          <p>{client?.email}</p>
          <p>{client?.company}</p>
        </div>
      </div>

      {/** billing details */}
      <div className="py-4">
        <span className="font-semibold text-lg">Payment Details</span>
        {/**options */}
        <div className="flex w-full mt-6">
          <div className="w-1/2 pr-4 flex items-center">
            <input
              type="checkbox"
              id="transfer"
              className="h-4 w-4 mr-2.5 accent-purple-500"
              checked={!paypal}
              onChange={() => toggleOptions()}
            />
            <label htmlFor="transfer">Bank Transfer</label>
          </div>
          <div className="w-1/2 pl-4 flex items-center">
            <input
              type="checkbox"
              id="paypal"
              className="h-4 w-4 mr-2.5 accent-purple-500 bg-none"
              checked={paypal}
              onChange={() => toggleOptions()}
            />
            <label htmlFor="paypal" className="relative flex h-6 w-20">
              <Image
                src={payPal}
                objectFit="contain"
                layout="fill"
                alt="paypal"
              />
            </label>
          </div>
        </div>

        {paypal ? (
          <form className="w-full mt-8">
            <div className="w-full">
              <input
                type="text"
                id="paypalEmail"
                placeholder="PayPal Email Address *"
                required
                autoComplete="off"
                className={inputStyles}
                value={paypalEmail}
                onChange={e => setPaypalEmail(e.target.value)}
              />
            </div>
            <button
              className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
              onClick={e => addBillingPaypal(e)}
            >
              UPDATE BILLING DETAILS
            </button>
          </form>
        ) : (
          <form className="w-full mt-8">
            <div className="flex w-full">
              <div className="w-1/2 pr-4">
                <input
                  type="text"
                  id="bank"
                  placeholder="Bank Name *"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.bank_name}
                  onChange={e =>
                    setBankDetails({
                      ...bankDetails,
                      bank_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-1/2 pl-4">
                <input
                  type="number"
                  id="account"
                  placeholder="Bank Account Number *"
                  pattern="[0-9]*"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.account_number}
                  onChange={e =>
                    setBankDetails({
                      ...bankDetails,
                      account_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex w-full mt-8">
              <div className="w-1/2 pr-4">
                <input
                  type="text"
                  id="bank-swift"
                  placeholder="Bank Swift/Bic *"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.bank_swift}
                  onChange={e =>
                    setBankDetails({
                      ...bankDetails,
                      bank_swift: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-1/2 pl-4">
                <input
                  type="text"
                  id="bank-address"
                  placeholder="Bank Address *"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.bank_address}
                  onChange={e =>
                    setBankDetails({
                      ...bankDetails,
                      bank_address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
              onClick={e => addBillingTransfer(e)}
            >
              UPDATE BILLING DETAILS
            </button>
          </form>
        )}
      </div>

      {/**change password */}
      <div className="py-4">
        <span className="text-lg font-semibold">Change Password</span>
        <form className="w-full mt-8">
          <div className="flex w-full">
            <div className="w-1/2 pr-4">
              <input
                type="password"
                id="password"
                placeholder="Password *"
                required
                autoComplete="off"
                className={inputStyles}
                value={password.new}
                onChange={e =>
                  setPassword({ ...password, new: e.target.value })
                }
              />
            </div>
            <div className="w-1/2 pl-4">
              <input
                type="password"
                id="confirm"
                placeholder="Confirm Password *"
                required
                autoComplete="off"
                className={inputStyles}
                value={password.confirm}
                onChange={e => {
                  setPassword({ ...password, confirm: e.target.value })
                  setErrors({})
                }}
              />
              {errors.confirmPassword ? (
                <span className="text-sm text-red-500 pt-4">
                  Password and Confirm Password don&apos;t match
                </span>
              ) : null}
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

export default MyAccount
