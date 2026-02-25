import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const CARDS = [
  { icon: '📍', title: 'Find Venues',      subtitle: 'Search studios & spaces',     tab: 'Venues'    },
  { icon: '👥', title: 'Community',         subtitle: 'Connect with other teachers', tab: 'Community' },
  { icon: '🎁', title: 'Exclusive Offers',  subtitle: 'Deals curated for you',       tab: 'Offers'    },
  { icon: '👤', title: 'My Profile',        subtitle: 'Manage your teacher profile', tab: 'Profile'   }
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.header}>
          <Text style={s.greeting}>Namaste, {user?.name?.split(' ')[0]} 🙏</Text>
          <Text style={s.sub}>Where are you teaching today?</Text>
        </View>

        <View style={s.grid}>
          {CARDS.map(card => (
            <TouchableOpacity key={card.title} style={s.card} onPress={() => navigation.navigate(card.tab)}>
              <Text style={s.icon}>{card.icon}</Text>
              <Text style={s.cardTitle}>{card.title}</Text>
              <Text style={s.cardSub}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.tip}>
          <Text style={s.tipTitle}>🌍 Traveling Tip</Text>
          <Text style={s.tipText}>Reach out to local yoga communities when visiting a new city — the YogaNomad community is here to help!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingBottom: 40 },
  header:    { marginBottom: 24 },
  greeting:  { fontSize: 26, fontWeight: '800', color: '#2D3748' },
  sub:       { fontSize: 15, color: '#718096', marginTop: 4 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:      { width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  icon:      { fontSize: 30, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748', marginBottom: 4 },
  cardSub:   { fontSize: 12, color: '#718096' },
  tip:       { marginTop: 24, backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16 },
  tipTitle:  { fontSize: 14, fontWeight: '700', color: '#4338CA', marginBottom: 6 },
  tipText:   { fontSize: 13, color: '#4A5568', lineHeight: 20 }
});
