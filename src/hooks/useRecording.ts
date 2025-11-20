import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export const useRecording = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [duration, setDuration] = useState(0);
  const [metering, setMetering] = useState(-160);
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.metering !== undefined) {
            setMetering(status.metering);
          }
        },
        100
      );
      setRecording(recording);
      setIsRecording(true);

      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
      throw err;
    }
  }, [permissionResponse, requestPermission]);

  const stopRecording = useCallback(async () => {
    if (!recording) return null;

    console.log('Stopping recording..');
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(null);
    setIsRecording(false);

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    return { uri, duration };
  }, [recording, duration]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recording) {
      recording.stopAndUnloadAsync();
    }
  }, [recording]);

  return {
    recording,
    duration,
    metering,
    isRecording,
    startRecording,
    stopRecording,
    cleanup,
  };
};
