/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { mainFormSchema } from "./mainFormSchema";
import React from "react";
import { NestedFields } from "./NestedFields";
import { FormFieldText } from "./FormFieldText";
import { useDebouncedCallback } from "use-debounce";

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ["side", "rear"],
  category: "kitchen-accessories",
  witnesses: [
    {
      name: "Marek",
      email: "marek@email.cz",
    },
    {
      name: "Emily",
      email: "emily.johnson@x.dummyjson.com",
    },
  ],
};

const damagedPartsOptions = ["roof", "front", "side", "rear"];

export const MainForm: React.FC = () => {
  const methods = useForm({
    resolver: yupResolver(mainFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { register, handleSubmit, control } = methods;

  const triggerDebounced = useDebouncedCallback(() => methods.trigger(), 500);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (data) => console.log(data),
          (errors) => console.log(errors)
        )}
        onChange={() => {
          if (methods.formState.isSubmitted) {
            triggerDebounced();
          }
        }}
      >
        <FormFieldText
          label="Množství"
          type="number"
          control={control}
          name="amount"
        />

        <div className="form-field">
          <label>Poškozené části</label>
          {damagedPartsOptions.map((option) => (
            <div key={option}>
              <input
                type="checkbox"
                {...register("damagedParts")}
                value={option}
                id={option}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>

        <NestedFields />

        <button type="submit">Odeslat</button>
      </form>
    </FormProvider>
  );
};
