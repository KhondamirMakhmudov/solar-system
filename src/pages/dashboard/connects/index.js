import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetPythonQuery from "@/hooks/python/useGetQuery";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { IconButton, Typography } from "@mui/material";
import { get } from "lodash";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import NodeGroup from "@/components/nodes";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Index = () => {
  const [openId, setOpenId] = useState(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const {
    data: connects,
    isLoading,
    isFetching,
  } = useGetPythonQuery({
    key: KEYS.connects,
    url: URLS.connects,
  });

  const handleToggle = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleCopy = (value, field) => {
    if (!value) return;
    navigator?.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <DashboardLayout headerTitle={"Коннекты"}>
      <div className="manrope space-y-[10px] my-[15px]">
        {get(connects, "data.data", []).map((connect) => {
          const id = get(connect, "id");
          const isOpen = openId === id;

          return (
            <div
              key={id}
              className="text-white cursor-pointer rounded-md border border-[#2A1F3C] overflow-hidden"
            >
              {/* Header */}
              <div
                className={`flex p-[18px] justify-between items-center  ${
                  isOpen ? "rounded-b-0" : "rounded-md"
                } bg-gradient-to-r`}
                style={{
                  background: "linear-gradient(to right, #8b5cf6, #2A1F3C)",
                }}
                onClick={() => handleToggle(id)}
              >
                <div>
                  <Typography variant="h5" sx={{ fontFamily: "Manrope" }}>
                    {get(connect, "name")}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <ViewAgendaIcon sx={{ width: "15px" }} />
                    <p>
                      {get(connect, "ip")}:{get(connect, "port")}
                    </p>
                  </div>
                </div>

                <IconButton>
                  {isOpen ? (
                    <KeyboardArrowUpIcon sx={{ color: "white" }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ color: "white" }} />
                  )}
                </IconButton>
              </div>

              {/* Toggle section with animation */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-4 bg-[#1F2937] border-t border-[#2A1F3C]"
                  >
                    <div className="flex justify-between items-center">
                      <Typography variant="h6" sx={{ fontFamily: "Manrope" }}>
                        Подробности подключения
                      </Typography>
                      <IconButton
                        onClick={() => setShowSensitive((prev) => !prev)}
                      >
                        {showSensitive ? (
                          <VisibilityOffIcon sx={{ color: "white" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "white" }} />
                        )}
                      </IconButton>
                    </div>
                    <ul className="my-[15px] flex justify-between gap-2 flex-wrap">
                      {/* IP Address */}
                      <li className="flex-1">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-400">
                              IP Address
                            </div>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(get(connect, "ip", ""), "ip")
                              }
                            >
                              {copiedField === "ip" ? (
                                <span className="text-green-400 text-xs">
                                  Скопировано
                                </span>
                              ) : (
                                <ContentCopyIcon
                                  sx={{ color: "gray", fontSize: 18 }}
                                />
                              )}
                            </IconButton>
                          </div>
                          <div className="font-mono text-white">
                            {get(connect, "ip", "") || "-"}
                          </div>
                        </div>
                      </li>

                      {/* Port */}
                      <li className="flex-1">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-400">Port</div>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(get(connect, "port", ""), "port")
                              }
                            >
                              {copiedField === "port" ? (
                                <span className="text-green-400 text-xs">
                                  Скопировано
                                </span>
                              ) : (
                                <ContentCopyIcon
                                  sx={{ color: "gray", fontSize: 18 }}
                                />
                              )}
                            </IconButton>
                          </div>
                          <div className="font-mono text-white">
                            {get(connect, "port", "") || "-"}
                          </div>
                        </div>
                      </li>

                      {/* Username */}
                      <li className="flex-1">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-400">
                              Имя пользователя
                            </div>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  get(connect, "username", ""),
                                  "username"
                                )
                              }
                            >
                              {copiedField === "username" ? (
                                <span className="text-green-400 text-xs">
                                  Скопировано
                                </span>
                              ) : (
                                <ContentCopyIcon
                                  sx={{ color: "gray", fontSize: 18 }}
                                />
                              )}
                            </IconButton>
                          </div>
                          <div className="font-mono text-white">
                            {showSensitive
                              ? get(connect, "username", "")
                              : "••••••••"}
                          </div>
                        </div>
                      </li>

                      {/* Password */}
                      <li className="flex-1">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-400">Пароль</div>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  get(connect, "password", ""),
                                  "password"
                                )
                              }
                            >
                              {copiedField === "password" ? (
                                <span className="text-green-400 text-xs">
                                  Скопировано
                                </span>
                              ) : (
                                <ContentCopyIcon
                                  sx={{ color: "gray", fontSize: 18 }}
                                />
                              )}
                            </IconButton>
                          </div>
                          <div className="font-mono text-white">
                            {showSensitive
                              ? get(connect, "password", "")
                              : "••••••••"}
                          </div>
                        </div>
                      </li>
                    </ul>

                    <div className="my-[15px]">
                      <Typography variant="h6" sx={{ fontFamily: "Manrope" }}>
                        Узлы данных
                      </Typography>

                      {Array.isArray(get(connect, "nodes", [])) &&
                        get(connect, "nodes", []).length > 0 && (
                          <div className="mt-6">
                            <NodeGroup nodes={get(connect, "nodes", [])} />
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Index;
