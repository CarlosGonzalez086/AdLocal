import emailjs from "@emailjs/browser";

export const sendWelcomeEmail = async (nombre: string, email: string) => {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      nombre,
      email,
      year: new Date().getFullYear(),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  );
};
