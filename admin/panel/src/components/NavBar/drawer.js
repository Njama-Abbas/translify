import React from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { IconContext } from "react-icons";
import { ListItem, NavLink } from "./elements";
import { AuthAPI } from "../../api";
import { useHistory } from "react-router-dom";

import {
  MdSettings,
  MdAssignmentInd,
  MdLocalCarWash,
  MdHome,
} from "react-icons/md";

import { FaPowerOff } from "react-icons/fa";

import FileUploadComponent from "../ProfilePhoto";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { window, handleDrawerToggle, mobileOpen } = props;
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const logOut = () => {
    AuthAPI.logout();
    history.push("/");
  };

  const drawer = (
    <div>
      <IconContext.Provider value={{ color: "blue", size: "30px" }}>
        <div
          className={classes.toolbar}
          style={{
            backgroundColor: "#3f51b5",
            zIndex: -1,
          }}
        />
        <Divider />
        <br />
        <FileUploadComponent />
        <br />
        <Divider />
        <br />
        <List>
          {["home", "clients", "drivers"].map((text, index) => (
            <ListItem button key={text}>
              <NavLink to={`/admin/${text}`}>
                <ListItemIcon>
                  {index === 1 ? (
                    <MdAssignmentInd />
                  ) : index === 2 ? (
                    <MdLocalCarWash />
                  ) : (
                    <MdHome />
                  )}
                </ListItemIcon>
                {text}
              </NavLink>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem button>
            <NavLink to="/admin/settings">
              <ListItemIcon>
                <MdSettings />
              </ListItemIcon>
              {"Settings"}
            </NavLink>
          </ListItem>
        </List>
        <List>
          <ListItem button>
            <NavLink
              to="/logout"
              onClick={(e) => {
                e.preventDefault();
                logOut();
              }}
            >
              <ListItemIcon>
                <FaPowerOff />
              </ListItemIcon>
              {"Logout"}
            </NavLink>
          </ListItem>
        </List>
      </IconContext.Provider>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
