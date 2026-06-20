export interface AppTranslations {
  appName: string;
  selectVideo: string;
  processDevice: string;
  supportedFormats: string;
  browseFiles: string;
  selection: string;
  exportLength: string;
  annotationsLabel: string;
  toolPointer: string;
  toolPen: string;
  toolArrow: string;
  toolRect: string;
  toolCircle: string;
  toolLine: string;
  toolText: string;
  clear: string;
  editorSettings: string;
  videoFilters: string;
  filterIntensity: string;
  overlaysAudio: string;
  addBgAudio: string;
  addWatermark: string;
  logoSettings: string;
  logoPosition: string;
  logoOpacity: string;
  logoSize: string;
  logoTopLeft: string;
  logoTopRight: string;
  logoBottomLeft: string;
  logoBottomRight: string;
  removeWatermark: string;
  videoVolume: string;
  outputFormat: string;
  audioBitrate: string;
  audioBitrateDefault: string;
  videoBitrate: string;
  gifLimit: string;
  exportVideo: string;
  rendering: string;
  exportComplete: string;
  downloadOutput: string;
  autoDownloaded: string;
  downloadFallback: string;
  bgAudioTrack: string;
  bgMusicVolume: string;
  trimRange: string;
  extractingBgWaveform: string;
  errMaxSize: (maxMB: number, actualMB: string) => string;
  errInvalidFormat: string;
  errMaxDuration: (maxMin: number, actualMin: string) => string;
  msgInitSuccess: string;
  msgFeatures: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  exportSuccess: (format: string, sizeMB: string) => string;
  renderingSeq: string;
  gifStep1: string;
  gifStep2: string;
  gifStep3: string;
  gifSuccess: (sizeMB: string) => string;
}

export function getTranslations(lang: 'vi' | 'en'): AppTranslations {
  const isVi = lang === 'vi';
  return {
    appName: 'Ichigo Screen Editor',
    selectVideo: isVi ? 'Chọn video để chỉnh sửa' : 'Select a video to edit',
    processDevice: isVi 
      ? 'Video của bạn được xử lý hoàn toàn trên thiết bị của bạn.<br>Chúng tôi không nhận & lưu trữ bất kỳ dữ liệu nào lên máy chủ.' 
      : 'Your video is processed entirely on your device.<br>No data is uploaded to any server.',
    supportedFormats: isVi 
      ? 'Hỗ trợ định dạng: <strong>MP4, WebM, Ogg</strong><br><span class="text-xs">(Hoạt động tốt nhất trên trình duyệt Chrome hoặc Edge trên hệ điều hành Windows)</span>'
      : 'Supported formats: <strong>MP4, WebM, Ogg</strong><br><span class="text-xs">(Best performance on Chrome or Edge browser on Windows)</span>',
    browseFiles: isVi ? 'Duyệt tệp tin' : 'Browse files',
    selection: isVi ? 'Vùng chọn:' : 'Selection:',
    exportLength: isVi ? 'Độ dài xuất:' : 'Export duration:',
    annotationsLabel: isVi ? 'Chú thích:' : 'Annotations:',
    toolPointer: isVi ? 'Tương tác với video (phát/tạm dừng)' : 'Interact with video (play/pause)',
    toolPen: isVi ? 'Vẽ tay' : 'Freehand draw',
    toolArrow: isVi ? 'Công cụ mũi tên' : 'Arrow tool',
    toolRect: isVi ? 'Hình chữ nhật' : 'Rectangle tool',
    toolCircle: isVi ? 'Hình tròn' : 'Circle tool',
    toolLine: isVi ? 'Đường thẳng' : 'Straight line tool',
    toolText: isVi ? 'Văn bản (chữ)' : 'Text tool',
    clear: isVi ? 'Xóa nét vẽ' : 'Clear',
    editorSettings: isVi ? 'Tùy chỉnh' : 'Customization',
    videoFilters: isVi ? 'Bộ lọc màu video' : 'Video filter presets',
    filterIntensity: isVi ? 'Cường độ màu' : 'Color intensity',
    overlaysAudio: isVi ? 'Lớp phủ & âm thanh' : 'Overlays & audio',
    addBgAudio: isVi ? 'Thêm file nhạc' : 'Add audio file',
    addWatermark: isVi ? 'Thêm watermark' : 'Add watermark logo',
    logoSettings: isVi ? 'Cấu hình logo/watermark' : 'Watermark logo settings',
    logoPosition: isVi ? 'Vị trí hình mờ' : 'Watermark position',
    logoOpacity: isVi ? 'Độ mờ hình mờ' : 'Watermark opacity',
    logoSize: isVi ? 'Kích thước hình mờ' : 'Watermark size',
    logoTopLeft: isVi ? 'Trên - trái' : 'Top-left',
    logoTopRight: isVi ? 'Trên - phải' : 'Top-right',
    logoBottomLeft: isVi ? 'Dưới - trái' : 'Bottom-left',
    logoBottomRight: isVi ? 'Dưới - phải' : 'Bottom-right',
    removeWatermark: isVi ? 'Xóa hình mờ' : 'Remove watermark',
    videoVolume: isVi ? 'Âm lượng video' : 'Video volume',
    outputFormat: isVi ? 'Định dạng đầu ra' : 'Output format',
    audioBitrate: isVi ? 'Tốc độ bit âm thanh' : 'Audio bitrate',
    audioBitrateDefault: isVi ? '192 Kbps (mặc định)' : '192 Kbps (default)',
    videoBitrate: isVi ? 'Tốc độ bit video (bitrate)' : 'Video bitrate',
    gifLimit: isVi ? ' (không dài hơn 60s)' : ' (not longer than 60s)',
    exportVideo: isVi ? 'Xuất Video' : 'Export Video',
    rendering: isVi ? 'Đang xuất' : 'Rendering',
    exportComplete: isVi ? 'Xuất hoàn tất' : 'Export complete',
    downloadOutput: isVi ? 'Tải xuống kết quả' : 'Download output',
    autoDownloaded: isVi ? 'Video đã được xuất và tải xuống tự động.' : 'Video has been exported and downloaded automatically.',
    downloadFallback: isVi ? 'Tải lại' : 'Redownload',
    bgAudioTrack: isVi ? 'Nhạc nền' : 'Background music',
    bgMusicVolume: isVi ? 'Âm lượng nhạc nền' : 'Background music volume',
    trimRange: isVi ? 'Khoảng cắt' : 'Trim range',
    extractingBgWaveform: isVi ? 'Đang phân tích nhạc nền...' : 'Analyzing background music...',
    errMaxSize: (maxMB: number, actualMB: string) => isVi 
      ? `Dung lượng video vượt quá giới hạn cho phép (Tối đa ${maxMB}MB. Tệp tin của bạn: ${actualMB}MB).` 
      : `Video file size exceeds the allowed limit (Maximum ${maxMB}MB. Your file: ${actualMB}MB).`,
    errInvalidFormat: isVi 
      ? `Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp MP4, WebM hoặc Ogg.` 
      : `Unsupported file format. Please select an MP4, WebM, or Ogg file.`,
    errMaxDuration: (maxMin: number, actualMin: string) => isVi 
      ? `Độ dài video vượt quá giới hạn cho phép (Tối đa ${maxMin} phút. Video của bạn: ${actualMin} phút).` 
      : `Video duration exceeds the allowed limit (Maximum ${maxMin} minutes. Your video: ${actualMin} minutes).`,
    msgInitSuccess: isVi 
      ? 'Ichigo Engine (Phiên bản V2 - Direct Pipeline Siêu Nhẹ) đã khởi tạo thành công.' 
      : 'Ichigo Engine (V2 - Ultra-Lightweight Direct Pipeline) initialized successfully.',
    msgFeatures: isVi 
      ? 'Tính năng hoạt động: Dòng thời gian không trễ, bộ tổng hợp khung hình canvas, bộ trộn âm thanh chính đa tuyến đa kênh.' 
      : 'Active features: Zero-latency timeline, frame-level canvas compositor, multi-track dynamic master mixer.',
    step1: isVi ? 'Bước 1/4: Phân tích cấu trúc video đầu vào & khởi tạo dòng bản ghi...' : 'Step 1/4: Analyzing input structure & initializing tracks...',
    step2: isVi ? 'Bước 2/4: Chuẩn bị định tuyến luồng âm thanh theo thời gian thực...' : 'Step 2/4: Preparing real-time audio routing matrix...',
    step3: isVi ? 'Bước 3/4: Khởi tạo bộ ghi đa luồng (Recording Muxer)...' : 'Step 3/4: Creating direct recording muxer stream...',
    step4: isVi ? 'Bước 4/4: Biên dịch gói nội dung & đóng gói định dạng container...' : 'Step 4/4: Package compilation & building container...',
    exportSuccess: (format: string, sizeMB: string) => isVi 
      ? `Xuất video thành công! Đã lưu dưới định dạng ${format} (${sizeMB} MB).` 
      : `Export completed successfully! Saved as ${format} (${sizeMB} MB).`,
    renderingSeq: isVi ? 'Đang hiển thị luồng video và xử lý các độ sâu hình ảnh...' : 'Rendering video sequence and compositing layers...',
    gifStep1: isVi ? 'Bước 1/3: Khởi tạo luồng ghép khung hình cho ảnh GIF động...' : 'Step 1/3: Initializing frame compositor for GIF rendering...',
    gifStep2: isVi ? 'Bước 2/3: Chụp các khung hình chính & lồng ghép các lớp vẽ chú thích...' : 'Step 2/3: Capturing keyframes and overlaying annotations...',
    gifStep3: isVi ? 'Bước 3/3: Tối ưu hóa bảng màu và nén thành tệp tin GIF động...' : 'Step 3/3: Processing palette optimization and file packaging...',
    gifSuccess: (sizeMB: string) => isVi 
      ? `Xuất ảnh GIF thành công! Đã lưu dưới định dạng ảnh động GIF chuyên dụng (${sizeMB} MB).` 
      : `GIF Export completed successfully! Saved as standard animated GIF (${sizeMB} MB).`,
  };
}
