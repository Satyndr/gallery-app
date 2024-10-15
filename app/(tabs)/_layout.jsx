import PhotosIcon from '../../assets/icons/photos-image.png';
import AlbumsIcon from '../../assets/icons/albums.png'
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'black', 
        headerShown: false,
        tabBarStyle:{
            display: 'flex',
            height: 55
        },
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginBottom: 5,
        },
        tabBarIconStyle: {
            marginBottom: -5, 
        },
}}
    >
      <Tabs.Screen
        name="photos"
        options={{
            title: "Photos",
            tabBarIcon: ({ color }) => (
                <Image 
                source={PhotosIcon} 
                style={{ width: 24, height: 24, tintColor: color }}
                />
            ),
        }}
        
      />
      <Tabs.Screen
        name="albums"
        options={{
            title: "Albums",
            tabBarIcon: ({ color }) => (
                <Image 
                source={AlbumsIcon} 
                style={{ width: 22, height: 22, tintColor: color }}
                />
            ),
        }}
      />
    </Tabs>
  );
}
