import Sound from 'react-native-sound';

// 在静音模式下启用播放
Sound.setCategory('Playback');

let sound: Sound;

const initPlayer = (filepath: string) => {
  return new Promise((resolve, reject) => {
    console.log('-----------initPlayer', filepath);
    try {
      if (sound) {
        sound.release();
      }
      sound = new Sound(filepath, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
          reject(error);
        } else {
          resolve(sound);
        }
      });
    } catch (error) {
      console.log('初始化播放器失败', error);
    }
  });
};

const play = () => {
  console.log('sxxxxxxxx');
  return new Promise((resolve, reject) => {
    sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
        resolve(sound);
      } else {
        console.log('playback failed due to audio decoding errors');
        reject();
      }
    });
  });
};

const pause = () => {
  return new Promise<void>((resolve, reject) => {
    if (sound) {
      sound.pause(() => {
        resolve();
      });
    } else {
      reject();
    }
  });
};

const stop = () => {
  return new Promise<void>((resolve, reject) => {
    if (sound) {
      sound.stop(() => {
        resolve();
      });
    } else {
      reject();
    }
    sound.release();
  });
};

const getCurrentTime = () => {
  return new Promise((resolve, reject) => {
    if (sound && sound.isLoaded()) {
      sound.getCurrentTime(seconds => {
        resolve(seconds);
      });
    } else {
      reject();
    }
  });
};

//获取音频时长
const getDuration = () => {
  if (sound) {
    return sound.getDuration();
  }
  return 0;
};

export {sound, initPlayer, pause, play, stop, getCurrentTime, getDuration};
