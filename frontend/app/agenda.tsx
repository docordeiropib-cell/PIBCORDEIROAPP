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
import * as Calendar from 'expo-calendar';
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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface ScheduleItem {
  day: string;
  dayNumber: number;
  events: Array<{
    time: string;
    title: string;
    description: string;
  }>;
}

export default function AgendaScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Programação fixa da igreja
  const weeklySchedule: ScheduleItem[] = [
    {
      day: 'Domingo',
      dayNumber: 0,
      events: [
        {
          time: '09:00',
          title: 'EBD - Escola Bíblica Dominical',
          description: 'Estudo bíblico para toda a família'
        },
        {
          time: '19:30',
          title: 'Culto de Domingo',
          description: 'Culto de adoração e palavra'
        }
      ]
    },
    {
      day: 'Quarta-feira',
      dayNumber: 3,
      events: [
        {
          time: '19:30',
          title: 'Culto de Quarta',
          description: 'Culto de oração e doutrina'
        }
      ]
    },
    {
      day: 'Sexta-feira',
      dayNumber: 5,
      events: [
        {
          time: '19:30',
          title: 'MCM - Mulheres Cristãs em Missão',
          description: 'Reunião das mulheres da igreja'
        }
      ]
    },
    {
      day: 'Sábado',
      dayNumber: 6,
      events: [
        {
          time: '15:30',
          title: 'Mensageiras do Rei',
          description: 'Ministério infantil'
        },
        {
          time: '19:30',
          title: 'UNIJOVEM e UMHBB',
          description: 'Ministérios jovem e masculino'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/events`);
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCalendar = async (scheduleItem: ScheduleItem, event: any) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso ao calendário');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Erro', 'Nenhum calendário disponível');
        return;
      }

      // Calcular próxima data do evento
      const today = new Date();
      const todayDay = today.getDay();
      let daysUntilNext = scheduleItem.dayNumber - todayDay;
      if (daysUntilNext <= 0) daysUntilNext += 7;

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilNext);

      // Definir horário
      const [hours, minutes] = event.time.split(':');
      const startDate = new Date(nextDate);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2); // 2 horas de duração

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.title,
        notes: event.description,
        startDate,
        endDate,
        location: 'R. Sete de Setembro, 451, São João dos Patos - MA',
        timeZone: 'America/Fortaleza',
      });

      Alert.alert('Sucesso', 'Evento adicionado ao calendário!');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert('Erro', 'Não foi possível adicionar ao calendário');
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
        {/* Programação Semanal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programação Semanal</Text>
          {weeklySchedule.map((schedule, index) => (
            <View key={index} style={styles.scheduleCard}>
              <View style={styles.dayHeader}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.dayTitle}>{schedule.day}</Text>
              </View>
              {schedule.events.map((event, eventIndex) => (
                <View key={eventIndex} style={styles.eventItem}>
                  <View style={styles.eventTime}>
                    <Ionicons name="time-outline" size={16} color={colors.accent} />
                    <Text style={styles.timeText}>{event.time}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={() => addToCalendar(schedule, event)}
                  >
                    <Ionicons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Eventos Especiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos Especiais</Text>
          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
          ) : events.length > 0 ? (
            events.map((event) => (
              <View key={event.id} style={styles.specialEventCard}>
                <View style={styles.eventHeader}>
                  <Ionicons 
                    name={event.type === 'culto' ? 'church' : 'calendar'} 
                    size={24} 
                    color={colors.primary} 
                  />
                  <Text style={styles.specialEventTitle}>{event.title}</Text>
                </View>
                <Text style={styles.specialEventDescription}>{event.description}</Text>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="time-outline" size={16} color={colors.text} />
                    <Text style={styles.eventDetailText}>
                      {formatDate(event.date)} às {event.time}
                    </Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Ionicons name="location-outline" size={16} color={colors.text} />
                    <Text style={styles.eventDetailText}>{event.location}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addCalendarButton}>
                  <Ionicons name="calendar" size={16} color={colors.white} />
                  <Text style={styles.addCalendarText}>Adicionar ao Calendário</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noEventsCard}>
              <Ionicons name="calendar-outline" size={48} color={colors.lightGray} />
              <Text style={styles.noEventsText}>Nenhum evento especial programado</Text>
            </View>
          )}
        </View>

        {/* Informações Importantes */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={styles.infoTitle}>Informações Importantes</Text>
            <Text style={styles.infoText}>
              • Todos os cultos são realizados na igreja{'\n'}
              • Para eventos especiais, verifique local e horário{'\n'}
              • Em caso de dúvidas, entre em contato conosco
            </Text>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  scheduleCard: {
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
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 4,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
  calendarButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.gray,
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
  specialEventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  specialEventDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  eventDetails: {
    marginBottom: 16,
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
  addCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  addCalendarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noEventsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
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
});