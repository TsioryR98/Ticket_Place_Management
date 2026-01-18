import { getOrderById } from '@/lib/api';
import { OrderItem } from '@/types/order';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { CheckCircle, ArrowLeft, List, Ticket } from 'lucide-react';

export default async function OrderConfirmation({ params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-red-700 text-lg">Access denied</h2>
          <p className="text-red-600 mt-2">You must be logged in to view this order</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center text-blue-600 hover:underline mt-4 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  try {
    const { orderId } = await params;
    const order = await getOrderById(orderId);

    if (order.user_id !== session.user.id) {
      throw new Error("This order doesn't belong to you");
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header avec confirmation - Ajout d'une animation subtle */}
        <div className="text-center mb-8 animate-in fade-in duration-300">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking confirmed</h1>
          <p className="text-gray-500">
            Reference: <span className="font-medium text-gray-700">#{order.order_id}</span> • Le{' '}
            {format(new Date(order.created_at), 'dd/MM/yyyy à HH:mm')}
          </p>
        </div>

        {/* Carte principale - Ajout d'une transition subtile */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          {/* Détails de la commande - Amélioration des espacements */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 mr-3 rounded-full"></span>
              Your booking details
            </h2>

            <div className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.order_item_id}
                  className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-all duration-200 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Ticket className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.quantity}x {item.ticket_type}
                        </h3>
                        {item.event_title && (
                          <p className="text-sm text-gray-500 mt-1">{item.event_title}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total - Meilleure mise en valeur */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 text-lg">Total amount</span>
                <span className="font-bold text-blue-600 text-xl">{order.total_amount}€</span>
              </div>
            </div>
          </div>

          {/* Pied de page avec boutons - Amélioration des effets */}
          <div className="bg-gray-50 px-6 py-4 border-t flex flex-col sm:flex-row justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all hover:-translate-x-1 duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to home
            </Link>

            <Link
              href="/dashboard/reservations"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-900 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all hover:translate-x-1 duration-200 shadow-sm hover:shadow-md"
            >
              View my reservations
              <List className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur:', error);
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-red-700 text-lg">Error</h2>
          <p className="text-red-600 mt-2">
            {error instanceof Error ? error.message : 'Order not found'}
          </p>
          <Link
            href="/dashboard/reservations"
            className="inline-flex items-center text-blue-600 hover:underline mt-4 font-medium"
          >
            Back to my reservations
          </Link>
        </div>
      </div>
    );
  }
}
