import { getOrderById } from "@/lib/api";
import { OrderItem } from "@/types/order";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import Link from "next/link";
import authOptions from "@/app/api/auth/[...nextauth]/options";

export default async function OrderConfirmation({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="font-bold text-red-700">Accès refusé</h2>
          <p className="text-red-600">
            Vous devez être connecté pour voir cette commande
          </p>
          <Link
            href="/auth/login"
            className="text-blue-500 hover:underline mt-2"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }
  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (order.user_id !== session.user.id) {
      throw new Error("Cette commande ne vous appartient pas");
    }

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Réservation confirmée
          </h1>
          <p className="text-gray-500 mb-6">
            Référence: #{order.order_id} • Le{" "}
            {format(new Date(order.created_at), "dd/MM/yyyy à HH:mm")}
          </p>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span>Statut:</span>
              <span className="font-medium capitalize">
                {order.status_order}
              </span>
            </div>

            <h2 className="text-xl font-semibold pt-2">Détails</h2>
            {order.items.map((item: OrderItem) => (
              <div key={item.order_item_id} className="py-2 border-b">
                <div className="flex justify-between">
                  <span>
                    {item.quantity}x {item.ticket_type}
                  </span>
                  <span>{item.price * item.quantity}€</span>
                </div>
                {item.event_title && (
                  <p className="text-sm text-gray-500">{item.event_title}</p>
                )}
              </div>
            ))}

            <div className="flex justify-between font-bold text-lg pt-4">
              <span>Total</span>
              <span>{order.total_amount}€</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Link
              href="/" // Retour à l'accueil
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              ← Retour à l'accueil
            </Link>

            <Link
              href="/dashboard/reservations" // Vers la liste des réservations
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Voir toutes mes réservations →
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur:", error);
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h2 className="font-bold text-red-700">Erreur</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : "Commande introuvable"}
          </p>
          <Link
            href="/dashboard/reservations"
            className="text-blue-500 hover:underline mt-2"
          >
            Retour à mes réservations
          </Link>
        </div>
      </div>
    );
  }
}
