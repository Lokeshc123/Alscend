import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ITask } from "../screens/Home/Home";
interface TaskProps {
  task: ITask;
}
const Tasks = ({ task }: TaskProps) => {
  // Format date for better display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity onPress={() => console.log("Task pressed" , task.title)}>
    <View style={[styles.container, { borderLeftColor: task.color }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{task.emoji}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.statusRow}>
          <Text style={styles.status}>Status: {task.status}</Text>
          <Text style={styles.type}>{task.type}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progress}>
            Progress: {task.progress}%
            {task.goal && ` of ${task.goal}`}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(task.progress, 100)}%`, backgroundColor: task.color },
              ]}
            />
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.stat}>Streak: {task.streak} days</Text>
          {task.currentGoal && (
            <Text style={styles.stat}>Current Goal: {task.currentGoal}</Text>
          )}
        </View>

        <Text style={styles.date}>
          Updated: {formatDate(task.updatedAt)}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    alignSelf: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4, // Using task.color for this
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  details: {
    padding: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: "#444",
  },
  type: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  progressContainer: {
    marginBottom: 10,
  },
  progress: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  stat: {
    fontSize: 13,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});