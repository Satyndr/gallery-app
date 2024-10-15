import { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, Image, View, TouchableOpacity, Modal } from 'react-native';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddIcon from "../../assets/icons/add.png";
import { useRouter } from 'expo-router';

import DropdownComponent from '../../components/DropdownComponent';


export default function Albums() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Fetch albums automatically when component mounts
  useEffect(() => {
    const getAlbums = async () => {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(fetchedAlbums);
    };

    getAlbums(); // Fetch albums
  }, [permissionResponse]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View 
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 15,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          Albums
        </Text>

        <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative'
        }}
        >        
        {/* <TouchableOpacity>
          <Image
            source={AddIcon}
            style={{
                height: 18,
                width: 18,
                opacity: 0.7,
                marginRight: 8,
              }}
            />
        </TouchableOpacity> */}
        <DropdownComponent/>
        
        </View>

      </View>

      <FlatList
        data={albums}
        renderItem = {({item})=>
            <AlbumEntry key={item.id} album={item} />
        }
        keyExtractor={(item) => item.id}
        numColumns={3}  
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
      >
      </FlatList>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }) {
  const [firstImage, setFirstImage] = useState(null);
//   const navigation = useNavigation(); 
    const router = useRouter();

  useEffect(() => {
    const getFirstAlbumImage = async () => {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album,
        first: 1,  // Fetch only the first image
        mediaType: ['photo', 'video', 'audio'],
      });
      setFirstImage(albumAssets.assets[0]);  // Set first image
    };

    getFirstAlbumImage();
  }, [album]);

  function truncateTitle(title, wordLimit) {
    const words = title.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';  // Limit to the number of words, and append '...'
    }
    return title;
  }
  
  return (
    <TouchableOpacity 
    
    style={styles.albumContainer}
    onPress={() => router.push({
      pathname: '/albumPage/'+album.id,
      params: { albumTitle: album.title }  
    })} 
    >

      {firstImage && (
        firstImage.mediaType === 'photo' ? (
          <Image 
            source={{ uri: firstImage.uri }} 
            style={styles.albumThumbnail}
          />
        ) : (
          <Video
            source={{ uri: firstImage.uri }}
            style={styles.albumThumbnail}
            shouldPlay={false} 
            isLooping={false}
            resizeMode="cover"
          />
        )
      )}
      <Text style={styles.albumTitle}>
        {truncateTitle(album.title, 1)}
      </Text>
      <Text
      style={{
        fontSize: 10,
        fontWeight: '500',
      }}
      >
      {album.assetCount ?? 'no'}
      </Text>
      
      </TouchableOpacity>
  
  );
}

const styles = StyleSheet.create({
  albumContainer: {
    paddingHorizontal: 5,
    marginBottom: 12,
    marginTop: 20,
    gap: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  albumThumbnail: {
    width: 105,
    height: 105,
    // marginLeft: 2,
    borderRadius: 6,
    backgroundColor: '#d3d3d3',
  },
  columnWrapper: {
    justifyContent: 'flex-start',  // Spread the columns evenly
    marginBottom: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  albumTitle: {
    // marginTop: 5,
    width: '100%', // Ensure the text fits within the container width
    fontSize: 13,
    fontWeight: '500',
    overflow: 'hidden',   // Hide overflow
  },
});
