import { useTheme } from "@emotion/react";
import {
  Alert,
  Autocomplete,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { tokens } from "../../Theme";

const filter = createFilterOptions();
const url = "http://localhost:5000/inventory";
const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    cellClassName: "name-column--cell",
  },
  { field: "quantity", headerName: "Quantity", flex: 1 },
  { field: "price", headerName: "Price", flex: 1 },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
  },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "updatedAt", headerName: "Last Update", flex: 1 },
];

const AddInventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [row, setRows] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState(null);
  const [openDialog, toggleOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { categoryCollectionRef } = useAuth();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: `${colors.primary[800]}`,
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  useEffect(() => {
    const getCategory = async () => {
      const data = await getDocs(categoryCollectionRef);
      setSuggestions(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getCategory();
  }, [categoryCollectionRef]);
  console.log(suggestions);
  useEffect(() => {
    const getItems = async () => {
      await axios.get(url).then((res) => {
        setRows(res.data);
      });
    };
    getItems();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // const data = new FormData(event.currentTarget);
    // try {
    //   setError("");
    //   setLoading(true);
    // } catch (e) {
    //   setError(e.message);
    // }
    console.log(data.get("name"), data.get("quantity"));
    handleClose();
  };
  const handleOnClose = () => {
    setCategoryValue({
      category: "",
    });
    toggleOpen(false);
  };

  const [categoryValue, setCategoryValue] = useState({
    category: "",
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setCategory({
      category: categoryValue.category,
    });
    handleOnClose();
  };
  return (
    <Box m={"0 20px 0 20px"}>
      <Typography
        variant="h2"
        color={colors.grey[200]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        ADD INVENTORY
      </Typography>
      <Button sx={{ color: `${colors.greenAccent[400]}` }} onClick={handleOpen}>
        Add new Items
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h3">
            Add Item
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate={false}
            sx={{ mt: 2 }}
          >
            {error && (
              <Alert severity="warning" sx={{ background: "none" }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  id="name"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  id="quantity"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  label="price"
                  type="number"
                  id="price"
                  color="secondary"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Autocomplete
                  value={category}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      // timeout to avoid instant validation of the dialog's form.
                      setTimeout(() => {
                        toggleOpen(true);
                        setCategoryValue({
                          category: newValue,
                        });
                      });
                    } else if (newValue && newValue.inputValue) {
                      toggleOpen(true);
                      setCategoryValue({
                        category: newValue.inputValue,
                      });
                    } else {
                      setCategory(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== "") {
                      filtered.push({
                        inputValue: params.inputValue,
                        category: `Add "${params.inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  id="free-solo-dialog-demo"
                  options={suggestions}
                  getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.category;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderOption={(props, option) => (
                    <li {...props}>{option.category}</li>
                  )}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      color="secondary"
                      required
                      fullWidth
                      name="category"
                      type="text"
                      id="category"
                    />
                  )}
                />
                <Dialog open={openDialog} onClose={handleOnClose}>
                  <form onSubmit={handleOnSubmit}>
                    <DialogTitle>Add a new film</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Did you miss any film in our list? Please, add it!
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="category"
                        value={categoryValue.category}
                        onChange={(event) =>
                          setCategoryValue({
                            ...categoryValue,
                            category: event.target.value,
                          })
                        }
                        label="Category"
                        type="text"
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleOnClose}>Cancel</Button>
                      <Button type="submit">Add</Button>
                    </DialogActions>
                  </form>
                </Dialog>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleClose}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: `${colors.blueAccent[900]}` }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: `${colors.blueAccent[400]}` }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid getRowId={(row) => row._id} rows={row} columns={columns} />
      </Box>
    </Box>
  );
};
export default AddInventory;
