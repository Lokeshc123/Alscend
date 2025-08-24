import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { ITask } from "../screens/Home/Home";
import Tasks from "./Tasks";

interface Category {
  name: string;
  emoji: string;
}

interface CategoriesProps {
  parentCategories: Category[];
  tasks: ITask[];
}

const Categories = ({ parentCategories, tasks }: CategoriesProps) => {
  const [collapsedItem, setCollapsedItem] = useState<string | null>(null);

  const toggleCollapse = (categoryName: string) => {
    setCollapsedItem(collapsedItem === categoryName ? null : categoryName);
  };

  return (
    <FlatList
      data={parentCategories}
      keyExtractor={(item) => item.name}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <>
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={() => toggleCollapse(item.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.iconContainer}>
              <Entypo
                name={collapsedItem === item.name ? "triangle-down" : "triangle-up"}
                size={20}
                color="#666"
              />
            </View>
          </TouchableOpacity>

          {collapsedItem !== item.name && (
            <FlatList
              data={tasks.filter((task) => task.category === item.name)}
              keyExtractor={(task) => task._id}
              scrollEnabled={false}
              renderItem={({ item }) => <Tasks task={item} />}
            />
          )}
        </>
      )}
    />
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});