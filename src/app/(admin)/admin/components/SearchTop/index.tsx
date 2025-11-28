"use client";
import CustomInput from "@/components/client/customInput";
import { Button, Form } from "antd";
import { useEffect } from "react";

// 传入的类型，用于循环出组件
type WidgetType = "input" | "select" | "date";

type ConfigType = {
  type: WidgetType;
  name: string;
  label?: string;
  labelWidth?: number;
  width?: number;
  defaultValue?: any;
  props?: any;
};

type ProspType = {
  config: ConfigType[];
  onSearch: (searchParams: Record<string, any>) => void;
  onRefresh: () => void;
};

const SearchTop = ({ config, onSearch, onRefresh }: ProspType) => {
  const [form] = Form.useForm();

  const initForm = () => {
    form.setFieldsValue(
      config.reduce(
        (prev, cur) => ({ ...prev, [cur.name]: cur?.defaultValue }),
        {}
      )
    );
  };

  useEffect(() => {
    console.log(config, "++??config");
    if (!config.length) return;
    initForm();
  }, [config]);
  return (
    <div className="w-full flex justify-between items-center gap-3">
      <Form form={form}>
        {config?.map((item) => {
          switch (item.type) {
            case "input": {
              return (
                <Form.Item
                  style={{ width: item.width + "px" }}
                  name={item.name}
                  label={item.label}
                >
                  <CustomInput {...item.props} />
                </Form.Item>
              );
            }

            default:
              return null;
          }
        })}
      </Form>
      <div className="w-full flex justify-end items-center gap-3">
        <Button
          type="primary"
          onClick={() => {
            const searchParams = form.getFieldsValue();
            onSearch(searchParams);
          }}
        >
          查询
        </Button>
        <Button
          type="primary"
          onClick={() => {
            onRefresh();
          }}
        >
          重置
        </Button>
      </div>
    </div>
  );
};

export { SearchTop };
export type { ConfigType, WidgetType };
