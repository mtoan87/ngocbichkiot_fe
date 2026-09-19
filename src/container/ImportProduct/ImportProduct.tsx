"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  MenuItem,
  InputAdornment,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
// Import DatePicker components
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

import BatchPagination from "./BatchPagination";
import { toast } from "react-toastify";
import useDebounce from "@/hook/useDebounce";
import productApi from "@/axios-clients/product_api/productAPI";
import BatchAPI from "@/axios-clients/batch_api/batchAPI";
import { useRouter } from "next/navigation";
import { ProductBatch } from "@/types/BatchType";
import { convertDateToISO, formatMoney, isDateInFuture } from "@/utils/fn";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";
import withAuth from "@/hook/checkRoute";

interface BatchDetail {
  productId: number;
  quantity: number;
  sourceOfProductId: number;
  expiredDate: string;
}

interface CreateBatchModel {
  batchDetailsDTO: BatchDetail[];
}

const ImportProduct: React.FC = () => {
  // Router for navigation
  const router = useRouter();
  // State for productBatches list
  const [productBatches, setProductBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProductBatches, setFilteredProductBatches] = useState<
    ProductBatch[]
  >([]);
  const [sourceOfProducts, setSourceOfProducts] = useState<any[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState<boolean>(false);

  // State for selected productBatches in the table
  const [selectedProductBatches, setSelectedProductBatches] = useState<
    number[]
  >([]);

  // State for the update model
  const [model, setModel] = useState<CreateBatchModel>({
    batchDetailsDTO: [],
  });

  // State for error handling
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  //debounce
  const debounce = useDebounce(searchTerm, 500);

  // Pagination state for batches (lô hàng)
  const [batchesPage, setBatchesPage] = useState<number>(1);
  const [batchesPerPage] = useState<number>(5); // Fixed size of 5

  // Filter productBatches based on search term
  useEffect(() => {
    if (!debounce) {
      setFilteredProductBatches(productBatches);
    } else {
      const filtered = productBatches.filter(
        (productBatch) =>
          productBatch.name.toLowerCase().includes(debounce.toLowerCase()) ||
          productBatch.category.name
            .toLowerCase()
            .includes(debounce.toLowerCase())
      );
      setFilteredProductBatches(filtered);
    }
  }, [productBatches, debounce]);

  // Initialize data on component mount
  useEffect(() => {
    setModel({
      batchDetailsDTO: [],
    });
    setSelectedProductBatches([]);
    fetchProductBatches();
    fetchSourceOfProducts(); // Actually call the function
  }, []);

  // Fetch all productBatches list without pagination
  const fetchProductBatches = async () => {
    setIsLoading(true);
    try {
      const res: any = await productApi.getProductList({
        pageNumber: 1,
        pageSize: 1000, // Get a large number to avoid pagination
        searchTerm: "",
      });

      console.log("Fetched productBatches:", res?.items);
      setProductBatches(res?.items || []);
    } catch (error: any) {
      console.error("Error fetching productBatches:", error?.message);
      setError("Không thể tải danh sách sản phẩm");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSourceOfProducts = async () => {
    setIsLoadingSources(true);
    try {
      const params = {
        pageNumber: 1,
        pageSize: 1000, // Fetch all sources without pagination
      };
      // Fetch source of products from API
      const res: any = await sourceOfProductApi.getSourceList(params);

      console.log("Fetched sources:", res?.items);
      setSourceOfProducts(res?.items || []);
    } catch (error: any) {
      console.error("Error fetching source of products:", error?.message);
      setError("Không thể tải nguồn cung cấp");
      setShowError(true);
    } finally {
      setIsLoadingSources(false);
    }
  };

  // Handle checkbox selection in table
  const handleCheckboxToggle = (productBatchId: number) => {
    setSelectedProductBatches((prev) => {
      if (prev.includes(productBatchId)) {
        return prev.filter((id) => id !== productBatchId);
      } else {
        return [...prev, productBatchId];
      }
    });
  };

  // Handle select all checkbox (considering filtered productBatches)
  const handleSelectAll = () => {
    const visibleProductBatchIds = filteredProductBatches.map((i) => i.id);
    const selectedVisibleProductBatches = selectedProductBatches.filter((id) =>
      visibleProductBatchIds.includes(id)
    );

    if (
      selectedVisibleProductBatches.length === visibleProductBatchIds.length
    ) {
      // Deselect all visible productBatches
      setSelectedProductBatches((prev) =>
        prev.filter((id) => !visibleProductBatchIds.includes(id))
      );
    } else {
      // Select all visible productBatches
      setSelectedProductBatches((prev) => {
        const newSelected = [...prev];
        visibleProductBatchIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // Get select all checkbox state
  const getSelectAllState = () => {
    const visibleProductBatchIds = filteredProductBatches.map((i) => i.id);
    const selectedVisibleProductBatches = selectedProductBatches.filter((id) =>
      visibleProductBatchIds.includes(id)
    );

    if (selectedVisibleProductBatches.length === 0) {
      return { checked: false, indeterminate: false };
    } else if (
      selectedVisibleProductBatches.length === visibleProductBatchIds.length
    ) {
      return { checked: true, indeterminate: false };
    } else {
      return { checked: false, indeterminate: true };
    }
  };

  // Validate batch data before saving
  const validateBatchData = (): string | null => {
    if (model.batchDetailsDTO.length === 0) {
      return "Vui lòng thêm ít nhất một lô hàng";
    }

    for (let i = 0; i < model.batchDetailsDTO.length; i++) {
      const batch = model.batchDetailsDTO[i];

      if (batch.quantity <= 0) {
        return `Lô hàng ${i + 1}: Số lượng phải lớn hơn 0`;
      }

      if (batch.sourceOfProductId <= 0) {
        return `Lô hàng ${i + 1}: Vui lòng chọn nguồn cung cấp`;
      }

      if (!isDateInFuture(batch.expiredDate)) {
        return `Lô hàng ${i + 1}: Ngày hết hạn không thể là ngày quá khứ`;
      }
    }

    return null;
  };

  // Handlers for batches
  const handleSave = async () => {
    try {
      // Validate data before saving
      const validationError = validateBatchData();
      if (validationError) {
        setError(validationError);
        setShowError(true);
        return;
      }

      setIsSaving(true);
      console.log("Saving model:", model);

      // API call
      const response = await BatchAPI.CreateBatch(model);
      console.log(response);

      toast.success("Tạo lô hàng thành công");
      router.push("/admin/batch_product");
    } catch (error: any) {
      const apiError = error?.response?.data || error;
      const errorMessage =
        apiError?.message || "Có lỗi xảy ra khi tạo lô hàng!";
      const firstDetailedError = apiError?.errors?.[0];

      const finalErrorMessage = firstDetailedError || errorMessage;
      setError(finalErrorMessage);
      setShowError(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Add batches for selected productBatches
  const addSelectedBatches = () => {
    if (selectedProductBatches.length === 0) return;

    const today = new Date();
    const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from today

    // Use the first available source ID, or 1 as fallback
    const defaultSourceId =
      sourceOfProducts.length > 0 ? sourceOfProducts[0].id : 1;

    const newBatches = selectedProductBatches.map((id) => ({
      productId: id,
      quantity: 1,
      sourceOfProductId: defaultSourceId,
      expiredDate: futureDate.toISOString(),
    }));

    setModel({
      ...model,
      batchDetailsDTO: [...model.batchDetailsDTO, ...newBatches],
    });

    // Clear selection after adding
    setSelectedProductBatches([]);
  };

  const removeBatch = (index: number) => {
    const newBatches = [...model.batchDetailsDTO];
    newBatches.splice(index, 1);
    setModel({ ...model, batchDetailsDTO: newBatches });
  };

  const updateBatch = (index: number, field: keyof BatchDetail, value: any) => {
    const newBatches = [...model.batchDetailsDTO];

    // Special handling for expiredDate validation
    if (field === "expiredDate") {
      const dateValue =
        typeof value === "string" ? value : convertDateToISO(value);
      if (!isDateInFuture(dateValue)) {
        setError("Ngày hết hạn không thể là ngày quá khứ");
        setShowError(true);
        return;
      }
      newBatches[index] = { ...newBatches[index], [field]: dateValue };
    } else {
      newBatches[index] = { ...newBatches[index], [field]: value };
    }

    setModel({ ...model, batchDetailsDTO: newBatches });
  };

  // Handle date picker change
  const handleDateChange = (index: number, newDate: Date | null) => {
    if (newDate) {
      const dateValue = newDate.toISOString();
      if (isDateInFuture(dateValue)) {
        updateBatch(index, "expiredDate", dateValue);
      } else {
        setError("Ngày hết hạn không thể là ngày quá khứ");
        setShowError(true);
      }
    }
  };

  // Find productBatch name by id (for batch display)
  const getProductBatchNameById = (id: number): string => {
    const productBatch = productBatches.find((i) => i.id === id);
    return productBatch ? productBatch.name : `Product ID: ${id}`;
  };

  // Get minimum date (today)
  const getMinDate = (): Date => {
    return new Date();
  };

  // Handle batch page change
  const handleBatchPageChange = (page: number) => {
    setBatchesPage(page);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Handle error close
  const handleErrorClose = () => {
    setShowError(false);
  };

  const selectAllState = getSelectAllState();

  const handleCancel = () => {
    router.push("/admin/batch_product");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Error Snackbar */}
        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={handleErrorClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleErrorClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Header with breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={handleCancel}
          >
            Quay lại
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ py: 2 }}>
            {/* Table of productBatches with checkboxes */}
            <Paper elevation={1} sx={{ width: "100%", mb: 3 }}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle2">
                  Chọn nhiều sản phẩm ({selectedProductBatches.length} đã chọn)
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={fetchProductBatches}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <RefreshIcon fontSize="small" />
                    )}
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={addSelectedBatches}
                    disabled={
                      selectedProductBatches.length === 0 || isLoadingSources
                    }
                    size="small"
                  >
                    {isLoadingSources ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Đang tải...
                      </>
                    ) : (
                      `Thêm tất cả (${selectedProductBatches.length})`
                    )}
                  </Button>
                </Box>
              </Box>

              {/* Search Field */}
              <Box sx={{ px: 2, pb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm theo tên sản phẩm hoặc loại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectAllState.indeterminate}
                          checked={selectAllState.checked}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Loại</TableCell>
                      <TableCell align="right">Giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProductBatches.map((productBatch) => (
                      <TableRow
                        key={productBatch.id}
                        hover
                        selected={selectedProductBatches.includes(
                          productBatch.id
                        )}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProductBatches.includes(
                              productBatch.id
                            )}
                            onChange={() =>
                              handleCheckboxToggle(productBatch.id)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell
                          onClick={() => handleCheckboxToggle(productBatch.id)}
                        >
                          {productBatch.name}
                        </TableCell>
                        <TableCell
                          onClick={() => handleCheckboxToggle(productBatch.id)}
                        >
                          {productBatch.category.name}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => handleCheckboxToggle(productBatch.id)}
                        >
                          {formatMoney(productBatch.sellingPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProductBatches.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm
                              ? "Không tìm thấy sản phẩm nào"
                              : "Không có dữ liệu"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Batches section */}
            {model.batchDetailsDTO.length > 0 ? (
              <>
                <Divider sx={{ mb: 3 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Thông tin lô hàng ({model.batchDetailsDTO.length})
                  </Typography>
                </Box>

                {/* Display paginated batches in a more compact layout */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {model.batchDetailsDTO
                    .slice(
                      (batchesPage - 1) * batchesPerPage,
                      batchesPage * batchesPerPage
                    )
                    .map((batch, displayIndex) => {
                      const actualIndex =
                        (batchesPage - 1) * batchesPerPage + displayIndex;
                      return (
                        <Paper
                          key={actualIndex}
                          elevation={1}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          {/* Product Name Header */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pb: 2,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              Tên sản phẩm:{" "}
                              {getProductBatchNameById(batch.productId)}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeBatch(actualIndex)}
                              aria-label="Delete batch"
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Form Fields */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr 1fr",
                              },
                              gap: 2,
                            }}
                          >
                            {/* Quantity */}
                            <TextField
                              label="Số lượng"
                              type="number"
                              size="small"
                              value={batch.quantity}
                              onChange={(e) =>
                                updateBatch(
                                  actualIndex,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              error={batch.quantity <= 0}
                              helperText={
                                batch.quantity <= 0
                                  ? "Số lượng phải lớn hơn 0"
                                  : ""
                              }
                            />

                            {/* Source of Product Dropdown */}
                            <TextField
                              select
                              label="Nguồn cung cấp"
                              size="small"
                              value={batch.sourceOfProductId}
                              onChange={(e) =>
                                updateBatch(
                                  actualIndex,
                                  "sourceOfProductId",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              error={batch.sourceOfProductId <= 0}
                              helperText={
                                batch.sourceOfProductId <= 0
                                  ? "Vui lòng chọn nguồn cung cấp"
                                  : ""
                              }
                              disabled={
                                isLoadingSources ||
                                sourceOfProducts.length === 0
                              }
                            >
                              {sourceOfProducts.map((source) => (
                                <MenuItem key={source.id} value={source.id}>
                                  {source.name}
                                </MenuItem>
                              ))}
                              {sourceOfProducts.length === 0 && (
                                <MenuItem disabled value="">
                                  {isLoadingSources
                                    ? "Đang tải..."
                                    : "Không có nguồn cung cấp"}
                                </MenuItem>
                              )}
                            </TextField>

                            {/* Expiration Date with DatePicker */}
                            <DatePicker
                              label="Ngày hết hạn"
                              value={new Date(batch.expiredDate)}
                              onChange={(newDate: any) =>
                                handleDateChange(actualIndex, newDate)
                              }
                              disablePast={true}
                              minDate={getMinDate()}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  error: !isDateInFuture(batch.expiredDate),
                                  helperText: !isDateInFuture(batch.expiredDate)
                                    ? "Ngày hết hạn không hợp lệ"
                                    : "",
                                },
                              }}
                            />
                          </Box>
                        </Paper>
                      );
                    })}
                </Box>

                {/* Batch Pagination */}
                {model.batchDetailsDTO.length > batchesPerPage && (
                  <BatchPagination
                    totalItems={model.batchDetailsDTO.length}
                    itemsPerPage={batchesPerPage}
                    currentPage={batchesPage}
                    onPageChange={handleBatchPageChange}
                    onItemsPerPageChange={() => {}}
                  />
                )}
              </>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  bgcolor: "#f9f9f9",
                  borderRadius: 1,
                }}
              >
                <Typography color="text.secondary">
                  Chưa có lô hàng nào được thêm. Vui lòng chọn sản phẩm từ danh
                  sách bên trên.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>

        {/* Action buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}
        >
          <Button variant="outlined" size="large" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled={
              model.batchDetailsDTO.length === 0 ||
              model.batchDetailsDTO.some(
                (b) =>
                  b.quantity <= 0 ||
                  b.sourceOfProductId <= 0 ||
                  !isDateInFuture(b.expiredDate)
              ) ||
              isSaving ||
              isLoadingSources
            }
          >
            {isSaving ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Đang lưu...
              </>
            ) : (
              <>Tạo lô hàng ({model.batchDetailsDTO.length} lô)</>
            )}
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default withAuth(ImportProduct);
