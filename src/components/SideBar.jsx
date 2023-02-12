import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../Theme";
import "react-pro-sidebar/dist/css/styles.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AddHomeIcon from "@mui/icons-material/AddHome";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useMode } from "../Theme";
import { useAuth } from "../context/AuthContext";
import { getDocs } from "firebase/firestore";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const Sidebar = ({ selectedd }) => {
  const [theme] = useMode();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState();
  const [selected, setSelected] = useState("Profile");
  const { userCollectionRef, currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUser();
  }, [userCollectionRef]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[900]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "white !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <SidebarHeader>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    {users.map((user) => {
                      return (
                        <div>
                          {" "}
                          {currentUser.email === user.email
                            ? " Hi, " + user.lastName
                            : " "}
                        </div>
                      );
                    })}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
          </SidebarHeader>
          <SidebarContent>
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {" "}
              <Item
                title="Profile"
                to="/profile"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />{" "}
              {users.map((user) => {
                return (
                  <div>
                    {" "}
                    {currentUser.email === user.email ? (
                      user.role === "Admin" ? (
                        <Item
                          title="Manage Team"
                          to="/team"
                          icon={<PeopleOutlinedIcon />}
                          selected={selected}
                          setSelected={setSelected}
                        />
                      ) : (
                        " "
                      )
                    ) : (
                      " "
                    )}
                  </div>
                );
              })}
            </Box>
          </SidebarContent>
          <SidebarFooter>
            {" "}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {!isCollapsed && (
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  MY INVENTORY
                </Typography>
              )}
              <Item
                title="Add Inventory"
                to="/add"
                icon={<AddHomeIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {users.map((user) => {
                return (
                  <div>
                    {" "}
                    {currentUser.email === user.email ? (
                      user.role === "Admin" ? (
                        <Item
                          title="Update Inventory"
                          to="/update"
                          icon={<SystemUpdateAltOutlinedIcon />}
                          selected={selected}
                          setSelected={setSelected}
                        />
                      ) : (
                        " "
                      )
                    ) : (
                      " "
                    )}
                  </div>
                );
              })}

              <Item
                title="Report"
                to="/report"
                icon={<AssessmentOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </SidebarFooter>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
