import * as Yup from "yup";

type SearchUsersResponse = {
  total: number;
};

const searchUsersByEmail = async (
  email: string
): Promise<SearchUsersResponse> => {
  const response = await fetch(`https://dummyjson.com/users/search?q=${email}`);
  const res = await response.json();
  return res;
};

const witnessSchema = Yup.object({
  name: Yup.string().required('Pole "Jméno" je povinné'),
  email: Yup.string()
    .email('Pole "E-mail" musí být ve formátu email')
    .required('Pole "E-mail" je povinné')
    .test("unique-email", "Tento email již existuje", async (value) => {
      const users = await searchUsersByEmail(value);
      return users.total === 0;
    }),
});

export const mainFormSchema = Yup.object({
  amount: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Minimální hodnota je 0")
    .max(300, "Maximální hodnota je 300"),
  damagedParts: Yup.array().of(Yup.string().required()).required(),
  allocation: Yup.number()
    .min(0)
    .when("amount", ([amount], schema) =>
      schema.max(amount, 'Alokace nesmí být větší než "amount"')
    ),
  category: Yup.string().required('Pole "Kategorie" je povinné'),
  witnesses: Yup.array()
    .of(witnessSchema)
    .min(1, "Minimální počet svědků je 1")
    .max(5, "Maximální počet svědků je 5")
    .required(),
});

export type MainFormValues = Yup.InferType<typeof mainFormSchema>;
