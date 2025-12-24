export default function FormCard({ title, children }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
