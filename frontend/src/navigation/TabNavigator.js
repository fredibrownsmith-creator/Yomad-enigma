import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen          from '../screens/HomeScreen';
import VenueListScreen     from '../screens/venues/VenueListScreen';
import VenueDetailScreen   from '../screens/venues/VenueDetailScreen';
import AddVenueScreen      from '../screens/venues/AddVenueScreen';
import CommunityScreen     from '../screens/community/CommunityScreen';
import ChatScreen          from '../screens/community/ChatScreen';
import MemberProfileScreen from '../screens/community/MemberProfileScreen';
import OffersScreen        from '../screens/offers/OffersScreen';
import OfferDetailScreen   from '../screens/offers/OfferDetailScreen';
import ProfileScreen       from '../screens/profile/ProfileScreen';
import EditProfileScreen   from '../screens/profile/EditProfileScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const H     = { headerStyle: { backgroundColor: '#fff' }, headerTintColor: '#6B4EFF' };

const VenueStack = () => (
  <Stack.Navigator screenOptions={H}>
    <Stack.Screen name="VenueList"   component={VenueListScreen}   options={{ title: 'Venues' }} />
    <Stack.Screen name="VenueDetail" component={VenueDetailScreen} options={{ title: 'Venue Details' }} />
    <Stack.Screen name="AddVenue"    component={AddVenueScreen}    options={{ title: 'Add Venue' }} />
  </Stack.Navigator>
);

const CommunityStack = () => (
  <Stack.Navigator screenOptions={H}>
    <Stack.Screen name="CommunityList"  component={CommunityScreen}     options={{ title: 'Community' }} />
    <Stack.Screen name="MemberProfile"  component={MemberProfileScreen} options={{ title: 'Member Profile' }} />
    <Stack.Screen name="Chat"           component={ChatScreen}          options={{ title: 'Chat' }} />
  </Stack.Navigator>
);

const OffersStack = () => (
  <Stack.Navigator screenOptions={H}>
    <Stack.Screen name="OffersList"  component={OffersScreen}      options={{ title: 'Exclusive Offers' }} />
    <Stack.Screen name="OfferDetail" component={OfferDetailScreen} options={{ title: 'Offer Details' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={H}>
    <Stack.Screen name="ProfileView" component={ProfileScreen}     options={{ title: 'My Profile' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
  </Stack.Navigator>
);

const ICONS = { Home: '🏠', Venues: '📍', Community: '👥', Offers: '🎁', Profile: '👤' };

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6B4EFF',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#E2E8F0' },
        tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4 }}>{ICONS[route.name]}</Text>
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen} />
      <Tab.Screen name="Venues"    component={VenueStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Offers"    component={OffersStack} />
      <Tab.Screen name="Profile"   component={ProfileStack} />
    </Tab.Navigator>
  );
}
