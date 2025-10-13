import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  List,
  ListItemButton,
  ListItemIcon,
  patch,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import {
  PeopleAlt as PeopleAltIcon,
  Mediation as MediationIcon,
  SettingsRounded as SettingsRoundedIcon,
  SchoolRounded as SchoolRoundedIcon,
  CameraAlt as CameraAltIcon,
  Wifi as WifiIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExitModal from "../modal/exit-modal";
import { signOut } from "next-auth/react";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import RecyclingIcon from "@mui/icons-material/Recycling";
import LinkIcon from "@mui/icons-material/Link";

const menuItems = [
  {
    text: "Главная",
    icon: <HomeIcon />,
    path: "/dashboard/main",
  },

  {
    text: "Экологические показатели станции",
    icon: <RecyclingIcon />,
    path: "/dashboard/eco-system-stations/all",
  },

  {
    text: "Коннекты",
    icon: <LinkIcon />,
    path: "/dashboard/connects",
  },

  {
    text: "Настройки",
    icon: <SettingsRoundedIcon />,
    path: "/dashboard/settings",
  },
];

export default function Sidebar({ isOpen = true }) {
  const [open, setOpen] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const router = useRouter();

  // 🔑 active submenu bo‘lsa parentni ochiq qilib qo‘yish
  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.submenu?.some((sub) => router.pathname === sub.path)) {
        setOpenSubmenus((prev) => ({
          ...prev,
          [index]: true,
        }));
      }
    });
  }, [router.pathname]);

  const handleToggleSubmenu = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    localStorage.clear();
    sessionStorage.clear();
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <aside
      className={`${
        isOpen ? "w-[330px]" : "w-[80px]"
      } h-screen bg-[#0F0A1E] px-[16px] py-[25px] transition-all duration-300 overflow-y-auto flex flex-col justify-between font-manrope`}
    >
      <div>
        {/* LOGO */}
        <div
          onClick={() => router.push("/")}
          className="my-[32px] flex justify-center items-start gap-4 cursor-pointer"
        >
          <Image src="/icons/ies_brand.svg" alt="logo" width={73} height={76} />
        </div>

        {/* MENU */}
        <List sx={{ fontFamily: "Lato, sans-serif", color: "#A0AEC0" }}>
          {menuItems.map((item, index) => {
            const isActive = router.pathname === item.path;
            const isAnySubmenuActive =
              item.submenu?.some((sub) => router.pathname === sub.path) ||
              false;
            const isOpenSubmenu = openSubmenus[index] || false;

            return (
              <div key={index}>
                {/* Parent item */}
                <ListItemButton
                  onClick={() =>
                    item.submenu
                      ? handleToggleSubmenu(index)
                      : router.push(item.path)
                  }
                  selected={isActive || isAnySubmenuActive}
                  sx={{
                    borderRadius: "8px",
                    my: 0.5,
                    color:
                      isActive || isAnySubmenuActive ? "#6E39CB" : "#3A3541",
                    backgroundColor:
                      isActive || isAnySubmenuActive
                        ? "#DECCFE !important"
                        : "transparent",
                    "&:hover": {
                      background: "#C9AAFE",
                    },
                    justifyContent: isOpen ? "flex-start" : "center",
                    px: isOpen ? 2 : 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color:
                        isActive || isAnySubmenuActive ? "#6E39CB" : "#3A3541",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && (
                    <Typography
                      sx={{
                        fontFamily: "Manrope, sans-serif",
                        fontSize: "18px",
                        marginLeft: "12px",
                      }}
                    >
                      {item.text}
                    </Typography>
                  )}
                  {item.submenu && isOpen && (
                    <span className="ml-auto">
                      {isOpenSubmenu ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </span>
                  )}
                </ListItemButton>

                {/* Submenu */}
                {item.submenu && isOpenSubmenu && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.2 }}
                    className="ml-10"
                  >
                    {item.submenu.map((sub, subIndex) => {
                      const isSubActive = router.pathname === sub.path;
                      return (
                        <ListItemButton
                          key={subIndex}
                          onClick={() => router.push(sub.path)}
                          selected={isSubActive}
                          sx={{
                            borderRadius: "8px",
                            my: 0.5,
                            color: isSubActive ? "#9D66FD" : "#A78BFA",
                            backgroundColor: isSubActive
                              ? "#9F69FB"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "#E9D5FF",
                              color: "#9D66FD",
                            },
                          }}
                        >
                          {/* Icon o‘rniga */}
                          <div className="flex items-center">
                            {isSubActive ? (
                              <span className="text-[#9D66FD]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              </span>
                            ) : (
                              <span className="text-[#A78BFA]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="12" cy="12" r="4" />
                                </svg>
                              </span>
                            )}

                            <Typography
                              sx={{
                                fontSize: "15px",
                                ml: 1.5,
                                fontFamily: "Manrope, sans-serif",
                                fontWeight: isSubActive ? 600 : 400,
                              }}
                            >
                              {sub.text}
                            </Typography>
                          </div>
                        </ListItemButton>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </List>
      </div>

      {/* LOGOUT */}
      <div className="mb-4 w-full manrope relative">
        <ListItemButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#6E39CB",

            justifyContent: isOpen ? "flex-start" : "center",

            "&:hover": { backgroundColor: "#6E39CB" },
          }}
        >
          <div
            className={`flex ${
              !isOpen
                ? "justify-center items-center"
                : "justify-between items-start"
            } w-full`}
          >
            <div className="flex gap-2 justify-center items-center">
              <Avatar
                src="/images/avatar.jpg"
                sx={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />

              {isOpen && (
                <div className="text-white">
                  <h4 className="text-[15px]">John Johnson</h4>
                  <p className="text-sm">john@commerce.com</p>
                </div>
              )}
            </div>

            {isOpen && (
              <MoreVertIcon
                sx={{
                  marginRight: "-10px",
                  color: "white",
                  width: "20px",
                }}
              />
            )}
          </div>
        </ListItemButton>

        {open && (
          <motion.div
            initial={{ opacity: 0, translateY: "100px" }}
            animate={{ opacity: 1, translateY: "0px" }}
            exit={{ opacity: 0, translateY: "10px" }}
            className="absolute -top-[95px]  left-0 right-0 "
          >
            <div className="border border-[#555555] bg-[#1A132A] rounded-lg gap-y-[8px] shadow-md">
              <Link
                href={"#"}
                className={`flex p-[8px] hover:bg-[#312b3f] rounded-lg text-white items-center ${
                  isOpen ? "gap-2" : "justify-center"
                } transition-all duration-300`}
              >
                <SettingsRoundedIcon />
                {isOpen && <h4>Настройки</h4>}
              </Link>
              <div
                onClick={() => setOpenExitModal(true)}
                href={"#"}
                className={`flex p-[8px] hover:bg-[#312b3f] rounded-lg text-white items-center ${
                  isOpen ? "gap-2" : "justify-center"
                } transition-all duration-300`}
              >
                <ExitToAppIcon />
                {isOpen && <h4>Выйти</h4>}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <ExitModal
        open={openExitModal}
        onClose={() => setOpenExitModal(false)}
        handleLogout={handleLogout}
      />
    </aside>
  );
}
