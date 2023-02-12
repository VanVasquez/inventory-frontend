/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AddInventory from "./scenes/AddInventory";
import LogIn from "./scenes/Login";
import Profile from "./scenes/Profile";
import Register from "./scenes/Register";
import Team from "./scenes/Team";
import Report from "./scenes/Report";
import UpdateInventory from "./scenes/UpdateInventory";
import { ColorModeContext, useMode } from "./Theme";
import Sidebar from "./components/SideBar";
import Topbar from "./components/TopBar";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Profile />
                  </main>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/team"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Team />
                  </main>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <AddInventory />
                  </main>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/update"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <UpdateInventory />
                  </main>
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/report"
              element={
                <PrivateRoute>
                  <Sidebar />
                  <main className="content">
                    <Topbar />
                    <Report />
                  </main>
                </PrivateRoute>
              }
            ></Route>
          </Routes>
        </div>{" "}
      </ThemeProvider>{" "}
    </ColorModeContext.Provider>
  );
}

export default App;
