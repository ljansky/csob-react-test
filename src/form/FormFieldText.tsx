import classNames from "classnames";
import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type FormFieldTextProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
};

export const FormFieldText = <T extends FieldValues>({
  label,
  name,
  control,
  type = "text",
  disabled,
}: FormFieldTextProps<T>) => {
  const inputId = React.useId();
  const register = control.register(name, {
    valueAsNumber: type === "number",
    disabled,
  });
  const { error } = control.getFieldState(name);

  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type={type}
        {...register}
        className={classNames({ error: typeof error !== "undefined" })}
      />
      {error?.message && <div className="error">{error.message}</div>}
    </div>
  );
};
