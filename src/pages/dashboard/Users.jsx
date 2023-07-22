import {
  Box,
  TableContainer,
  TablePagination,
  TextField,
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
import AddUser from "../../components/dashboard/AddUser";
import UpdateUser from "../../components/dashboard/EditUser";
import { toast } from "react-toastify";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [limit, setLimit] = useState(10);
  const [departmentList, setDepartmentList] = useState([]);

  const handlePagination = (_, page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("auth/all");
      if (data?.users) {
        const res = data?.users.filter((user) => user?.role !== "director");
        setUsers(res);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the Users", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
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
        return fetchUsers();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to Delete the User",
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
    fetchUsers();
    fetchDepartments();
  }, []);

  if (loading && !users.length) {
    return <img src={logo} alt="loading" className="loader" />;
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQ.trim().toLowerCase();
    if (
      query.length === 0 ||
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      (user.department?.name &&
        user.department?.name?.toLowerCase().includes(query))
    ) {
      return true;
    }
    return false;
  });

  return (
    <Box sx={{ margin: { md: "50px", xs: "20px" } }}>
      <Box sx={{ margin: "20px auto", textAlign: "center" }}>
        {users.length ? (
          <TextField
            id="outlined-basic"
            value={searchQ}
            sx={{ width: { md: "40%", lg: "25%", xs: "80%" } }}
            onChange={(e) => setSearchQ(e.target.value)}
            label="Search Users"
            variant="outlined"
            size="small"
          />
        ) : null}
      </Box>
      <AddUser fetchUsers={fetchUsers} departmentList={departmentList} />
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
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(currentPage * limit, currentPage * limit + limit)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.role?.toUpperCase()}</TableCell>
                  <TableCell>{row?.seeOnly ? "Read Only" : "Read/Write"}</TableCell>
                  <TableCell>{row.department?.name || "N/A"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <AlertDialog handleDelete={handleDeleteUser} id={row._id} />
                    <UpdateUser
                      loading={loading}
                      departmentList={departmentList}
                      fetchUsers={fetchUsers}
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
        count={filteredUsers.length}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Users;
