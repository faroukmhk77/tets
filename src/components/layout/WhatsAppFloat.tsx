import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function WhatsAppFloat() {
  const [whatsappNumber, setWhatsappNumber] = useState('+212600000000');

  useEffect(() => {
    supabase.from('site_settings').select('whatsapp_number').single().then(({ data }) => {
      if (data?.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
    });
  }, []);

  const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-shadow"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
