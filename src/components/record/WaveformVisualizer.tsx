import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { spacing } from '../../constants/theme';

const BAR_COUNT = 20;
const BAR_WIDTH = 6;
const BAR_GAP = 6;

interface WaveformBarProps {
  index: number;
  metering: number;
}

const WaveformBar: React.FC<WaveformBarProps> = ({ index, metering }) => {
  const height = useSharedValue(10);

  useEffect(() => {
    const normalized = Math.max(0, (metering + 160) / 160);
    const randomFactor = Math.random();
    const centerFactor = 1 - Math.abs(index - BAR_COUNT / 2) / (BAR_COUNT / 2);

    const targetHeight = 20 + normalized * 150 * randomFactor * centerFactor;

    height.value = withTiming(targetHeight, {
      duration: 100,
      easing: Easing.linear,
    });
  }, [metering, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        animatedStyle,
        {
          backgroundColor: '#000',
        },
      ]}
    />
  );
};

interface WaveformVisualizerProps {
  metering: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  metering,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <WaveformBar key={index} index={index} metering={metering} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    gap: BAR_GAP,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
  },
});
