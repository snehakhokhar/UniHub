import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useState } from "react";
import { booksData } from "../../data/booksData";

export default function BookList() {
  const [search, setSearch] = useState("");

  const filteredBooks = booksData.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.semester.toString().toLowerCase().includes(search.toLowerCase()) ||
    book.branch.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍 Search by title, semester or branch"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* Book Image */}
            <Image
              source={{ uri: item.image && item.image.trim() !== "" ? item.image : "https://via.placeholder.com/100x100.png" }}
              style={styles.image}
            />

            {/* Text details like JioSaavn */}
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.subtitle}>
                {item.author} • {item.branch} • Sem {item.semester}
              </Text>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>{item.price}</Text>
                <TouchableOpacity onPress={() => handleCall(item.contact)}>
                  <Text style={styles.callText}>📞 Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: "#eee",
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "green",
  },
  callText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
