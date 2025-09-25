import { Button, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import Link from "next/link";
import MarkUnreadChatAltOutlinedIcon from "@mui/icons-material/MarkUnreadChatAltOutlined";
import { useRouter } from "next/router";
import ExitModal from "../modal/exit-modal";
import { signOut, useSession } from "next-auth/react";

const MainContentHeader = ({ children, toggleSidebar }) => {
  return (
    <div className="bg-transparent p-[8px] h-[52px] sticky top-0 z-30 rounded-md flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <IconButton
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ backgroundColor: "#DECCFE" }}
        >
          <MenuIcon sx={{ color: "#A877FD" }} />
        </IconButton>
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "22px",
            fontWeight: "medium",
            color: "#9D66FD",
          }}
        >
          {children}
        </Typography>
      </div>
    </div>
  );
};
export default MainContentHeader;
