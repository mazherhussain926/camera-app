import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Slider from '@react-native-community/slider';
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "./src/components/Button";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

export default function App(): React.Component {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState<string>("back");
  const [flash, setFlash] = useState<string>("off");
  const[zoom,setZoom] =useState<number>(0) 

  const cameraRef = useRef(null);

  // Request camera and media library permissions when the component mounts
  useEffect(() => {
    (async () => {
      try {
        await MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus.status === "granted") {
          requestPermission(); // Call without any arguments
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // Function to take a picture using the camera
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // Function to pick image from local device
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error, "Error to pick image");
    }
  };

  // Function to save the taken picture to the media library
  const savePicture = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Picture is saved");
        setImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to toggle the camera between front and back
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Function to toggle the flash mode between off and on
  const toggleFlashMode = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  // Display a message if camera permissions are not granted
  if (!permission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <Button
            icon="flash"
            color={flash === "off" ? "#f1f1f1" : "#ef9c66"}
            onPress={toggleFlashMode}
          />
        </View>
        {!image ? (
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            flash={flash}
            facing={facing}
            isPinchToZoomEnabled={true}
            zoom={zoom}
          >
             <Slider
              style={styles.zoomSlider}
              minimumValue={0}
              maximumValue={1}
              value={zoom}
              onValueChange={(value) => setZoom(value)}
            />
          </CameraView>
          
          
        ) : (
          <Image source={{ uri: image }} style={styles.camera} />
        )}
        {image ? (
          
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 20,
            }}
          >
             
            <Button
              title={"Re-take"}
              icon="retweet"
              onPress={() => setImage(null)}
            />
            <Button title={"Save"} icon="check" onPress={savePicture} />
          </View>
        ) : (

          <View style={styles.takePictureContainer}>
            <Button onPress={pickImage} title={"Album"} />
            {/* {image && <Image source={{ uri: image }} style={styles.camera} />} */}

            <Button onPress={takePicture} icon="camera" />
            <Button
              toggleIcon="camera-reverse-outline"
              onPress={toggleCameraFacing}
            />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    justifyContent:"flex-end"
  },
  zoomSlider:{
      width: "100%",
      height: 40,
  },
  takePictureContainer: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
});
