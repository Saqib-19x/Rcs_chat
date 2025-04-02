import { useSearchParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { enrollAgentsByLink } from "@/Service/auth.service";
import { toast } from "sonner";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CircularProgress } from "@mui/material"; 


const Enrollagents = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log(token, "token7");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    token: token || "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (token) {
      setOpen(true);
    } else {
      console.log("No token found");
    }
  }, [token]);

  const handleEnrollSubmit = async () => {
    const { name, password, token } = formData;
    if (!name || !password || !token) {
      toast("Missing Information", {
        description: "All fields are required.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await enrollAgentsByLink(formData);
      if (response.success) {
        toast(response.message);
        setFormData({
          name: "",
          password: "",
          token: "",
        });

        setTimeout(() => {
          setLoading(false); 
          setOpen(false);
          window.location.href = "https://celchat.com";
        }, 2000);

      } else {
        toast(response.message);
        setLoading(false); // Stop loading on failure
      }
    } catch (error) {
      console.error("Failed to create agent:", error.message);
      toast(error.message);
      setLoading(false); // Stop loading on error
    }
  };

  const handleEnrollChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Fragment>
      {token && (
        <Dialog
          open={open}
          onClose={(e) => e.stopPropagation()}
          fullWidth
          maxWidth="sm" // Limit the dialog's width
          PaperProps={{
            sx: {
              padding: isMobile ? "10px" : "20px", // Adjust padding for mobile and larger screens
            },
          }}
        >
          <DialogTitle>Enroll Agent</DialogTitle>
          <DialogContent>
            <Typography>
              Enroll the agents here. Click save when you are done.
            </Typography>

            {/* Use Grid for responsive spacing */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="name-input">Name</InputLabel>
                  <Input
                    id="name-input"
                    name="name"
                    value={formData.name}
                    onChange={handleEnrollChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="password-input">Password</InputLabel>
                  <Input
                    id="password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleEnrollChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {/* <Button
              className="text-xs"
              onClick={handleEnrollSubmit}
              color="primary"
              variant="contained"
              fullWidth={isMobile}
              sx={{
                padding: isMobile ? "8px" : "12px",
                fontSize: isMobile ? "12px" : "16px",
              }}
            >
              Save
            </Button> */}
            <button className=" text-sm font-semibold rounded-md bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 px-2 py-1" onClick={handleEnrollSubmit}>
            {loading ? <CircularProgress size={24} /> : "Proceed"}

            </button>
          </DialogActions>
        </Dialog>
      )}
      {!token && <div className="w-full">Redirecting...</div>}
    </Fragment>
  );
};

export default Enrollagents;
