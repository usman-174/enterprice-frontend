import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import Table from "@mui/material/Table";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import logo from "../../assests/logo.png";
// import ShowMoreText from "react-show-more-text";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AlertDialog from "../../components/AlertDialog";
import AddLicense from "../../components/dashboard/AddLicense";
import UpdateLicense from "../../components/dashboard/EditLicense";
import { toast } from "react-toastify";

const Licenses = () => {
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [AllLicenses, setAllLicenses] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);
  const [showFutureLicenses, setShowFutureLicenses] = useState(false);
  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("licenses/all");

      if (data?.licenses) {
        setAllLicenses(data?.licenses);
        if (!showFutureLicenses) {
          setLicenses(
            data?.licenses.filter((val) => val.year <= new Date().getFullYear())
          );
        } else {
          setLicenses(
            data?.licenses.filter((val) => val.year > new Date().getFullYear())
          );
        }
        setLicenses(data?.licenses);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the Licenses", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      setLoading(false);
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete("licenses/" + id);
      if (data?.success) {
        return fetchLicenses();
      }
    } catch (error) {
      toast.error(
        error?.response.data.message || "Failed to Delete the License",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        }
      );
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
  const fetchDonors = async () => {
    try {
      const { data } = await axios.get("donors");

      if (data?.donors) {
        setDonors(data?.donors);
      }
    } catch (error) {
      console.error(error?.response.data.message);
    }
  };
  const fetchSupplier = async () => {
    try {
      const { data } = await axios.get("suppliers");

      if (data?.suppliers) {
        setSuppliers(data?.suppliers);
      }
    } catch (error) {
      console.error(error?.response.data.message);
    }
  };
  useEffect(() => {
    if (AllLicenses.length) {
      if (!showFutureLicenses) {
        setLicenses(
          AllLicenses.filter((val) => val.year <= new Date().getFullYear())
        );
      } else {
        setLicenses(
          AllLicenses.filter((val) => val.year > new Date().getFullYear())
        );
      }
    }
  }, [setShowFutureLicenses, AllLicenses, showFutureLicenses]);
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
    <Box sx={{ margin: "20px" }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {licenses.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Licenses"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddLicense
        fetchLicenses={fetchLicenses}
        departmentList={departmentList}
        donors={donors}
        suppliers={suppliers}
        loading={loading}
      />
      <FormGroup sx={{ ml: 5 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showFutureLicenses}
              onChange={(e) => setShowFutureLicenses(e.target.checked)}
            />
          }
          label="Show Future Licenses"
        />
      </FormGroup>
      <TableContainer>
        <Table
          size="small"
          sx={{
            padding: "10px",
            margin: "auto",

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
                Url
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
                        <ReadMore limit={40}>{row?.name}</ReadMore>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row?.department?.name}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        <ReadMore limit={150}>{row.description}</ReadMore>
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
                          ? row.daysTillValidityExpiry > 0
                            ? row.daysTillValidityExpiry + " days"
                            : "EXPIRED"
                          : "N/A"}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {row.supportTime} years
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.firstDate
                          ? row.daysTillSupportExpiry > 0
                            ? row.daysTillSupportExpiry + " days"
                            : "EXPIRED"
                          : "N/A"}
                      </TableCell>

                      <TableCell sx={{ textAlign: "center" }}>
                        {row.firstDate
                          ? moment(row.firstDate).format("MM/DD/YYYY")
                          : "N/A"}
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

                      <TableCell sx={{ textAlign: "center" }}>
                        <AlertDialog handleDelete={handleDelete} id={row._id} />

                        <UpdateLicense
                          departmentList={departmentList}
                          license={row}
                          fetchLicenses={fetchLicenses}
                          loading={loading}
                          donors={donors}
                          suppliers={suppliers}
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
function ReadMore({ children,limit }) {
  const text = children;

  const [isShow, setIsShowLess] = useState(true);
  const result = isShow ? text.slice(0, limit) : text;
  const isLonger = text.length > limit;

  function toggleIsShow() {
    setIsShowLess(!isShow);
  }

  return (
    <p>
      {result}
      {isLonger ? (
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ color: "blue", cursor: "pointer" }}
          onClick={toggleIsShow}
        >
          {isShow ? "  Read More" : "  Read Less"}
        </Typography>
      ) : null}
    </p>
  );
}

export default Licenses;
