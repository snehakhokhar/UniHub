import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function BookCard({ book }: { book: { id: string; title: string; author: string } }) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/book/${book.id}`)}>
      <View style={styles.card}>
        <Text style={styles.title}>{book.title}</Text>
        <Text>{book.author}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 8, backgroundColor: "#f5f5f5", borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});
