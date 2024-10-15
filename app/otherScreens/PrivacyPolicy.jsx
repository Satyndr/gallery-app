import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

    useEffect(()=>{
        navigation.setOptions({
            headerTitle: "Privacy Policy"
        })
    },[])

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.contentContainer}>

        <Text style={styles.policyText}>
          Your privacy is important to us. This privacy policy explains how we collect, use, and share
          your personal information when you use our app.
        </Text>

        <Text style={styles.subTitle}>1. Information We Collect</Text>
        <Text style={styles.policyText}>
          We collect the following types of information when you use our app:
          - Photos and videos stored on your device to display within the app's gallery features.
          - User activity logs to help us understand usage patterns and improve our services.
          - Metadata associated with media files such as timestamps, file names, and sizes.
        </Text>

        <Text style={styles.subTitle}>2. How We Use Your Information</Text>
        <Text style={styles.policyText}>
          We use your personal information to:
          - Display and manage your photos and videos.
          - Enhance and improve the user experience.
          - Provide troubleshooting and customer support.
        </Text>

        <Text style={styles.subTitle}>3. Sharing Your Information</Text>
        <Text style={styles.policyText}>
          We do not share your personal information with third parties, except:
          - When required by law.
          - When necessary for technical reasons (e.g., third-party services integrated into the app).
        </Text>

        <Text style={styles.subTitle}>4. Data Retention</Text>
        <Text style={styles.policyText}>
          We retain your personal information only for as long as necessary to provide the services and fulfill the purposes outlined in this policy.
        </Text>

        <Text style={styles.subTitle}>5. Security</Text>
        <Text style={styles.policyText}>
          We implement security measures to protect your data from unauthorized access, alteration, or destruction.
        </Text>

        <Text style={styles.subTitle}>6. Your Rights</Text>
        <Text style={styles.policyText}>
          You have the right to access, update, or delete the information we hold about you. Contact us for any privacy concerns.
        </Text>

        {/* <Text style={styles.subTitle}>7. Contact Us</Text>
        <Text style={styles.policyText}>
          If you have any questions about this privacy policy, please contact us at: support@example.com.
        </Text> */}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  policyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
