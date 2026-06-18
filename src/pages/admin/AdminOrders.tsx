import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  address: string;
  size: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  products: { name: Record<string, string>; images: string[] } | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-emerald-500/20 text-emerald-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const statuses = ['new', 'contacted', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusLabels: Record<string, string> = {
  new: 'admin.orderNew',
  contacted: 'admin.orderContacted',
  confirmed: 'admin.orderConfirmed',
  shipped: 'admin.orderShipped',
  delivered: 'admin.orderDelivered',
  cancelled: 'admin.orderCancelled',
};

export default function AdminOrders() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, products(name, images)')
      .order('created_at', { ascending: false });
    setOrders((data || []) as Order[]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    loadOrders();
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h2 className="text-lg font-semibold text-cream mb-6">{t('admin.orders', lang)}</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs rounded ${filter === 'all' ? 'bg-gold text-black' : 'border border-gold/20 text-cream/50 hover:text-gold'}`}
        >
          All ({orders.length})
        </button>
        {statuses.map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded capitalize ${filter === s ? 'bg-gold text-black' : 'border border-gold/20 text-cream/50 hover:text-gold'}`}
            >
              {t(statusLabels[s], lang)} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-neutral-900 border border-gold/10 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {order.products?.images?.[0] && (
                <img src={order.products.images[0]} alt="" className="w-14 h-14 object-cover rounded flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium truncate">
                  {order.products ? getLocalizedField(order.products.name, lang) : 'Product'}
                </p>
                <p className="text-cream/40 text-xs mt-1">
                  {order.customer_name} | {order.customer_phone} | {order.city}
                </p>
                <p className="text-cream/30 text-xs mt-0.5">
                  Size: {order.size} | Qty: {order.quantity} | {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold font-semibold text-sm">{order.total_price} MAD</span>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded border-0 ${statusColors[order.status] || 'bg-neutral-800 text-cream'}`}
                >
                  {statuses.map(s => (
                    <option key={s} value={s} className="bg-neutral-900 text-cream">{t(statusLabels[s], lang)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-cream/30 text-xs text-center py-8">{lang === 'ar' ? 'لا توجد طلبات' : lang === 'darija' ? 'ما كاين حتى أوردر' : 'No orders'}</p>}
      </div>
    </div>
  );
}
