import { Box, TableContainer, TablePagination, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import logo from "../../assests/logo.png";
import AlertDialog from "../../components/AlertDialog";
import EditDonor from "../../components/dashboard/EditDonors"
import AddDonor from "../../components/dashboard/AddDonor";

const Donors = () => {
  const [loading, setLoading] = useState(true);
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
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("donors");

      if (data?.donors) {
        setDonors(data?.donors);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    try {
      const { data } = await axios.delete("suppliers/" + id);
      if (data?.success) {
        return fetchDonors();
      }
    } catch (error) {
      alert("Failed to delete the Supplier");
    }
  };
  useEffect(() => {
    fetchDonors();

    // eslint-disable-next-line
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
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
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
              .filter((val) => {
                const query = searchQ.trim().toLowerCase();
                let returnValue = false;

                if (query.length === "") {
                  returnValue = false;
                } else if (val.name.toLowerCase().includes(query)) {
                  returnValue = true;
                }
                return returnValue;
              })
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell >{row._id}</TableCell>
                  <TableCell>{row.name}</TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog
                      handleDelete={handleDeleteDonor}
                      id={row._id}
                    />
                    <EditDonor fetchDonors={fetchDonors} donor={row} loading={loading} />
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
