import {
  Autocomplete,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React from "react";

const AddLicense = ({
  departmentList,
  fetchLicenses,
  loading,
  donors,
  suppliers,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [firstDate, setFirstDate] = React.useState(Date.now());
  const [donor, setDonor] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [lempirasPrice, setLempirasPrice] = React.useState(0);
  const [supplier, setSupplier] = React.useState("");
  const [supplierContact, setSupplierContact] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [amount, setAmount] = React.useState(0);
  const [supportTime, setSupportTime] = React.useState(0);
  const [validityTime, setValidityTime] = React.useState(0);

  const [sku, setSku] = React.useState("");
  const [type, setType] = React.useState("");
  const [sourceOfFund, setSourceOfFund] = React.useState("");

  const [error, setError] = React.useState("");

  const [department, setDepartment] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");

  const handleDepartmentChange = (e, v) => {
    if (v?.length) {
      setSelectedDepartment(v);
      const result = departmentList.find((x) => x.name === v);
      if (result) {
        setDepartment(result._id)
      }else{
        setError("Invalid Department")
      }
    }
  };
  

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setYear(new Date().getFullYear() + 1);
    } else {
      setYear(new Date().getFullYear());
    }
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    if (
      !name ||
      !department ||
      !description ||
      !sourceOfFund ||
      !type ||
      !sku ||
      !url ||
      !validityTime ||
      !supportTime ||
      !amount ||
      !supplier ||
      !supplierContact ||
      !lempirasPrice ||
      !year
    ) {
      return setError("Please provide all details");
    }
    if(sourceOfFund === "donation" && !donor){
      return setError("Please select a Donor");

    }
    // return
    try {
      const { data } = await axios.post("licenses", {
        type,
        name,
        firstDate: !checked
          ? new Date(firstDate?.toLocaleString()).toISOString()
          : undefined,
        description,
        sku,
        year,
        validityTime,
        supportTime,
        amount,
        sourceOfFund,
        department,
        donor: sourceOfFund === "own" ? undefined : donor,
        supplier,
        supplierContact,
        lempirasPrice,
      });
      if (data?.success) {
        fetchLicenses();
        e.target.reset();
        return handleClose();
      }
    } catch (error) {
      return setError(error?.response.data.message);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disabled={loading}
        size="small"
        sx={{ margin: { md: "20px 40px", xs: "10px" } }}
      >
        Add License
      </Button>
      <Drawer anchor={"right"} open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{
            width: { md: 500, xs: "98%" },
            p: 2,
            mt: { md: 5, xs: 2 },
            mx: "auto",
          }}
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
                my: 2,
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
              <FormControl
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
              </FormControl>
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
                    disabled={checked}
                   
                    onChange={(e) => setFirstDate(e)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="For Next Year"
              />
            </Box>
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{
                margin: "20px auto",
                backgroundColor: "#f2f232",
                color: "#3D57DB",
                "&:hover": {
                  color: "#FFFF00",
                },
              }}
            >
              Add License
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

export default AddLicense;
