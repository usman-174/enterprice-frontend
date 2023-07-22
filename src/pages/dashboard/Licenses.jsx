import React, { useEffect, useState } from "react";
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
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import logo from "../../assests/logo.png";
import AlertDialog from "../../components/AlertDialog";
import AddLicense from "../../components/dashboard/AddLicense";
import UpdateLicense from "../../components/dashboard/EditLicense";

const Licenses = () => {
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState([]);
  const [allLicenses, setAllLicenses] = useState([]);
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
        const filteredLicenses = data?.licenses.filter((val) => {
          if (!showFutureLicenses) {
            return val.year <= new Date().getFullYear();
          } else {
            return val.year > new Date().getFullYear();
          }
        });
        setLicenses(filteredLicenses);

        const expired = data.licenses.filter(
          (x) => x.daysTillValidityExpiry < 8 && x.daysTillValidityExpiry > 0
        );
        if (expired.length) {
          await axios.post("licenses/notify", { licenses: expired });
        }
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
      // Handle error here
    }
  };

  const fetchDonors = async () => {
    try {
      const { data } = await axios.get("donors");

      if (data?.donors) {
        setDonors(data?.donors);
      }
    } catch (error) {
      // Handle error here
    }
  };

  const fetchSupplier = async () => {
    try {
      const { data } = await axios.get("suppliers");

      if (data?.data) {
        setSuppliers(data?.data);
      }
    } catch (error) {
      // Handle error here
    }
  };

  useEffect(() => {
    fetchLicenses();
    fetchDepartments();
    fetchSupplier();
    fetchDonors();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const filteredLicenses = allLicenses.filter((val) => {
      if (!showFutureLicenses) {
        return val.year <= new Date().getFullYear();
      } else {
        return val.year > new Date().getFullYear();
      }
    });
    setLicenses(filteredLicenses);
  }, [showFutureLicenses, allLicenses]);

  if (loading && !licenses.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }

  const handleSearch = (e) => {
    setSearchQ(e.target.value);
  };

  const filteredLicenses = licenses.filter((val) => {
    const query = searchQ.trim().toLowerCase();
    return (
      query.length === 0 ||
      val.name.toLowerCase().includes(query) ||
      val.description.toLowerCase().includes(query) ||
      val.supplier.toLowerCase().includes(query) ||
      val.donor.toLowerCase().includes(query) ||

      val.type.toLowerCase().includes(query) ||
      (val.department && val.department.name.toLowerCase().includes(query))
    );
  });

  return (
    <Box sx={{ margin: "20px" }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {licenses.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={handleSearch}
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
              onChange={() => setShowFutureLicenses((prev) => !prev)}
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
              {tableHeaderCells.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLicenses
              .slice(0, limit)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell sx={{ textAlign: "center" }}>{row.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.department?.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <ReadMore limit={80}>{row.description}</ReadMore>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.type}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.amount}</TableCell>
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
                  <TableCell sx={{ textAlign: "center" }}>{row?.year}</TableCell>
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        sx={{ marginRight: "40px" }}
        count={filteredLicenses.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

const tableHeaderCells = [
  "Name",
  "Department",
  "Description",
  "Type",
  "Amount",
  "Validity Years",
  "Days left in Validity Expiry",
  "Support Years",
  "Days left in Support Expiry",
  "First Donate/Purchase",
  "Donor Name",
  "Supplier Name",
  "Supplier Contact",
  "URL",
  "Fund Type",
  "Release Year",
  "Action",
];

const ReadMore = React.memo(({ children, limit }) => {
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
          {isShow ? " Read More" : " Read Less"}
        </Typography>
      ) : null}
    </p>
  );
});

export default Licenses;
