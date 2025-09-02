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
  success: '#38a169',
};

interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  contact: string;
  schedule: string;
  whatsapp_link: string;
}

export default function MinistriesScreen() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ministries`);
      if (response.ok) {
        const ministriesData = await response.json();
        setMinistries(ministriesData);
      }
    } catch (error) {
      console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (ministry: Ministry) => {
    try {
      await Linking.openURL(ministry.whatsapp_link);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    }
  };

  const handleCall = (contact: string) => {
    const phoneNumber = contact.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const getMinistryIcon = (id: string) => {
    switch (id) {
      case 'mcm':
        return 'woman';
      case 'unijovem':
        return 'people';
      case 'umhbb':
        return 'man';
      case 'mensageiras':
        return 'happy';
      default:
        return 'heart';
    }
  };

  const getMinistryColor = (id: string) => {
    switch (id) {
      case 'mcm':
        return '#e91e63';
      case 'unijovem':
        return '#2196f3';
      case 'umhbb':
        return '#4caf50';
      case 'mensageiras':
        return '#ff9800';
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nossos Ministérios</Text>
          <Text style={styles.headerSubtitle}>
            Faça parte da família PIB do Cordeiro
          </Text>
        </View>

        {/* Ministérios */}
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Carregando ministérios...</Text>
            </View>
          ) : (
            ministries.map((ministry) => (
              <View key={ministry.id} style={styles.ministryCard}>
                <View style={styles.ministryHeader}>
                  <View 
                    style={[
                      styles.iconContainer, 
                      { backgroundColor: getMinistryColor(ministry.id) }
                    ]}
                  >
                    <Ionicons 
                      name={getMinistryIcon(ministry.id)} 
                      size={32} 
                      color={colors.white} 
                    />
                  </View>
                  <View style={styles.ministryTitleContainer}>
                    <Text style={styles.ministryTitle}>{ministry.name}</Text>
                    <Text style={styles.ministrySchedule}>{ministry.schedule}</Text>
                  </View>
                </View>

                <Text style={styles.ministryDescription}>
                  {ministry.description}
                </Text>

                <View style={styles.leaderInfo}>
                  <View style={styles.leaderRow}>
                    <Ionicons name="person" size={16} color={colors.text} />
                    <Text style={styles.leaderText}>Líder: {ministry.leader}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleCall(ministry.contact)}
                  >
                    <Ionicons name="call" size={16} color={colors.accent} />
                    <Text style={styles.contactText}>{ministry.contact}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.participateButton}
                  onPress={() => handleParticipate(ministry)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
                  <Text style={styles.participateText}>Participar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Informações Gerais */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={styles.infoTitle}>Como Participar</Text>
            <Text style={styles.infoText}>
              • Clique em "Participar" para entrar no grupo do WhatsApp{'\n'}
              • Converse com o líder do ministério{'\n'}
              • Participe das reuniões e atividades{'\n'}
              • Seja bem-vindo(a) à nossa família!
            </Text>
          </View>
        </View>

        {/* Versículo de Motivação */}
        <View style={styles.section}>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>
              "E ele mesmo deu uns para apóstolos, e outros para profetas, 
              e outros para evangelistas, e outros para pastores e doutores, 
              querendo o aperfeiçoamento dos santos, para a obra do ministério, 
              para edificação do corpo de Cristo."
            </Text>
            <Text style={styles.verseReference}>Efésios 4:11-12</Text>
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
  ministryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ministryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ministryTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  ministryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ministrySchedule: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  ministryDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  leaderInfo: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaderText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: colors.accent,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  participateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 16,
  },
  participateText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
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