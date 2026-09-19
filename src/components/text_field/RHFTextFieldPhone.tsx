import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type IProps = {
    name: string;
};

type Props = IProps & TextFieldProps;

const formatPhoneNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    const match = numeric.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);

    if (!match) return value;

    const [, p1, p2, p3] = match;
    return [p1, p2, p3].filter(Boolean).join(".");
};

export default function RHFPhoneField({ name, ...other }: Props) {
    const { control, setValue, getValues } = useFormContext();
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        const initialValue = getValues(name) || "";
        setDisplayValue(formatPhoneNumber(initialValue));
    }, [getValues, name]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const inputValue = event.target.value.replace(/\D/g, "").slice(0, 10); // max 10 digits
        setDisplayValue(formatPhoneNumber(inputValue));
        setValue(name, inputValue);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    {...other}
                    value={displayValue}
                    onChange={(e) => {
                        handleChange(e);
                        field.onChange(e); // update RHF state
                    }}
                    onBlur={field.onBlur}
                    inputProps={{ inputMode: "numeric", maxLength: 12 }}
                    InputLabelProps={{
                        required: true,
                        sx: {
                            "& .MuiInputLabel-asterisk": {
                                color: "red",
                            },
                        },
                    }}
                />
            )}
        />
    );
}
