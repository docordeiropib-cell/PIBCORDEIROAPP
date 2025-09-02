import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
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

interface MediaLinks {
  pregacoes: string;
  estudos: string;
  videos: string;
}

interface ReadingPlan {
  id: string;
  day: number;
  book: string;
  chapters: string;
  date: string;
}

export default function MediaScreen() {
  const [mediaLinks, setMediaLinks] = useState<MediaLinks | null>(null);
  const [todayReading, setTodayReading] = useState<ReadingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    try {
      // Fetch media links
      const mediaResponse = await fetch(`${BACKEND_URL}/api/media-links`);
      if (mediaResponse.ok) {
        const media = await mediaResponse.json();
        setMediaLinks(media);
      }

      // Fetch today's reading
      const readingResponse = await fetch(`${BACKEND_URL}/api/reading-plan/today`);
      if (readingResponse.ok) {
        const reading = await readingResponse.json();
        setTodayReading(reading);
      }
    } catch (error) {
      console.error('Error fetching media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = async (url: string, title: string) => {
    try {
      if (url.includes('FOLDER_ID')) {
        Alert.alert(
          'Links em Configuração', 
          'Os links do Google Drive serão configurados em breve. Por favor, entre em contato conosco para acessar o conteúdo.'
        );
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', `Não foi possível abrir ${title}`);
    }
  };

  const mediaItems = [
    {
      id: 'pregacoes',
      title: 'Pregações',
      description: 'Ouça as mensagens e pregações dos cultos',
      icon: 'mic' as keyof typeof Ionicons.glyphMap,
      color: '#e53e3e',
      link: mediaLinks?.pregacoes || ''
    },
    {
      id: 'estudos',
      title: 'Estudos Bíblicos',
      description: 'Aprofunde-se nos estudos da Palavra',
      icon: 'book' as keyof typeof Ionicons.glyphMap,
      color: '#38a169',
      link: mediaLinks?.estudos || ''
    },
    {
      id: 'videos',
      title: 'Vídeos de Cultos',
      description: 'Assista aos cultos e eventos especiais',
      icon: 'videocam' as keyof typeof Ionicons.glyphMap,
      color: '#3182ce',
      link: mediaLinks?.videos || ''
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mídia e Conteúdo</Text>
          <Text style={styles.headerSubtitle}>
            Acesse pregações, estudos e vídeos
          </Text>
        </View>

        {/* Leitura do Dia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leitura Bíblica do Dia</Text>
          {loading ? (
            <View style={styles.readingCard}>
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : todayReading ? (
            <View style={styles.readingCard}>
              <View style={styles.readingHeader}>
                <Ionicons name="book-outline" size={24} color={colors.primary} />
                <Text style={styles.readingTitle}>Dia {todayReading.day}</Text>
              </View>
              <Text style={styles.readingText}>
                {todayReading.book} - Capítulos {todayReading.chapters}
              </Text>
              <TouchableOpacity style={styles.readingButton}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                <Text style={styles.readingButtonText}>Marcar como Lido</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.readingCard}>
              <Text style={styles.noReadingText}>Plano de leitura em configuração</Text>
            </View>
          )}
        </View>

        {/* Conteúdo de Mídia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdo Disponível</Text>
          {mediaItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.mediaCard}
              onPress={() => handleOpenLink(item.link, item.title)}
            >
              <View style={[styles.mediaIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={32} color={colors.white} />
              </View>
              <View style={styles.mediaContent}>
                <Text style={styles.mediaTitle}>{item.title}</Text>
                <Text style={styles.mediaDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Plano de Leitura Completo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plano de Leitura Anual</Text>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="calendar" size={24} color={colors.accent} />
              <Text style={styles.planTitle}>Leia a Bíblia em 1 Ano</Text>
            </View>
            <Text style={styles.planDescription}>
              Acompanhe seu progresso na leitura da Bíblia completa em 365 dias. 
              Uma jornada espiritual transformadora através da Palavra de Deus.
            </Text>
            <TouchableOpacity style={styles.planButton}>
              <Ionicons name="list" size={20} color={colors.white} />
              <Text style={styles.planButtonText}>Ver Plano Completo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações de Acesso */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={styles.infoTitle}>Como Acessar</Text>
            <Text style={styles.infoText}>
              • Todo conteúdo está disponível no Google Drive{'\n'}
              • Downloads gratuitos para ouvir offline{'\n'}
              • Conteúdo atualizado semanalmente{'\n'}
              • Em caso de problemas, entre em contato
            </Text>
          </View>
        </View>

        {/* Versículo Motivacional */}
        <View style={styles.section}>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>
              "Lâmpada para os meus pés é tua palavra, 
              e luz para o meu caminho."
            </Text>
            <Text style={styles.verseReference}>Salmos 119:105</Text>
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
  readingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  readingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  readingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  readingButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  noReadingText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mediaCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
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
  mediaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContent: {
    flex: 1,
    marginLeft: 16,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  mediaDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  planCard: {
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
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
  },
  planDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 12,
  },
  planButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
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