import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import useGetPythonQuery from "@/hooks/python/useGetQuery";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { IconButton, Typography, Button } from "@mui/material";
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
import { useSession } from "next-auth/react";
import ContentLoader from "@/components/loader";
import usePostPythonQuery from "@/hooks/python/usePostQuery";
import MethodModal from "@/components/modal/method-modal";
import Input from "@/components/input";
import CustomSelect from "@/components/select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { config } from "@/config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import DeleteModal from "@/components/modal/delete-modal";

const Index = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState(null);

  const [showSensitive, setShowSensitive] = useState(false);
  // for connect
  const [createConnectModal, setCreateConnectModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectConnect, setSelectConnect] = useState(null);
  // for node
  const [createNodeModal, setCreateNodeModal] = useState(false);
  const [deleteNodeModal, setDeleteNodeModal] = useState(false);
  const [selectNode, setSelectNode] = useState(null);

  const [copiedField, setCopiedField] = useState(null);
  const [formData, setFormData] = useState({
    company_info_id: "",
    name: "",
    ip: "",
    port: "",
    username: "",
    password: "",
  });
  const [formDataNode, setFormDataNode] = useState({
    name: "",
    type: "",
    identifier: "",
    node_id: "",
    units: "",
    description: "",
  });

  const {
    data: connects,
    isLoading,
    isFetching,
  } = useGetPythonQuery({
    key: KEYS.connects,
    url: URLS.connects,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
    },
    enabled: !!session?.accessToken,
  });

  const {
    data: company,
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
  } = useGetPythonQuery({
    key: [KEYS.company.createConnectModal],
    url: URLS.company,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
    },
    enabled: !!session?.accessToken && !!createConnectModal,
  });

  const companyOptions = get(company, "data.data", []).map((company) => ({
    value: company.id,
    label: company.name,
  }));
  //  create connect
  const { mutate: createConnect } = usePostPythonQuery({
    listKeyId: "create-connect",
  });

  const submitCreateConnect = () => {
    createConnect(
      {
        url: URLS.connects,
        attributes: formData,
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Коннект успешно создан", {
            position: "top-center",
          });
          setCreateConnectModal(false);
          setFormData({
            company_info_id: "",
            name: "",
            ip: "",
            port: "",
            username: "",
            password: "",
          });

          queryClient.invalidateQueries("create-connect");
        },
        onError: (error) => {
          toast.error(`Error is ${error}`, { position: "top-right" });
        },
      }
    );
  };
  // delete connect
  const handleDeleteConnect = async () => {
    try {
      const response = await fetch(
        `${config.PYTHON_API_URL}${URLS.connects}${selectConnect}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ selectConnect }), // faqat agar backend body kutsa
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении");
      }

      let result = null;

      // Faqat agar javob body mavjud bo‘lsa
      if (response.status !== 200) {
        result = await response.json();
        console.log("Deleted:", result);
      }
      queryClient.invalidateQueries(KEYS.connects);
      setDeleteModal(false);
      setSelectConnect(false);
      toast.success("Успешно удалено");
    } catch (error) {
      console.error(error);
      toast.error("Не удалось удалить");
    }
  };

  // create node to connect (by id of the connectt)

  const { mutate: createNode } = usePostPythonQuery({
    listKeyId: "create-node",
  });

  const submitCreateNode = () => {
    createNode(
      {
        url: URLS.nodes,
        attributes: formDataNode,
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Узил успешно создан", {
            position: "top-center",
          });
          setCreateConnectModal(false);
          setFormDataNode({
            name: "",
            type: "",
            identifier: "",
            node_id: "",
            units: "",
            description: "",
          });

          queryClient.invalidateQueries("create-node");
        },
        onError: (error) => {
          toast.error(`Error is ${error}`, { position: "top-right" });
        },
      }
    );
  };

  // set Data to formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeNode = (e) => {
    const { name, value } = e.target;
    setFormDataNode((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleCopy = (value, field) => {
    if (!value) return;
    navigator?.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (isLoading || isFetching) {
    return (
      <DashboardLayout headerTitle={"Коннекты"}>
        <ContentLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout headerTitle={"Коннекты"}>
      <div className="my-[15px]">
        <Button
          onClick={() => setCreateConnectModal(true)}
          sx={{
            textTransform: "initial",
            backgroundColor: "#6E39CB",
            boxShadow: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "14px",
            padding: "8px 16px",
            borderRadius: "10px",
            fontFamily: "Manrope",
            "&:hover": {
              backgroundColor: "#5b2bb3",
              boxShadow: "none",
            },
          }}
          variant="contained"
        >
          Создать
        </Button>
      </div>
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
                  background: "#6E39CB",
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

                <div className="flex items-center gap-2">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(connect);
                    }}
                  >
                    <EditIcon sx={{ color: "white", fontSize: 20 }} />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectConnect(id);
                      setDeleteModal(true);
                    }}
                  >
                    <DeleteIcon sx={{ color: "white", fontSize: 20 }} />
                  </IconButton>

                  <IconButton>
                    {isOpen ? (
                      <KeyboardArrowUpIcon sx={{ color: "white" }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </div>
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
                      <div className="flex justify-between items-center">
                        <Typography variant="h6" sx={{ fontFamily: "Manrope" }}>
                          Узлы данных
                        </Typography>

                        <Button
                          onClick={() => {
                            setCreateNodeModal(true);
                            setSelectNode();
                          }}
                          sx={{
                            textTransform: "initial",
                            backgroundColor: "#6E39CB",
                            boxShadow: "none",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontSize: "14px",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            fontFamily: "Manrope",
                            "&:hover": {
                              backgroundColor: "#5b2bb3",
                              boxShadow: "none",
                            },
                          }}
                          variant="contained"
                        >
                          Добавить узиль к коннекту
                        </Button>
                      </div>

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
      {/* create modal for connect */}
      {createConnectModal && (
        <MethodModal
          open={createConnectModal}
          onClose={() => {
            setCreateConnectModal(false);
            setFormData({
              name: "",
              address: "",
              latitude: 0,
              longitude: 0,
              description: "",
            });
          }}
        >
          <div className="space-y-[20px] manrope">
            <CustomSelect
              className="bg-gray-100"
              options={companyOptions}
              value={formData.company_info_id}
              placeholder="Выберите станцию"
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  company_info_id: val,
                }))
              }
            />

            <Input
              placeholder={"Название коннекта"}
              name={"name"}
              value={formData.name}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <Input
                placeholder={"IP адресс"}
                label={"IP адресс"}
                name="ip"
                classNames="w-1/2"
                type="text"
                value={formData.ip}
                onChange={handleChange}
              />

              <Input
                placeholder={"Порт"}
                label={"Порт"}
                name="port"
                classNames="w-1/2"
                type="text"
                value={formData.port}
                onChange={handleChange}
              />
            </div>

            <Input
              placeholder={"Имя пользователя"}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder={"Пароль"}
              isPassword={true}
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              onClick={submitCreateConnect}
              sx={{
                backgroundColor: "#6E39CB",
                color: "#FFFFFF",
                height: "45px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "17px",
                fontWeight: "600",
                width: "100%",
                fontFamily: "Manrope, sans-serif",
                "&:hover": {
                  backgroundColor:
                    formData.name && formData.address ? "#A877FD" : "#555",
                },
                cursor:
                  formData.name && formData.address ? "pointer" : "not-allowed",
              }}
            >
              Добавить
            </Button>
          </div>
        </MethodModal>
      )}
      {/* delete modal for connect */}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setSelectConnect(null);
          }}
          deleting={() => {
            handleDeleteConnect(selectConnect); // 👈 DELETE so‘rov
            setDeleteModal(false);
            setSelectConnect(null);
          }}
          title="Вы уверены, что хотите удалить этот коннект?"
        />
      )}

      {/* create modal for node */}
      {createNodeModal && (
        <MethodModal
          open={createNodeModal}
          onClose={() => {
            setCreateNodeModal(false);
            setFormDataNode({
              name: "",
              type: "",
              identifier: "",
              node_id: "",
              units: "",
              description: "",
            });
          }}
        >
          <div className="space-y-[20px] manrope">
            <Input
              placeholder={"Описание"}
              name={"name"}
              value={formDataNode.name}
              onChange={handleChangeNode}
            />
            <div className="flex gap-2">
              <Input
                placeholder={"Единицы измерения"}
                label={"Единицы измерения"}
                name="units"
                classNames="w-1/2"
                type="text"
                value={formDataNode.units}
                onChange={handleChangeNode}
              />

              <Input
                placeholder={"Тип"}
                label={"Тип"}
                name="type"
                classNames="w-1/2"
                type="text"
                value={formDataNode.type}
                onChange={handleChangeNode}
              />
            </div>

            <Input
              placeholder={"Имя пользователя"}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder={"Пароль"}
              isPassword={true}
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              onClick={submitCreateConnect}
              sx={{
                backgroundColor: "#6E39CB",
                color: "#FFFFFF",
                height: "45px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "17px",
                fontWeight: "600",
                width: "100%",
                fontFamily: "Manrope, sans-serif",
                "&:hover": {
                  backgroundColor:
                    formData.name && formData.address ? "#A877FD" : "#555",
                },
                cursor:
                  formData.name && formData.address ? "pointer" : "not-allowed",
              }}
            >
              Добавить
            </Button>
          </div>
        </MethodModal>
      )}
    </DashboardLayout>
  );
};

export default Index;
