import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t, getLocalizedField } from '../../i18n/translations';
import { supabase } from '../../lib/supabase';
import { Package, MapPin, Phone, User, Calendar, Hash, AlertCircle, CheckCircle, Truck, XCircle } from 'lucide-react';

interface Order {
  id: string;
  reference: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  address: string;
  selected_size: string;
  quantity: number;
  total_price: number;
  status: string;
  stock_deducted: boolean;
  created_at: string;
  products: { name: Record<string, string>; images: string[]; stock: number; price: number } | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, products(name, images, stock, price)')
      .order('created_at', { ascending: false });
    setOrders((data || []) as Order[]);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const validateOrder = async (order: Order) => {
    setValidating(true);
    setError('');
    setSuccess('');

    try {
      // Call the stock deduction function
      const { data, error: rpcError } = await supabase.rpc('deduct_order_stock', {
        p_order_id: order.id
      });

      if (rpcError) {
        setError(`Error: ${rpcError.message}`);
        return;
      }

      const result = data as { success: boolean; error?: string; previous_stock?: number; new_stock?: number; deducted?: number };

      if (!result.success) {
        setError(result.error || 'Failed to validate order');
        return;
      }

      // Update order status to confirmed
      await supabase.from('orders').update({ status: 'confirmed', updated_at: new Date().toISOString() }).eq('id', order.id);

      setSuccess(lang === 'ar' ? 'تم التحقق من الطلب وخصم المخزون' : lang === 'darija' ? 'لأوردر تأكد ولاستوك نقص' : 'Order validated and stock deducted');
      loadOrders();
      setSelectedOrder({ ...order, status: 'confirmed', stock_deducted: true });
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setValidating(false);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const generateRef = (id: string) => `VSA-${id.slice(0, 8).toUpperCase()}`;

  return (
    <div>
      <h2 className="text-lg font-semibold text-cream mb-6">{t('admin.orders', lang)}</h2>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle size={14} /> {success}
          <button onClick={() => setSuccess('')} className="ml-auto opacity-50 hover:opacity-100">X</button>
        </div>
      )}

      {/* Filters */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order List */}
        <div className="space-y-3">
          {filtered.map(order => (
            <button
              key={order.id}
              onClick={() => { setSelectedOrder(order); setError(''); setSuccess(''); }}
              className={`w-full text-left bg-neutral-900 border rounded-lg p-4 transition-all ${selectedOrder?.id === order.id ? 'border-gold/50' : 'border-gold/10 hover:border-gold/30'}`}
            >
              <div className="flex gap-4">
                {order.products?.images?.[0] && (
                  <img src={order.products.images[0]} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-cream text-sm font-medium truncate">
                      {order.products ? getLocalizedField(order.products.name, lang) : 'Product'}
                    </p>
                    <span className="text-gold font-semibold text-sm whitespace-nowrap">{order.total_price} MAD</span>
                  </div>
                  <p className="text-cream/40 text-xs mt-1 flex items-center gap-1">
                    <Hash size={10} /> {generateRef(order.id)}
                  </p>
                  <p className="text-cream/50 text-xs mt-1 flex items-center gap-1">
                    <User size={10} /> {order.customer_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[order.status] || 'bg-neutral-800 text-cream'}`}>
                      {t(statusLabels[order.status], lang)}
                    </span>
                    {order.stock_deducted && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={10} /> {lang === 'ar' ? 'تم الخصم' : lang === 'darija' ? 'ديديكتا' : 'Stock deducted'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-cream/30 text-xs text-center py-8">{lang === 'ar' ? 'لا توجد طلبات' : lang === 'darija' ? 'ما كاين حتى أوردر' : 'No orders'}</p>}
        </div>

        {/* Order Details Panel */}
        <div className="lg:sticky lg:top-4">
          {selectedOrder ? (
            <div className="bg-neutral-900 border border-gold/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-cream font-semibold">{lang === 'ar' ? 'تفاصيل الطلب' : lang === 'darija' ? 'ديتاي ديال لأوردر' : 'Order Details'}</h3>
                <span className={`text-xs px-3 py-1 rounded border ${statusColors[selectedOrder.status]}`}>
                  {t(statusLabels[selectedOrder.status], lang)}
                </span>
              </div>

              {selectedOrder.products?.images?.[0] && (
                <img src={selectedOrder.products.images[0]} alt="" className="w-full h-40 object-cover rounded mb-4" />
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-cream/70">
                  <Hash size={14} className="text-gold" />
                  <span className="text-cream/50">{lang === 'ar' ? 'المرجع:' : lang === 'darija' ? 'لريفيرونس:' : 'Reference:'}</span>
                  <span className="text-cream font-mono">{generateRef(selectedOrder.id)}</span>
                </div>

                <div className="flex items-center gap-2 text-cream/70">
                  <User size={14} className="text-gold" />
                  <span className="text-cream/50">{lang === 'ar' ? 'الاسم:' : lang === 'darija' ? 'لسمية:' : 'Name:'}</span>
                  <span className="text-cream">{selectedOrder.customer_name}</span>
                </div>

                <div className="flex items-center gap-2 text-cream/70">
                  <Phone size={14} className="text-gold" />
                  <span className="text-cream/50">{lang === 'ar' ? 'الهاتف:' : lang === 'darija' ? 'تيليفون:' : 'Phone:'}</span>
                  <a href={`tel:${selectedOrder.customer_phone}`} className="text-gold hover:underline">{selectedOrder.customer_phone}</a>
                </div>

                <div className="flex items-start gap-2 text-cream/70">
                  <MapPin size={14} className="text-gold mt-0.5" />
                  <div>
                    <span className="text-cream/50">{lang === 'ar' ? 'المدينة:' : lang === 'darija' ? 'لفيلة:' : 'City:'}</span>
                    <span className="text-cream ml-1">{selectedOrder.city}</span>
                    <p className="text-cream/60 text-xs mt-1">{selectedOrder.address}</p>
                  </div>
                </div>

                <hr className="border-gold/10" />

                <div className="flex items-center gap-2 text-cream/70">
                  <Package size={14} className="text-gold" />
                  <span className="text-cream/50">{lang === 'ar' ? 'المنتج:' : lang === 'darija' ? 'لوبرودوي:' : 'Product:'}</span>
                  <span className="text-cream">{selectedOrder.products ? getLocalizedField(selectedOrder.products.name, lang) : 'N/A'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-neutral-800 rounded p-2">
                    <p className="text-cream/40 text-xs">{lang === 'ar' ? 'المقاس' : lang === 'darija' ? 'لا تاي' : 'Size'}</p>
                    <p className="text-cream font-semibold">{selectedOrder.selected_size || 'N/A'}</p>
                  </div>
                  <div className="bg-neutral-800 rounded p-2">
                    <p className="text-cream/40 text-xs">{lang === 'ar' ? 'الكمية' : lang === 'darija' ? 'لكونتيتي' : 'Qty'}</p>
                    <p className="text-cream font-semibold">{selectedOrder.quantity}</p>
                  </div>
                  <div className="bg-neutral-800 rounded p-2">
                    <p className="text-cream/40 text-xs">{lang === 'ar' ? 'المخزون' : lang === 'darija' ? 'لوستوك' : 'Stock'}</p>
                    <p className={`font-semibold ${selectedOrder.products && selectedOrder.products.stock >= selectedOrder.quantity ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedOrder.products?.stock ?? 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gold/10">
                  <span className="text-cream/50">{lang === 'ar' ? 'السعر الإجمالي:' : lang === 'darija' ? 'لوبريو توتال:' : 'Total Price:'}</span>
                  <span className="text-gold text-lg font-bold">{selectedOrder.total_price} MAD</span>
                </div>

                <div className="flex items-center gap-2 text-cream/70">
                  <Calendar size={14} className="text-gold" />
                  <span className="text-cream/50">{lang === 'ar' ? 'التاريخ:' : lang === 'darija' ? 'لا دات:' : 'Date:'}</span>
                  <span className="text-cream">{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</span>
                </div>

                {/* Status Update */}
                <div className="pt-4">
                  <label className="text-cream/50 text-xs block mb-2">{lang === 'ar' ? 'تحديث الحالة:' : lang === 'darija' ? 'بدّل لوستاتو:' : 'Update Status:'}</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`px-3 py-1.5 text-xs rounded border transition-all ${selectedOrder.status === s ? statusColors[s] + ' border-current' : 'border-gold/20 text-cream/50 hover:text-gold hover:border-gold/40'}`}
                      >
                        {t(statusLabels[s], lang)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Validate Order Button */}
                {!selectedOrder.stock_deducted && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <div className="pt-4">
                    <button
                      onClick={() => validateOrder(selectedOrder)}
                      disabled={validating || (selectedOrder.products && selectedOrder.products.stock < selectedOrder.quantity)}
                      className="w-full py-3 text-sm font-bold rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      {validating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          {lang === 'ar' ? 'جاري التحقق...' : lang === 'darija' ? 'كيتشيكا...' : 'Validating...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          {lang === 'ar' ? 'تأكيد الطلب وخصم المخزون' : lang === 'darija' ? 'أكد لأوردر ونقص لوستوك' : 'Validate Order & Deduct Stock'}
                        </>
                      )}
                    </button>
                    {selectedOrder.products && selectedOrder.products.stock < selectedOrder.quantity && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {lang === 'ar' ? 'المخزون غير كافٍ' : lang === 'darija' ? 'لوستوك ما كافيش' : `Insufficient stock. Available: ${selectedOrder.products.stock}, Needed: ${selectedOrder.quantity}`}
                      </p>
                    )}
                  </div>
                )}

                {selectedOrder.stock_deducted && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle size={14} />
                      {lang === 'ar' ? 'تم خصم المخزون لهذا الطلب' : lang === 'darija' ? 'لوستوك نقص من هاد لأوردر' : 'Stock has been deducted for this order'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-gold/10 rounded-lg p-8 text-center">
              <Package size={48} className="text-gold/20 mx-auto mb-3" />
              <p className="text-cream/30 text-sm">{lang === 'ar' ? 'اختر طلبًا لعرض التفاصيل' : lang === 'darija' ? 'ختار أوردر باش تشوف الديتاي' : 'Select an order to view details'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
