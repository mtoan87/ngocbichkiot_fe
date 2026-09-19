'use client'

import React from "react";
import CustomizeTable from "@/components/table/customize-table";
import { ProductLog } from "@/types/ProductType";
import { Tabs, Tab, Box } from "@mui/material";
import withAuth from "@/hook/checkRoute";

const LogTableTabs = ({ logs }: { logs: ProductLog[] }) => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);

    const groupedLogs = React.useMemo(() => {
        const sortedLogs = [...logs].sort((a, b) => {
            return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
        });

        return sortedLogs.reduce<Record<string, ProductLog[]>>((acc, log) => {
            const key = log.type;
            if (!acc[key]) acc[key] = [];
            acc[key].push(log);
            return acc;
        }, {});
    }, [logs]);

    const tabKeys = ["Export", "Expired", "Rollback", "UpdatePrice"].filter((key) => key in groupedLogs);
    console.log(tabKeys)
    const tabLabels: Record<string, string> = {
        "Export": "Xuất kho",
        "Expired": "Hết hạn",
        "Rollback": "Trả hàng",
        "UpdatePrice": "Cập nhật giá",
    };

    const headerByType: Record<string, any[]> = {
        "Export": [
            { id: "batchId", label: "Lô hàng", align: "center" },
            { id: "quantity", label: "Số lượng", align: "center" },
        ],
        "Expired": [
            { id: "batchId", label: "Lô hàng", align: "center" },
            { id: "quantity", label: "Số lượng", align: "center" },
        ],
        "Rollback": [
            { id: "batchId", label: "Lô hàng", align: "center" },
            { id: "quantity", label: "Số lượng", align: "center" },
        ],
        "UpdatePrice": [
            { id: "oldImportCost", label: "Giá nhập cũ", align: "center" },
            { id: "newImportCost", label: "Giá nhập mới", align: "center" },
            { id: "oldSellingPrice", label: "Giá bán cũ", align: "center" },
            { id: "newSellingPrice", label: "Giá bán mới", align: "center" },
            { id: "createDate", label: "Thời gian", align: "center", format: "date" },
        ],
    };

    const currentTabKey = tabKeys[tabIndex];
    const data = groupedLogs[currentTabKey] || [];
    const headers = headerByType[currentTabKey] || [];

    const dataToDisplay = React.useMemo(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        return data.slice(start, end);
    }, [data, page, pageSize]);

    const handleChangePage = (_: any, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setPageSize(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleTabChange = (_: any, newValue: number) => {
        setTabIndex(newValue);
        setPage(0);
    };

    return (
        <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ px: "16px" }}>
                {tabKeys.map((key) => (
                    <Tab key={key} label={tabLabels[key] || key} />
                ))}
            </Tabs>
            <Box mt={2}>
                <CustomizeTable
                    tableHeaderTitle={headers}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    total={data.length}
                    size={pageSize}
                    page={page}
                    data={dataToDisplay}
                />
            </Box>
        </Box>
    );
}
export default withAuth(LogTableTabs);
