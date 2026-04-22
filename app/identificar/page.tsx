import Link from "next/link";
import { getGuest } from "@/lib/session";
import { identify } from "./actions";

export default async function Identificar({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; gift_id?: string; error?: string }>;
}) {
  const { next, gift_id, error } = await searchParams;
  const guest = await getGuest();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/presentes" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-foreground sm:mt-8 sm:text-4xl">
        Quem é você?
      </h1>
      <p className="mt-3 font-serif text-base text-muted sm:text-lg">
        Precisamos só do seu nome e e-mail para registrar a sua escolha — sem
        senhas.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 font-sans text-sm text-red-800">
          Verifique seu nome e um e-mail válido.
        </div>
      )}

      <form action={identify} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next ?? "/presentes"} />
        {gift_id && <input type="hidden" name="gift_id" value={gift_id} />}
        <div>
          <label className="block font-sans text-sm text-muted">Nome</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={guest?.name ?? ""}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">E-mail</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={guest?.email ?? ""}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-accent py-3 font-serif text-lg text-white transition hover:opacity-90"
        >
          Continuar
        </button>
      </form>
    </main>
  );
}
