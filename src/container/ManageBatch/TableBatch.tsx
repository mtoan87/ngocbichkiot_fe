/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";

import CustomizeTable from "@/components/table/customize-table";
import BatchAPI from "@/axios-clients/batch_api/batchAPI";
import MenuActionTableBatch from "../menu_action/Batch/MenuActionTableBatch";
import withAuth from "@/hook/checkRoute";

// Define the Batch model interface
interface BatchModel {
  batchNumber: string;
  receivedDate: string;
  provideCompanies: string[];
}

// API returns all data without server-side pagination

const TableBatch = () => {
  // State declarations with proper typing
  const [selectedData, setSelectedData] = useState<BatchModel | null>(null);
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataBatch, setDataBatch] = useState<BatchModel[]>([]);

  // Select data handler
  const selectData = (row: BatchModel) => {
    setSelectedData(row);
  };

  // Fetch batch data
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response: any = await BatchAPI.getBatchList({});

        const items = Array.isArray(response)
          ? response
          : response?.items || [];

        console.log("Fetched batch data:", items);

        setDataBatch(items);
        setTotal(items.length);
      } catch (error: any) {
        console.error("Error fetching batch data:", error?.message);
        setDataBatch([]);
        setTotal(0);
      }
    };

    fetchBatchData();
  }, []); // Remove page and size dependencies since API doesn't support pagination

  // Table headers configuration
  const tableHeader = [
    {
      id: "id",
      label: "Số lô",
      align: "left" as const,
      format: "bathchNumber" as const,
    },
    {
      id: "createDate",
      label: "Ngày nhận",
      align: "center" as const,
      format: "date" as const,
    },
  ];

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  return (
    <>
      <CustomizeTable
        data={dataBatch}
        tableHeaderTitle={tableHeader}
        title="Bảng quản lý lô hàng"
        menuAction={
          <MenuActionTableBatch
            batchData={selectedData}
            onOpenDetail={selectData}
          />
        }
        selectedData={selectData}
        size={size}
        page={page}
        total={total}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default withAuth(TableBatch);
