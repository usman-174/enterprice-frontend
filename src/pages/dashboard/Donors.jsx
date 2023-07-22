import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import logo from "../../assests/logo.png";
import AlertDialog from "../../components/AlertDialog";
import EditDonor from "../../components/dashboard/EditDonors";
import AddDonor from "../../components/dashboard/AddDonor";
import { toast } from "react-toastify";

const Donors = () => {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("donors");
      if (data?.donors) {
        setDonors(data?.donors);
      }
    } catch (error) {
      toast.error("Failed to load Donors", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    try {
      const { data } = await axios.delete("suppliers/" + id);
      if (data?.success) {
        fetchDonors();
      }
    } catch (error) {
      toast.error(
        error?.response.data.message || "Failed to Delete the Donor",
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

  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const filterDonors = (val) => {
    const query = searchQuery.trim().toLowerCase();
    return query.length === 0 || val.name.toLowerCase().includes(query);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  if (loading && !donors.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }

  return (
    <Box sx={{ margin: { md: "50px", xs: "20px" } }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {donors.length ? (
          <TextField
            id="outlined-basic"
            value={searchQuery}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search Donors"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddDonor fetchDonors={fetchDonors} />
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
              <TableCell sx={{ fontWeight: "bold" }}>id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>name</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donors
              .slice(0, limit)
              .filter(filterDonors)
              .map(({ _id, name }) => (
                <TableRow key={_id}>
                  <TableCell>{_id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog handleDelete={handleDeleteDonor} id={_id} />
                    <EditDonor
                      fetchDonors={fetchDonors}
                      donor={{ _id, name }}
                      loading={loading}
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
        count={donors?.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Donors;
