import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { categories } from '../data/categories';

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('Detectando localização...');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    getUserLocation();
    checkSession();
  }, []);
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (session) {
      setIsLoggedIn(true);
    }
  };
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationText('Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setCoords({ latitude, longitude });

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const foundDistrict = address[0].district || address[0].subregion || '';
        const foundCity = address[0].city || '';

        setDistrict(foundDistrict);
        setCity(foundCity);

        setLocationText(
          `${foundDistrict || 'Bairro não encontrado'}, ${foundCity || 'Cidade não encontrada'}`
        );
      } else {
        setLocationText('Localização encontrada');
      }
    } catch (error) {
      setLocationText('Não foi possível obter a localização');
    }
  };
  const uploadFlyer = async () => {
    try {
      console.log('INICIANDO UPLOAD...');
  
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!session) {
        alert('Usuário não logado');
        return;
      }
  
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permission.granted) {
        alert('Permissão negada');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 20,
      });
  
      if (result.canceled || !result.assets?.length) {
        console.log('Nenhuma imagem selecionada');
        return;
      }
  
      console.log('Criando encarte...');
  
      const { data: flyerInsert, error: flyerError } = await supabase
        .from('flyer_uploads')
        .insert([
          {
            store_name: 'Supermarket VR',
            city: 'Volta Redonda',
            state: 'RJ',
            file_url: 'multi',
            original_file_name: `encarte-${Date.now()}`,
            status: 'pending',
          },
        ])
        .select()
        .single();
  
      if (flyerError || !flyerInsert) {
        console.log('ERRO AO CRIAR ENCARTE:', flyerError);
        alert('Erro ao criar encarte');
        return;
      }
  
      const flyerUploadId = flyerInsert.id;
      console.log('ENCARTE ID:', flyerUploadId);
  
      for (let i = 0; i < result.assets.length; i++) {
        const image = result.assets[i];
  
        console.log(`Processando página ${i + 1}`);
  
        const fileExt = image.uri.split('.').pop() || 'jpg';
        const fileName = `flyers/${flyerUploadId}/page-${i + 1}-${Date.now()}.${fileExt}`;
  
        const base64 = await FileSystem.readAsStringAsync(image.uri, {
          encoding: 'base64',
        });
  
        const { error: uploadError } = await supabase.storage
          .from('flyers')
          .upload(fileName, decode(base64), {
            contentType: image.mimeType || 'image/jpeg',
            upsert: false,
          });
  
        if (uploadError) {
          console.log('ERRO NO STORAGE:', uploadError);
          alert(`Erro no upload da página ${i + 1}`);
          return;
        }
  
        const { data: publicUrlData } = supabase.storage
          .from('flyers')
          .getPublicUrl(fileName);
  
        const publicUrl = publicUrlData.publicUrl;
  
        console.log('URL:', publicUrl);
  
        const { error: insertError } = await supabase
          .from('flyer_pages')
          .insert([
            {
              flyer_upload_id: flyerUploadId,
              page_number: i + 1,
              file_url: publicUrl,
            },
          ]);
  
        if (insertError) {
          console.log('ERRO AO SALVAR NO BANCO:', insertError);
          alert(`Erro ao salvar página ${i + 1}`);
          return;
        }
  
        console.log(`Página ${i + 1} salva`);
      }
  
      alert('Encarte enviado com sucesso 🚀');
    } catch (error) {
      console.log('ERRO GERAL:', error);
      alert('Erro geral');
    }
  };
  const handleSearch = async () => {
    if (!searchText.trim()) return;
  
    setIsLoading(true);
  
    setTimeout(() => {
      navigation.navigate('Results', {
        searchText,
        userCoords: coords,
        locationText,
        district,
        city,
        radiusKm,
      });
  
      setIsLoading(false);
    }, 600);
  };
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.log('ERRO LOGIN:', error);
        alert('Erro no login');
        return;
      }
  
      if (data.session) {
        setIsLoggedIn(true);
        alert('Login feito com sucesso');
      }
    } catch (error) {
      console.log('ERRO GERAL LOGIN:', error);
      alert('Erro geral no login');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>Prexio NOVO TESTE</Text>
        <Text style={styles.subtitle}>
          Encontre o menor custo real perto de você
        </Text>

        <Text style={styles.locationLabel}>Sua localização</Text>
        <Text style={styles.locationValue}>{locationText}</Text>

        <Text style={styles.sectionTitle}>Categorias</Text>
        <View style={styles.categoriesWrap}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryChip}
              onPress={() => setSearchText(item.value)}
            >
              <Text style={styles.categoryChipText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ex: Coca-Cola 2L, cerveja, água, suco"
          value={searchText}
          onChangeText={setSearchText}
        />

        <Text style={styles.radiusLabel}>Raio de busca</Text>

        <View style={styles.radiusRow}>
          {[3, 5, 10].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.radiusButton,
                radiusKm === value && styles.radiusButtonActive,
              ]}
              onPress={() => setRadiusKm(value)}
            >
              <Text
                style={[
                  styles.radiusButtonText,
                  radiusKm === value && styles.radiusButtonTextActive,
                ]}
              >
                {value} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={isLoading}
        ><TextInput
        style={styles.input}
        placeholder="Seu email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, { marginTop: 12 }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          {isLoggedIn ? 'Logado' : 'Entrar'}
        </Text>
      </TouchableOpacity>
          <Text style={styles.buttonText}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={uploadFlyer} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', color: 'blue' }}>
            Enviar encarte
          </Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  categoryChip: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryChipText: {
    fontWeight: '600',
    color: '#111',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  radiusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  radiusButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  radiusButtonActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  radiusButtonText: {
    color: '#111',
    fontWeight: '600',
  },
  radiusButtonTextActive: {
    color: '#FFF',
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});