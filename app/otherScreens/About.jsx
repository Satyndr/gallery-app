import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppLogo from '../../assets/images/icon.png';

export default function AboutScreen() {
    const navigation = useNavigation();

    useEffect(()=>{
        navigation.setOptions({
            headerTitle: "About"
        })
    },[])

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Image source={AppLogo} style={styles.logo} />

      <Text style={styles.appName}>My Gallery App</Text>
      <Text style={styles.appVersion}>Version 1.0.0</Text>

      <Text style={styles.heading}>About This App</Text>
      <Text style={styles.description}>
        My Gallery App is designed to provide users with a simple and elegant way
        to browse and manage their photos and videos. The app offers features such as
        image viewing, video playback, and media sorting for easy navigation of media
        files on your device.
      </Text>

      {/* <Text style={styles.heading}>Developer Information</Text>
      <Text style={styles.description}>
        Developed by: Yan developers
        {'\n'}
        Email: developer@example.com
      </Text> */}

      {/* Credits */}
      <Text style={styles.heading}>Credits</Text>
      <Text style={styles.description}>
        Special thanks to all contributors and libraries used in the development of this app:
        - React Native
        - Expo
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
