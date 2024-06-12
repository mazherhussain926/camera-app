import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "./src/components/Button.js";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const cameraRef = useRef(null);

  // Request camera and media library permissions when the component mounts
  useEffect(() => {
    (async () => {
      try {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        requestPermission(cameraStatus.status === "granted");
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

  // Function to save the take picture to the media library
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
    <View style={styles.container}>
      {!image ? (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          flash={flash}
          facing={facing}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 20,
             // backgroundColor:"#f1f1f1"
            }}
          >
            <Button toggleIcon="camera-reverse-outline" onPress={toggleCameraFacing} />
            <Button
              icon="flash"
              color={flash === "off" ? "#f1f1f1" : "#ef9c66"}
              onPress={toggleFlashMode}
            />
          </View>
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
        <View>
          <Button
            title={"Take a picture"}
            icon="camera"
            onPress={takePicture}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 20,
  },
  image: {},
  camera: {
    flex: 1,
    borderRadius: 20,
  },
});
