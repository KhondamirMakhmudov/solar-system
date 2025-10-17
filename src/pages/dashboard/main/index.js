import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { Typography, IconButton, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MapOfUz from "@/components/map-country";
import useGetPythonQuery from "@/hooks/python/useGetQuery";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { useSession } from "next-auth/react";
import { get } from "lodash";
import ContentLoader from "@/components/loader";
import { useState } from "react";
import usePostPythonQuery from "@/hooks/python/usePostQuery";
import MethodModal from "@/components/modal/method-modal";
import Input from "@/components/input";
import toast from "react-hot-toast";

const Index = () => {
  const { data: session } = useSession();
  const [showHint, setShowHint] = useState(true);
  const [createCompanyModal, setCreateCompanyModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    data: company,
    isLoading: isLoadingCompany,
    isFetching: isFetchingCompany,
  } = useGetPythonQuery({
    key: KEYS.company,
    url: URLS.company,
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      Accept: "application/json",
    },
    enabled: !!session?.accessToken,
  });

  const { mutate: createCompany } = usePostPythonQuery({
    listKeyId: "create-company",
  });

  const submitCreateCompany = () => {
    createCompany(
      {
        url: URLS.company,
        attributes: formData,
        config: {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Станция успешно создана", {
            position: "top-center",
          });
          setCreateCompanyModal(false);
          setFormData({
            name: "",
            address: "",
            latitude: 0,
            longitude: 0,
            description: "",
          });

          queryClient.invalidateQueries(KEYS.users);
        },
        onError: (error) => {
          toast.error(`Error is ${error}`, { position: "top-right" });
        },
      }
    );
  };

  if (isLoadingCompany || isFetchingCompany) {
    return (
      <DashboardLayout>
        <ContentLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout headerTitle="Главная">
      <div className="my-[15px]">
        <Button
          onClick={() => setCreateCompanyModal(true)}
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
          Добавить станцию
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4 my-[20px] bg-[#1A132A] p-[30px] border border-[#555555] shadow-sm rounded-lg">
        {/* Title */}
        <div className="col-span-12 mb-[15px] text-white">
          <Typography
            variant="h6"
            sx={{ fontFamily: "Manrope" }}
            className="font-semibold mb-2 manrope"
          >
            Карта теплоэлектростанций Узбекистана
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-300 leading-relaxed"
            sx={{ fontFamily: "Manrope" }}
          >
            На данной карте представлены все действующие теплоэлектростанции
            (ИЭС) страны. Каждый объект играет ключевую роль в обеспечении
            регионов тепловой и электрической энергией. Выберите станцию, чтобы
            узнать больше о её характеристиках, местоположении и значении для
            энергетической системы Узбекистана.
          </Typography>
        </div>

        {/* Map + floating hint */}
        <div className="relative col-span-12 h-[600px] rounded-lg overflow-hidden">
          <MapOfUz
            markersData={get(company, "data.data")}
            onMarkerClick={() => setShowHint(false)}
          />

          {/* 💡 Floating hint panel */}
          {showHint && (
            <div className="absolute top-5 left-5 bg-[#2A1F3D]/90 text-white backdrop-blur-md rounded-xl shadow-lg border border-[#444] px-4 py-3 w-[300px] animate-fadeIn">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <InfoOutlinedIcon className="text-blue-400" />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "Manrope" }}
                    className="font-semibold"
                  >
                    Подсказка
                  </Typography>
                </div>
                <IconButton
                  size="small"
                  onClick={() => setShowHint(false)}
                  sx={{
                    color: "#ccc",
                    "&:hover": { color: "#fff" },
                    p: 0.5,
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </div>
              <Typography
                variant="body2"
                sx={{ fontFamily: "Manrope" }}
                className="text-gray-200 leading-relaxed"
              >
                Нажмите на одну из станций на карте, чтобы увидеть подробную
                информацию справа.
              </Typography>
            </div>
          )}
        </div>
      </div>

      {createCompanyModal && (
        <MethodModal
          open={createCompanyModal}
          onClose={() => {
            setCreateCompanyModal(false);
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
            <Input
              placeholder={"Название станции"}
              name={"name"}
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              placeholder={"Адрес"}
              name={"address"}
              value={formData.address}
              onChange={handleChange}
            />

            <div className="flex gap-2">
              <Input
                placeholder={"Широта"}
                label={"Широта (Latitude)"}
                name="latitude"
                classNames="w-1/2"
                type="number"
                value={formData.latitude}
                onChange={handleChange}
              />

              <Input
                placeholder={"Долгота"}
                label={"Долгота (Longitude)"}
                name="longitude"
                classNames="w-1/2"
                type="number"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <textarea
              name="description"
              placeholder="Описание станции"
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-[100px] p-3 bg-[#374151] text-white border border-gray-100 rounded-lg focus:outline-none focus:border-[#6E39CB] resize-none"
              style={{ fontFamily: "Manrope" }}
            />

            <Button
              onClick={submitCreateCompany}
              disabled={!formData.name || !formData.address}
              sx={{
                backgroundColor:
                  formData.name && formData.address ? "#6E39CB" : "#555",
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
