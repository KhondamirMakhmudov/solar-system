import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import useGetPythonQuery from "@/hooks/python/useGetQuery";
import { URLS } from "@/constants/url";
import { KEYS } from "@/constants/key";
import { get } from "lodash";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TuneIcon from "@mui/icons-material/Tune";
import StorageIcon from "@mui/icons-material/Storage";
import LinkIcon from "@mui/icons-material/Link";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LabelIcon from "@mui/icons-material/Label";
import CircleIcon from "@mui/icons-material/Circle";

const Index = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedType, setSelectedType] = useState("ALL");

  const {
    data: nodes,
    isLoading,
    isFetching,
  } = useGetPythonQuery({
    key: KEYS.nodes,
    url: URLS.nodes,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
    },
    enabled: !!session?.accessToken,
  });

  const filteredNodes = get(nodes, "data.data", [])?.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.identifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || node.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = [
    "ALL",
    ...new Set(get(nodes, "data.data", [])?.map((node) => node.type) || []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <DashboardLayout headerTitle={"Узлы"}>
      <div className="min-h-screen bg-gradient-to-br from-[#1F2937] via-[#2A1F3C] to-[#1F2937] p-6 manrope my-[15px] rounded-md">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию, описанию или идентификатору..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1F2937] border border-[#6E39CB]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#6E39CB] focus:ring-2 focus:ring-[#6E39CB]/20 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {types.map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? "bg-[#6E39CB] text-white shadow-lg shadow-[#6E39CB]/50"
                      : "bg-[#1F2937] text-gray-300 border border-[#6E39CB]/30 hover:border-[#6E39CB]"
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex gap-4 text-sm text-gray-400"
          >
            <span>Всего узлов: {nodes?.length || 0}</span>
            <span>Отфильтровано: {filteredNodes?.length || 0}</span>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#6E39CB] border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Nodes Grid */}
        {!isLoading && !isFetching && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredNodes?.map((node) => (
                <motion.div
                  key={node.id}
                  variants={cardVariants}
                  layout
                  className="bg-gradient-to-br from-[#2A1F3C] to-[#1F2937] rounded-xl border border-[#6E39CB]/30 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#6E39CB]/20 transition-shadow"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-[#6E39CB]/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#6E39CB]/20 rounded-lg flex items-center justify-center">
                          <StorageIcon className="text-[#6E39CB]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white uppercase">
                            {node.name}
                          </h3>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <LabelIcon style={{ fontSize: 14 }} />
                            {node.type}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setExpandedCard(
                            expandedCard === node.id ? null : node.id
                          )
                        }
                        className="text-[#6E39CB] hover:bg-[#6E39CB]/10 p-2 rounded-lg transition-colors"
                      >
                        {expandedCard === node.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </motion.button>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#6E39CB]/20 text-[#6E39CB] rounded-full text-xs font-medium">
                        {node.units}
                      </span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <CircleIcon style={{ fontSize: 8 }} />
                        {node.connects?.length || 0} подключений
                      </span>
                    </div>
                  </div>

                  {/* Card Body - Expandable */}
                  <AnimatePresence>
                    {expandedCard === node.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          {/* Node Details */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <TuneIcon
                                className="text-gray-400 mt-0.5"
                                style={{ fontSize: 18 }}
                              />
                              <div>
                                <span className="text-gray-400">
                                  Идентификатор:
                                </span>
                                <p className="text-white font-mono text-xs break-all mt-1">
                                  {node.identifier}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarTodayIcon
                                className="text-gray-400"
                                style={{ fontSize: 18 }}
                              />
                              <span className="text-gray-400">Создан:</span>
                              <span className="text-white">
                                {new Date(node.created_at).toLocaleDateString(
                                  "ru-RU"
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Connections */}
                          {node.connects && node.connects.length > 0 && (
                            <div>
                              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <LinkIcon style={{ fontSize: 18 }} />
                                Подключения ({node.connects.length})
                              </h4>
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {node.connects.map((conn, idx) => (
                                  <motion.div
                                    key={conn.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#1F2937] p-3 rounded-lg border border-[#6E39CB]/20 hover:border-[#6E39CB]/50 transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-white font-medium">
                                        {conn.name}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        Port: {conn.port}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-400 space-y-1">
                                      <div>IP: {conn.ip}</div>
                                      <div>User: {conn.username}</div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isFetching && filteredNodes?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-gray-400"
          >
            <StorageIcon style={{ fontSize: 64 }} className="mb-4 opacity-50" />
            <p className="text-xl">Узлы не найдены</p>
            <p className="text-sm mt-2">Попробуйте изменить параметры поиска</p>
          </motion.div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #6e39cb;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #8b4fd9;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Index;
