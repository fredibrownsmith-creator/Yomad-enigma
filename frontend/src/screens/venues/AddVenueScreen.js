import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { createVenue } from '../../api/venues';
import { useAuth } from '../../context/AuthContext';

const EQUIPMENT = ['Yoga mats', 'Blocks', 'Straps', 'Bolsters', 'Blankets', 'Wheels', 'Mirrors', 'Sound system'];
const AMENITIES = ['Changing rooms', 'Showers', 'Air conditioning', 'Natural light', 'Parking', 'Public transport', 'Kitchen', 'WiFi', 'Outdoor space'];

export default function AddVenueScreen({ navigation }) {
  const { token } = useAuth();
  const [form, setForm]       = useState({ name: '', description: '', address: '', city: '', country: '', capacity: '', pricePerHour: '' });
  const [equip, setEquip]     = useState([]);
  const [amenity, setAmenity] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (item, list, set) => set(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  const update = (f) => (v) => setForm(p => ({ ...p, [f]: v }));

  const submit = async () => {
    if (!form.name || !form.city || !form.country || !form.address) return Alert.alert('Error', 'Please fill required fields');
    setLoading(true);
    try {
      await createVenue({ ...form, capacity: parseInt(form.capacity) || null, pricePerHour: parseFloat(form.pricePerHour) || null, equipment: equip, amenities: amenity }, token);
      Alert.alert('Success', 'Venue added!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Add a Venue</Text>
        <TextInput style={s.input} placeholder="Venue Name *"    value={form.name}         onChangeText={update('name')} />
        <TextInput style={[s.input, s.area]} placeholder="Description" value={form.description}  onChangeText={update('description')} multiline numberOfLines={4} />
        <TextInput style={s.input} placeholder="Full Address *"  value={form.address}      onChangeText={update('address')} />
        <TextInput style={s.input} placeholder="City *"          value={form.city}         onChangeText={update('city')} />
        <TextInput style={s.input} placeholder="Country *"       value={form.country}      onChangeText={update('country')} />
        <TextInput style={s.input} placeholder="Capacity"        value={form.capacity}     onChangeText={update('capacity')} keyboardType="numeric" />
        <TextInput style={s.input} placeholder="Price/hour (USD)" value={form.pricePerHour} onChangeText={update('pricePerHour')} keyboardType="decimal-pad" />

        <Text style={s.label}>Equipment Available</Text>
        <View style={s.tags}>
          {EQUIPMENT.map(i => (
            <TouchableOpacity key={i} style={[s.tag, equip.includes(i) && s.tagOn]} onPress={() => toggle(i, equip, setEquip)}>
              <Text style={[s.tagTxt, equip.includes(i) && s.tagTxtOn]}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Amenities</Text>
        <View style={s.tags}>
          {AMENITIES.map(i => (
            <TouchableOpacity key={i} style={[s.tag, amenity.includes(i) && s.tagOn]} onPress={() => toggle(i, amenity, setAmenity)}>
              <Text style={[s.tagTxt, amenity.includes(i) && s.tagTxtOn]}>{i}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
          <Text style={s.btnTxt}>{loading ? 'Adding...' : 'Add Venue'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F8F9FA', paddingBottom: 48 },
  title:  { fontSize: 22, fontWeight: '800', color: '#2D3748', marginBottom: 20 },
  input:  { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15 },
  area:   { height: 100, textAlignVertical: 'top' },
  label:  { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8, marginTop: 4 },
  tags:   { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag:    { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, margin: 4 },
  tagOn:  { backgroundColor: '#6B4EFF', borderColor: '#6B4EFF' },
  tagTxt: { fontSize: 13, color: '#4A5568' },
  tagTxtOn: { color: '#fff' },
  btn:    { backgroundColor: '#6B4EFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
