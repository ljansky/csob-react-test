import classNames from "classnames";
import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

type FormFieldSelectProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  options: Option[];
  disabled?: boolean;
};

export const FormFieldSelect = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  disabled,
}: FormFieldSelectProps<T>) => {
  const inputId = React.useId();
  const register = control.register(name, {
    disabled,
  });
  const { error } = control.getFieldState(name);

  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      <select
        id={inputId}
        {...register}
        className={classNames({ error: typeof error !== "undefined" })}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && <div className="error">{error.message}</div>}
    </div>
  );
};
