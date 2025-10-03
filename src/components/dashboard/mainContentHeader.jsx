import { Button, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";

const MainContentHeader = ({ children, toggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`p-[8px] h-[52px] sticky top-0 z-30 rounded-md flex justify-between items-center gap-4 transition-all duration-300
      ${
        scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
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
