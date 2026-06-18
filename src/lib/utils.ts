// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (accepts various formats)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]{8,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate Moroccan phone number
export function isValidMoroccanPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\s/g, '');
  return /^(?:\+212|0)([5-7]\d{8})$/.test(cleanPhone);
}

// Validate name (letters, spaces, hyphens only)
export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100 && /^[\p{L}\s\-']+$/u.test(name);
}

// Validate address
export function isValidAddress(address: string): boolean {
  return address.length >= 5 && address.length <= 500;
}

// Validate city
export function isValidCity(city: string): boolean {
  return city.length >= 2 && city.length <= 100;
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate price
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price >= 0 && price <= 1000000;
}

// Validate quantity
export function isValidQuantity(qty: number): boolean {
  return Number.isInteger(qty) && qty >= 1 && qty <= 100;
}

// Escape WhatsApp message text
export function escapeWhatsApp(text: string): string {
  return text.replace(/([*_~`])/g, '\\$1');
}

// Format price with MAD currency
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA') + ' MAD';
}

// Generate a random order reference
export function generateOrderRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VSA-${timestamp}-${random}`;
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
