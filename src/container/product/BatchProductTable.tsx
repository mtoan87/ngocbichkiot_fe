/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";

import CustomizeTable from "@/components/table/customize-table";
import withAuth from "@/hook/checkRoute";
import { BatchDetail } from "@/types/BatchType";


const BatchProductTable = ({ batchDetails }: { batchDetails: BatchDetail[] }) => {
    // State declarations with proper typing
    const [size, setSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(batchDetails.length);
    const [page, setPage] = useState<number>(0);

    // Table headers configuration
    const tableHeader = [
        // {
        //     id: "id",
        //     label: "Số lô",
        //     align: "left" as const,
        //     format: "bathchNumber" as const,
        // },
        {
            id: "batchId",
            label: "Số lô",
            align: "center" as const,
            minWidth: 120,
            maxWidth: 140,
        },
        {
            id: "sourceOfProductDTO.name",
            label: "Nhà cung cấp",
            align: "center" as const,
            minWidth: 120,
            maxWidth: 150,
        },
        {
            id: "quantity",
            label: "SL ban đầu",
            align: "center" as const,
            minWidth: 90,
        },
        {
            id: "remainingQuantity",
            label: "SL còn lại",
            align: "center" as const,
            minWidth: 90,
            format: "checkNumber"
        },
        {
            id: "expiredDate",
            label: "HSD",
            align: "center" as const,
            minWidth: 100,
            format: "date" as const,
        },
        {
            id: "daysUntilExpiration",
            label: "Ngày còn lại",
            align: "center" as const,
            minWidth: 80,
            format: "checkNumber"
        },
        {
            id: "isExpiredLogged",
            label: "Trạng thái",
            align: "center" as const,
            minWidth: 100,
            format: "expired"
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
                data={[...batchDetails].reverse().slice(page * size, page * size + size)}
                tableHeaderTitle={tableHeader}
                title="Bảng quản lý lô hàng"
                size={size}
                page={page}
                total={total}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
};

export default withAuth(BatchProductTable);
