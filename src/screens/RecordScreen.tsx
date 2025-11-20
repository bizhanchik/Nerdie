import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { StorageService } from '../services/storage';
import { OpenAIService } from '../services/openai';
import { Lecture } from '../types';
import { useRecording } from '../hooks/useRecording';
import { WaveformVisualizer } from '../components/record/WaveformVisualizer';
import { RecordingHeader } from '../components/record/RecordingHeader';
import { StopButton } from '../components/record/StopButton';
import { ProcessingOverlay } from '../components/record/ProcessingOverlay';
import { colors } from '../constants/theme';

type RecordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Record'
>;

export default function RecordScreen() {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const { metering, startRecording, stopRecording, cleanup } = useRecording();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    startRecording().catch((error) => {
      console.error('Failed to start recording', error);
      navigation.goBack();
    });

    return cleanup;
  }, []);

  const handleStopRecording = async () => {
    const result = await stopRecording();
    if (!result || !result.uri) return;

    await processRecording(result.uri, result.duration);
  };

  const processRecording = async (uri: string, duration: number) => {
    setIsProcessing(true);

    try {
      const newLecture: Lecture = {
        id: Date.now().toString(),
        title: `Lecture ${new Date().toLocaleDateString()}`,
        date: Date.now(),
        audioUri: uri,
        duration: duration,
        status: 'processing',
      };

      await StorageService.saveLecture(newLecture);

      setProcessingStep('Transcribing audio...');
      const transcription = await OpenAIService.transcribeAudio(uri);

      newLecture.transcription = transcription;
      await StorageService.saveLecture(newLecture);

      setProcessingStep('Generating study materials...');
      const materials = await OpenAIService.generateStudyMaterials(
        transcription
      );

      newLecture.summary = materials.summary;
      newLecture.flashcards = materials.flashcards;
      newLecture.notes = materials.notes;
      newLecture.status = 'processed';

      await StorageService.saveLecture(newLecture);

      setIsProcessing(false);
      navigation.replace('LectureDetail', { lectureId: newLecture.id });
    } catch (error) {
      console.error('Processing failed', error);
      Alert.alert(
        'Processing Failed',
        'Could not process the audio. Saved locally.'
      );

      const lectures = await StorageService.getLectures();
      const current = lectures.find((l) => l.audioUri === uri);
      if (current) {
        current.status = 'failed';
        await StorageService.saveLecture(current);
      }

      setIsProcessing(false);
      navigation.goBack();
    }
  };

  if (isProcessing) {
    return <ProcessingOverlay step={processingStep} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <RecordingHeader />

      <View style={styles.content}>
        <WaveformVisualizer metering={metering} />
      </View>

      <View style={styles.footer}>
        <StopButton onPress={handleStopRecording} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
});
