import Link from "next/link";

export default function NossaHistoria() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/casamento" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Nossa História
      </h1>
      <div className="mt-5 space-y-4 font-serif text-base leading-relaxed text-foreground sm:mt-6 sm:space-y-5 sm:text-lg">
        <p>
          Conte aqui como vocês se conheceram, o pedido, e os momentos mais
          marcantes do relacionamento.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nossos caminhos
          se cruzaram e Deus escreveu uma das mais belas histórias da nossa vida.
        </p>
      </div>
    </main>
  );
}
