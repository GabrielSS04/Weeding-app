import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gabriel & Nathalia — Nosso Casamento",
  description:
    "Bem-vindos ao nosso site de casamento. 12 de dezembro de 2026, Cascavel. Toda honra e glória a Deus.",
  openGraph: {
    title: "Gabriel & Nathalia — Nosso Casamento",
    description: "12 de dezembro de 2026, Cascavel.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CasamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
