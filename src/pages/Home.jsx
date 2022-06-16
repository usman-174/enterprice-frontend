import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import logo from "../assests/logo.png";

import { Box, TableContainer, TablePagination, TextField } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import UpdateLicense from "../components/dashboard/EditLicense";
import AddLicense from "../components/dashboard/AddLicense";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [allLicenses, setAllLicenses] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
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
        setAllLicenses(data?.licenses);
        const datax = data?.licenses.filter(
          (val) => val.year <= new Date().getFullYear()
        );
        setLicenses(datax);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.message);

      alert(error?.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (checked) {
      setLicenses(
        allLicenses.filter((val) => {
          let returnValue = false;
          if (Number(val.year) > new Date().getFullYear()) {
            returnValue = true;
          }
          return returnValue;
        })
      );
    } else {
      const data = allLicenses.filter(
        (val) => val.year <= new Date().getFullYear()
      );
      setLicenses(data);
    }

    // eslint-disable-next-line
  }, [checked, setAllLicenses, allLicenses]);
  useEffect(() => {
    fetchLicenses();
    fetchDepartments();

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
      <FormControlLabel
        sx={{ marginLeft: { md: "3rem", xs: "20px" } }}
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="Show future Licenses"
      />
      <br />
      <AddLicense
        fetchLicenses={fetchLicenses}
        departmentList={departmentList}
      />
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
                Department
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
                Days left in Support Expiry
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                First Donate/Purchase
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
                Fund Type
              </TableCell>
             
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Release Year
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
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
                        {row.firstDate
                          ? row.daysTillSupportExpiry + " days"
                          : "N/A"}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {row.firstDate
                          ? moment(row.firstDate).format("MM/DD/YYYY")
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.donor ? row.donor  : "N/A"}
                      </TableCell>
                     
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.supplier ? row.supplier  : "N/A"}

                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.supplierContact ? row.supplierContact  : "N/A"}

                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.sourceOfFund ? row.sourceOfFund  : "N/A"}

                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.year}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <UpdateLicense
                          departmentList={departmentList}
                          license={row}
                          fetchLicenses={fetchLicenses}
                          loading={loading}
                        />
                      </TableCell>
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
      />
    </Box>
  );
};

export default Home;
