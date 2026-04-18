import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Storage from 'expo-sqlite/kv-store';
import { supabase } from '../lib/supabase';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function normalizeText(text?: string) {
  if (!text) return '';
  return text.toLowerCase();
}

function getCategoryFromSearch(search: string) {
  const s = normalizeText(search);

  if (
    s.includes('coca') ||
    s.includes('fanta') ||
    s.includes('guarana') ||
    s.includes('refrigerante')
  ) {
    return 'refrigerante';
  }

  if (s.includes('cerveja') || s.includes('heineken') || s.includes('skol')) {
    return 'cerveja';
  }

  if (s.includes('agua')) return 'agua';
  if (s.includes('suco')) return 'suco';
  if (s.includes('vodka') || s.includes('whisky') || s.includes('gin')) {
    return 'destilado';
  }

  return null;
}

export default function ResultsScreen({ route }: any) {
  const { searchText, userCoords, locationText, district, city, radiusKm } =
    route.params;

    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    
  const loadOffers = async () => {
    const { data, error } = await supabase
        .from('offers')
        .select('*');
      
    if (error) {
        console.log('ERRO AO BUSCAR OFFERS:', error);
    } else {
        console.log('OFFERS DO BANCO:', data); // 👈 AQUI
        setOffers(data || []);
     }
    };
    
    const loadFavorites = async () => {
      try {
        const saved = await Storage.getItem('prexio_favorites');
        if (saved) {
          setFavoriteIds(JSON.parse(saved));
        }
      } catch (error) {}
    };
    
    useEffect(() => {
      loadFavorites();
      loadOffers();
    }, []);

  const toggleFavorite = async (id: string) => {
    try {
      let updated: string[] = [];

      if (favoriteIds.includes(id)) {
        updated = favoriteIds.filter((item) => item !== id);
      } else {
        updated = [...favoriteIds, id];
      }

      setFavoriteIds(updated);
      await Storage.setItem('prexio_favorites', JSON.stringify(updated));
    } catch (error) {}
  };
  const normalizedSearch = normalizeText(searchText || '').trim();
  const inferredCategory = getCategoryFromSearch(normalizedSearch);
  
  const baseOffers = offers
  .map((offer) => {
    let distanceKm = null;

    if (
      userCoords?.latitude &&
      userCoords?.longitude &&
      offer.latitude &&
      offer.longitude
    ) {
      distanceKm = getDistanceKm(
        userCoords.latitude,
        userCoords.longitude,
        offer.latitude,
        offer.longitude
      );
    }

    return {
      ...offer,
      distanceKm,
      total: Number(offer.price) + Number(offer.fee || 0),
    };
  })
  .filter((offer) => {
    const productName = normalizeText(offer.product_name);
    const category = normalizeText(offer.category);

    const hasSearchText = normalizedSearch.length > 0;

    let matchesSearch = true;

    if (hasSearchText) {
      matchesSearch = productName.includes(normalizedSearch);
    } else if (inferredCategory) {
      matchesSearch = category === normalizeText(inferredCategory);
    }

    const insideRadius =
      offer.distanceKm === null ? true : offer.distanceKm <= radiusKm;

    return matchesSearch && insideRadius;
  });

const districtMatches = baseOffers.filter(
  (offer) =>
    district &&
    normalizeText(offer.district) === normalizeText(district)
);

const cityMatches = baseOffers.filter(
  (offer) =>
    city &&
    normalizeText(offer.city) === normalizeText(city)
);

const finalOffers =
  districtMatches.length > 0
    ? districtMatches
    : cityMatches.length > 0
    ? cityMatches
    : baseOffers;

const sortedOffers = finalOffers.sort((a, b) => a.total - b.total);

const scopeText =
  districtMatches.length > 0
    ? `Mostrando resultados do bairro: ${district}`
    : cityMatches.length > 0
    ? `Sem ofertas suficientes no bairro. Mostrando cidade: ${city}`
    : 'Mostrando resultados próximos disponíveis';

      return (
        <FlatList
          data={sortedOffers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const isFavorite = favoriteIds.includes(item.id);
      
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.store}>{item.store_name ?? 'Loja'}</Text>
                    <Text style={styles.product}>{item.product_name}</Text>
                  </View>
      
                  <TouchableOpacity
                    style={[
                      styles.favoriteButton,
                      isFavorite && styles.favoriteButtonActive,
                    ]}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        isFavorite && styles.favoriteButtonTextActive,
                      ]}
                    >
                      {isFavorite ? 'Salvo' : 'Favoritar'}
                    </Text>
                  </TouchableOpacity>
                </View>
      
                <Text>Categoria: {item.category}</Text>
                <Text>Bairro: {item.district}</Text>
                <Text>Cidade: {item.city}</Text>
                <Text>Preço: R$ {item.price.toFixed(2)}</Text>
                <Text>Taxa: R$ {item.fee.toFixed(2)}</Text>
                <Text>
                  Distância:{' '}
                  {item.distanceKm !== null
                    ? `${item.distanceKm.toFixed(2)} km`
                    : 'não disponível'}
                </Text>
                <Text style={styles.total}>
                  Custo total: R$ {item.total.toFixed(2)}
                </Text>
              </View>
            );
          }}
        />
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  radius: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  scope: {
    fontSize: 14,
    color: '#111',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyBox: {
    marginTop: 24,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  store: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  product: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  favoriteButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFF',
  },
  favoriteButtonActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  favoriteButtonText: {
    color: '#111',
    fontWeight: '600',
    fontSize: 12,
  },
  favoriteButtonTextActive: {
    color: '#FFF',
  },
  total: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
  },
});