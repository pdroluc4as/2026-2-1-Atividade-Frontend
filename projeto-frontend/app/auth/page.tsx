"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .max(32, "Name must be at most 32 characters."),
  password: z
    .string()
    .max(10, "Password must be at most 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            placeholder="Apelido"
            className="border rounded p-2 w-full"
          />
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="password"
            placeholder="Senha"
            className="border rounded p-2 w-full mt-2"
          />
        )}
      />

      <button type="submit" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">
        Enviar
      </button>
    </form>
  );
}
