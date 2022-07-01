import {
  Box,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import logo from "../../assests/logo.png";
import AlertDialog from "../../components/AlertDialog";
import AddDirector from "../../components/dashboard/AddDirector";
import UpdateDirector from "../../components/dashboard/EditDirector";

const Directors = () => {
  const [loading, setLoading] = useState(true);
  const [directors, setDirectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);
  const [departmentList, setDepartmentList] = useState([]);
  const [directions, setDirections] = useState([]);

  const fetchDirections = async () => {
    try {
      const { data } = await axios.get("directions");
      
    if (data?.directions) {
      console.log("Setting Directions");
      setDirections(data?.directions);
    }
    } catch (error) {

      setDirections([]);
      
    }
  };
  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("auth/all_directors");

      if (data?.directors) {
        setDirectors(data?.directors);
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response.data.message);
      setLoading(false);
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
  const handleDeleteUser = async (id) => {
    try {
      const { data } = await axios.delete("auth/" + id);
      if (data?.success) {
        return fetchDirectors();
      }
    } catch (error) {
      alert("Failed to delete the user");
    }
  };
  useEffect(() => {
    fetchDirectors();
    fetchDepartments();
    fetchDirections();
    // eslint-disable-next-line
  }, []);
  if (loading && !directors.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Box sx={{ margin: { md: "50px", xs: "20px" } }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {directors?.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Directors"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddDirector
        fetchUsers={fetchDirectors}
        departmentList={departmentList}
        fetchDepartments={fetchDepartments}
        allDirections={directions}
        setDepartmentList={setDepartmentList}
      />
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
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Managing Departments
              </TableCell>

              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {directors
              .filter((val) => {
                const query = searchQ.trim().toLowerCase();
                let returnValue = false;

                if (query.length === "") {
                  returnValue = false;
                } else if (
                  val.username.toLowerCase().includes(query) ||
                  val.email.toLowerCase().includes(query) ||
                  val.role.toLowerCase().includes(query)
                ) {
                  returnValue = true;
                }
                return returnValue;
              })
              .slice(0, limit)

              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.role.toUpperCase()}</TableCell>
                  <TableCell>
                    {row.manageList?.map((list) => (
                      <Typography
                        varaint="small"
                        key={list._id}
                        component="small"
                        sx={{ mx: 1, fontSize: "12px" }}
                      >
                        {list.name}
                      </Typography>
                    ))}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog handleDelete={handleDeleteUser} id={row._id} />
                    <UpdateDirector
                      loading={loading}
                      allDirections={directions}
                      departmentList={departmentList}
                      fetchUsers={fetchDirectors}
                      user={row}
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
        count={directors?.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Directors;
