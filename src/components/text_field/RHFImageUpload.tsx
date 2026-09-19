
import { useFormContext, Controller } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

type Props = {
    name: string;
    label?: string;
};

const RHFImageUpload: React.FC<Props> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <Box>
                    {label && (
                        <Typography variant="subtitle2" gutterBottom>
                            {label}
                        </Typography>
                    )}
                    <Button variant="outlined" component="label">
                        Chọn ảnh
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    const files = Array.from(e.target.files);
                                    onChange(files);
                                }
                            }}
                        />
                    </Button>
                    <Box mt={1}>
                        {(value as File[] | undefined)?.map((file, idx) => (
                            <Typography key={idx} variant="body2">
                                {file.name}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            )}
        />
    );
};

export default RHFImageUpload;
