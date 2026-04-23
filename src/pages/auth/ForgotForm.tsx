import { Form, Input, Button, DatePicker } from "antd";
import {
  IdCard,
  IdCardLanyard,
  KeyRound,
  CalendarDays,
  Fingerprint,
  Building2,
} from "lucide-react";
import dayjs from "dayjs";
import { Icon } from "../../components/ui/Icon";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { FACTORY_OPTIONS, REQUIRE_MESSAGE } from "../../libs/constance";
import type { ForgotFormValues } from "../../types/auth";
import { useTranslation } from "../../hooks/useTranslation";

interface ForgotFormProps {
  onFinish: (values: ForgotFormValues) => void;
  loading: boolean;
}

export const ForgotForm = ({ onFinish, loading }: ForgotFormProps) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<ForgotFormValues>();

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="lp-form lp-form--scroll w-full"
      autoComplete="off"
    >
      <Form.Item
        name="userId"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <Input
          prefix={
            <Icon>
              <IdCardLanyard size={15} />
            </Icon>
          }
          placeholder={t("soThe")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="idNumber"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <Input
          prefix={
            <Icon>
              <IdCard size={15} />
            </Icon>
          }
          placeholder={t("chungMinhNhanDan")}
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="receivedDate"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          placeholder={t("ngayCap")}
          size="large"
          suffixIcon={
            <Icon>
              <CalendarDays size={15} />
            </Icon>
          }
          className="lp-datepicker w-full"
          disabledDate={(d) => d && d.isAfter(dayjs())}
        />
      </Form.Item>

      <Form.Item
        name="birthDate"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          placeholder={t("ngaySinh")}
          size="large"
          suffixIcon={
            <Icon>
              <Fingerprint size={15} />
            </Icon>
          }
          className="lp-datepicker w-full"
          disabledDate={(d) => d && d.isAfter(dayjs())}
        />
      </Form.Item>

      <Form.Item
        name="factory"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <CustomSelect
          placeholder={t("ngaySinh")}
          options={FACTORY_OPTIONS}
          icon={<Building2 size={15} />}
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[{ required: true, message: t(REQUIRE_MESSAGE) }]}
      >
        <Input.Password
          prefix={
            <Icon>
              <KeyRound size={15} />
            </Icon>
          }
          placeholder={t("matKhauMoi")}
          size="large"
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          htmlType="submit"
          loading={loading}
          block
          className="lp-submit-btn"
        >
          {t("doiMatKhau")}
        </Button>
      </Form.Item>
    </Form>
  );
};
