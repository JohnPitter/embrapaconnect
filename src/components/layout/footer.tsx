import Link from "next/link";

const footerLinks = {
  Plataforma: [
    { label: "Funcionalidades", href: "/#funcionalidades" },
    { label: "Como Funciona", href: "/#como-funciona" },
    { label: "Cadastrar", href: "/register" },
  ],
  Suporte: [
    { label: "Central de Ajuda", href: "#" },
    { label: "Contato", href: "#contato" },
    { label: "Issues", href: "https://github.com/JohnPitter/embrapaconnect/issues" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Licença MIT", href: "https://github.com/JohnPitter/embrapaconnect/blob/main/LICENSE" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-dark-base border-t border-white/10">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-display text-[22px] font-black text-lime-accent">
              EC.
            </Link>
            <p className="text-[13px] text-light-muted/70 leading-relaxed max-w-xs">
              Conectando produtores rurais brasileiros à Embrapa com tecnologia de ponta.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                {section}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-light-muted/70 transition-colors hover:text-lime-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[12px] text-light-muted/50">
            © 2026 EmbrapaConnect. Todos os direitos reservados.
          </p>
          <p className="text-[12px] text-light-muted/50">
            Desenvolvido para conectar o campo ao futuro.
          </p>
        </div>
      </div>
    </footer>
  );
}
