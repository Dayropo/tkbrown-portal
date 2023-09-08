import useSWR from "swr"
import { useState } from "react"
import { fetcher } from "../../lib/fetcher"
import { MdAddchart } from "react-icons/md"
import * as yup from "yup"
import { useFormik } from "formik"
import { styled } from "@mui/material/styles"
import { TextField, Box, MenuItem } from "@mui/material"
import axios from "axios"
import Swal from "sweetalert2"
import { status } from "../../utils/data"
import EditInvoiceModal from "./EditInvoiceModal"

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "#000000",
  },
  "& .MuiSvgIcon-root": {
    color: "rgb(156 163 175)",
  },
  "& label": {
    color: "rgb(156 163 175)",
  },
  "&:hover label": {
    fontWeight: 700,
  },
  "& label.Mui-focused": {
    color: "rgb(156 163 175)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "rgb(156 163 175)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgb(156 163 175)",
    },
    "&:hover fieldset": {
      borderColor: "rgb(156 163 175)",
      borderWidth: 2,
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgb(156 163 175)",
    },
  },
})

const billingSchema = yup.object({
  invoice_number: yup
    .string("Enter the invoice number")
    .required("This field is required"),
  period: yup
    .string("Enter the invoice period")
    .required("This field is required"),
  amount: yup.string("Enter the amount").required("This field is required"),
  client_email: yup
    .string("Enter the client email")
    .email("Enter a valid email")
    .required("This field is required"),
  client_domain: yup
    .string("Enter the client domain")
    .required("This field is required"),
  status: yup
    .string("Enter the invoice status")
    .required("This field is required"),
})

const Billings = () => {
  const [invoiceIndex, setInvoiceIndex] = useState(0)
  const [selectedInvoice, setSelectedInvoice] = useState({})
  const [showModal, setShowModal] = useState(false)

  const formik = useFormik({
    initialValues: {
      invoice_number: "",
      period: "",
      amount: "",
      client_email: "",
      client_domain: "",
      status: "",
    },
    validationSchema: billingSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const response = await axios
        .post("/api/v2/invoice/", {
          invoice_number: values.invoice_number,
          period: values.period,
          amount: `${values.amount} €`,
          client_email: values.client_email,
          client_domain: values.client_domain,
          status: values.status,
        })
        .catch(err => {
          Swal.fire({
            toast: true,
            icon: "error",
            title: err?.response?.data?.message,
            position: "top",
            timer: 5000,
            showConfirmButton: false,
          })
        })
      if (response?.status === 201) {
        Swal.fire({
          toast: true,
          icon: "success",
          title: response?.data?.message,
          position: "top",
          timer: 5000,
          showConfirmButton: false,
        })
        resetForm()
      }
    },
  })

  const { data: billings, error: billingsError } = useSWR(
    `/api/v2/clients/billings`,
    fetcher
  )

  const { data: invoices, error: invoiceError } = useSWR(
    `/api/v2/invoice?index=${invoiceIndex}`,
    fetcher
  )

  return (
    <div className="py-4 relative">
      {showModal && (
        <EditInvoiceModal
          selectedInvoice={selectedInvoice}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <span className="font-semibold text-lg mb-8">Billings</span>
      {billings?.length > 0 ? (
        <div className="mt-8 hidden sm:flex flex-col">
          <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
            <span className="w-1/5 text-center sm:text-base text-sm">
              Company
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Billing Email
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Account Number
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Bank Name
            </span>
            <span className="w-1/5 text-center sm:text-base text-sm">
              Paypal Email
            </span>
          </div>

          {billings?.map((item, index) => (
            <div
              className={`${
                index === billings.length - 1 ? "rounded-b-md" : null
              } flex w-full py-3 bg-white text-black items-center divide-x-1 divide-black`}
              key={index}
            >
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.client_company ? item?.client_company : "-"}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.billing_email ? item?.billing_email : "-"}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.account_number ? item?.account_number : "-"}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.bank_name ? item?.bank_name : "-"}
              </span>
              <span className="w-1/5 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.paypal_email ? item?.paypal_email : "-"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <MdAddchart size={200} className="text-purple-500" />
            <p className="font-medium text-gray-400">No data found</p>
          </div>
        </div>
      )}

      {invoices?.length > 0 && (
        <div className="mt-16">
          <span className="font-semibold text-lg mb-8">Invoices</span>

          <div className="mt-8 flex flex-col">
            <div className="flex w-full py-3 bg-purple-400 rounded-t-md text-white items-end">
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5">
                Invoice No
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5">
                Period
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5">
                Amount
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5">
                Email
              </span>
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5">
                Domain
              </span>
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5">
                Status
              </span>
            </div>
          </div>

          {/**invoice mapping */}
          {invoices?.map((item, index) => (
            <div
              className={`${
                index === invoices.length - 1 ? "rounded-b-md" : null
              } flex w-full py-3 bg-white text-black items-center divide-x-1 divide-black cursor-pointer`}
              key={item?.id}
              onClick={() => {
                setShowModal(true)
                setSelectedInvoice(item)
              }}
            >
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.invoice_number}
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5 break-words">
                {item?.period}
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5 break-words">
                {item?.amount}
              </span>
              <span className="w-2/12 hidden lg:block text-center sm:text-base text-sm px-2.5 break-words">
                {item?.client_email}
              </span>
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.client_domain}
              </span>
              <span className="w-1/3 lg:w-2/12 text-center sm:text-base text-sm px-2.5 break-words">
                {item?.status}
              </span>
            </div>
          ))}

          <div
            className={`${
              invoiceIndex ? "justify-between" : "justify-end"
            } w-full flex items-center bg-white py-2.5 px-4`}
          >
            <button
              className={`${
                invoiceIndex ? "flex" : "hidden"
              } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
              onClick={() => setInvoiceIndex(invoiceIndex - 1)}
            >
              Prev
            </button>
            <button
              className={`${
                invoices?.length < 5 ? "hidden" : "flex"
              } bg-purple-400 text-white py-1.5 px-6 rounded-2xl`}
              onClick={() => setInvoiceIndex(invoiceIndex + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="mt-16">
        <span className="font-semibold text-lg mb-8">Add a new Invoice</span>
        <Box component="form" noValidate autoComplete="off">
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/**invoice number */}
            <StyledTextField
              variant="standard"
              id="invoice_number"
              size="small"
              label="Invoice No"
              value={formik.values.invoice_number}
              onChange={formik.handleChange("invoice_number")}
              error={
                formik.touched.invoice_number &&
                Boolean(formik.errors.invoice_number)
              }
              helperText={
                formik.touched.invoice_number && formik.errors.invoice_number
              }
              sx={{
                mt: "1.5rem",
                width: { xs: "100%", sm: "30%" },
              }}
            />

            {/**period */}
            <StyledTextField
              variant="standard"
              id="period"
              size="small"
              label="Period"
              value={formik.values.period}
              onChange={formik.handleChange("period")}
              error={formik.touched.period && Boolean(formik.errors.period)}
              helperText={formik.touched.period && formik.errors.period}
              sx={{
                mt: "1.5rem",
                width: { xs: "45%", sm: "30%" },
              }}
            />

            {/**amount*/}
            <StyledTextField
              variant="standard"
              id="amount"
              size="small"
              label="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange("amount")}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              sx={{
                mt: "1.5rem",
                width: { xs: "45%", sm: "30%" },
              }}
            />

            {/**client email*/}
            <StyledTextField
              variant="standard"
              id="client_email"
              size="small"
              label="Client Email"
              value={formik.values.client_email}
              onChange={formik.handleChange("client_email")}
              error={
                formik.touched.client_email &&
                Boolean(formik.errors.client_email)
              }
              helperText={
                formik.touched.client_email && formik.errors.client_email
              }
              sx={{
                mt: "1.5rem",
                width: { xs: "100%", sm: "30%" },
              }}
            />

            {/**Client Domain */}
            <StyledTextField
              variant="standard"
              id="client_domain"
              size="small"
              label="Client Domain"
              value={formik.values.client_domain}
              onChange={formik.handleChange("client_domain")}
              error={
                formik.touched.client_domain &&
                Boolean(formik.errors.client_domain)
              }
              helperText={
                formik.touched.client_domain && formik.errors.client_domain
              }
              sx={{
                mt: "1.5rem",
                width: { xs: "100%", sm: "30%" },
              }}
            />

            {/**status */}
            <StyledTextField
              variant="standard"
              id="status"
              size="small"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange("status")}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              select
              sx={{
                mt: "1.5rem",
                width: { xs: "100%", sm: "30%" },
              }}
            >
              {status.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          </Box>

          <button
            className="mt-8 bg-purple-500 text-white py-2 px-6 rounded text-sm"
            onClick={e => formik.handleSubmit(e)}
          >
            ADD INVOICE
          </button>
        </Box>
      </div>
    </div>
  )
}

export default Billings
