# Upload Images Ionic 3
Este proyecto es un ejemplo para subir imágenes desde la cámara y galería con
 Ionic 3 a un servidor php con Laravel.

## Instalación automática de dependencias
```
npm install
ionic prepare
```


## Instalación manual de dependencias
```
npm install --save @ionic-native/camera
npm install --save @ionic-native/file
npm install --save @ionic-native/file-path
npm install --save @ionic-native/file-transfer
npm install --save @ionic-native/crop
ionic cordova plugin add cordova-plugin-camera --save
ionic cordova plugin add cordova-plugin-file --save
ionic cordova plugin add cordova-plugin-file-transfer --save
ionic cordova plugin add cordova-plugin-filepath --save
ionic cordova plugin add cordova-plugin-crop
```

## iOS 11 Camera Permissions Plugin for Apache Cordova
```
cordova plugin add cordova-plugin-ios-camera-permissions --save
```

Customising the message prompts

On installation you can customise the prompts shown by setting the following variables on installation.

CAMERA_USAGE_DESCRIPTION for NSCameraUsageDescription
MICROPHONE_USAGE_DESCRIPTION for NSMicrophoneUsageDescription
PHOTOLIBRARY_ADD_USAGE_DESCRIPTION for NSPhotoLibraryAddUsageDescription (write-access only, iOS 11 only)
PHOTOLIBRARY_USAGE_DESCRIPTION for NSPhotoLibraryUsageDescription (read/write access)
For example:

```
cordova plugin add cordova-plugin-ios-camera-permissions --variable CAMERA_USAGE_DESCRIPTION="your usage message" --variable MICROPHONE_USAGE_DESCRIPTION="your microphone usage message here" --variable PHOTOLIBRARY_ADD_USAGE_DESCRIPTION="your photo library usage message here" --variable PHOTOLIBRARY_USAGE_DESCRIPTION="your photo library usage message here" --save
```
