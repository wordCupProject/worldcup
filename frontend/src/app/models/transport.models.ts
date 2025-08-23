// src/app/models/transport.models.ts

export type TransportType = 'PLANE' | 'BUS' | 'TRAIN' | 'CAR';

export interface TransportDTO {
  id?: number;
  type: TransportType;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  capacite: number;
  place: number;
  price: number;
  compagnie: string;
  // World Cup 2030 specific fields
  isWorldCupRoute?: boolean;
  matchDay?: string;
  stadium?: string;
  specialOffer?: boolean;
}

export interface ReservationRequestDTO {
  userId: number;
  transportId: number;
  seatPreference?: string;
  specialRequests?: string;
}

export interface TransportReservationDTO {
  id: number;
  type: TransportType;
  seatNumber: string;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  reservationDate: string;
  userId: number;
  userName: string;
  userEmail: string;
  transportId: number;
  transportType: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  compagnie: string;
  // World Cup 2030 specific fields
  isWorldCupRoute?: boolean;
  matchDay?: string;
  stadium?: string;
  qrCode?: string;
  ticketNumber?: string;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export const TRANSPORT_TYPES: { value: TransportType; label: string; icon: string }[] = [
  { value: 'PLANE', label: 'Avion', icon: '✈️' },
  { value: 'BUS', label: 'Bus', icon: '🚌' },
  { value: 'TRAIN', label: 'Train', icon: '🚂' },
  { value: 'CAR', label: 'Véhicule privé', icon: '🚗' }
];

export const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  'PLANE': 'Avion',
  'BUS': 'Bus', 
  'TRAIN': 'Train',
  'CAR': 'Véhicule privé'
};

// Morocco 2030 World Cup Cities
export const MOROCCO_2030_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Agadir',
  'Tanger',
  'Meknès',
  'Oujda',
  'Tétouan',
  'Al Hoceima'
];

export const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 500, label: '0 - 500 MAD' },
  { min: 500, max: 1000, label: '500 - 1000 MAD' },
  { min: 1000, max: 2000, label: '1000 - 2000 MAD' },
  { min: 2000, max: 5000, label: '2000 - 5000 MAD' },
  { min: 5000, max: Infinity, label: 'Plus de 5000 MAD' }
];

export const WORLD_CUP_STADIUMS = [
  'Stade Mohammed V - Casablanca',
  'Stade Prince Moulay Abdellah - Rabat',
  'Grand Stade de Marrakech - Marrakech',
  'Complexe Sportif de Fès - Fès',
  'Stade Adrar - Agadir',
  'Stade Ibn Batouta - Tanger'
];

// Utility functions
export function getTransportIcon(type: TransportType): string {
  const transport = TRANSPORT_TYPES.find(t => t.value === type);
  return transport?.icon || '🚗';
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-MA')} MAD`;
}

export function isWorldCupPeriod(date: string): boolean {
  const transportDate = new Date(date);
  const worldCupStart = new Date('2030-06-01');
  const worldCupEnd = new Date('2030-07-31');
  return transportDate >= worldCupStart && transportDate <= worldCupEnd;
}