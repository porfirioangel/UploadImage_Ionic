import {Component} from '@angular/core';
import {
    ActionSheetController, Loading, LoadingController, NavController, Platform,
    ToastController
} from 'ionic-angular';
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {Camera} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";
import {EntriesCallback, File, Entry} from '@ionic-native/file';
import {Crop} from "@ionic-native/crop";

declare var cordova: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    lastImage: string = null;
    loading: Loading;

    constructor(public navCtrl: NavController,
                private camera: Camera,
                private transfer: FileTransfer,
                private file: File,
                private filePath: FilePath,
                public actionSheetCtrl: ActionSheetController,
                public toastCtrl: ToastController,
                public platform: Platform,
                public loadingCtrl: LoadingController,
                public crop: Crop) {

    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    private getCorrectNames(fileUri: string) {
        let correctPath = '';
        let currentName = '';

        if (this.platform.is('ios')) {
            // TODO Implementar esto
        } else if (this.platform.is('android')) {
            correctPath = fileUri.substr(0,
                fileUri.lastIndexOf('/') + 1);

            currentName = fileUri.substring(
                fileUri.lastIndexOf('/') + 1,
                fileUri.lastIndexOf('?'));
        }

        return {
            correctPath: correctPath,
            currentName: currentName
        };
    }

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options)
            .then((fileUri) => {
                // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
                // Only giving an android example as ionic-native camera has built in cropping ability
                if (this.platform.is('ios')) {
                    return fileUri;
                } else if (this.platform.is('android')) {
                    let imageData = {
                        // Modify fileUri format, may not always be necessary
                        fileUri: 'file://' + fileUri,
                        device: 'android'
                    };

                    return imageData;
                }
            })
            .then((imageData) => {
                console.log('Image data', imageData);

                this.crop.crop(imageData.fileUri, {quality: 100})
                    .then((filePath) => {
                        console.log('cropped', filePath);

                        let correctNames = this.getCorrectNames(filePath);

                        this.copyFileToLocalDir(correctNames.correctPath,
                            correctNames.currentName,
                            this.createFileName());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.file.copyFile(namePath, currentName, cordova.file.dataDirectory,
                newFileName)
                .then(success => {
                    this.lastImage = newFileName;
                    resolve(newFileName);
                }, error => {
                    this.presentToast('Error while storing file.');
                    reject('Error while storing file.');
                });
        });
    }

    private cropImage(imagePath): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.crop.crop(imagePath, {quality: 75})
                .then((newImage) => {
                    console.log('new image path is: ' + newImage);
                    resolve(newImage);
                })
                .catch((error) => {
                    console.error('Error cropping image', error);
                    reject(error);
                });
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = "http://192.168.0.14/upload.php";

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;

        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {'fileName': filename}
        };

        const fileTransfer: FileTransferObject = this.transfer.create();

        this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
        });
        this.loading.present();

        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
            this.loading.dismissAll();
            this.presentToast('Image succesful uploaded.');
        }, err => {
            this.loading.dismissAll();
            this.presentToast('Error while uploading file.');
        });
    }


}
