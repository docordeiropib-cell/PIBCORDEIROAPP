import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

// Church theme colors
const colors = {
  primary: '#1a365d',
  secondary: '#2d5a87',
  accent: '#4a90b8',
  white: '#ffffff',
  gray: '#f7fafc',
  text: '#2d3748',
  lightGray: '#e2e8f0',
};

interface ChurchInfo {
  name: string;
  address: string;
  phone: string;
  instagram: string;
  maps_link: string;
}

export default function ContactScreen() {
  const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChurchInfo();
  }, []);

  const fetchChurchInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/church-info`);
      if (response.ok) {
        const info = await response.json();
        setChurchInfo(info);
      }
    } catch (error) {
      console.error('Error fetching church info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (churchInfo?.phone) {
      const phoneNumber = churchInfo.phone.replace(/\D/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMaps = () => {
    if (churchInfo?.maps_link) {
      Linking.openURL(churchInfo.maps_link);
    }
  };

  const handleInstagram = () => {
    if (churchInfo?.instagram) {
      const username = churchInfo.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${username}`);
    }
  };

  const handleWaze = () => {
    const address = "R. Sete de Setembro, 451, São João dos Patos - MA";
    Linking.openURL(`https://waze.com/ul?q=${encodeURIComponent(address)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contato e Localização</Text>
          <Text style={styles.headerSubtitle}>
            Venha nos visitar!
          </Text>
        </View>

        {/* Igreja Info */}
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Carregando informações...</Text>
            </View>
          ) : churchInfo ? (
            <View style={styles.infoCard}>
              <View style={styles.churchHeader}>
                <Ionicons name="business" size={32} color={colors.primary} />
                <Text style={styles.churchName}>{churchInfo.name}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="location" size={20} color={colors.accent} />
                <Text style={styles.infoText}>{churchInfo.address}</Text>
              </View>
              
              <TouchableOpacity style={styles.infoItem} onPress={handleCall}>
                <Ionicons name="call" size={20} color={colors.accent} />
                <Text style={[styles.infoText, styles.linkText]}>{churchInfo.phone}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.infoItem} onPress={handleInstagram}>
                <Ionicons name="logo-instagram" size={20} color={colors.accent} />
                <Text style={[styles.infoText, styles.linkText]}>{churchInfo.instagram}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Botões de Navegação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Chegar</Text>
          
          <TouchableOpacity style={styles.navigationButton} onPress={handleMaps}>
            <View style={styles.navButtonContent}>
              <Ionicons name="map" size={24} color={colors.white} />
              <View style={styles.navButtonText}>
                <Text style={styles.navButtonTitle}>Google Maps</Text>
                <Text style={styles.navButtonSubtitle}>Abrir no Google Maps</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navigationButton} onPress={handleWaze}>
            <View style={styles.navButtonContent}>
              <Ionicons name="car" size={24} color={colors.white} />
              <View style={styles.navButtonText}>
                <Text style={styles.navButtonTitle}>Waze</Text>
                <Text style={styles.navButtonSubtitle}>Navegação com Waze</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Horários de Funcionamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários de Funcionamento</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Domingo</Text>
              <Text style={styles.scheduleTime}>09:00 - 11:00 | 19:30 - 21:30</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Quarta-feira</Text>
              <Text style={styles.scheduleTime}>19:30 - 21:30</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Sexta-feira</Text>
              <Text style={styles.scheduleTime}>19:30 - 21:30 (MCM)</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Sábado</Text>
              <Text style={styles.scheduleTime}>15:30 - 17:00 | 19:30 - 21:30</Text>
            </View>
          </View>
        </View>

        {/* Redes Sociais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Siga-nos</Text>
          <View style={styles.socialCard}>
            <TouchableOpacity style={styles.socialButton} onPress={handleInstagram}>
              <Ionicons name="logo-instagram" size={32} color={colors.white} />
              <Text style={styles.socialText}>@pibdocordeiro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.section}>
          <View style={styles.additionalInfoCard}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={styles.additionalInfoTitle}>Informações Importantes</Text>
            <Text style={styles.additionalInfoText}>
              • Estacionamento disponível na frente da igreja{'\n'}
              • Acessibilidade para pessoas com deficiência{'\n'}
              • Berçário disponível durante os cultos{'\n'}
              • Venha como estiver, você é bem-vindo!
            </Text>
          </View>
        </View>

        {/* Versículo */}
        <View style={styles.section}>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>
              "Alegrei-me quando me disseram: Vamos à casa do Senhor."
            </Text>
            <Text style={styles.verseReference}>Salmos 122:1</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  churchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  churchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  linkText: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  navigationButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navButtonText: {
    marginLeft: 16,
  },
  navButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  navButtonSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  scheduleCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scheduleTime: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  socialCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialButton: {
    backgroundColor: '#E4405F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  socialText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  additionalInfoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'left',
  },
  verseCard: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  verseText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
});