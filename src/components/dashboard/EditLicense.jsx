import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useState } from "react";
import { useUser } from "../../Store";

const UpdateLicense = ({
  loading,
  fetchLicenses,
  license,
  departmentList,
  donors,
  suppliers,
}) => {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = React.useState(
    license?.description || ""
  );
  const [lempirasPrice, setLempirasPrice] = React.useState(
    license?.lempirasPrice || 0
  );

  const [name, setName] = React.useState(license?.name || "");
  const [firstDate, setFirstDate] = React.useState(
    license?.firstDate || Date.now()
  );

  const [amount, setAmount] = React.useState(license?.amount || 0);
  const [supportTime, setSupportTime] = React.useState(
    license?.supportTime || 0
  );
  const [validityTime, setValidityTime] = React.useState(
    license?.validityTime || 0
  );

  const [sku, setSku] = React.useState(license?.sku || "");
  const [type, setType] = React.useState(license?.type || "");

  const [sourceOfFund, setSourceOfFund] = React.useState(
    license?.sourceOfFund || ""
  );
  const [donor, setDonor] = React.useState(license?.donor || "");
  const [url, setUrl] = React.useState(license?.url || "");
  const [supplier, setSupplier] = React.useState(license?.supplier || "");
  const [supplierContact, setSupplierContact] = React.useState(
    license?.supplierContact || ""
  );

  const [error, setError] = React.useState("");
  const [department, setDepartment] = React.useState(
    license?.department._id || ""
  );
  const [selectedDepartment, setSelectedDepartment] = React.useState(
    license?.department.name || ""
  );
  const handleDepartmentChange = (e, v) => {
    if (v?.length) {
      setSelectedDepartment(v);
      const result = departmentList.find((x) => x.name === v);
      if (result) {
        setDepartment(result._id);
      } else {
        setError("Invalid Department");
      }
    }
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    let fields = {};
    if (name && name !== license.name) {
      fields.name = name;
    }
    if (description && description !== license.description) {
      fields.description = description;
    }
    if (sku && sku !== license.sku) {
      fields.sku = sku;
    }
    if (
      firstDate &&
      firstDate !== license.firstDate &&
      license.year <= new Date().getFullYear()
    ) {
      fields.firstDate = firstDate;
    } else {
      fields.firstDate = undefined;
    }

    if (amount && amount !== license.amount) {
      fields.amount = amount;
    }
    if (supportTime && supportTime !== license.supportTime) {
      fields.supportTime = supportTime;
    }
    if (validityTime && validityTime !== license.validityTime) {
      fields.validityTime = validityTime;
    }
    if (type && type !== license.type) {
      fields.type = type;
    }
    if (sourceOfFund && sourceOfFund !== license.sourceOfFund) {
      fields.sourceOfFund = sourceOfFund;
    }
    if (department && department !== license.department && user.role !=="user" ) {
      fields.department = department;
    }else if(user.role ==="user"){
      fields.department = user.department;

    }
    if (sourceOfFund === "donation" && donor && donor !== license.donor) {
      fields.donor = donor;
    }
    if (url && url !== license.url) {
      fields.url = url;
    }
    if (supplier && supplier !== license.supplier) {
      fields.supplier = supplier;
    }
    if (supplierContact && supplierContact !== license.supplierContact) {
      fields.supplierContact = supplierContact;
    }
    if (lempirasPrice && lempirasPrice !== license.lempirasPrice) {
      fields.lempirasPrice = lempirasPrice;
    }
    try {
      const { data } = await axios.put(`licenses/${license._id}`, fields);
      if (data?.success) {
        fetchLicenses();
        if (!loading) {
          return handleClose();
        }
      }
    } catch (error) {
      return setError(error?.response?.data?.message||"Error while Updating the License.");

    }
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        disabled={loading}
        sx={{ margin: "5px" }}
        title="Update User"
        size="small"
        aria-label="delete"
      >
        <BorderColorIcon sx={{ color: "#3D57DB" }} />
      </IconButton>
      <Drawer anchor={"right"} open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{ width: { md: 500, xs: "100%" }, p: 3, mt: { md: 5, xs: 2 } }}
        >
          {error && (
            <FormHelperText
              sx={{
                fontSize: "14px",
                color: "error.dark",
                textAlign: "left",
                margin: "2px",
              }}
            >
              * {error}
            </FormHelperText>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, textAlign: "center" }}
          >
            <TextField
              margin="normal"
              required
              sx={{ width: "90%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              sx={{ width: "90%" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              multiline
              minRows={4}
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
            />

            <FormControl sx={{ width: "90%" }} variant="standard">
              <TextField
                margin="normal"
                required
                fullWidth
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                id="sku"
                label="License Sku"
                name="sku"
                autoComplete="sku"
                autoFocus
              />
            </FormControl>
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-around",
                AlignItems: "center",
              }}
            >
              <TextField
                margin="normal"
                required
                type="number"
                value={amount}
                sx={{ width: "40%" }}
                onChange={(e) => setAmount(e.target.value)}
                id="amount"
                label="Amount"
                name="amount"
                autoComplete="amount"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                sx={{ width: "40%" }}
                type="number"
                value={lempirasPrice}
                onChange={(e) => setLempirasPrice(e.target.value)}
                id="lempirasPrice"
                label="Lempiras Price "
                name="lempirasPrice"
                autoComplete="lempirasPrice"
                autoFocus
              />
            </Box>
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-around",
                AlignItems: "center",
                my: 1,
              }}
            >
              <TextField
                margin="normal"
                required
                type="number"
                value={supportTime}
                onChange={(e) => setSupportTime(e.target.value)}
                id="support"
                sx={{ width: "40%" }}
                label="Support Years"
                name="support"
                autoComplete="support"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                sx={{ width: "40%" }}
                type="number"
                value={validityTime}
                onChange={(e) => setValidityTime(e.target.value)}
                id="validity"
                label="Validity Years"
                name="validity"
                autoComplete="validity"
                autoFocus
              />
            </Box>

            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                my: 1,
              }}
            >
              <FormControl sx={{ width: "40%" }}>
                <InputLabel id="Type-id">Type</InputLabel>
                <Select
                  labelId="Type-id"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value={"continue"}>Continue</MenuItem>

                  <MenuItem value={"subscription"}>Subscription</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                sx={{
                  width: "40%",
                }}
              >
                <InputLabel id="fund-id">Source of Fund</InputLabel>
                <Select
                  labelId="fund-id"
                  id="demo-simple-selectx"
                  value={sourceOfFund}
                  label="Source of Fund"
                  onChange={(e) => setSourceOfFund(e.target.value)}
                >
                  <MenuItem selected value="own">
                    Own
                  </MenuItem>
                  <MenuItem value="donation">Donation</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                my: 1,
              }}
            >
              {sourceOfFund === "donation" ? (
                <FormControl sx={{ width: "40%" }}>
                  <InputLabel id="Donor-id">Donor </InputLabel>
                  <Select
                    labelId="Donor-id"
                    id="demo-simple-select"
                    value={donor}
                    label="Donor"
                    onChange={(e) => setDonor(e.target.value)}
                  >
                    {donors?.map((val) => (
                      <MenuItem key={val._id} value={val.name}>
                        {val.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
              <FormControl
                sx={{ width: sourceOfFund === "donation" ? "40%" : "80%" }}
              >
                <InputLabel id="Supplier-id">Supplier</InputLabel>
                <Select
                  labelId="Supplier-id"
                  id="demo-simple-select"
                  value={supplier}
                  label="Supplier"
                  onChange={(e) => {
                    setSupplier(e.target.value);
                  }}
                >
                  {suppliers?.map((val) => (
                    <MenuItem
                      key={val._id}
                      onClick={() => {
                        setUrl(val?.url || "URl" + val._id);
                        setSupplierContact(val?.contact || "Contact" + val._id);
                      }}
                      value={val.name}
                    >
                      {val.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              component="div"
              display={"flex"}
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                my: 2,
              }}
            >
            {user.role !=="user" ?  <FormControl
                sx={{
                  width: "43%",
                }}
              >
                <Autocomplete
                  id="departments"
                  fullWidth
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  options={departmentList?.map((dept) => dept?.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Department" />
                  )}
                />
              </FormControl>:null}
              <FormControl
                sx={{
                  width: "40%",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="First Date"
                    inputFormat="MM/dd/yyyy"
                    value={firstDate}
                  
                    disabled={license?.year > new Date().getFullYear()}
                    onChange={(e) => setFirstDate(e)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Box>

            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{ margin: "20px auto", textAlign: "center" }}
            >
              Update License
            </Button>
            <Button
              size="large"
              color="error"
              variant="contained"
              onClick={() => setIsOpen(false)}
              sx={{ margin: "20px 10px", textAlign: "center" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default UpdateLicense;
