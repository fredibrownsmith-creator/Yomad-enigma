import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { getVenue, addVenueReview } from '../../api/venues';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import ReviewCard from '../../components/ReviewCard';

export default function VenueDetailScreen({ route }) {
  const { id } = route.params;
  const { token } = useAuth();
  const [venue, setVenue]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [review, setReview]       = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try   { setVenue(await getVenue(id, token)); }
    catch (err) { Alert.alert('Error', err.message); }
    finally { setLoading(false); }
  };

  const submit = async () => {
    if (!review.rating) return Alert.alert('Error', 'Please select a rating');
    setSubmitting(true);
    try {
      await addVenueReview(id, review, token);
      Alert.alert('Thanks!', 'Review submitted successfully.');
      setReview({ rating: 0, comment: '' });
      await load();
    } catch (err) { Alert.alert('Error', err.message); }
    finally { setSubmitting(false); }
  };

  const avg = venue?.reviews?.length
    ? (venue.reviews.reduce((a, r) => a + r.rating, 0) / venue.reviews.length).toFixed(1)
    : null;

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color="#6B4EFF" /></View>;
  if (!venue)  return <View style={s.center}><Text>Venue not found</Text></View>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={s.page}>
        <View style={s.hero}>
          <Text style={s.name}>{venue.name}</Text>
          <View style={s.badgeRow}>
            {venue.isVerified && <View style={s.badge}><Text style={s.badgeTxt}>✓ Verified</Text></View>}
            {avg && <Text style={s.rating}>⭐ {avg}</Text>}
          </View>
          <Text style={s.loc}>📍 {venue.city}, {venue.country}</Text>
          {venue.address && <Text style={s.addr}>{venue.address}</Text>}
        </View>

        {venue.description && (
          <View style={s.card}>
            <Text style={s.cardTitle}>About</Text>
            <Text style={s.body}>{venue.description}</Text>
          </View>
        )}

        <View style={s.card}>
          <Text style={s.cardTitle}>Details</Text>
          {venue.capacity     && <Text style={s.detail}>👥 Capacity: {venue.capacity} people</Text>}
          {venue.pricePerHour && <Text style={s.detail}>💰 ${venue.pricePerHour}/hour</Text>}
        </View>

        {venue.equipment?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Equipment</Text>
            <View style={s.tags}>{venue.equipment.map(i => <View key={i} style={s.tag}><Text style={s.tagTxt}>{i}</Text></View>)}</View>
          </View>
        )}

        {venue.amenities?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Amenities</Text>
            <View style={s.tags}>{venue.amenities.map(i => <View key={i} style={s.tag}><Text style={s.tagTxt}>{i}</Text></View>)}</View>
          </View>
        )}

        <View style={s.card}>
          <Text style={s.cardTitle}>Leave a Review</Text>
          <StarRating rating={review.rating} onRate={r => setReview(p => ({ ...p, rating: r }))} />
          <TextInput style={[s.input, { height: 80, textAlignVertical: 'top', marginTop: 10 }]} placeholder="Share your experience..." value={review.comment} onChangeText={v => setReview(p => ({ ...p, comment: v }))} multiline />
          <TouchableOpacity style={s.btn} onPress={submit} disabled={submitting}>
            <Text style={s.btnTxt}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
          </TouchableOpacity>
        </View>

        {venue.reviews?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Reviews ({venue.reviews.length})</Text>
            {venue.reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page:     { flex: 1, backgroundColor: '#F8F9FA' },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero:     { backgroundColor: '#6B4EFF', padding: 20, paddingBottom: 24 },
  name:     { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  badge:    { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  rating:   { color: '#fff', fontSize: 14 },
  loc:      { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  addr:     { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  card:     { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  cardTitle:{ fontSize: 16, fontWeight: '700', color: '#2D3748', marginBottom: 10 },
  body:     { fontSize: 14, color: '#4A5568', lineHeight: 22 },
  detail:   { fontSize: 14, color: '#4A5568', marginBottom: 6 },
  tags:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:      { backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  tagTxt:   { color: '#4338CA', fontSize: 13 },
  input:    { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14 },
  btn:      { backgroundColor: '#6B4EFF', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12 },
  btnTxt:   { color: '#fff', fontWeight: '700' }
});
