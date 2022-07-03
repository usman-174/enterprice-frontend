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
import AddSupplier from "../../components/dashboard/AddSupplier";
import EditSupplier from "../../components/dashboard/EditSuppliers";
import { toast } from "react-toastify";
const Suppliers = () => {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);

  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("suppliers");

      if (data?.suppliers) {
        setSuppliers(data?.suppliers);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the Suppliers", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const { data } = await axios.delete("suppliers/" + id);
      if (data?.success) {
        return fetchSuppliers();
      }
    } catch (error) {
      toast.error(
        error?.response.data.message || "Failed to Delete the Supplier",
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
  useEffect(() => {
    fetchSuppliers();

    // eslint-disable-next-line
  }, []);
  if (loading && !suppliers.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Box sx={{ margin: { md: "50px", xs: "20px" } }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {suppliers.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Suppliers"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddSupplier fetchSuppliers={fetchSuppliers} />
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
              <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Url</TableCell>

              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers
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
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.contact ? row.contact : "N/A"}</TableCell>
                  <TableCell>{row.url ? row.url : "N/A"}</TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog
                      handleDelete={handleDeleteSupplier}
                      id={row._id}
                    />
                    <EditSupplier
                      fetchSuppliers={fetchSuppliers}
                      supplier={row}
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
        count={suppliers?.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Suppliers;
