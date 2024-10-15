import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import EnhancedImageViewing from 'react-native-image-viewing';
import { Video } from 'expo-av';

import VideoIcon from "../../assets/icons/play-button-arrowhead.png";
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

export default function AlbumPage() {
  const route = useRoute();
  const { albumId, albumTitle } = route.params;
  const navigation = useNavigation();

  const [mediaAssets, setMediaAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: albumTitle
    });

    loadAlbumMedia();
  }, [albumId]);

  const loadAlbumMedia = async (cursor = null, loadMore = false) => {
    // If there's no next page or already loading more, return early
    if (!hasNextPage || (loadMore && loadingMore)) return;
  
    // Set loading indicators
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
  
    try {
      // Fetch media assets with pagination
      const media = await MediaLibrary.getAssetsAsync({
        album: albumId,
        mediaType: ['photo', 'video'],
        first: 40, // Number of items to load per request
        after: cursor, // Handle pagination using the cursor
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by creation time, descending (recent first)
      });
  
      // Generate video thumbnails where necessary
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
            return { ...asset, thumbnailUri: asset.uri }; // For photos, use the original URI as thumbnail
          }
        })
      );
  
      // Update the state with new assets (append if loading more, else replace)
      setMediaAssets(prev =>
        loadMore ? [...prev, ...assetsWithThumbnails] : assetsWithThumbnails
      );
  
      // Set the pagination details
      setEndCursor(media.endCursor); // Set the cursor for the next page
      setHasNextPage(media.hasNextPage); // Whether there's more media to load
  
    } catch (error) {
      console.error("Error loading media assets:", error);
    } finally {
      // Reset loading indicators
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loadingMore) {
      loadAlbumMedia(endCursor, true);
    }
  };

  const handleAssetPress = (selectedAsset) => {
    const selectedIndex = mediaAssets.findIndex(photo => photo.id === selectedAsset.id);
    setSelectedImageIndex(selectedIndex);

    if (selectedAsset.mediaType === 'video') {
      setSelectedVideo(selectedAsset.uri);
      setIsVideoVisible(true);
    } else {
      const start = Math.max(selectedIndex - 5, 0);
      const end = Math.min(selectedIndex + 6, mediaAssets.length);

      const swipableImages = mediaAssets.slice(start, end).map(photo => ({
        uri: photo.thumbnailUri || photo.uri,
        id: photo.id,
        mediaType: photo.mediaType,
      }));

      setSelectedImage(swipableImages);
      setSelectedImageIndex(selectedIndex - start);
      setIsImageViewVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleAssetPress(item)}
      style={styles.mediaContainer}
    >
      <Image
        source={{ uri: item.thumbnailUri || item.uri }}
        style={styles.media}
      />
      {item.mediaType === 'video' && (
        <Image source={VideoIcon} style={styles.videoIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={mediaAssets}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.mediaList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#000" /> : null}
      />

      {selectedImage && (
        <EnhancedImageViewing
          images={selectedImage}
          imageIndex={selectedImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
          animationType='fade'
          presentationStyle='overFullScreen'
        />
      )}

      <Modal
        visible={isVideoVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsVideoVisible(false)}
      >
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo }}
          style={{ flex: 1 }}
          useNativeControls
          resizeMode="contain"
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    position: 'relative',
    width: '24%',
    height: 90,
    marginHorizontal: '0.7%',
    marginVertical: 2,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
