import { Form, Input, Button } from "antd";
import { Building2, IdCard, KeyRound } from "lucide-react";
import { Icon } from "../../components/ui/Icon";
import { FACTORY_OPTIONS, REQUIRE_MESSAGE } from "../../libs/constance";
import type { LoginFormValues } from "../../types/auth";
import { CustomSelect } from "../../components/ui/CustomSelect";

interface LoginFormProps {
  onFinish: (values: LoginFormValues) => void;
  loading: boolean;
}

export const LoginForm = ({ onFinish, loading }: LoginFormProps) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      className="lp-form"
      style={{ width: "100%" }}
      autoComplete="off"
    >
      <Form.Item
        name="userId"
        rules={[{ required: true, message: REQUIRE_MESSAGE }]}
      >
        <Input
          prefix={
            <Icon>
              <IdCard size={15} />
            </Icon>
          }
          placeholder="Account Number"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: REQUIRE_MESSAGE }]}
      >
        <Input.Password
          prefix={
            <Icon>
              <KeyRound size={15} />
            </Icon>
          }
          placeholder="••••••••"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="factory"
        rules={[{ required: true, message: REQUIRE_MESSAGE }]}
      >
        <CustomSelect
          placeholder="Factory"
          options={FACTORY_OPTIONS}
          icon={<Building2 size={15} />}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          htmlType="submit"
          loading={loading}
          block
          className="lp-submit-btn"
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};
