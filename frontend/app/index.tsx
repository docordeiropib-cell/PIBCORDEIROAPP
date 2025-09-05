import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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

interface NextEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

export default function PIBApp() {
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
        Alert.alert('Pedidos de Oração', 'Em breve! Sistema de pedidos de oração.');
        break;
      case 'reading':
        Alert.alert('Leitura do Dia', 'Em breve! Plano de leitura bíblica diário.');
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

        {/* Programação da Semana */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programação Semanal</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Domingo</Text>
              <Text style={styles.scheduleTime}>09:00 - EBD | 19:30 - Culto</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Quarta-feira</Text>
              <Text style={styles.scheduleTime}>19:30 - Culto</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Sexta-feira</Text>
              <Text style={styles.scheduleTime}>19:30 - MCM</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>Sábado</Text>
              <Text style={styles.scheduleTime}>15:30 - Mensageiras | 19:30 - Jovens</Text>
            </View>
          </View>
        </View>

        {/* Versículo do Dia */}
        <View style={styles.section}>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>
              "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, 
              para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
            </Text>
            <Text style={styles.verseReference}>João 3:16</Text>
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Primeira Igreja Batista do Cordeiro</Text>
            <Text style={styles.contactAddress}>R. Sete de Setembro, 451{'\n'}São João dos Patos - MA{'\n'}CEP 65665-000</Text>
            <Text style={styles.contactSocial}>Instagram: @pibdocordeiro</Text>
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
    elevation: 3,
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
  },
  quickActionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
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
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactAddress: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  contactSocial: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
});
