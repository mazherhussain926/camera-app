import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
//common button
export default function Button({ title, onPress, icon, color, toggleIcon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon ? (
        <Entypo name={icon} size={28} color={color ? color : "#f1f1f1"} />
      ) : (
        <Ionicons
          name={toggleIcon}
          size={28}
          color={color ? color : "#f1f1f1"}
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 10,
  },
});
