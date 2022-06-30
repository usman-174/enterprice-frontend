import Table from "@mui/material/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../assests/logo.png";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  TablePagination,
  TextField,
  Typography
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import UpdateLicense from "../components/dashboard/EditLicense";
import { useUser } from "../Store";
const ComingLicenses = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [AllLicenses, setAllLicenses] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

  const [suppliers, setSuppliers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);

  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const handleDepartmentFilter = (event) => {
    console.log("-----------" , event.target.value);
    setDepartmentFilter(event.target.value);
    if (event.target.value === "All Departments") {
      console.log("WORKING");
      let data = [];
      user.manageList.forEach((dept) => {
        const filteredLicenses = AllLicenses.filter(
          (license) => license.department._id === dept._id
        );
        data = [...data,...filteredLicenses];
      });
      setLicenses(data);
    } else {
      const foundDept = departmentList.find(x=>x.name ===event.target.value)
      const data = AllLicenses.filter(
        (license) => license.department._id === foundDept._id
      );
      setLicenses(data);
    }
  };
  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get("departments");
      if (data?.departments) {
        setDepartmentList(data?.departments);
      }
    } catch (error) {
      return;
    }
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("licenses");

      if (data?.licenses) {
        const nextYearLicenses = data?.licenses.filter(
          (val) => val.year > new Date().getFullYear()
        );
        setAllLicenses(nextYearLicenses);
        let datax = [];
        user.manageList.forEach((dept) => {
          const filteredLicenses = nextYearLicenses.filter(
            (license) => license.department._id === dept._id
          );
          datax = [...datax, ...filteredLicenses];
        });
        setLicenses(datax);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.message);

      alert(error?.response.data.message);
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const { data } = await axios.get("donors");

      if (data?.donors) {
        setDonors(data?.donors);
      }
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };
  const fetchSupplier = async () => {
    try {
      const { data } = await axios.get("suppliers");

      if (data?.suppliers) {
        setSuppliers(data?.suppliers);
      }
    } catch (error) {
      console.log(error?.response.data.message);
    }
  };
  useEffect(() => {
    fetchLicenses();
    fetchDepartments();
    fetchSupplier();
    fetchDonors();
    // eslint-disable-next-line
  }, []);
  if (loading && !licenses.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Box sx={{ width: { md: "95%" }, margin: "4rem auto" }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {licenses.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{
              width: { md: "40%", lg: "25%", xs: "80%" },
              margin: "1rem auto",
            }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Licenses"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { md: "left", xs: "center" },
          alignItems: "center",
          flexDirection: { md: "row", xs: "column" },
        }}
      >
      <Typography
        variant="small"
        sx={{
          fontSize: "15px",
          display: { md: "inline", xs: "block" },
          margin: { md: "0 40px", xs: 2 },
          color: "#3D57DB",
          textDecoration: "none",
        }}
        component={Link}
        to={"/"}
      >
        Show this year licenses
      </Typography>
      {user?.role === "director" ? (
          <FormControl
            size="small"
            sx={{ width: { md: "20%", xs: "75%" }, mx: 2 }}
          >
            <InputLabel id="demo-simple2-select-label">Departments</InputLabel>
            <Select
              labelId="demo-simple2-select-label"
              id="demo-simple2-select"
              value={departmentFilter}
              defaultValue={"All Departments"}
              label="Departments"
              onChange={handleDepartmentFilter}
            >
              <MenuItem value={"All Departments"}>All Departments</MenuItem>
              {user.manageList.map((dept) => (
                <MenuItem key={dept._id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
        </Box>
      {licenses.length ? (
        <>
          <TableContainer>
            <Table
              size="small"
              sx={{
                padding: "5px 10px",
                margin: "auto",
                width: "94%",
                textAlign: "center",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Department Direction
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Department Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Validity Years
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Days left in Validity Expiry
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Support Years
                  </TableCell>
                 
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Donor Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Supplier Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Supplier Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Url
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Fund Type
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Release Year
                  </TableCell>
                  {!user.seeOnly && user.role !== "director" ? (
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                      Action
                    </TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {licenses.length
                  ? licenses
                      .slice(0, limit)
                      .filter((val) => {
                        const query = searchQ.trim().toLowerCase();
                        let returnValue = false;

                        if (query.length === "") {
                          returnValue = false;
                        } else if (
                          val.name.toLowerCase().includes(query) ||
                          val.description.toLowerCase().includes(query) ||
                          val.type.toLowerCase().includes(query) ||
                          val?.department?.direction.toLowerCase().includes(query)||
                          val?.department?.name.toLowerCase().includes(query)

                        ) {
                          returnValue = true;
                        }
                        return returnValue;
                      })
                      .map((row) => (
                        <TableRow key={row._id}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.department?.direction}
                          </TableCell> 
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.department?.name}
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            {row.description}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.type}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.amount}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.validityTime} years
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.firstDate
                              ? row.daysTillValidityExpiry + " days"
                              : "N/A"}
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            {row.supportTime} years
                          </TableCell>
                          

                         
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.donor ? row.donor : "N/A"}
                          </TableCell>

                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.supplier ? row.supplier : "N/A"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.supplierContact ? row.supplierContact : "N/A"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.url ? row.url : "N/A"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.sourceOfFund ? row.sourceOfFund : "N/A"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row?.year}
                          </TableCell>
                          {!user.seeOnly && user.role !== "director" ? (
                            <TableCell sx={{ textAlign: "center" }}>
                              <UpdateLicense
                                departmentList={departmentList}
                                license={row}
                                donors={donors}
                                suppliers={suppliers}
                                fetchLicenses={fetchLicenses}
                                loading={loading}
                              />
                            </TableCell>
                          ) : null}
                        </TableRow>
                      ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            sx={{ marginRight: "40px" }}
            count={licenses?.length}
            onPageChange={handlePagination}
            onRowsPerPageChange={handleLimitChange}
            page={currentPage}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />{" "}
        </>
      ) : (
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "red", mx: "auto", my: 3, textAlign: "center" }}
        >
          No Licenses Found.
        </Typography>
      )}
    </Box>
  );
};

export default ComingLicenses;
