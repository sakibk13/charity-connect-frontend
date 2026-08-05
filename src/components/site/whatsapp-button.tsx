import { env } from "@/lib/env";

const DEFAULT_MESSAGE =
  "Assalamu Alaikum, I have a question about AICT Global Bangladesh.";

export function WhatsappButton() {
  const href = `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(
    DEFAULT_MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 fill-current"
      >
        <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.62 4.66 1.797 6.686L2.667 29.333l6.826-1.789a13.27 13.27 0 0 0 6.508 1.657h.006c7.363 0 13.333-5.97 13.333-13.334 0-3.563-1.389-6.913-3.909-9.431a13.246 13.246 0 0 0-9.43-3.769zm0 24.4a11.03 11.03 0 0 1-5.62-1.54l-.403-.24-4.05 1.062 1.082-3.949-.263-.406a11.02 11.02 0 0 1-1.687-5.893c0-6.104 4.966-11.07 11.072-11.07a11 11 0 0 1 7.83 3.244 10.996 10.996 0 0 1 3.24 7.83c-.001 6.104-4.968 11.07-11.072 11.07zm6.07-8.29c-.333-.166-1.966-.97-2.27-1.08-.305-.111-.527-.166-.75.167-.222.333-.86 1.08-1.054 1.303-.194.222-.389.25-.722.083-.334-.166-1.407-.518-2.68-1.653-.99-.883-1.658-1.974-1.852-2.307-.194-.334-.021-.514.146-.68.15-.149.334-.389.5-.583.167-.194.222-.333.334-.556.111-.222.055-.417-.028-.583-.083-.167-.75-1.807-1.028-2.474-.271-.65-.546-.562-.75-.573l-.638-.011c-.222 0-.583.083-.888.417-.305.333-1.166 1.14-1.166 2.78 0 1.64 1.194 3.225 1.36 3.447.167.222 2.35 3.587 5.694 5.031.795.343 1.415.548 1.898.702.797.253 1.523.217 2.097.132.64-.096 1.966-.804 2.243-1.581.278-.777.278-1.443.194-1.582-.083-.138-.305-.222-.638-.389z" />
      </svg>
    </a>
  );
}
