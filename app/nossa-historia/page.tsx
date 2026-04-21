import Link from "next/link";

export default function NossaHistoria() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-8 font-serif text-5xl text-foreground">Nossa História</h1>
      <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-foreground">
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
