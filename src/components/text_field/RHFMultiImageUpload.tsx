import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    name: string;
    label?: string;
}

const RHFMultiImageUpload = ({ name, label }: Props) => {
    const { control, setValue } = useFormContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                useEffect(() => {
                    if (!field.value) return;

                    const newPreviews = field.value.map((item: File | string) =>
                        typeof item === "string" ? item : URL.createObjectURL(item)
                    );
                    setPreviews(newPreviews);
                }, [field.value]);

                const handleFiles = (files: FileList | null) => {
                    if (!files) return;

                    const validFiles = Array.from(files).filter((file) =>
                        ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)
                    );

                    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
                    setPreviews((prev) => [...prev, ...newPreviews]);
                    setValue(name, [...(field.value || []), ...validFiles], { shouldValidate: true });
                };

                const removeImage = (index: number) => {
                    const newFiles = [...field.value];
                    const newPreviews = [...previews];
                    newFiles.splice(index, 1);
                    newPreviews.splice(index, 1);
                    setValue(name, newFiles, { shouldValidate: true });
                    setPreviews(newPreviews);
                };

                return (
                    <Box>
                        {label && (
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {label}
                            </Typography>
                        )}

                        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    multiple
                                    hidden
                                    ref={fileInputRef}
                                    onChange={(e) => handleFiles(e.target.files)}
                                />
                                <IconButton onClick={() => fileInputRef.current?.click()} color="primary">
                                    <AddPhotoAlternateIcon sx={{ width: "100px", height: "100px" }} />
                                </IconButton>
                            </Box>

                            {previews.map((url, index) => (
                                <Box key={index} position="relative">
                                    <img
                                        src={url}
                                        alt={`preview-${index}`}
                                        width={100}
                                        height={100}
                                        style={{ borderRadius: 8, objectFit: "cover" }}
                                    />
                                    <IconButton
                                        size="small"
                                        color="error"
                                        sx={{ position: "absolute", top: 0, right: 0 }}
                                        onClick={() => removeImage(index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                );
            }}
        />
    );
};

export default RHFMultiImageUpload;
