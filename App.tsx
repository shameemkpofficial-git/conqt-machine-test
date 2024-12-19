import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import Share from 'react-native-share';
import { WebView } from 'react-native-webview';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [backgroundSound, setBackgroundSound] = useState<Sound | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    AudioRecord.init({
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'recorded_audio.wav',
    });

    const sound = new Sound('sample.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
      console.log('Background track loaded');
      setBackgroundSound(sound);
    });

    return () => {
      if (backgroundSound) {
        backgroundSound.release();
      }
    };
  }, []);

  const startRecordingAndPlayback = () => {
    if (!backgroundSound) {
      Alert.alert('Error', 'Background sound is not loaded');
      return;
    }

    backgroundSound.setNumberOfLoops(-1); 
    backgroundSound.play((success) => {
      if (!success) {
        console.error('Background playback failed');
      }
    });

    // Start recording
    AudioRecord.start();
    setIsRecording(true);
    console.log('Recording started with background music');
  };

  const stopRecording = async () => {
    if (backgroundSound) {
      backgroundSound.stop();
    }

    const recordedFilePath = await AudioRecord.stop();
    console.log('Recording stopped. File saved at:', recordedFilePath);
    setIsRecording(false);
    setFilePath(recordedFilePath);

    applyPitchAdjustment(recordedFilePath);
  };

  const applyPitchAdjustment = (filePath) => {
    const pitchAdjustmentCode = `
      const Tone = require('tone');
      const player = new Tone.Player("${filePath}").toDestination();
      const pitchShift = new Tone.PitchShift({ pitch: 2 }).toDestination();
      player.connect(pitchShift);
      player.start();
    `;

    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: `<script>${pitchAdjustmentCode}</script>` }}
        javaScriptEnabled
      />
    );
  };

  const shareRecordedAudio = () => {
    if (!filePath) {
      Alert.alert('Error', 'No recorded audio to share');
      return;
    }

    const options = {
      title: 'Share Audio File',
      url: `file://${filePath}`, 
      type: 'audio/wav', 
      message: 'Check out this recorded audio!',
    };

    Share.open(options)
      .then((res) => {
        console.log('Share successful:', res);
      })
      .catch((error) => {
        console.error('Error sharing file:', error);
        Alert.alert('Error', 'Failed to share the audio file.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karaoke App</Text>
      {!isRecording ? (
        <Button title="Start Recording & Playback" onPress={startRecordingAndPlayback} />
      ) : (
        <Button title="Stop Recording" onPress={stopRecording} />
      )}
      {filePath && <Button title="Share Recorded Audio" onPress={shareRecordedAudio} />}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
