import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
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

interface NextEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

export default function HomeScreen() {
  const [nextEvent, setNextEvent] = useState<NextEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNextEvent();
  }, []);

  const fetchNextEvent = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/events/next`);
      if (response.ok) {
        const event = await response.json();
        setNextEvent(event);
      }
    } catch (error) {
      console.error('Error fetching next event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'live':
        Alert.alert('Culto Ao Vivo', 'Em breve! Transmissão ao vivo dos cultos.');
        break;
      case 'prayer':
        Alert.alert('Pedidos de Oração', 'Acesse a aba Oração para enviar seu pedido.');
        break;
      case 'reading':
        Alert.alert('Leitura do Dia', 'Acesse seu plano de leitura bíblica diário.');
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={32} color={colors.white} />
            <Text style={styles.churchName}>PIB do Cordeiro</Text>
          </View>
          <Text style={styles.subtitle}>São João dos Patos - MA</Text>
        </View>

        {/* Próximo Evento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo Evento</Text>
          {loading ? (
            <View style={styles.eventCard}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : nextEvent ? (
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Ionicons name="calendar" size={24} color={colors.primary} />
                <Text style={styles.eventTitle}>{nextEvent.title}</Text>
              </View>
              <Text style={styles.eventDescription}>{nextEvent.description}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.text} />
                  <Text style={styles.eventDetailText}>
                    {formatDate(nextEvent.date)} às {nextEvent.time}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={16} color={colors.text} />
                  <Text style={styles.eventDetailText}>{nextEvent.location}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.eventCard}>
              <Text style={styles.noEventText}>Nenhum evento próximo</Text>
            </View>
          )}
        </View>

        {/* Botões Rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('live')}
            >
              <Ionicons name="videocam" size={28} color={colors.white} />
              <Text style={styles.quickActionText}>Culto Ao Vivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('prayer')}
            >
              <Ionicons name="heart" size={28} color={colors.white} />
              <Text style={styles.quickActionText}>Pedidos de Oração</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('reading')}
            >
              <Ionicons name="book" size={28} color={colors.white} />
              <Text style={styles.quickActionText}>Leitura do Dia</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações da Igreja */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Igreja</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Bem-vindo à Primeira Igreja Batista do Cordeiro! 
              Somos uma comunidade de fé comprometida com o amor de Cristo 
              e o serviço ao próximo.
            </Text>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.infoButtonText}>Saiba Mais</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Versículo do Dia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Versículo do Dia</Text>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>
              "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, 
              para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
            </Text>
            <Text style={styles.verseReference}>João 3:16</Text>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  churchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
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
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  eventDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  eventDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  noEventText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 3,
    marginBottom: 12,
  },
  quickActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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
  infoText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  infoButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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