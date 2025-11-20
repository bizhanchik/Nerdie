import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface SwipeActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SwipeActions: React.FC<SwipeActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {onEdit && (
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Edit2 size={24} color="#fff" />
          <Text style={styles.text}>Edit</Text>
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Trash2 size={24} color="#fff" />
          <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },
  button: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  editButton: {
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
