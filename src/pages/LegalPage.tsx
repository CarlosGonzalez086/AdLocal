import { Link } from "react-router-dom";

interface LegalPageProps {
  tipo: "terminos" | "privacidad";
}

const LEGAL_CONTENT = {
  terminos: {
    title: "Términos y Condiciones de Uso",
    updated: "Última actualización: 2026",
    sections: [
      {
        heading: "1. Uso del panel para comercios",
        body: "El panel de AdLocal permite administrar la presencia digital de tu negocio, catálogo de productos o servicios, horarios, pedidos y citas dentro del ecosistema AdLocal.",
      },
      {
        heading: "2. Responsabilidad de la información",
        body: "El titular de la cuenta es responsable de la veracidad de precios, existencias, tiempos de entrega, cumplimiento fiscal y atención a clientes derivada de pedidos o citas recibidas.",
      },
      {
        heading: "3. Suscripciones y facturación",
        body: "Los planes de suscripción se gestionan a través del proveedor de pagos autorizado. Puedes consultar o cancelar tu renovación desde la sección Mi Plan dentro de tu cuenta.",
      },
      {
        heading: "4. Seguridad y colaboradores",
        body: "Eres responsable de resguardar tus credenciales de acceso y administrar correctamente los permisos asignados a tus colaboradores.",
      },
    ],
  },
  privacidad: {
    title: "Aviso de Privacidad",
    updated: "Última actualización: 2026",
    sections: [
      {
        heading: "1. Datos recopilados",
        body: "Recopilamos los datos necesarios para operar tu cuenta de comercio o administrador, incluyendo nombre, correo electrónico, información comercial, datos bancarios configurados para cobro y registros de actividad operativa.",
      },
      {
        heading: "2. Finalidad del tratamiento",
        body: "La información se emplea exclusivamente para autenticar tu acceso, publicar tu perfil comercial en el directorio, procesar suscripciones y habilitar el flujo de pedidos y citas.",
      },
      {
        heading: "3. Protección y resguardo",
        body: "Las credenciales sensibles y claves de servicio se transmiten bajo cifrado TLS y no se comercializan ni ceden a terceros ajenos a la operación de la plataforma.",
      },
      {
        heading: "4. Derechos de titularidad",
        body: "Puedes actualizar tu información desde tu perfil y solicitar la baja o rectificación de datos mediante los canales de soporte oficiales de AdLocal.",
      },
    ],
  },
} as const;

export default function LegalPage({ tipo }: LegalPageProps) {
  const doc = LEGAL_CONTENT[tipo];

  return (
    <main className="container py-5" style={{ maxWidth: 820 }}>
      <h1 className="fw-bold mb-2">{doc.title}</h1>
      <p className="text-muted mb-4">{doc.updated}</p>

      {doc.sections.map((section) => (
        <section key={section.heading} className="mb-4">
          <h2 className="h5 fw-semibold">{section.heading}</h2>
          <p className="text-body-secondary">{section.body}</p>
        </section>
      ))}

      <div className="pt-3 d-flex gap-3">
        <Link to="/usuario/login" className="btn btn-outline-secondary btn-sm">
          Volver a iniciar sesión
        </Link>
        <Link to="/usuario/crear-cuenta" className="btn btn-primary btn-sm">
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
