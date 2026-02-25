import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const YOGA_STYLES = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Restorative', 'Kundalini', 'Bikram', 'Power'];
const LANGUAGES   = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Hindi', 'Arabic'];

export default function RegisterScreen({ navigation }) {
  const [form, setForm]         = useState({ name: '', email: '', password: '', bio: '', location: '', country: '', yearsExperience: '' });
  const [styles_, setStyles]    = useState([]);
  const [languages, setLangs]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();

  const toggle = (item, list, setList) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const update = (field) => (val) => setForm(p => ({ ...p, [field]: val }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert('Error', 'Please fill required fields');
    setLoading(true);
    try {
      await register({ ...form, yogaStyles: styles_, languages, yearsExperience: parseInt(form.yearsExperience) || 0 });
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Create Your Profile</Text>

        <TextInput style={s.input} placeholder="Full Name *"              value={form.name}            onChangeText={update('name')} />
        <TextInput style={s.input} placeholder="Email *"                  value={form.email}           onChangeText={update('email')} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Password *"               value={form.password}        onChangeText={update('password')} secureTextEntry />
        <TextInput style={[s.input, s.area]} placeholder="Bio"            value={form.bio}             onChangeText={update('bio')} multiline numberOfLines={3} />
        <TextInput style={s.input} placeholder="Current City"             value={form.location}        onChangeText={update('location')} />
        <TextInput style={s.input} placeholder="Country"                  value={form.country}         onChangeText={update('country')} />
        <TextInput style={s.input} placeholder="Years Teaching Experience" value={form.yearsExperience} onChangeText={update('yearsExperience')} keyboardType="numeric" />

        <Text style={s.label}>Yoga Styles</Text>
        <View style={s.tags}>
          {YOGA_STYLES.map(item => (
            <TouchableOpacity key={item} style={[s.tag, styles_.includes(item) && s.tagOn]} onPress={() => toggle(item, styles_, setStyles)}>
              <Text style={[s.tagTxt, styles_.includes(item) && s.tagTxtOn]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Languages Spoken</Text>
        <View style={s.tags}>
          {LANGUAGES.map(item => (
            <TouchableOpacity key={item} style={[s.tag, languages.includes(item) && s.tagOn]} onPress={() => toggle(item, languages, setLangs)}>
              <Text style={[s.tagTxt, languages.includes(item) && s.tagTxtOn]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
          <Text style={s.btnTxt}>{loading ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>Already have an account? <Text style={s.linkBold}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#F8F9FA', paddingBottom: 48 },
  title:     { fontSize: 24, fontWeight: '800', color: '#2D3748', marginBottom: 20, textAlign: 'center' },
  input:     { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15 },
  area:      { height: 90, textAlignVertical: 'top' },
  label:     { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8, marginTop: 4 },
  tags:      { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  tag:       { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, margin: 4 },
  tagOn:     { backgroundColor: '#6B4EFF', borderColor: '#6B4EFF' },
  tagTxt:    { fontSize: 13, color: '#4A5568' },
  tagTxtOn:  { color: '#fff' },
  btn:       { backgroundColor: '#6B4EFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnTxt:    { color: '#fff', fontWeight: '700', fontSize: 16 },
  link:      { textAlign: 'center', color: '#718096', marginTop: 20, fontSize: 14 },
  linkBold:  { color: '#6B4EFF', fontWeight: '700' }
});
