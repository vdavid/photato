<script lang="ts">
    import {config} from '../../config';
    import {auth, getSessionToken} from '../../auth/auth.svelte';
    import {__, getActiveLocaleCode} from '../../i18n/i18n.svelte';
    import {courseData} from '../../challenges/courseData';
    import {weeklyChallengeTitles} from '../../challenges/challengeRepository';
    import {uploadStatuses, selectionStatuses} from '../uploadPageStatuses';
    import {formatDateWithWeekDayAndTime} from '../../website/dateTimeHelper';
    import FileSelectorWithPreview from './FileSelectorWithPreview.svelte';
    import PhotoTitleInput from './PhotoTitleInput.svelte';
    import PhotoUploader from '../PhotoUploader';

    interface SelectionStatus {
        name: string;
        isError: boolean;
    }

    const photoUploader = new PhotoUploader();
    const {currentWeekIndex, isCourseOver, isCourseRunning, getDeadline} = courseData;

    let accessToken = $state<string | null>(null);
    let selectedFile = $state<File | null>(null);
    let selectedFilePreviewUrl = $state('');
    let selectionStatus = $state<SelectionStatus>(selectionStatuses.readyToSelectFile);
    let uploadStatus = $state<SelectionStatus>(uploadStatuses.notStarted);
    let uploadProgress = $state(0.0);
    let title = $state('');

    $effect(() => {
        accessToken = getSessionToken();
        document.title = __('Photo upload') + ' - Photato';
    });

    function validateSelectedFile(file: File): SelectionStatus {
        return (file.size > config.imageUpload.maximumSizeInBytes)
            ? selectionStatuses.selectedFileIsTooLarge
            : ((file.size < config.imageUpload.minimumSizeInBytes)
                ? selectionStatuses.selectedFileIsTooSmall
                : ((file.type !== 'image/jpeg') ? selectionStatuses.wrongFileType : selectionStatuses.readyToUpload));
    }

    function handleFileSelected(file: File | null) {
        if (file) {
            const newStatus = validateSelectedFile(file);
            selectionStatus = newStatus;
            if (newStatus === selectionStatuses.readyToUpload) {
                selectedFile = file;
                selectedFilePreviewUrl = URL.createObjectURL(file);
            } else {
                selectedFile = null;
                selectedFilePreviewUrl = '';
            }
            uploadProgress = 0.0;
        }
    }

    function handleFileSelectionRemoved() {
        selectedFile = null;
        selectionStatus = selectionStatuses.readyToSelectFile;
        selectedFilePreviewUrl = '';
        uploadProgress = 0.0;
    }

    function getSelectionStatusText(status: SelectionStatus): string {
        const minimumSize = Math.round(config.imageUpload.minimumSizeInBytes / 1024);
        const maximumSize = Math.round(config.imageUpload.maximumSizeInBytes / 1024 / 1024);
        const texts: Record<string, string> = {
            [selectionStatuses.readyToSelectFile.name]: __('Please select your photo to upload. (a JPEG file of maximum 25 megabytes)'),
            [selectionStatuses.selectedFileIsTooSmall.name]: __('The image you’ve selected is smaller than {minimumSize} kilobytes. This is just too small. Please select a bit higher resolution photo.', {minimumSize}),
            [selectionStatuses.selectedFileIsTooLarge.name]: __('The image you’ve selected is larger than {maximumSize} megabytes. We can’t handle a photo this big. Please select a smaller photo.', {maximumSize}),
            [selectionStatuses.wrongFileType.name]: __('The image you’ve selected is not a JPEG. Please select a JPEG file.', {maximumSize}),
            [selectionStatuses.readyToUpload.name]: __('Photo is ready to upload. (Make sure you gave it a title if you wanted!)'),
        };
        return texts[status.name];
    }

    function getUploadStatusText(status: SelectionStatus): string {
        const texts: Record<string, string> = {
            [uploadStatuses.notStarted.name]: '',
            [uploadStatuses.uploading.name]: __('Uploading your photo...'),
            [uploadStatuses.uploadDone.name]: __('We got your photo! Remember, if you want to change it, you can upload a new one by the end of the week.'),
            [uploadStatuses.uploadFailed.name]: __('Upload failed. Sorry about it. We don’t know what’s wrong. Please refresh the page and try again. It it keeps on failing, please drop us an email at {emailAddress}.', {emailAddress: config.customerServiceEmailAddress}),
        };
        return texts[status.name];
    }

    async function uploadSelectedFile() {
        try {
            uploadStatus = uploadStatuses.uploading;
            const parameters = {
                environment: config.backendApi.environment,
                emailAddress: auth.user!.emailAddress,
                courseName: config.course.name,
                weekIndex: currentWeekIndex,
                originalFileName: selectedFile!.name,
                title,
                mimeType: selectedFile!.type,
            };
            const signedUrl = await photoUploader.getSignedUrlFromServer(config.backendApi.photoUpload.url, accessToken!, parameters);
            if (signedUrl) {
                const response = await photoUploader.uploadFile(signedUrl, selectedFile!, (progress) => {uploadProgress = progress;});
                if ((response.target as XMLHttpRequest).status === 200) {
                    uploadStatus = uploadStatuses.uploadDone;
                    uploadProgress = 1.0;
                } else {
                    uploadStatus = uploadStatuses.uploadFailed;
                    console.error('Unknown error during the upload PUT part.');
                }
            } else {
                uploadStatus = uploadStatuses.uploadFailed;
                console.error('Empty response from getSignedUrlFromServer. Perhaps a CORS error?');
            }
        } catch (error) {
            uploadStatus = uploadStatuses.uploadFailed;
            console.error(error);
        }
    }

    let formattedDeadline = $derived(formatDateWithWeekDayAndTime(getDeadline(currentWeekIndex), getActiveLocaleCode()));
    let courseStatusHelpText = $derived(isCourseRunning
        ? __('Submit your pic before {deadline}.\nNote: Please upload a photo you made this week. If you want to share your older pics, you’re welcome to send them in to the Facebook group.\nReminder: if you already submitted a photo this week, the new picture will replace it.', {deadline: formattedDeadline})
        : (isCourseOver
            ? __('The course has already ended. You can’t upload pics anymore. ☹')
            : __('The course has not started. You can upload your photos soon! 😊')));
    let canStartUpload = $derived(auth.isAuthenticated
        && (selectionStatus === selectionStatuses.readyToUpload)
        && (uploadStatus !== uploadStatuses.uploading));
</script>

<div id="fileUpload">
    <h1>{__('Photo upload')}</h1>
    <p class="currentWeek">{__('Week #{weekIndex}', {weekIndex: currentWeekIndex})}</p>
    {#if isCourseRunning}
        <h2>{__(weeklyChallengeTitles[currentWeekIndex - 1])}</h2>
    {/if}
    <p class="preWrap">{courseStatusHelpText}</p>
    {#if isCourseRunning}
        <FileSelectorWithPreview onFileSelected={handleFileSelected} onFileRemoved={handleFileSelectionRemoved}
                                 isDisabled={!auth.isAuthenticated || uploadStatus === uploadStatuses.uploading}
                                 {selectedFile} {selectedFilePreviewUrl}/>
        <PhotoTitleInput {title} isDisabled={uploadStatus === uploadStatuses.uploading} onChange={(newTitle) => (title = newTitle)}/>
        {#if uploadStatus === uploadStatuses.notStarted}
            <div class={'selectionStatus' + (selectionStatus.isError ? ' error' : '')}>
                {getSelectionStatusText(selectionStatus)}
            </div>
        {/if}
        <div class={'uploadStatus' + (selectionStatus.isError ? ' error' : (uploadStatus === uploadStatuses.uploadDone ? ' success' : ''))}>
            {#if [uploadStatuses.uploading, uploadStatuses.uploadDone, uploadStatuses.uploadFailed].includes(uploadStatus)}
                <progress value={uploadProgress * 100} max={100}></progress>
            {/if}
            <div>
                {getUploadStatusText(uploadStatus)}
            </div>
        </div>
        <div class="uploadButton">
            <button onclick={uploadSelectedFile} disabled={!canStartUpload}>
                {__('Upload')}
            </button>
        </div>
    {/if}
</div>
