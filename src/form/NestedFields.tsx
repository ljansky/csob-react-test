/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MainFormValues } from "./mainFormSchema";
import { FormFieldText } from "./FormFieldText";
import { useQuery } from "@tanstack/react-query";
import { FormFieldSelect } from "./FormFieldSelect";

type Category = {
  name: string;
  slug: string;
};

const getCategories = async (): Promise<Category[]> => {
  const response = await fetch("https://dummyjson.com/products/categories");
  return response.json();
};

export const NestedFields: React.FC = () => {
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<MainFormValues>();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "witnesses",
  });

  const amount = watch("amount");

  return (
    <div>
      <FormFieldText
        label="Alokace"
        type="number"
        control={control}
        name="allocation"
        disabled={typeof amount === "undefined" || isNaN(amount)}
      />

      {data && (
        <FormFieldSelect
          label="Kategorie"
          control={control}
          name="category"
          options={data.map((category) => ({
            value: category.slug,
            label: category.name,
          }))}
        />
      )}

      <label>Svědci</label>
      {fields.map((field, index) => (
        <div key={field.id} className="witness">
          <div className="witness-inner">
            <FormFieldText
              label="Jméno"
              control={control}
              name={`witnesses.${index}.name`}
            />

            <FormFieldText
              label="E-mail"
              control={control}
              name={`witnesses.${index}.email`}
            />
          </div>

          <button type="button" onClick={() => remove(index)}>
            X
          </button>
        </div>
      ))}
      {errors.witnesses?.root && (
        <div className="error">{errors.witnesses.root.message}</div>
      )}

      <button
        type="button"
        onClick={() => {
          append({
            name: "",
            email: "",
          });
        }}
      >
        Přidat svědka
      </button>
    </div>
  );
};
