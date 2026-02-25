import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { getMembers } from '../../api/community';
import { useAuth } from '../../context/AuthContext';
import MemberCard from '../../components/MemberCard';

const LANGUAGES  = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese'];
const YOGA_STYLES = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Restorative', 'Kundalini'];

export default function CommunityScreen({ navigation }) {
  const { token } = useAuth();
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showFilter, setShow]   = useState(false);
  const [f, setF]               = useState({ country: '', language: '', yogaStyle: '' });

  useEffect(() => { load(); }, []);

  const load = async (params = {}) => {
    setLoading(true);
    try   { setMembers(await getMembers(params, token)); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const apply = () => {
    const p = {};
    if (f.country)   p.country   = f.country;
    if (f.language)  p.language  = f.language;
    if (f.yogaStyle) p.yogaStyle = f.yogaStyle;
    load(p);
    setShow(false);
  };

  const reset = () => { setF({ country: '', language: '', yogaStyle: '' }); load(); setShow(false); };

  const pick = (field, val) => setF(p => ({ ...p, [field]: p[field] === val ? '' : val }));

  return (
    <SafeAreaView style={s.page}>
      <View style={s.topBar}>
        <Text style={s.count}>{members.length} teachers found</Text>
        <TouchableOpacity style={s.filterBtn} onPress={() => setShow(!showFilter)}>
          <Text style={s.filterTxt}>⚙️ Filters</Text>
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={s.panel}>
          <TextInput style={s.input} placeholder="Filter by country" value={f.country} onChangeText={v => setF(p => ({ ...p, country: v }))} />
          <Text style={s.label}>Language</Text>
          <View style={s.tags}>
            {LANGUAGES.map(l => (
              <TouchableOpacity key={l} style={[s.tag, f.language === l && s.tagOn]} onPress={() => pick('language', l)}>
                <Text style={[s.tagTxt, f.language === l && s.tagTxtOn]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.label}>Yoga Style</Text>
          <View style={s.tags}>
            {YOGA_STYLES.map(y => (
              <TouchableOpacity key={y} style={[s.tag, f.yogaStyle === y && s.tagOn]} onPress={() => pick('yogaStyle', y)}>
                <Text style={[s.tagTxt, f.yogaStyle === y && s.tagTxtOn]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.row}>
            <TouchableOpacity style={s.resetBtn} onPress={reset}><Text style={s.resetTxt}>Reset</Text></TouchableOpacity>
            <TouchableOpacity style={s.applyBtn} onPress={apply}><Text style={s.applyTxt}>Apply</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? <View style={s.center}><ActivityIndicator size="large" color="#6B4EFF" /></View> : (
        <FlatList
          data={members}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <MemberCard member={item} onPress={() => navigation.navigate('MemberProfile', { id: item.id })} />}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={s.empty}>No members found with these filters.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page:     { flex: 1, backgroundColor: '#F8F9FA' },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  count:    { fontSize: 14, color: '#718096' },
  filterBtn:{ backgroundColor: '#6B4EFF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  filterTxt:{ color: '#fff', fontSize: 13, fontWeight: '600' },
  panel:    { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  input:    { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14, marginBottom: 10 },
  label:    { fontSize: 13, fontWeight: '600', color: '#4A5568', marginBottom: 8 },
  tags:     { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  tag:      { borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, margin: 3 },
  tagOn:    { backgroundColor: '#6B4EFF', borderColor: '#6B4EFF' },
  tagTxt:   { fontSize: 12, color: '#4A5568' },
  tagTxtOn: { color: '#fff' },
  row:      { flexDirection: 'row', gap: 10, marginTop: 8 },
  resetBtn: { flex: 1, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 10, padding: 10, alignItems: 'center' },
  resetTxt: { color: '#718096' },
  applyBtn: { flex: 2, backgroundColor: '#6B4EFF', borderRadius: 10, padding: 10, alignItems: 'center' },
  applyTxt: { color: '#fff', fontWeight: '700' },
  empty:    { textAlign: 'center', color: '#718096', marginTop: 40 }
});
