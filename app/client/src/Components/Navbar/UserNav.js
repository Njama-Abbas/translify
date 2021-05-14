import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { AppBar, Toolbar, IconButton, MenuItem, Menu } from "@material-ui/core";

import {
  UserLogo,
  DashBoardIcon,
  NavLink,
  AppTitle,
  AccountDropDown,
  NameTag,
} from "./UserNav.elements";

import { MdAccountCircle } from "react-icons/md";
import { FaPowerOff, FaUserAlt } from "react-icons/fa";

import { BsThreeDotsVertical } from "react-icons/bs";
import DutySwitch from "../DutySwitch";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  appBar: {
    padding: "0px 8px",
  },

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  profmenu: {
    marginTop: "50px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "70px",
      width: "200px",
    },
  },
}));

export default function UserNav({ user, logOutCallBack }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const formatName = (name) =>
    name.split("")[0].toUpperCase() + name.split("").slice(1).join("");

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.profmenu}
    >
      <MenuItem onClick={handleMenuClose}>
        <NavLink primary to={`/${user.role}/profile`}>
          <IconButton color="inherit">
            <FaUserAlt />
          </IconButton>
          <p>Profile</p>
        </NavLink>
      </MenuItem>
      <MenuItem onClick={logOutCallBack}>
        <NavLink
          primary="true"
          to="/goodbye"
          onClick={(e) => e.preventDefault()}
        >
          <IconButton color="inherit">
            <FaPowerOff />
          </IconButton>
          <p>Log out</p>
        </NavLink>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem></MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <MdAccountCircle />
        </IconButton>
        <AccountDropDown>Account</AccountDropDown>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <UserLogo to={`/${user.role}`}>
            <AppTitle>translify</AppTitle> &nbsp;
            <DashBoardIcon size="40px" />
            <NameTag>
              {formatName(user.firstname)}&nbsp;{formatName(user.lastname)}
            </NameTag>
          </UserLogo>
          <br />
          <div>{user.role === "driver" && <DutySwitch user={user} />}</div>
          <div className={classes.grow} />
          <div>
            {user.role === "client" && (
              <NavLink to={`/client/order-truck`}>Order</NavLink>
            )}
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MdAccountCircle size="40px" />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <BsThreeDotsVertical size="40px" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Toolbar />
    </div>
  );
}
