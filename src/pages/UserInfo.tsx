import { useState, useEffect } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Image } from "antd";
import { QRCodeSVG } from "qrcode.react";
import { getApiErrorMessage, isoToDisplay, maskOf } from "../libs/helper";
import type { FieldKey, UserInfo, UserInfoPayload } from "../types/user";
import { useAppSelector } from "../hooks/auth";
import userApi from "../api/user";
import { AppAlert } from "../components/ui/AppAlert";
import { DATE_FIELDS, EDITABLE_FIELDS, MASKED_FIELDS } from "../libs/constance";
import InlineSelect from "../components/ui/inlineEdit/InlineSelect";
import InlineDateInput from "../components/ui/inlineEdit/InlineDateInput";
import InlineTextInput from "../components/ui/inlineEdit/InlineTextInput";
import { useTranslation } from "../hooks/useTranslation";

export default function UserInfo() {
  const { t } = useTranslation();

  const currentUser = useAppSelector((s) => s.auth.user);
  const vehicles = useAppSelector((s) => s.transport.vehicles);
  const currentLang = useAppSelector((s) => s.language.current);

  const [user, setUser] = useState<UserInfo>(null);

  const [revealed, setRevealed] = useState(false);
  const [editingField, setEditingField] = useState<FieldKey | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [localValues, setLocalValues] = useState<Record<string, string>>({
    birthday: user?.Birthday ?? "",
    phone: user?.Mobilephone_Number ?? "",
    idCard: user?.ID ?? "",
    idIssueDate: user?.ID_Day ?? "",
    transport: user?.Vehicle ?? "",
    temporaryAddress: user?.Address_Live ?? "",
  });

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
      phone: user.Mobilephone_Number ?? "",
      idCard: user.ID ?? "",
      idIssueDate: isoToDisplay(user.ID_Day ?? ""),
      transport: user.Vehicle ?? "",
      temporaryAddress: user.Address_Live ?? "",
    });
  }, [user]);

  useEffect(() => {
    if (!revealed) setEditingField(null);
  }, [revealed]);

  const startEdit = (field: FieldKey) => {
    if (!revealed || !EDITABLE_FIELDS.includes(field)) return;
    setEditingField(field);
  };

  const saveField = (field: FieldKey, value: string) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    // TODO: call API to persist
  };

  const cancelField = () => setEditingField(null);

  const getDisplay = (fieldKey: FieldKey): string => {
    if (fieldKey === "transport") {
      return (
        vehicleOptions.find((o) => o.value === localValues.transport)?.label ??
        ""
      );
    }
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
  }: {
    label: string;
    fieldKey: FieldKey;
    placeholder?: string;
    span?: 1 | 2 | 4;
  }) => {
    const raw = getDisplay(fieldKey);
    const isMasked = MASKED_FIELDS.includes(fieldKey) && !revealed;
    const isEditable = EDITABLE_FIELDS.includes(fieldKey);
    const isEditing = editingField === fieldKey;
    const isDate = DATE_FIELDS.includes(fieldKey);
    const isSelect = fieldKey === "transport";
    const displayText = raw || "";

    return (
      <div className={`ui-cell ui-cell--span-${span}`} key={fieldKey}>
        <span className="ui-cell__label">{t(label)}</span>

        <div className="ui-cell__body">
          {isEditing ? (
            <>
              {isDate && (
                <InlineDateInput
                  initial={localValues[fieldKey] ?? ""}
                  onSave={(v) => saveField(fieldKey, v)}
                  onCancel={cancelField}
                />
              )}
              {isSelect && (
                <InlineSelect
                  initial={localValues[fieldKey] ?? ""}
                  options={vehicleOptions}
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
                />
              )}
            </>
          ) : (
            <div
              className={`ui-cell__value-row ${isEditable && revealed ? "ui-cell__value-row--editable" : ""}`}
              onClick={() => isEditable && revealed && startEdit(fieldKey)}
              title={isEditable && revealed ? "Nhấn để chỉnh sửa" : undefined}
            >
              <span
                className={`ui-cell__value ${isMasked ? "ui-cell__value--masked" : ""}`}
              >
                {isMasked ? maskOf(displayText) : displayText}
              </span>
              {isEditable && (
                <Pencil
                  size={12}
                  className={`ui-pencil-icon ${!revealed ? "ui-pencil-icon--hidden" : ""}`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ui-page">
      <div className="ui-inner">
        {/* ── LEFT: QR card ── */}
        <div className="ui-left">
          <div className="ui-left-card">
            {/* decorative dots */}
            <div className="ui-left-card__deco" aria-hidden="true" />

            <div className="ui-qr-section">
              <div className="ui-qr-wrap" title="Phóng to QR">
                <Image
                  style={{ display: "none" }}
                  preview={{
                    open: qrVisible,
                    onOpenChange: (v) => setQrVisible(v),
                    imageRender: () => (
                      <div className="ui-qr-preview-box">
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
                          <p className="ui-qr-preview-name">
                            {user.Person_Name}
                          </p>
                        )}
                      </div>
                    ),
                    actionsRender: () => null,
                  }}
                  // src=""
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
                    className="ui-qr-code"
                  />
                </div>
              </div>

              {/* Name + serial below QR */}
              <div className="ui-qr-identity">
                <p className="ui-qr-identity__name">
                  {user?.Person_Name || "—"}
                </p>
                <p className="ui-qr-identity__serial">
                  {user?.Person_ID || ""}
                </p>
                <p className="ui-qr-identity__dept">
                  {user?.Department_Name || ""}
                </p>
              </div>

              <button
                className="ui-eye-btn"
                onClick={() => setRevealed((v) => !v)}
                title={revealed ? "Ẩn thông tin" : "Hiện thông tin"}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                {/* <span className="ui-eye-btn__label">
                  {revealed ? t("anThongTin") : t("hienThongTin")}
                </span> */}
              </button>
            </div>
          </div>
        </div>
        {/* /ui-left */}

        {/* ── RIGHT: form card ── */}
        <div className="ui-right">
          <div className="ui-right-card">
            {/* ── Grid ── */}
            <div className="ui-grid">
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

              {renderCell({ label: "maSoThue", fieldKey: "taxCode" })}
              {renderCell({ label: "ngayVaoCongTy", fieldKey: "joinDate" })}
              {renderCell({
                label: "hinhThucDiChuyen",
                fieldKey: "transport",
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
            </div>
          </div>
          {/* /ui-right-card */}
        </div>
        {/* /ui-right */}
      </div>

      <style>{`
        /* ── Page ── */
        .ui-page {
          width: 100%;
          min-height: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 24px 24px 72px;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .ui-inner {
          width: 100%;
          min-height: calc(100vh - 140px);
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 20px;
          animation: ui-rise 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes ui-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Left panel (1/3) ── */
        .ui-left {
          flex: 0 0 calc(33.333% - 10px);
          display: flex;
          flex-direction: column;
        }

        /* Left card */
        .ui-left-card {
          flex: 1;
          border-radius: 20px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .dark .ui-left-card {
          background: rgba(15,27,48,0.7);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .light .ui-left-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(15,37,68,0.08);
        }

        /* Decorative dot pattern */
        .ui-left-card__deco {
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          pointer-events: none;
          transition: background 0.3s;
        }
        .dark .ui-left-card__deco  { background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%); }
        .light .ui-left-card__deco { background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%); }

        /* ── Right panel (2/3) ── */
        .ui-right {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .ui-right-card {
          flex: 1;
          border-radius: 20px;
          padding: 28px 28px 24px;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .dark .ui-right-card {
          background: rgba(15,27,48,0.7);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .light .ui-right-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 24px rgba(15,37,68,0.08);
        }

        /* QR scales to fit card */
        .ui-qr-section svg {
          width: 100%;
          max-width: 160px;
          height: auto;
        }

        /* ── QR section ── */
        .ui-qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .ui-qr-wrap {
          padding: 16px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.18s ease, background 0.3s ease;
        }
        .ui-qr-wrap:hover { transform: scale(1.03); }
        .dark .ui-qr-wrap  { background: rgba(255,255,255,0.06); box-shadow: 0 0 0 1px rgba(255,255,255,0.08); }
        .light .ui-qr-wrap { background: rgba(37,99,235,0.05); box-shadow: 0 0 0 1px rgba(37,99,235,0.1); }
        .ui-qr-code { display: block; transition: color 0.3s; }
        .dark .ui-qr-code  { color: rgba(255,255,255,0.9); }
        .light .ui-qr-code { color: #0f2544; }

        /* Identity below QR */
        .ui-qr-identity {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 100%;
        }
        .ui-qr-identity__name {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          line-height: 1.3;
          transition: color 0.3s;
        }
        .dark .ui-qr-identity__name  { color: rgba(255,255,255,0.92); }
        .light .ui-qr-identity__name { color: #0f2544; }

        .ui-qr-identity__serial {
          font-size: 11.5px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.5px;
          transition: color 0.3s;
        }
        .dark .ui-qr-identity__serial  { color: rgba(147,197,253,0.6); }
        .light .ui-qr-identity__serial { color: rgba(37,99,235,0.65); }

        .ui-qr-identity__dept {
          font-size: 11.5px;
          margin: 0;
          transition: color 0.3s;
        }
        .dark .ui-qr-identity__dept  { color: rgba(255,255,255,0.4); }
        .light .ui-qr-identity__dept { color: #64748b; }

        /* Divider inside left card */
        .ui-qr-section::after {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          margin: 0 auto;
          transition: background 0.3s;
        }
        .dark .ui-qr-section::after  { background: rgba(255,255,255,0.08); }
        .light .ui-qr-section::after { background: rgba(0,0,0,0.07); }

        /* Eye btn */
        .ui-eye-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid var(--ui-eye-border);
          border-radius: 999px;
          padding: 7px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          color: var(--ui-eye-color);
        }
        .ui-eye-btn__label { font-family: 'DM Sans', sans-serif; }
        .dark  { --ui-eye-border: rgba(147,197,253,0.28); --ui-eye-color: rgba(147,197,253,0.82); }
        .light { --ui-eye-border: rgba(37,99,235,0.22);   --ui-eye-color: #2563eb; }
        .ui-eye-btn:hover { background: var(--ui-eye-hover); }
        .dark  { --ui-eye-hover: rgba(147,197,253,0.07); }
        .light { --ui-eye-hover: rgba(37,99,235,0.05); }

        /* ── Cell ── */
        .ui-cell {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }
        .ui-cell--span-1 { grid-column: span 1; }
        .ui-cell--span-2 { grid-column: span 2; }
        .ui-cell--span-4 { grid-column: span 4; }

        .ui-cell::after {
          content: '';
          display: block;
          height: 1px;
          margin-top: 4px;
          transition: background 0.3s;
        }
        .dark .ui-cell::after  { background: rgba(255,255,255,0.06); }
        .light .ui-cell::after { background: rgba(0,0,0,0.06); }

        .ui-cell__label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          transition: color 0.3s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dark .ui-cell__label  { color: rgba(147,197,253,0.55); }
        .light .ui-cell__label { color: rgba(37,99,235,0.75); }

        .ui-cell__body {
          position: relative;
          min-height: 26px;
          display: flex;
          align-items: center;
        }

        /* Value row — clickable when editable + revealed */
        .ui-cell__value-row {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          border-radius: 6px;
          padding: 2px 4px;
          margin: -2px -4px;
          transition: background 0.15s;
          cursor: default;
        }
        .ui-cell__value-row--editable {
          cursor: text;
        }
        .ui-cell__value-row--editable:hover {
          background: var(--ui-hover-bg);
        }
        .dark  { --ui-hover-bg: rgba(147,197,253,0.07); }
        .light { --ui-hover-bg: rgba(37,99,235,0.05); }

        .ui-cell__value {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          word-break: break-word;
          transition: color 0.3s;
          line-height: 1.5;
        }
        .dark .ui-cell__value  { color: rgba(255,255,255,0.88); }
        .light .ui-cell__value { color: #0f172a; }

        .ui-cell__value--masked {
          letter-spacing: 3px;
          font-size: 12px;
        }
        .dark .ui-cell__value--masked  { color: rgba(255,255,255,0.16); }
        .light .ui-cell__value--masked { color: rgba(0,0,0,0.13); }

        /* Pencil icon */
        .ui-pencil-icon {
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.15s;
          color: var(--ui-pencil-color);
        }
        .dark  { --ui-pencil-color: rgba(147,197,253,0.7); }
        .light { --ui-pencil-color: #2563eb; }
        .ui-pencil-icon--hidden { display: none; }
        .ui-cell__value-row--editable:hover .ui-pencil-icon { opacity: 0.6; }

        /* ── Responsive ── */

        /* Desktop: 4 cols in right panel */
        .ui-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 24px;
        }

        /* Medium: 1/3 + 2/3 still holds, grid goes 3 col */
        @media (max-width: 1200px) {
          .ui-grid { grid-template-columns: repeat(3, 1fr); }
          .ui-cell--span-4 { grid-column: span 3; }
          .ui-cell--span-2 { grid-column: span 2; }
        }

        /* Tablet: stack vertically, QR on top */
        @media (max-width: 900px) {
          .ui-inner { flex-direction: column; align-items: stretch; min-height: unset; gap: 16px; }
          .ui-left { flex: none; width: 100%; }
          .ui-left-card { padding: 24px; flex-direction: row; gap: 24px; justify-content: flex-start; }
          .ui-left-card__deco { display: none; }
          .ui-qr-section { flex-direction: row; align-items: center; width: auto; gap: 20px; }
          .ui-qr-section::after { display: none; }
          .ui-qr-identity { text-align: left; }
          .ui-qr-section svg { max-width: 100px; }
          .ui-right { width: 100%; }
          .ui-page { padding: 16px 16px 96px; align-items: flex-start; }
          .ui-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 20px; }
          .ui-cell--span-4 { grid-column: span 2; }
          .ui-cell--span-2 { grid-column: span 2; }
        }

        @media (max-width: 600px) {
          .ui-left-card { flex-direction: column; align-items: center; }
          .ui-qr-section { flex-direction: column; }
          .ui-qr-identity { text-align: center; }
          .ui-qr-section svg { max-width: 130px; }
        }

        @media (max-width: 480px) {
          .ui-page { padding: 12px 12px 96px; }
          .ui-inner { gap: 12px; }
          .ui-grid { grid-template-columns: 1fr; gap: 14px; }
          .ui-right-card { padding: 20px 16px; }
          .ui-cell--span-1,
          .ui-cell--span-2,
          .ui-cell--span-4 { grid-column: span 1; }
        }
        /* QR preview overlay */
        .ui-qr-preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .ui-qr-preview-name {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.3px;
        }
      `}</style>
    </div>
  );
}
