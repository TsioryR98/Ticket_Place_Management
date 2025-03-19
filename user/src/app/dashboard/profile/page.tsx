import { mockUser } from "@/lib/mockUser";

export default function UserProfile() {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold">Profil</h2>
      <p>
        <strong>Nom:</strong> {mockUser.name}
      </p>
      <p>
        <strong>Email:</strong> {mockUser.email}
      </p>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded">
        Modifier le Profil
      </button>
    </div>
  );
}
