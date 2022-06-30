import { Box, TableContainer, TablePagination, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../../assests/logo.png";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import AlertDialog from "../../components/AlertDialog";
import AddDepartment from "../../components/dashboard/AddDepartment";
import UpdateDepartment from "../../components/dashboard/EditDepartment";
const Departments = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);


  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);
  const [directions, setDirections] = useState([]);
  const fetchDirections = async () => {
      try {
        
        const { data } = await axios.get("directions");
  
        if (data?.directions) {
          setDirections(data?.directions);
        }
     
      } catch (error) {
        
      
      }
    };
  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const handleDeleteDepartments = async (id) => {
    try {
      console.log("Deleting Department");
      const { data } = await axios.delete(`/departments/${id}`);
      if (data?.success) {
        fetchDepartments();
      }
    } catch (error) {
      alert(error?.response.data.message);
    }
  };
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("departments");

      if (data?.departments) {
        setDepartments(data?.departments);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
    }
  };
 

  useEffect(() => {
    fetchDepartments();
    fetchDirections()
    // eslint-disable-next-line
  }, []);
  if (loading && !departments.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Box sx={{ margin: "20px" }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {departments.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Departments"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddDepartment
       directions={directions}
        fetchDepartments={fetchDepartments}
      />
      <TableContainer>
        <Table
          size="small"
          sx={{
            padding: "10px",
            margin: "auto",
            width: "94%",
            textAlign: "center",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Direction</TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CreatedAt</TableCell>

              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments
              .slice(0, limit)
              .filter((val) => {
                const query = searchQ.trim().toLowerCase();
                let returnValue = false;

                if (query.length === "") {
                  returnValue = false;
                } else if (
                  val.name.toLowerCase().includes(query) ||
                  val.description.toLowerCase().includes(query)
                ) {
                  returnValue = true;
                }
                return returnValue;
              })
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row._id}</TableCell>

                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row?.direction || "N/A"}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    {moment(row.createdAt).format("MM/DD/YYYY")}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog
                      handleDelete={handleDeleteDepartments}
                      id={row._id}
                    />
                    <UpdateDepartment
                      loading={loading}
                      directions={directions}
                      fetchDepartments={fetchDepartments}
                      department={row}
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
        count={departments?.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Departments;
