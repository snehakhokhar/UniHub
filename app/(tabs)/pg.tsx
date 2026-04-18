import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

const pgOptions = [
  {
    id: "1",
    title: "Find PG near LD College",
    subtitle: "Browse nearby PG options",
    link: "https://www.magicbricks.com/pg-near-ld-college-of-engineering-in-ahmedabad-pppfr?utm_source=chatgpt.com",
    image: require("../../assets/images/pg1.png"),
  },
  {
    id: "2",
    title: "Explore verified PG listings",
    subtitle: "Trusted platforms with reviews",
    link: "https://www.stanzaliving.com/paying-guest-pg-hostel-near-ld-college-of-engineering-internal-road-panjrapole-ahmedabad-slw177cgeg19",
    image: require("../../assets/images/pg2.png"),
  },
 
];

export default function PGScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      
      <Image source={item.image } style={styles.image} />

      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.subtitle}>{item.subtitle}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL(item.link)}
      >
        <Text style={styles.buttonText}>Explore</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏠 PG Finder</Text>

      <FlatList
        data={pgOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 6,
  },
  button: {
    marginTop: 14,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});