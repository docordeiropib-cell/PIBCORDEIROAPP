import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  warning: '#d69e2e',
};

interface PrayerRequest {
  id: string;
  name: string;
  message: string;
  is_public: boolean;
  is_approved: boolean;
  is_answered: boolean;
  testimony?: string;
  created_at: string;
}

export default function PrayerScreen() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/prayer-requests`);
      if (response.ok) {
        const requests = await response.json();
        setPrayerRequests(requests);
      }
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitPrayerRequest = async () => {
    if (!name.trim() || !message.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/prayer-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          is_public: isPublic,
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Sucesso', 
          'Seu pedido de oração foi enviado! Será analisado pelos líderes antes de ser publicado.',
          [
            {
              text: 'OK',
              onPress: () => {
                setName('');
                setMessage('');
                setShowForm(false);
                fetchPrayerRequests();
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível enviar seu pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderPrayerForm = () => (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Novo Pedido de Oração</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowForm(false)}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Seu nome:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          maxLength={100}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pedido de oração:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Compartilhe seu pedido de oração..."
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.charCount}>{message.length}/500</Text>
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsPublic(!isPublic)}
      >
        <Ionicons 
          name={isPublic ? "eye" : "eye-off"} 
          size={20} 
          color={colors.primary} 
        />
        <Text style={styles.toggleText}>
          {isPublic ? "Pedido público (visível para todos)" : "Pedido privado (apenas líderes)"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={submitPrayerRequest}
        disabled={submitting}
      >
        {submitting ? (
          <Text style={styles.submitButtonText}>Enviando...</Text>
        ) : (
          <>
            <Ionicons name="send" size={20} color={colors.white} />
            <Text style={styles.submitButtonText}>Enviar Pedido</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Pedidos de Oração</Text>
            <Text style={styles.headerSubtitle}>
              "Orai uns pelos outros, para que sareis"
            </Text>
          </View>

          {/* Botão Novo Pedido */}
          {!showForm && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.newRequestButton}
                onPress={() => setShowForm(true)}
              >
                <Ionicons name="add-circle" size={24} color={colors.white} />
                <Text style={styles.newRequestText}>Fazer Pedido de Oração</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Formulário */}
          {showForm && (
            <View style={styles.section}>
              {renderPrayerForm()}
            </View>
          )}

          {/* Mural de Oração */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mural de Oração</Text>
            {loading ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Carregando pedidos...</Text>
              </View>
            ) : prayerRequests.length > 0 ? (
              prayerRequests.map((request) => (
                <View key={request.id} style={styles.prayerCard}>
                  <View style={styles.prayerHeader}>
                    <View style={styles.prayerInfo}>
                      <Ionicons name="person-circle" size={20} color={colors.primary} />
                      <Text style={styles.prayerName}>{request.name}</Text>
                    </View>
                    <Text style={styles.prayerDate}>
                      {formatDate(request.created_at)}
                    </Text>
                  </View>
                  
                  <Text style={styles.prayerMessage}>{request.message}</Text>

                  {request.is_answered && request.testimony && (
                    <View style={styles.testimonyCard}>
                      <View style={styles.testimonyHeader}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={styles.testimonyTitle}>Oração Respondida!</Text>
                      </View>
                      <Text style={styles.testimonyText}>{request.testimony}</Text>
                    </View>
                  )}

                  <View style={styles.prayerActions}>
                    <TouchableOpacity style={styles.prayButton}>
                      <Ionicons name="heart" size={16} color={colors.primary} />
                      <Text style={styles.prayButtonText}>Orar por isso</Text>
                    </TouchableOpacity>
                    {request.is_answered && (
                      <View style={styles.answeredBadge}>
                        <Ionicons name="checkmark" size={16} color={colors.success} />
                        <Text style={styles.answeredText}>Respondida</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="heart-outline" size={48} color={colors.lightGray} />
                <Text style={styles.emptyText}>Nenhum pedido de oração ainda</Text>
                <Text style={styles.emptySubtext}>Seja o primeiro a compartilhar!</Text>
              </View>
            )}
          </View>

          {/* Informações */}
          <View style={styles.section}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={colors.accent} />
              <Text style={styles.infoTitle}>Como Funciona</Text>
              <Text style={styles.infoText}>
                • Envie seu pedido de oração{'\n'}
                • Será analisado pelos líderes{'\n'}
                • Pedidos aprovados aparecerão no mural{'\n'}
                • A igreja orará por você!
              </Text>
            </View>
          </View>

          {/* Versículo */}
          <View style={styles.section}>
            <View style={styles.verseCard}>
              <Text style={styles.verseText}>
                "Confessai as vossas culpas uns aos outros, e orai uns pelos outros, 
                para que sareis. A oração feita por um justo pode muito em seus efeitos."
              </Text>
              <Text style={styles.verseReference}>Tiago 5:16</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontStyle: 'italic',
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
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  newRequestText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formCard: {
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    textAlign: 'right',
    marginTop: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  prayerCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
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
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  prayerDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
  },
  prayerMessage: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonyCard: {
    backgroundColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  testimonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testimonyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
    marginLeft: 8,
  },
  testimonyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  prayerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  prayButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  answeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answeredText: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginTop: 4,
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