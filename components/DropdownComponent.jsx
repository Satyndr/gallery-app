import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import Dots from "../assets/icons/three-dot.png"
import { useRouter } from 'expo-router';

export default function DropdownComponent() {
    const [dropMenuVisible, setDropMenuVisible] = useState(false);
    const router = useRouter();

  return (
    <View
    style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position:'relative'
    }}
    >
      <TouchableOpacity
        onPress={()=>setDropMenuVisible(!dropMenuVisible)}
        >
          <Image 
            source={Dots}
            style={{
              height: 20,
              width: 20,
              opacity: 0.7,
            }}
          />
        </TouchableOpacity>
        
        {dropMenuVisible && 
        
        <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          right: 10,
          top: 40,
          borderRadius: 10,
          zIndex: 10,
          
        }}
        >
          
            <TouchableOpacity
            onPress={()=>router.push('otherScreens/About')}
            >
              <Text
              style={{
                padding: 10,
                fontSize: 15,
              }}
              >About</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>router.push('otherScreens/PrivacyPolicy')}
            >
              <Text
              style={{
                padding: 10,
                fontSize: 15,
              }}
              >Pivacy Policy</Text>
            </TouchableOpacity>
          
        </View>

        }
    </View>
  )
}