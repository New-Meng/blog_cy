"use client";
import zhCN from "antd/locale/zh_CN";
import { _$fetch } from "@/app/lib/client/fetch";
import CustomInput from "@/components/client/customInput";
import { Tag } from "@prisma/client";
import {
  Button,
  ConfigProvider,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { SearchTop } from "../components/SearchTop";
import type { ConfigType } from "../components/SearchTop";

interface TagListResponseData {
  list: Tag[];
  total: number;
  pageNo: number;
  pageSize: number;
}

const baseColumnes: TableColumnsType = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: "标签名称",
    dataIndex: "tagName",
    key: "tagName",
    align: "center",
    width: 300,
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
    align: "center",
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

const searchConfig: ConfigType[] = [
  {
    type: "input",
    name: "tagName",
    label: "标签名称",
    defaultValue: "",
    width: 300,
  },
];

const TagManagePage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnsType = baseColumnes.concat([
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (text: string, record: any) => (
        <div className="w-full flex items-center justify-center gap-2">
          <Button
            type="primary"
            onClick={() => {
              setShowCreate(true);
              setCurDetail(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除吗？"
            onConfirm={() => {
              handleDelete(record);
            }}
          >
            <Button loading={deleteLoading === record.id} danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]);

  const [list, setList] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number>();

  const [showCreate, setShowCreate] = useState(false);
  const [curDetail, setCurDetail] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");

  let seachParamsData = {};

  const getList = async (
    pageNo: number,
    pageSize: number,
    searchParams?: Record<string, any>
  ) => {
    try {
      setTableLoading(true);
      const res = await _$fetch.get<TagListResponseData>(
        `/apiv1/admin/tag/list?pageNo=${pageNo}&pageSize=${pageSize}${Object.entries(
          searchParams || {}
        )
          .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
          .join("")}`
      );
      if (res.success && Array.isArray(res.data?.list)) {
        setList(res.data.list);
        setCurrentPage(res.data.pageNo);
        setPageSize(res.data.pageSize);
        setTotal(res.data.total);
      }
      setTableLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setTableLoading(false);
    }
  };

  const onSearch = (searchParams: Record<string, any>) => {
    seachParamsData = searchParams;
    getList(currentPage, pageSize, searchParams);
  };

  const onRefresh = async () => {
    setCurrentPage(1);
    setPageSize(10);
    await getList(1, 10);
  };

  const handleDelete = async (record: Tag) => {
    try {
      setDeleteLoading(record.id);
      const res = await _$fetch.post<Tag>(`/apiv1/admin/tag/delete`, {
        body: {
          id: record.id,
        },
      });
      if (res.success) {
        messageApi.success("删除成功");
        getList(currentPage, pageSize);
      } else {
        messageApi.error("删除失败");
      }
      setDeleteLoading(undefined);
    } catch (error) {
      console.log(error);
      messageApi.error("删除失败");
      setDeleteLoading(undefined);
    }
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSubmit = async () => {
    try {
      setModalLoading(true);
      if (curDetail?.id) {
        const res = await _$fetch.post<Tag>(`/apiv1/admin/tag/update`, {
          body: {
            id: curDetail.id,
            tagName: tagName,
          },
        });
        if (res.success) {
          setShowCreate(false);
          getList(currentPage, pageSize);
          messageApi.success("更新成功");
        } else {
          messageApi.error("更新失败");
        }
      } else {
        const res = await _$fetch.post<Tag>(`/apiv1/admin/tag/create`, {
          body: {
            tagName: tagName,
          },
        });
        if (res.success) {
          setShowCreate(false);
          getList(currentPage, pageSize);
          messageApi.success("创建成功");
        } else {
          messageApi.error("创建失败");
        }
      }
      setModalLoading(false);
    } catch (error) {
      console.log(error);
      messageApi.error("操作失败");
      setModalLoading(false);
    }
  };

  useEffect(() => {
    getList(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (showCreate) {
      setTagName(curDetail?.tagName || "");
    } else {
      setTagName("");
    }
  }, [curDetail, showCreate]);

  return (
    <ConfigProvider locale={zhCN}>
      {contextHolder}
      <div className="w-full">
        <SearchTop
          onSearch={onSearch}
          onRefresh={onRefresh}
          config={searchConfig}
        ></SearchTop>
        <div className="w-full p-2">
          <Button
            type="primary"
            onClick={() => {
              setShowCreate(true);
              setCurDetail(null);
            }}
          >
            创建标签
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={tableLoading}
          onChange={handleTableChange}
          style={{ width: "100%" }}
        />

        <Modal
          title="创建标签"
          visible={showCreate}
          onCancel={() => {
            setShowCreate(false);
            setTagName("");
          }}
          confirmLoading={modalLoading}
          onOk={onSubmit}
        >
          <div className="w-full p-2">
            <CustomInput
              value={tagName}
              onChange={setTagName}
              placeholder="请输入标签名称"
            />
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TagManagePage;
