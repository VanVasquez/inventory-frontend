import { Box, Button, IconButton, Menu, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDocs } from "firebase/firestore";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { userCollectionRef, currentUser, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUser();
  }, [userCollectionRef]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onlogout = async () => {
    await logout();
    navigate("/ ");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/** ADD // EDIT // DELETE */}
      <Box>
        {users.map((user) => {
          return (
            <div>
              {" "}
              {currentUser.email === user.email
                ? user.firstName + " " + user.lastName
                : " "}
            </div>
          );
        })}
      </Box>
      <Box display="flex">
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <PersonOutlinedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={handleClose}
              style={{ backgroundColor: "white" }}
            >
              <Typography
                style={{
                  padding: "0 8px 0 8px",
                }}
              >
                <Button onClick={onlogout}>Log Out</Button>
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  );
};

export default Topbar;
