import { View, Text, TouchableOpacity, Image, SectionList, StyleSheet, ActivityIndicator, Modal } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import EnhancedImageViewing from 'react-native-image-viewing';
import { Video } from 'expo-av';
import moment from 'moment';

import VideoIcon from "../../assets/icons/play-button-arrowhead.png"

import DropdownComponent from '../../components/DropdownComponent';

export default function Photos() {

  const [photos, setPhotos] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageFooter, setShowImageFooter] = useState(true);

  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermission();
  }, []);

  const loadPhotos = async () => {
    if (hasPermission && hasNextPage && !loading) {
      setLoading(true);
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo','video'],
        first: 50,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], 
        after: endCursor,
      });

      const assetsWithThumbnails = await Promise.all(
        media.assets.map(async (asset) => {
          if (asset.mediaType === 'video') {
            try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                time: 1, // Generate thumbnail at 1 second into the video
              });
              return { ...asset, thumbnailUri: uri };
            } catch (e) {
              console.warn('Failed to generate thumbnail for video:', e);
              return { ...asset, thumbnailUri: null };
            }
          } else {
            return { ...asset, thumbnailUri: asset.uri };
          }
        })
      );

      // setPhotos((prevPhotos) => [...prevPhotos, ...media.assets]);
      setPhotos((prevPhotos) => [...prevPhotos, ...assetsWithThumbnails]);
      setEndCursor(media.endCursor);
      setHasNextPage(media.hasNextPage);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      loadPhotos();
    }
  };

  useEffect(() => {
    if (hasPermission) {
      loadPhotos();
    }
  }, [hasPermission]);

  // Group photos by date
  const groupPhotosByDate = (photos) => {
    const groupedPhotos = [];
    const today = moment();
    const yesterday = moment().subtract(1, 'days');

    photos.forEach((photo) => {
      const creationDate = moment(photo.creationTime);

      let sectionTitle;
      if (creationDate.isSame(today, 'day')) {
        sectionTitle = 'Today';
      } else if (creationDate.isSame(yesterday, 'day')) {
        sectionTitle = 'Yesterday';
      } else {
        sectionTitle = creationDate.format('MMMM DD, YYYY');
      }

      const existingGroup = groupedPhotos.find(
        (group) => group.title === sectionTitle
      );

      if (existingGroup) {
        existingGroup.data.push(photo);
      } else {
        groupedPhotos.push({ title: sectionTitle, data: [photo] });
      }
    });

    return groupedPhotos;
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // Function to render photos in rows of 4
  const renderPhotoRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((asset) => (
        <TouchableOpacity
          key={asset.id}
          onPress={() => handleAssetPress(asset)}
          style={styles.photoContainer}
        >
          <Image
            source={{ uri: asset.thumbnailUri || asset.uri }}
            style={styles.photo}
          />
          {asset.mediaType === 'video' && (
            <Image source={VideoIcon} style={styles.videoIcon} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleAssetPress = (selectedAsset) => {
    const selectedIndex = photos.findIndex(photo => photo.id === selectedAsset.id);
    setSelectedImageIndex(selectedIndex);
  
    if (selectedAsset.mediaType === 'video') {
      setSelectedVideo(selectedAsset.uri); // Set the video URI for playback
      setIsVideoVisible(true); // Trigger video modal
    }else{
    const start = Math.max(selectedIndex - 5, 0);
    const end = Math.min(selectedIndex + 6, photos.length); // +6 to include the selected image and 5 right
  
    const swipableImages = photos.slice(start, end).map(photo => ({
      uri: photo.thumbnailUri || photo.uri, // Use thumbnail for videos, normal uri for images
      id: photo.id, // Useful if you want to track which image is currently displayed
      mediaType: photo.mediaType, // Can use this if you want to distinguish between photos/videos later
    }));
  
    setSelectedImage(swipableImages); // Set the array of images to the viewer
    setSelectedImageIndex(selectedIndex - start); // Set the index of the initially selected image
    setIsImageViewVisible(true);
    }
  };
  
  
  const renderFooter = () => {
    return (
      loading && (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )
    );
  };

  // Helper to group photos into rows of 4
  const groupIntoRows = (photos, numColumns) => {
    const rows = [];
    for (let i = 0; i < photos.length; i += numColumns) {
      rows.push(photos.slice(i, i + numColumns));
    }
    return rows;
  };

  // Group and sort photos
  const groupedPhotos = groupPhotosByDate(photos);
  const numColumns = 4;

  if (!hasPermission) {
    return <Text>Requesting permission...</Text>;
  }

  
  // function ImageFooter() { 
  //   if (showImageFooter){
  //     return <View >
  //     <Text style={{
  //       color:'white'
  //     }}>Whats up</Text>
  //   </View>
  //   }
  // }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos</Text>
        {/* <TouchableOpacity style={styles.menuIcon}>
          <Image source={Dots} style={styles.dotsIcon} />
        </TouchableOpacity> */}
        <DropdownComponent></DropdownComponent>
      </View>

      <View style={styles.container}>
        <SectionList
          sections={groupedPhotos.map(section => ({
            ...section,
            data: groupIntoRows(section.data, numColumns), // Group photos into rows of 4
          }))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPhotoRow}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          renderSectionHeader={renderSectionHeader}
        />

        {selectedImage && (
          <EnhancedImageViewing
            images={selectedImage} // Pass the array of swipable images
            imageIndex={selectedImageIndex} // The initially selected image index
            visible={isImageViewVisible}
            onRequestClose={() => setIsImageViewVisible(false)} // Close the viewer
            animationType='fade'
            presentationStyle='overFullScreen'
            // FooterComponent={ImageFooter}
            onLongPress={()=>setShowImageFooter(!showImageFooter)}
            delayLongPress={0}
          />
        )}
      </View>

      <Modal
        visible={isVideoVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsVideoVisible(false)}
      >
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo }} // Use selected video URI
          style={{ flex: 1 }}
          useNativeControls
          resizeMode="contain"
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    position: 'relative'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuIcon: {
    display: 'flex',
    justifyContent: 'center',
  },
  dotsIcon: {
    height: 20,
    width: 20,
    opacity: 0.7,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  photo: {
    width: '100%', 
    height: 90,
    marginHorizontal: '0.7%', 
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  loadingFooter: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    width: '24%', // Four images per row with some margin
    height: 90,
    marginHorizontal: '0.7%',
  },
  videoIcon:{
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    tintColor: '#fff',
  }
});
