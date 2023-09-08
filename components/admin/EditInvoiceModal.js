import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import * as yup from "yup"
import { useFormik } from "formik"
import Swal from "sweetalert2"
import { FiX } from "react-icons/fi"
import axios from "axios"
import { status } from "../../utils/data"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", sm: "65%", md: "50%" },
  bgcolor: "background.paper",
  border: "0px",
  boxShadow: 24,
  p: 4,
  outline: "none",
}

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

const EditInvoiceModal = ({ selectedInvoice, showModal, setShowModal }) => {
  const formik = useFormik({
    initialValues: {
      _id: selectedInvoice._id,
      invoice_number: selectedInvoice.invoice_number,
      period: selectedInvoice.period,
      amount: selectedInvoice.amount,
      client_email: selectedInvoice.client_email,
      client_domain: selectedInvoice.client_domain,
      status: selectedInvoice.status,
    },
    validationSchema: billingSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const response = await axios
        .put("/api/v2/invoice/", {
          _id: values._id,
          invoice_number: values.invoice_number,
          period: values.period,
          amount: values.amount,
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
        setShowModal(false)
      }
    },
  })

  return (
    <Box>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <IconButton
            sx={{ position: "absolute", top: "0px", right: "0px" }}
            onClick={() => setShowModal(false)}
          >
            <FiX />
          </IconButton>

          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", mt: "1rem" }}
          >
            Edit Invoice Details
          </Typography>

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
                  width: { xs: "100%", sm: "45%" },
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
                  width: { xs: "100%", sm: "45%" },
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
                  width: { xs: "100%", sm: "45%" },
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
                  width: { xs: "100%", sm: "45%" },
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
                  width: { xs: "100%", sm: "45%" },
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
                  width: { xs: "100%", sm: "45%" },
                }}
              >
                {status?.map(option => (
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
              EDIT INVOICE
            </button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default EditInvoiceModal
