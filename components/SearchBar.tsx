import { TextInput, StyleSheet } from "react-native";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.search}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
