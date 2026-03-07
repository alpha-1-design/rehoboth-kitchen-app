import Tesseract from 'tesseract.js';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';

let cocoModel = null;

export const extractText = async (imageData) => {
  try {
    const result = await Tesseract.recognize(imageData, 'eng');
    return result.data.text;
  } catch (error) {
    console.warn('OCR error:', error.message);
    throw error;
  }
};

export const detectObjects = async (imageData) => {
  try {
    if (!cocoModel) {
      cocoModel = await cocoSsd.load();
    }
    const img = new Image();
    img.src = imageData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const predictions = await cocoModel.detect(img);
    return predictions;
  } catch (error) {
    console.warn('Object detection error:', error.message);
    throw error;
  }
};

export const detectFaces = async (imageData) => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    const img = new Image();
    img.src = imageData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  } catch (error) {
    console.warn('Face detection error:', error.message);
    throw error;
  }
};

export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          reject(error);
        },
      );
    } else {
      reject(new Error('Geolocation not supported'));
    }
  });
};
