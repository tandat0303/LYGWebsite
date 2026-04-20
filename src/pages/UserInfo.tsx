import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Pencil, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getApiErrorMessage, isoToDisplay, maskOf } from "../libs/helper";
import type { FieldKey, UserInfo, UserInfoPayload } from "../types/user";
import { useAppSelector } from "../hooks/auth";
import userApi from "../api/user";
import { AppAlert } from "../components/ui/AppAlert";
import {
  DATE_FIELDS,
  EDITABLE_FIELDS,
  MASKED_FIELDS,
  TRANSPORT_OPTIONS,
} from "../libs/constance";
import InlineSelect from "../components/ui/inlineEdit/InlineSelect";
import InlineDateInput from "../components/ui/inlineEdit/InlineDateInput";
import InlineTextInput from "../components/ui/inlineEdit/InlineTextInput";

export default function UserInfo() {
  const currentUser = useAppSelector((s) => s.auth.user);
  const [user, setUser] = useState<UserInfo>(null);

  const [revealed, setRevealed] = useState(false);
  const [editingField, setEditingField] = useState<FieldKey | null>(null);
  const [qrZoom, setQrZoom] = useState(false);

  const [localValues, setLocalValues] = useState<Record<string, string>>({
    birthday: user?.Birthday ?? "",
    phone: user?.Mobilephone_Number ?? "",
    idCard: user?.ID ?? "",
    idIssueDate: user?.ID_Day ?? "",
    transport: user?.Vehicle ?? "",
    temporaryAddress: user?.Address_Live ?? "",
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setQrZoom(false);
  };

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
        TRANSPORT_OPTIONS.find((o) => o.value === localValues.transport)
          ?.label ?? ""
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
        <span className="ui-cell__label">{label}</span>

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
                  options={TRANSPORT_OPTIONS}
                  onSave={(v) => saveField(fieldKey, v)}
                  onCancel={cancelField}
                />
              )}
              {!isDate && !isSelect && (
                <InlineTextInput
                  initial={localValues[fieldKey] ?? ""}
                  placeholder={placeholder}
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
        {/* ── QR + Eye ── */}
        <div className="ui-qr-section">
          <div
            className="ui-qr-wrap"
            onClick={() => setQrZoom(true)}
            title="Phóng to QR"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setQrZoom(true)}
          >
            <QRCodeSVG
              value={user?.Person_ID || "N/A"}
              size={148}
              bgColor="transparent"
              fgColor="currentColor"
              className="ui-qr-code"
            />
          </div>
          <button
            className="ui-eye-btn"
            onClick={() => setRevealed((v) => !v)}
            title={revealed ? "Ẩn thông tin" : "Hiện thông tin"}
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            {/* <span>{revealed ? "Ẩn thông tin" : "Hiện thông tin"}</span> */}
          </button>
        </div>

        {/* ── QR Zoom overlay ── */}
        {qrZoom && (
          <div
            className="ui-qr-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
          >
            <div className="ui-qr-zoom-box">
              <button className="ui-qr-close" onClick={() => setQrZoom(false)}>
                <X size={18} />
              </button>
              <QRCodeSVG
                value={user?.Person_ID || "N/A"}
                size={260}
                bgColor="transparent"
                fgColor="currentColor"
                className="ui-qr-code"
              />
              <p className="ui-qr-zoom-label">{user?.Person_Name}</p>
            </div>
          </div>
        )}

        {/* ── Grid (can adjust width with "span") ── */}
        <div className="ui-grid">
          {renderCell({ label: "Họ và tên", fieldKey: "fullName", span: 2 })}
          {renderCell({ label: "Số thẻ", fieldKey: "cardNumber", span: 2 })}
          {renderCell({ label: "Đơn vị", fieldKey: "department" })}

          {renderCell({ label: "Mã số thuế", fieldKey: "taxCode" })}
          {renderCell({ label: "Ngày vào công ty", fieldKey: "joinDate" })}
          {renderCell({
            label: "Ngày sinh",
            fieldKey: "birthday",
            placeholder: "DD/MM/YYYY",
          })}
          {renderCell({
            label: "Số điện thoại",
            fieldKey: "phone",
            placeholder: "0901234567",
          })}

          {renderCell({
            label: "Số CCCD / Hộ chiếu người NT",
            fieldKey: "idCard",
            placeholder: "012345678901",
            // span: 2,
          })}
          {renderCell({
            label: "Ngày cấp",
            fieldKey: "idIssueDate",
            placeholder: "DD/MM/YYYY",
          })}
          {renderCell({ label: "Hình thức di chuyển", fieldKey: "transport" })}

          {renderCell({
            label: "Địa chỉ thường trú",
            fieldKey: "permanentAddress",
            span: 4,
          })}
          {renderCell({
            label: "Địa chỉ tạm trú",
            fieldKey: "temporaryAddress",
            placeholder: "Nhập địa chỉ tạm trú",
            span: 4,
          })}
        </div>
      </div>

      <style>{`
        /* ── Page ── */
        .ui-page {
          width: 100%;
          min-height: 100%;
          padding: 32px 32px 72px;
          box-sizing: border-box;
        }
        .ui-inner {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: ui-rise 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes ui-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── QR ── */
        .ui-qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ui-qr-wrap {
          cursor: zoom-in;
          padding: 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.18s ease, background 0.3s ease;
        }
        .ui-qr-wrap:hover { transform: scale(1.04); }
        .dark .ui-qr-wrap  { background: rgba(255,255,255,0.05); box-shadow: 0 0 0 1px rgba(255,255,255,0.07); }
        .light .ui-qr-wrap { background: rgba(0,0,0,0.04); box-shadow: 0 0 0 1px rgba(0,0,0,0.06); }
        .ui-qr-code { display: block; transition: color 0.3s; }
        .dark .ui-qr-code  { color: rgba(255,255,255,0.88); }
        .light .ui-qr-code { color: #0f2544; }

        /* Eye btn */
        .ui-eye-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid var(--ui-eye-border);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s ease;
          color: var(--ui-eye-color);
        }
        .dark  { --ui-eye-border: rgba(147,197,253,0.28); --ui-eye-color: rgba(147,197,253,0.82); }
        .light { --ui-eye-border: rgba(37,99,235,0.22);   --ui-eye-color: #2563eb; }
        .ui-eye-btn:hover { background: var(--ui-eye-hover); }
        .dark  { --ui-eye-hover: rgba(147,197,253,0.07); }
        .light { --ui-eye-hover: rgba(37,99,235,0.05); }

        /* ── QR Overlay ── */
        .ui-qr-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 999;
          display: flex; align-items: center; justify-content: center;
          animation: ui-fade 0.2s ease;
        }
        @keyframes ui-fade { from { opacity: 0; } to { opacity: 1; } }
        .ui-qr-zoom-box {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          gap: 14px; padding: 32px; border-radius: 22px;
          animation: ui-zoom-in 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes ui-zoom-in {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .dark .ui-qr-zoom-box  { background: rgba(15,27,48,0.96); border: 1px solid rgba(255,255,255,0.09); box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
        .light .ui-qr-zoom-box { background: #fff; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 32px 80px rgba(15,37,68,0.18); }
        .ui-qr-close {
          position: absolute; top: 10px; right: 10px;
          width: 30px; height: 30px;
          border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .dark .ui-qr-close  { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.65); }
        .light .ui-qr-close { background: rgba(0,0,0,0.05); color: #475569; }
        .ui-qr-close:hover  { background: rgba(239,68,68,0.15) !important; color: #ef4444 !important; }
        .ui-qr-zoom-label {
          font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; margin: 0;
          transition: color 0.3s;
        }
        .dark .ui-qr-zoom-label  { color: rgba(255,255,255,0.65); }
        .light .ui-qr-zoom-label { color: #475569; }

        /* ── Grid ── */
        .ui-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 24px;
        }

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
          font-family: 'DM Sans', sans-serif;
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
          font-family: 'DM Sans', sans-serif;
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
        @media (max-width: 1100px) {
          .ui-grid { grid-template-columns: repeat(3, 1fr); }
          .ui-cell--span-4 { grid-column: span 3; }
        }
        @media (max-width: 768px) {
          .ui-page { padding: 24px 20px 96px; }
          .ui-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 20px; }
          .ui-cell--span-4 { grid-column: span 2; }
          .ui-cell--span-2 { grid-column: span 2; }
        }
        @media (max-width: 480px) {
          .ui-page { padding: 20px 16px 96px; }
          .ui-grid { grid-template-columns: 1fr; gap: 14px; }
          .ui-cell--span-1,
          .ui-cell--span-2,
          .ui-cell--span-4 { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
