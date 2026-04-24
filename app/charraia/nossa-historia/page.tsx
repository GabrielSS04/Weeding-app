import Link from "next/link";

export default function NossaHistoriaCharraia() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Nossa História
      </h1>
      <div className="mt-5 space-y-4 font-serif text-base leading-relaxed text-foreground sm:mt-6 sm:space-y-5 sm:text-lg">
        <p>
          Nossa história começou de forma simples, mas cheia de significado.
          Entre encontros, risadas e muitos sonhos compartilhados, fomos
          construindo uma parceria baseada em amor, respeito e companheirismo.
        </p>
        <p>
          Hoje, damos mais um passo importante juntos: o nosso lar. Esse chá de
          casa nova representa não só um novo espaço, mas o início de mais um
          capítulo da nossa história, que estamos muito felizes em dividir com
          vocês.
        </p>
      </div>
    </main>
  );
}
