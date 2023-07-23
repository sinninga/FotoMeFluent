import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
 
  const handleCameraTypeChange = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleImagePick = async () => {
    const image = await ImagePicker.launchImageLibraryAsync();

    if (!image.canceled) {
      // Send the captured image to the backend server for object detection
      const base64Image = image.assets[0].base64;
      try {
        const response = await fetch('http://localhost:3000/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64Image }),
        });

        if (response.ok) {
          const { objects } = await response.json();
          console.log('Detected objects:', objects);
        } else {
          console.error('Error detecting objects:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending image to server:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={handleCameraTypeChange}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              Flip
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          padding: 10,
          margin: 20,
          borderRadius: 5,
        }}
        onPress={handleImagePick}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Pick Image</Text>
      </TouchableOpacity>
    </View>
  );
}
