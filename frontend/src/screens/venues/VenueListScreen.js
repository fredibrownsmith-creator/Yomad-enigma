import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { getVenues, searchVenues } from '../../api/venues';
import { useAuth } from '../../context/AuthContext';
import VenueCard from '../../components/VenueCard';

export default function VenueListScreen({ navigation }) {
  const { token } = useAuth();
  const [venues, setVenues]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [city, setCity]         = useState('');
  const [country, setCountry]   = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try   { setVenues(await getVenues(token)); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city)    params.city    = city;
      if (country) params.country = country;
      setVenues(await searchVenues(params, token));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const reset = () => { setCity(''); setCountry(''); load(); };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.row}>
        <TextInput  style={[s.input, { flex: 1 }]} placeholder="City"    value={city}    onChangeText={setCity} />
        <TextInput  style={[s.input, { flex: 1 }]} placeholder="Country" value={country} onChangeText={setCountry} />
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={s.actions}>
        <TouchableOpacity onPress={reset}><Text style={s.reset}>Reset</Text></TouchableOpacity>
        <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate('AddVenue')}>
          <Text style={s.addTxt}>+ Add Venue</Text>
        </TouchableOpacity>
      </View>

      {loading ? <View style={s.center}><ActivityIndicator size="large" color="#6B4EFF" /></View> : (
        <FlatList
          data={venues}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <VenueCard venue={item} onPress={() => navigation.navigate('VenueDetail', { id: item.id })} />}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={s.empty}>No venues found. Try different filters.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row:       { flexDirection: 'row', padding: 12, gap: 8 },
  input:     { backgroundColor: '#fff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14 },
  searchBtn: { backgroundColor: '#6B4EFF', borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center', minWidth: 44 },
  actions:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 4 },
  reset:     { color: '#718096', fontSize: 13 },
  addBtn:    { backgroundColor: '#6B4EFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addTxt:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  empty:     { textAlign: 'center', color: '#718096', marginTop: 40, fontSize: 14 }
});
