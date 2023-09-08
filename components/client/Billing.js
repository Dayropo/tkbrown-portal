import useSWR from "swr"
import axios from "axios"
import { useRouter } from "next/router"
import Image from "next/image"
import payPal from "../../public/paypal.png"
import { useState } from "react"
import Swal from "sweetalert2"

const Billing = ({ user, company }) => {
  //form styles
  const inputStyles =
    "text-black font-normal bg-purple-50 px-4 pt-2 pb-1.5 border-b-2 border-gray-400 w-full placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-none focus:border-purple-600"

  // billings state
  const [billingEmail, setBillingEmail] = useState("")
  const [paypal, setPaypal] = useState(false)
  const [paypalEmail, setPaypalEmail] = useState("")

  //input states
  const [bankDetails, setBankDetails] = useState({
    account_number: "",
    bank_name: "",
    bank_swift: "",
    bank_address: "",
  })

  //error states
  const [transferErrors, setTransferErrors] = useState({
    billingEmail: "",
    accountNumber: "",
    bankName: "",
    bankSwift: "",
    bankAddress: "",
  })

  const [paypalErrors, setPaypalErrors] = useState({
    billingEmail: "",
    paypalEmail: "",
  })

  //toggle transfer or paypal
  const toggleOptions = () => {
    setPaypal(prev => !prev)
  }

  //   const { data: client, error } = useSWR("client", async () => {
  //     const res = await axios
  //       .get(`/api/clients?email=${user?.email}`)
  //       .catch(error => {
  //         return error?.response
  //       })
  //     return res?.data
  //   })

  //validation handlers
  const validateBillingTransfer = () => {
    let isValid = true

    if (billingEmail) {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      )
      if (pattern.test(billingEmail)) {
        setTransferErrors(prevState => ({
          ...prevState,
          billingEmail: "",
        }))
      } else {
        isValid = false
        setTransferErrors(prevState => ({
          ...prevState,
          billingEmail: "Provide a valid email",
        }))
      }
    } else {
      isValid = false
      setTransferErrors(prevState => ({
        ...prevState,
        billingEmail: "This field is required",
      }))
    }

    if (bankDetails.account_number) {
      if (
        bankDetails?.account_number.length >= 5 &&
        bankDetails?.account_number.length <= 17
      ) {
        setTransferErrors(prevState => ({
          ...prevState,
          accountNumber: "",
        }))
      } else {
        isValid = false
        setTransferErrors(prevState => ({
          ...prevState,
          accountNumber: "Provide a valid account number",
        }))
      }
    } else {
      isValid = false
      setTransferErrors(prevState => ({
        ...prevState,
        accountNumber: "This field is required",
      }))
    }

    if (!bankDetails?.bank_address) {
      isValid = false
      setTransferErrors(prevState => ({
        ...prevState,
        bankAddress: "This field is required",
      }))
    }

    if (!bankDetails?.bank_name) {
      isValid = false
      setTransferErrors(prevState => ({
        ...prevState,
        bankName: "This field is required",
      }))
    }

    if (bankDetails.bank_swift) {
      if (
        bankDetails?.bank_swift.length >= 8 &&
        bankDetails.bank_swift.length <= 11
      ) {
        setTransferErrors(prevState => ({
          ...prevState,
          bankSwift: "",
        }))
      } else {
        isValid = false
        setTransferErrors(prevState => ({
          ...prevState,
          bankSwift: "Provide a valid bank swift or bic code",
        }))
      }
    } else {
      isValid = false
      setTransferErrors(prevState => ({
        ...prevState,
        bankSwift: "This field is required",
      }))
    }

    return isValid
  }

  const validateBillingPaypal = () => {
    let isValid = true

    if (billingEmail) {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      )
      if (pattern.test(billingEmail)) {
        setPaypalErrors(prevState => ({
          ...prevState,
          billingEmail: "",
        }))
      } else {
        isValid = false
        setPaypalErrors(prevState => ({
          ...prevState,
          billingEmail: "Provide a valid email",
        }))
      }
    } else {
      isValid = false
      setPaypalErrors(prevState => ({
        ...prevState,
        billingEmail: "This field is required",
      }))
    }

    if (paypalEmail) {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      )
      if (pattern.test(paypalEmail)) {
        setPaypalErrors(prevState => ({
          ...prevState,
          paypalEmail: "",
        }))
      } else {
        isValid = false
        setPaypalErrors(prevState => ({
          ...prevState,
          paypalEmail: "Provide a valid email",
        }))
      }
    } else {
      isValid = false
      setPaypalErrors(prevState => ({
        ...prevState,
        paypalEmail: "This field is required",
      }))
    }

    return isValid
  }

  // submit handlers
  const addBillingTransfer = async e => {
    e.preventDefault()
    const validation = validateBillingTransfer()
    if (validation) {
      const res = await axios
        .put(`/api/v2/billings/transfer`, {
          client_company: company,
          billing_email: billingEmail,
          bank_name: bankDetails.bank_name,
          account_number: bankDetails.account_number,
          bank_swift: bankDetails.bank_swift,
          bank_address: bankDetails.bank_address,
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
      if (res?.status === 201 || 204) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: res?.data?.message,
          position: "top",
          timer: 5000,
          showConfirmButton: false,
        })
        setBankDetails({
          account_number: "",
          bank_name: "",
          bank_swift: "",
          bank_address: "",
        })
        setBillingEmail("")
      }
    }
  }

  const addBillingPaypal = async e => {
    e.preventDefault()

    const validation = validateBillingPaypal()
    if (validation) {
      const res = await axios
        .put(`/api/v2/billings/paypal`, {
          client_company: company,
          billing_email: billingEmail,
          paypal_email: paypalEmail,
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
      if (res?.status === 201 || 204) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: res?.data?.message,
          position: "top",
          timer: 5000,
          showConfirmButton: false,
        })
        setPaypalEmail("")
        setBillingEmail("")
      }
    }
  }

  return (
    <div className="py-4">
      <span className="font-semibold text-lg">Billing</span>
      {/**billing address */}
      <form className="w-full mt-8">
        <div className="w-full">
          <input
            type="text"
            id="billingEmail"
            placeholder="Email address to receive bills *"
            required
            autoComplete="off"
            className={inputStyles}
            value={billingEmail}
            onChange={e => {
              setPaypalErrors({
                billingEmail: "",
                paypalEmail: "",
              })
              setTransferErrors({
                accountNumber: "",
                bankAddress: "",
                bankName: "",
                bankSwift: "",
                billingEmail: "",
              })
              setBillingEmail(e.target.value)
            }}
          />
          {paypal ? (
            <p className="sm:text-sm text-xs text-red-500 mt-2.5">
              {paypalErrors?.billingEmail}
            </p>
          ) : (
            <p className="sm:text-sm text-xs text-red-500 mt-2.5">
              {transferErrors?.billingEmail}
            </p>
          )}
        </div>
      </form>

      {/** billing details */}
      <div className="py-4 mt-4">
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
                placeholder="PayPal email address *"
                required
                autoComplete="off"
                className={inputStyles}
                value={paypalEmail}
                onChange={e => {
                  setPaypalErrors({
                    billingEmail: "",
                    paypalEmail: "",
                  })
                  setPaypalEmail(e.target.value)
                }}
              />
              <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                {paypalErrors?.paypalEmail}
              </p>
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
                  placeholder="Bank name *"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.bank_name}
                  onChange={e => {
                    setTransferErrors({
                      accountNumber: "",
                      bankAddress: "",
                      bankName: "",
                      bankSwift: "",
                      billingEmail: "",
                    })
                    setBankDetails({
                      ...bankDetails,
                      bank_name: e.target.value,
                    })
                  }}
                />
                <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                  {transferErrors?.bankName}
                </p>
              </div>
              <div className="w-1/2 pl-4">
                <input
                  type="number"
                  id="account"
                  placeholder="Bank account number *"
                  pattern="[0-9]*"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.account_number}
                  onChange={e => {
                    setTransferErrors({
                      accountNumber: "",
                      bankAddress: "",
                      bankName: "",
                      bankSwift: "",
                      billingEmail: "",
                    })
                    setBankDetails({
                      ...bankDetails,
                      account_number: e.target.value,
                    })
                  }}
                />
                <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                  {transferErrors?.accountNumber}
                </p>
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
                  onChange={e => {
                    setTransferErrors({
                      accountNumber: "",
                      bankAddress: "",
                      bankName: "",
                      bankSwift: "",
                      billingEmail: "",
                    })
                    setBankDetails({
                      ...bankDetails,
                      bank_swift: e.target.value,
                    })
                  }}
                />
                <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                  {transferErrors?.bankSwift}
                </p>
              </div>
              <div className="w-1/2 pl-4">
                <input
                  type="text"
                  id="bank-address"
                  placeholder="Bank address *"
                  required
                  autoComplete="off"
                  className={inputStyles}
                  value={bankDetails.bank_address}
                  onChange={e => {
                    setTransferErrors({
                      accountNumber: "",
                      bankAddress: "",
                      bankName: "",
                      bankSwift: "",
                      billingEmail: "",
                    })
                    setBankDetails({
                      ...bankDetails,
                      bank_address: e.target.value,
                    })
                  }}
                />
                <p className="sm:text-sm text-xs text-red-500 mt-2.5">
                  {transferErrors?.bankAddress}
                </p>
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
    </div>
  )
}

export default Billing
