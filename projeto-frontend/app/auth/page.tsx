"use client";

import { useRouter } from "next/navigation";
import { userAuth } from "@/services/api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z
    .string()
    .min(5, "O nome não pode ter menos de 5 caracteres")
    .max(32, "O nome não pode ter mais de 32 caracteres"),
  password: z
    .string()
    .min(4, "A senha não pode ter menos de 4 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const login = await userAuth(values.username, values.password);
      
      localStorage.setItem('user', login.username);
      document.cookie = `app_token=${login.token}; path=/`;
      document.cookie = `user=${JSON.stringify(login.username)} path=/`;
      
      console.log("Login bem-sucedido!");
      console.log(localStorage.getItem('user'));
      router.push("/dashboard/");
    }     
    catch (error) {
      console.error("Erro no formulário de login:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Entre com suas credenciais para continuar.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup className="gap-4">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700"
                  >
                    Nome de usuário
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Seu username"
                    autoComplete="username"
                    className="h-11 rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {fieldState.invalid && (
                    <FieldError className="text-xs" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700"
                  >
                    Senha
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  {fieldState.invalid && (
                    <FieldError className="text-xs" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Entrar
            </button>
          </FieldGroup>
        </form>
      </div>
    </main>
  );
}
