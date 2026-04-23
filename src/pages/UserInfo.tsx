import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Image } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { getApiErrorMessage, isoToDisplay, maskOf } from "../libs/helper";
import type {
  FieldKey,
  Station,
  Trip,
  UserInfo,
  UserInfoPayload,
} from "../types/user";
import { useAppSelector } from "../hooks/auth";
import userApi from "../api/user";
import { AppAlert } from "../components/ui/AppAlert";
import { DATE_FIELDS, EDITABLE_FIELDS, MASKED_FIELDS } from "../libs/constance";
import InlineSelect from "../components/ui/inlineEdit/InlineSelect";
import InlineDateInput from "../components/ui/inlineEdit/InlineDateInput";
import InlineTextInput from "../components/ui/inlineEdit/InlineTextInput";
import { useTranslation } from "../hooks/useTranslation";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../contexts/ThemeContext";

const SHUTTLE_FACTORIES = ["LHG", "LYM"];
const SHUTTLE_VEHICLE = "Company shuttle bus";

export default function UserInfo() {
  const { t } = useTranslation();

  const { theme } = useTheme();

  const currentUser = useAppSelector((s) => s.auth.user);
  const vehicles = useAppSelector((s) => s.transport.vehicles);
  const currentLang = useAppSelector((s) => s.language.current);

  const [user, setUser] = useState<UserInfo>(null);
  const [revealed, setRevealed] = useState(false);
  const [editingField, setEditingField] = useState<FieldKey | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({
    birthday: user?.Birthday ?? "",
    phone: user?.mobilePhoneNumber ?? "",
    idCard: user?.ID ?? "",
    idIssueDate: user?.ID_Day ?? "",
    transport: user?.Vehicle ?? "",
    temporaryAddress: user?.Address_Live ?? "",
    shuttleTrip: user?.Bus_Route ?? "",
    shuttleStop: user?.PickupDropoffStation ?? "",
  });
  // Ref để luôn đọc được localValues mới nhất trong async/debounce (tránh stale closure)
  const localValuesRef = useRef(localValues);
  useEffect(() => {
    localValuesRef.current = localValues;
  }, [localValues]);

  const isShuttleFactory = SHUTTLE_FACTORIES.includes(
    currentUser?.factory ?? "",
  );
  const isShuttleSelected = localValues.transport === SHUTTLE_VEHICLE;

  const [trips, setTrips] = useState<Trip[]>([]);
  const stopDataRef = useRef<Station | null>(null);

  const vehicleOptions = vehicles.map((v) => {
    const labelMap: Record<string, string> = {
      vi: v.Name_Vehicle_VN,
      en: v.Name_Vehicle,
      mm: v.Name_Vehicle_MM,
      tw: v.Name_Vehicle_CN,
    };
    return {
      value: v.Name_Vehicle,
      label: labelMap[currentLang.code] ?? v.Name_Vehicle,
    };
  });

  const fetchUserInfo = async () => {
    try {
      const payload: UserInfoPayload = {
        factory: currentUser.factory,
        userId: currentUser.userId,
      };
      const res = await userApi.getUserInfo(payload);
      setUser(res);
    } catch (error) {
      AppAlert({ icon: "error", title: getApiErrorMessage(error) });
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLocalValues({
      birthday: isoToDisplay(user.Birthday ?? ""),
      phone: user.mobilePhoneNumber ?? "",
      idCard: user.ID ?? "",
      idIssueDate: isoToDisplay(user.ID_Day ?? ""),
      transport: user.Vehicle ?? "",
      temporaryAddress: user.Address_Live ?? "",
      shuttleTrip: user.Bus_Route ?? "",
      shuttleStop: user.PickupDropoffStation ?? ",",
    });
  }, [user]);

  useEffect(() => {
    if (!isShuttleFactory) return;
    userApi
      .getAddressByFactory(currentUser.factory)
      .then(setTrips)
      .catch(() => {});
  }, [isShuttleFactory]);

  useEffect(() => {
    if (!isShuttleSelected) {
      setLocalValues((prev) => ({ ...prev, shuttleTrip: "", shuttleStop: "" }));
      stopDataRef.current = null;
    }
  }, [isShuttleSelected]);

  useEffect(() => {
    if (!revealed) setEditingField(null);
  }, [revealed]);

  const [pendingApi, setPendingApi] = useState<{
    field: FieldKey;
    value: string;
  } | null>(null);
  const debouncedPending = useDebounce(pendingApi, 800);
  const prevDebounced = useRef<typeof debouncedPending>(null);

  useEffect(() => {
    if (!debouncedPending) return;
    if (prevDebounced.current === debouncedPending) return;
    prevDebounced.current = debouncedPending;
    const { field, value } = debouncedPending;

    const toIso = (display: string) => {
      if (!display) return "";
      const [d, m, y] = display.split("/");
      if (!d || !m || !y) return display;
      return `${d}/${m}/${y}`;
    };

    const persist = async () => {
      try {
        let success = false;

        if (field === "temporaryAddress") {
          success = await userApi.updateAddressLive(currentUser.factory, {
            personId: currentUser.userId,
            temporaryAddress: value,
          });
        }

        const USER_INFO_FIELDS: FieldKey[] = [
          "birthday",
          "phone",
          "idCard",
          "idIssueDate",
        ];
        if (USER_INFO_FIELDS.includes(field)) {
          // Đọc từ ref để luôn có giá trị mới nhất (tránh stale closure)
          const latest = { ...localValuesRef.current, [field]: value };
          success = await userApi.updateUserInfo(currentUser.factory, {
            userId: currentUser.userId,
            birthday: toIso(latest.birthday),
            idCard: latest.idCard,
            phone: latest.phone,
            idDate: toIso(latest.idIssueDate),
          });
        }

        if (!success) {
          AppAlert({ icon: "error", title: getApiErrorMessage(null) });
          await fetchUserInfo();
        }
      } catch (error) {
        AppAlert({ icon: "error", title: getApiErrorMessage(error) });
        await fetchUserInfo();
      }
    };
    persist();
  }, [debouncedPending]);

  const startEdit = (field: FieldKey) => {
    if (!revealed || !EDITABLE_FIELDS.includes(field)) return;
    setEditingField(field);
  };

  const handleFieldChange = useCallback((field: FieldKey, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
    setPendingApi({ field, value });
  }, []);

  const saveField = (field: FieldKey, value: string) => {
    setEditingField(null);

    if (field === "transport") {
      setLocalValues((prev) => ({ ...prev, transport: value }));
      const persist = async () => {
        try {
          const success = await userApi.updateVehicle(currentUser.factory, {
            personId: currentUser.userId,
            Vehicle: value,
          });
          if (!success)
            setLocalValues((prev) => ({
              ...prev,
              transport: user?.Vehicle ?? "",
            }));
        } catch (error) {
          AppAlert({ icon: "error", title: getApiErrorMessage(error) });
          setLocalValues((prev) => ({
            ...prev,
            transport: user?.Vehicle ?? "",
          }));
        }
      };
      persist();
      return;
    }

    if (field === "shuttleTrip") {
      setLocalValues((prev) => ({
        ...prev,
        shuttleTrip: value,
        shuttleStop: "",
      }));
      stopDataRef.current = null;
      const persistTrip = async () => {
        try {
          const success = await userApi.updateTrip(currentUser.factory, {
            personId: currentUser.userId,
            hanhTrinh: value,
          });
          if (!success)
            setLocalValues((prev) => ({
              ...prev,
              shuttleTrip: "",
              shuttleStop: "",
            }));
        } catch (error) {
          AppAlert({ icon: "error", title: getApiErrorMessage(error) });
          setLocalValues((prev) => ({
            ...prev,
            shuttleTrip: "",
            shuttleStop: "",
          }));
        }
      };
      persistTrip();
      return;
    }

    if (field === "shuttleStop") {
      setLocalValues((prev) => ({ ...prev, shuttleStop: value }));
      const stopObj =
        trips
          .find((t) => t.hanh_trinh === localValues.shuttleTrip)
          ?.tram_don_tra?.find((s) => s.ten === value) ?? null;
      stopDataRef.current = stopObj;
      const persistStop = async () => {
        try {
          const success = await userApi.updateStation(currentUser.factory, {
            personId: currentUser.userId,
            diaDiem: stopObj?.ten ?? "",
            lat: stopObj?.lat ?? 0,
            long: stopObj?.long ?? 0,
          });
          if (!success) {
            setLocalValues((prev) => ({ ...prev, shuttleStop: "" }));
            stopDataRef.current = null;
          }
        } catch (error) {
          AppAlert({ icon: "error", title: getApiErrorMessage(error) });
          setLocalValues((prev) => ({ ...prev, shuttleStop: "" }));
          stopDataRef.current = null;
        }
      };
      persistStop();
      return;
    }

    setLocalValues((prev) => ({ ...prev, [field]: value }));
    // API call xử lý qua debounce (handleFieldChange → setPendingApi → debouncedPending)
  };

  const cancelField = () => setEditingField(null);

  const getDisplay = (fieldKey: FieldKey): string => {
    if (fieldKey === "transport")
      return (
        vehicleOptions.find((o) => o.value === localValues.transport)?.label ??
        ""
      );
    if (fieldKey === "shuttleTrip") return localValues.shuttleTrip ?? "";
    if (fieldKey === "shuttleStop") return localValues.shuttleStop ?? "";
    if (EDITABLE_FIELDS.includes(fieldKey)) return localValues[fieldKey] ?? "";
    switch (fieldKey) {
      case "fullName":
        return user?.Person_Name ?? "";
      case "cardNumber":
        return user?.Person_ID ?? "";
      case "department":
        return user?.Department_Name ?? "";
      case "email":
        return user?.Email ?? "";
      case "taxCode":
        return user?.Tax_Code ?? "";
      case "joinDate":
        return isoToDisplay(user?.Date_Come_In ?? "");
      case "permanentAddress":
        return user?.Staying_Address ?? "";
      default:
        return "";
    }
  };

  const renderCell = ({
    label,
    fieldKey,
    placeholder = "",
    span = 1,
    options: customOptions,
    disabled = false,
  }: {
    label: string;
    fieldKey: FieldKey;
    placeholder?: string;
    span?: 1 | 2 | 4;
    options?: { label: string; value: string }[];
    disabled?: boolean;
  }) => {
    const raw = getDisplay(fieldKey);
    const isMasked = MASKED_FIELDS.includes(fieldKey) && !revealed;
    const isEditable = EDITABLE_FIELDS.includes(fieldKey);
    const isEditing = editingField === fieldKey;
    const isDate = DATE_FIELDS.includes(fieldKey);
    const isSelect = !!customOptions || fieldKey === "transport";
    const selectOpts = customOptions ?? vehicleOptions;
    const displayText = raw || "";

    const spanClass =
      span === 4
        ? "col-span-4 max-[1200px]:col-span-3 max-[900px]:col-span-2 max-[480px]:col-span-1"
        : span === 2
          ? "col-span-2 max-[480px]:col-span-1"
          : "col-span-1";

    return (
      <div
        key={fieldKey}
        className={`flex flex-col gap-[5px] min-w-0 ${spanClass} ${
          disabled ? "opacity-[0.38] pointer-events-none" : ""
        } [&::after]:content-[''] [&::after]:block [&::after]:h-px [&::after]:mt-1 [&::after]:bg-slate-100 dark:[&::after]:bg-white/6`}
      >
        {/* Label */}
        <span className="text-[11px] font-bold uppercase tracking-[0.6px] whitespace-nowrap overflow-hidden text-ellipsis text-blue-600/70 dark:text-blue-300/55">
          {t(label)}
        </span>

        {/* Body */}
        <div className="relative min-h-[26px] flex items-center">
          {isEditing ? (
            <>
              {isDate && (
                <InlineDateInput
                  initial={localValues[fieldKey] ?? ""}
                  onSave={(v) => saveField(fieldKey, v)}
                  onCancel={cancelField}
                  onChange={(v) => handleFieldChange(fieldKey, v)}
                />
              )}
              {isSelect && (
                <InlineSelect
                  initial={raw}
                  options={selectOpts}
                  onSave={(v) => saveField(fieldKey, v)}
                  onCancel={cancelField}
                />
              )}
              {!isDate && !isSelect && (
                <InlineTextInput
                  initial={localValues[fieldKey] ?? ""}
                  placeholder={t(placeholder)}
                  onSave={(v) => saveField(fieldKey, v)}
                  onCancel={cancelField}
                  onChange={(v) => handleFieldChange(fieldKey, v)}
                />
              )}
            </>
          ) : (
            <div
              className={`flex items-center gap-1.5 w-full rounded-md transition-colors duration-150 ${
                isEditable && revealed && !disabled
                  ? "cursor-text hover:bg-blue-50 dark:hover:bg-blue-300/[0.07]"
                  : "cursor-default"
              }`}
              style={{ padding: "2px 4px", margin: "-2px -4px" }}
              onClick={() =>
                !disabled && isEditable && revealed && startEdit(fieldKey)
              }
              title={
                isEditable && revealed && !disabled
                  ? "Click to edit"
                  : undefined
              }
            >
              <span
                className={`flex-1 text-sm font-medium wrap-break-words transition-colors duration-300 leading-normal
                  text-slate-700 dark:text-white/88 truncate
                  ${isMasked ? "tracking-[3px] text-xs text-slate-300 dark:text-white/16" : ""}`}
              >
                {isMasked ? maskOf(displayText) : displayText}
              </span>
              {isEditable && !disabled && (
                <Pencil
                  size={12}
                  className={`shrink-0 transition-opacity duration-150 text-blue-500 dark:text-blue-300/40
                    ${!revealed ? "hidden" : "opacity-50 group-hover:opacity-60"}`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    /* Page */
    <div
      className="w-full min-h-full flex items-center justify-center box-border overflow-x-hidden"
      style={{ padding: "24px" }}
    >
      {/* Inner */}
      <div
        className="w-full flex flex-row items-stretch gap-5 min-h-[calc(100vh-140px)]
          animate-[cp-rise_0.38s_cubic-bezier(0.22,1,0.36,1)_both]
          max-[900px]:flex-col max-[900px]:min-h-[unset] max-[900px]:gap-4
          max-[480px]:gap-3"
      >
        {/* ── LEFT: QR card ── */}
        <div className="flex-[0_0_calc(33.333%-10px)] flex flex-col max-[900px]:flex-none max-[900px]:w-full">
          <div
            className="flex-1 rounded-[20px] flex flex-col items-center justify-center relative overflow-hidden
              transition-[background,border-color,box-shadow] duration-300
              bg-white/55 border border-slate-200 shadow-[0_4px_20px_rgba(15,37,68,0.10)]
              dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              max-[900px]:flex-row max-[900px]:gap-6 max-[900px]:justify-center
              max-[600px]:flex-col max-[600px]:items-center"
            style={{ padding: "32px 24px" }}
          >
            {/* Decorative dot */}
            {theme === "dark" && (
              <div
                className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full pointer-events-none
                bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,transparent_70%)]
                max-[900px]:hidden"
                aria-hidden="true"
              />
            )}

            {/* QR section */}
            <div
              className="flex flex-col items-center gap-4 w-full relative z-1
                max-[900px]:flex-row max-[900px]:items-center max-[900px]:w-auto max-[900px]:gap-2.5
                max-[600px]:flex-col max-[600px]:items-center"
            >
              {/* QR wrap */}
              <div
                className="rounded-2xl flex items-center justify-center
                  transition-transform duration-180ms ease-out hover:scale-[1.03]
                  bg-gray-100 border border-slate-200 dark:bg-white/6 dark:border-transparent dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                style={{ padding: "16px" }}
                title="Phóng to QR"
              >
                <Image
                  style={{ display: "none" }}
                  preview={{
                    open: qrVisible,
                    onOpenChange: (v) => setQrVisible(v),
                    imageRender: () => (
                      <div className="flex flex-col items-center gap-4">
                        <QRCodeSVG
                          value={user?.Person_ID || "N/A"}
                          size={280}
                          bgColor="#ffffff"
                          fgColor="#0f2544"
                          style={{
                            borderRadius: 12,
                            padding: 16,
                            background: "#fff",
                          }}
                        />
                        {user?.Person_Name && (
                          <p className="text-white text-[15px] font-semibold m-0 tracking-[0.3px]">
                            {user.Person_Name}
                          </p>
                        )}
                      </div>
                    ),
                    actionsRender: () => null,
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "zoom-in" }}
                  onClick={() => setQrVisible(true)}
                  onKeyDown={(e) => e.key === "Enter" && setQrVisible(true)}
                >
                  <QRCodeSVG
                    value={user?.Person_ID || "N/A"}
                    size={148}
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="block transition-colors duration-300 text-slate-700 dark:text-white/90
                      w-full max-w-40 h-auto max-[900px]:max-w-[100px] max-[600px]:max-w-[130px]"
                  />
                </div>
              </div>

              {/* Identity */}
              <div
                className="text-center flex flex-col gap-[3px] w-full
                  max-[900px]:text-left max-[600px]:text-center"
              >
                <p className="text-[15px] font-bold m-0 leading-[1.3] transition-colors duration-300 text-slate-800 dark:text-white/92">
                  {user?.Person_Name || "—"}
                </p>
                <p className="text-[11.5px] font-semibold m-0 tracking-[0.5px] transition-colors duration-300 text-blue-600/70 dark:text-blue-300/60">
                  {user?.Person_ID || ""}
                </p>
                <p className="text-[11.5px] m-0 transition-colors duration-300 text-slate-500 dark:text-white/40">
                  {user?.Department_Name || ""}
                </p>
              </div>

              {/* Divider */}
              <div className="w-10 h-px bg-slate-300 dark:bg-white/8 max-[900px]:hidden" />

              {/* Eye button */}
              <button
                className="inline-flex items-center gap-[7px] bg-transparent border border-blue-400/40 dark:border-blue-300/[0.28]
                  rounded-full text-[13px] font-semibold cursor-pointer
                  transition-all duration-180 ease-in-out
                  text-blue-600/80 dark:text-blue-300/82 hover:bg-blue-400/8 dark:hover:bg-blue-300/7"
                style={{ padding: "7px 18px" }}
                onClick={() => setRevealed((v) => !v)}
                // title={revealed ? "Ẩn thông tin" : "Hiện thông tin"}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        {/* /left */}

        {/* ── RIGHT: form card ── */}
        <div className="flex-1 min-w-0 flex flex-col max-[900px]:w-full">
          <div
            className="flex-1 rounded-[20px] transition-[background,border-color,box-shadow] duration-300
              bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,37,68,0.08)]
              dark:bg-[rgba(15,27,48,0.7)] dark:border-white/[0.07] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ padding: "28px 28px 24px" }}
          >
            {/* Grid */}
            <div
              className="w-full grid grid-cols-4 gap-x-6 gap-y-5
                max-[1200px]:grid-cols-3
                max-[900px]:grid-cols-2 max-[900px]:gap-x-5 max-[900px]:gap-y-4
                max-[480px]:grid-cols-1 max-[480px]:gap-y-3.5"
            >
              {renderCell({ label: "hoVaTen", fieldKey: "fullName", span: 2 })}
              {renderCell({ label: "soThe", fieldKey: "cardNumber", span: 2 })}
              {renderCell({ label: "donVi", fieldKey: "department", span: 2 })}
              {renderCell({ label: "email", fieldKey: "email", span: 2 })}

              {renderCell({
                label: "ngaySinh",
                fieldKey: "birthday",
                placeholder: "DD/MM/YYYY",
                span: 2,
              })}
              {renderCell({
                label: "soDienThoai",
                fieldKey: "phone",
                placeholder: "0901234567",
                span: 2,
              })}

              {renderCell({
                label: "chungMinhNhanDan",
                fieldKey: "idCard",
                placeholder: "012345678901",
                span: 2,
              })}
              {renderCell({
                label: "ngayCap",
                fieldKey: "idIssueDate",
                placeholder: "DD/MM/YYYY",
                span: 2,
              })}

              {renderCell({ label: "maSoThue", fieldKey: "taxCode", span: 2 })}
              {renderCell({
                label: "ngayVaoCongTy",
                fieldKey: "joinDate",
                span: 2,
              })}

              {renderCell({
                label: "diaChiThuongTru",
                fieldKey: "permanentAddress",
                span: 4,
              })}
              {renderCell({
                label: "diaChiTamTru",
                fieldKey: "temporaryAddress",
                placeholder: "nhapDiaChiTamTru",
                span: 4,
              })}

              {renderCell({ label: "hinhThucDiChuyen", fieldKey: "transport" })}

              {isShuttleFactory && isShuttleSelected && (
                <>
                  {renderCell({
                    label: "tuyenXe",
                    fieldKey: "shuttleTrip",
                    span: 2,
                    options: trips.map((trip) => ({
                      value: trip.hanh_trinh,
                      label: trip.hanh_trinh,
                    })),
                  })}
                  {renderCell({
                    label: "tramDonTra",
                    fieldKey: "shuttleStop",
                    disabled: !localValues.shuttleTrip,
                    options: (
                      trips.find(
                        (t) => t.hanh_trinh === localValues.shuttleTrip,
                      )?.tram_don_tra ?? []
                    ).map((stop) => ({ value: stop.ten, label: stop.ten })),
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        {/* /right */}
      </div>

      <style>{`
        @keyframes cp-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
