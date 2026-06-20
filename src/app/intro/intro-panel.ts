import { Component, input, output, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { IntroSettings } from "./intro.types";
import { AudioGenerator } from "../audio/audio-generator";

@Component({
  selector: "app-intro-panel",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="p-5 rounded-2xl bg-neutral-900 border border-white/5 relative flex flex-col gap-4">
      <!-- Toggle Header -->
      <div
        class="flex items-center justify-between cursor-pointer group"
        (click)="toggleExpanded()"
        (keydown.enter)="toggleExpanded()"
        tabindex="0"
      >
        <div class="flex items-center gap-2">
          <mat-icon
            [class.text-emerald-400]="settings().enabled"
            [class.text-neutral-500]="!settings().enabled"
            class="transition-colors"
            style="font-size: 20px; width: 20px; height: 20px"
          >
            smart_display
          </mat-icon>
          <span
            class="text-sm font-semibold tracking-wide"
            [class.text-emerald-400]="settings().enabled"
            [class.text-neutral-300]="!settings().enabled"
          >
            {{ isVi ? "Intro video" : "Video intro" }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Quick toggle switch -->
          <label
            class="relative inline-flex items-center cursor-pointer"
            (click)="$event.stopPropagation()"
            (keydown.enter)="$event.stopPropagation()"
            tabindex="0"
          >
            <input
              type="checkbox"
              [ngModel]="settings().enabled"
              (ngModelChange)="toggleFeature($event)"
              class="sr-only peer"
            />
            <div
              class="w-7 h-4 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"
            ></div>
          </label>
          <mat-icon
            class="text-neutral-500 transition-transform"
            [class.rotate-180]="expanded()"
            style="font-size: 16px; width: 16px; height: 16px"
            >keyboard_arrow_down</mat-icon
          >
        </div>
      </div>

      <!-- Expanded Content -->
      @if (expanded()) {
        <div class="mt-4 flex flex-col gap-3">
          <!-- Quick enable message if disabled -->
          @if (!settings().enabled) {
            <div
              class="bg-neutral-900/50 rounded-lg p-3 text-center border-dashed border border-white/10"
            >
              <span class="text-xs text-neutral-400">
                {{
                  isVi
                    ? "Bật Intro để chỉnh sửa nội dung"
                    : "Enable Intro to edit content"
                }}
              </span>
            </div>
          } @else {
            <!-- Settings Form -->
            
            <!-- Main Configuration: Template, Font, Duration -->
            <div class="grid grid-cols-3 gap-2 mb-2">
              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-template"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide truncate"
                  title="{{ isVi ? 'Mẫu hiệu ứng' : 'Animation Template' }}"
                >
                  {{ isVi ? "Hiệu ứng" : "Template" }}
                </label>
                <select
                  id="intro-template"
                  [ngModel]="settings().template || 'minimal'"
                  (ngModelChange)="updateSetting('template', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-[11px] px-1 py-1.5 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                >
                  <option value="minimal">{{ isVi ? "Tối giản" : "Minimal" }}</option>
                  <option value="cinematic">{{ isVi ? "Điện ảnh" : "Cinematic" }}</option>
                  <option value="glitch">{{ isVi ? "Nhiễu sóng" : "Glitch" }}</option>
                  <option value="neon">{{ isVi ? "Neon" : "Neon" }}</option>
                  <option value="typewriter">{{ isVi ? "Gõ chữ" : "Typewriter" }}</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-font"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide truncate"
                  >Font</label
                >
                <select
                  id="intro-font"
                  [ngModel]="settings().fontFamily"
                  (ngModelChange)="updateSetting('fontFamily', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-[11px] px-1 py-1.5 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                >
                  <option value="Inter">Inter</option>
                  <option value="Lora">Lora</option>
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Be Vietnam Pro">Be Vietnam Pro</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-duration"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide truncate"
                  title="{{ isVi ? 'Thời gian (giây)' : 'Duration (s)' }}"
                  >{{ isVi ? "Thời gian (s)" : "Duration (s)" }}</label
                >
                <input
                  id="intro-duration"
                  type="number"
                  min="3"
                  max="7"
                  step="0.5"
                  [ngModel]="settings().duration"
                  (ngModelChange)="onDurationChanged($event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-[11px] px-2 py-1.5 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                />
              </div>
            </div>

            <!-- Title + Title Font Size -->
            <div class="grid grid-cols-[1fr_80px] gap-3">
              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-title"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide"
                  >{{ isVi ? "Tiêu đề" : "Title" }}</label
                >
                <input
                  id="intro-title"
                  type="text"
                  [ngModel]="settings().title"
                  (ngModelChange)="updateSetting('title', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-xs px-2 py-1.5 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-title-size"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide text-right"
                  >{{ isVi ? "Cỡ chữ (px)" : "Size (px)" }}</label
                >
                <input
                  id="intro-title-size"
                  type="number"
                  min="12"
                  max="120"
                  step="1"
                  [ngModel]="settings().titleFontSize || 100"
                  (ngModelChange)="updateSetting('titleFontSize', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-xs px-2 py-1.5 text-center focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                />
              </div>
            </div>

            <!-- Subtitle + Subtitle Font Size -->
            <div class="grid grid-cols-[1fr_80px] gap-3">
              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-subtitle"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide"
                  >{{ isVi ? "Mô tả ngắn" : "Subtitle" }}</label
                >
                <input
                  id="intro-subtitle"
                  type="text"
                  [ngModel]="settings().subtitle"
                  (ngModelChange)="updateSetting('subtitle', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-xs px-2 py-1.5 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-subtitle-size"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide text-right"
                  >{{ isVi ? "Cỡ chữ (px)" : "Size (px)" }}</label
                >
                <input
                  id="intro-subtitle-size"
                  type="number"
                  min="8"
                  max="80"
                  step="1"
                  [ngModel]="settings().subtitleFontSize || 50"
                  (ngModelChange)="updateSetting('subtitleFontSize', $event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-xs px-2 py-1.5 text-center focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                />
              </div>
            </div>

            <!-- Colors and Audio -->
            <div class="grid grid-cols-3 gap-3">
              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-bgcolor"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide whitespace-nowrap"
                  >{{ isVi ? "Màu nền" : "Background" }}</label
                >
                <div class="flex items-center gap-2">
                  <input
                    id="intro-bgcolor"
                    type="color"
                    [ngModel]="settings().bgColor"
                    (ngModelChange)="updateSetting('bgColor', $event)"
                    class="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                  />
                  <span class="text-[10px] text-neutral-300 font-mono truncate">{{
                    settings().bgColor
                  }}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-textcolor"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide whitespace-nowrap"
                  >{{ isVi ? "Màu chữ" : "Text Color" }}</label
                >
                <div class="flex items-center gap-2">
                  <input
                    id="intro-textcolor"
                    type="color"
                    [ngModel]="settings().textColor"
                    (ngModelChange)="updateSetting('textColor', $event)"
                    class="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0 flex-shrink-0"
                  />
                  <span class="text-[10px] text-neutral-300 font-mono truncate">{{
                    settings().textColor
                  }}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  for="intro-audio"
                  class="text-[10px] text-neutral-400 font-medium tracking-wide whitespace-nowrap"
                >
                  {{ isVi ? "Âm thanh" : "Audio" }}
                </label>
                <select
                  id="intro-audio"
                  [ngModel]="settings().audioType || 'none'"
                  (ngModelChange)="onAudioTypeSelected($event)"
                  class="w-full bg-neutral-950 border border-white/5 rounded block text-[11px] px-1 py-1 focus:outline-none focus:border-emerald-500/50 text-neutral-200"
                >
                  <option value="none">{{ isVi ? "Không" : "None" }}</option>
                  <option value="swoosh">Swoosh</option>
                  <option value="digital-spark">Digital Spark</option>
                  <option value="ambient-bell">Ambient Bell</option>
                  <option value="custom">
                    {{ isVi ? "Tệp riêng" : "Custom" }}
                  </option>
                </select>
              </div>
            </div>

            @if (settings().audioType === "custom") {
                @if (!settings().audioFile) {
                  <label
                    for="intro-audio-upload"
                    class="mt-2 flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-neutral-900/50 transition-colors cursor-pointer group"
                  >
                    <mat-icon
                      class="text-neutral-500 group-hover:text-emerald-400 mb-1"
                      style="font-size: 20px; width: 20px; height: 20px"
                      >upload_file</mat-icon
                    >
                    <span
                      class="text-[11px] text-neutral-400 group-hover:text-neutral-300"
                      >{{
                        isVi ? "Chọn tệp âm thanh" : "Choose audio file"
                      }}</span
                    >
                  </label>
                  <input
                    id="intro-audio-upload"
                    type="file"
                    accept="audio/*"
                    class="hidden"
                    (change)="onAudioSelected($event)"
                  />
                } @else {
                  <div
                    class="mt-2 flex items-center justify-between gap-2 bg-neutral-950 p-2 rounded border border-white/5"
                  >
                    <div class="flex items-center gap-2 overflow-hidden">
                      <mat-icon
                        class="text-emerald-500 flex-shrink-0"
                        style="font-size: 16px; width: 16px; height: 16px"
                        >music_note</mat-icon
                      >
                      <span class="text-xs text-neutral-300 truncate">{{
                        settings().audioFile!.name
                      }}</span>
                    </div>
                    <button
                      (click)="removeCustomAudio()"
                      class="text-red-400 hover:text-red-300 flex-shrink-0"
                    >
                      <mat-icon
                        style="font-size: 14px; width: 14px; height: 14px"
                        >close</mat-icon
                      >
                    </button>
                  </div>
                }
              }

              @if (settings().audioType !== "none") {
                <!-- Intro volume -->
                <div class="flex items-center gap-2 mt-2">
                  <mat-icon
                    class="text-neutral-500"
                    style="font-size: 14px; width: 14px; height: 14px"
                    >volume_up</mat-icon
                  >
                  <input
                    type="range"
                    class="flex-1"
                    min="0"
                    max="100"
                    [ngModel]="settings().audioVolume"
                    (ngModelChange)="updateSetting('audioVolume', $event)"
                  />
                  <span
                    class="text-[10px] text-neutral-400 font-mono w-6 text-right"
                    >{{ settings().audioVolume }}</span
                  >
                </div>
              }

            <button
              class="mt-2 w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 transition-colors border border-white/10 text-xs font-medium text-neutral-300 flex items-center justify-center gap-1"
              (click)="preview.emit()"
            >
              <mat-icon style="font-size: 14px; width: 14px; height: 14px"
                >play_arrow</mat-icon
              >
              {{ isVi ? "Xem trước intro" : "Preview intro" }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class IntroPanelComponent {
  lang = input<string>("en");
  settings = input.required<IntroSettings>();
  settingsChanged = output<IntroSettings>();
  preview = output<void>();
  audioGen = inject(AudioGenerator);

  expanded = signal(true);

  get isVi() {
    return this.lang() === "vi";
  }

  toggleExpanded() {
    this.expanded.update((v) => !v);
  }

  toggleFeature(enabled: boolean) {
    this.updateSetting("enabled", enabled);
    if (enabled) {
      this.expanded.set(true);
    }
  }

  updateSetting<K extends keyof IntroSettings>(key: K, value: IntroSettings[K]) {
    this.settingsChanged.emit({
      ...this.settings(),
      [key]: value,
    });
  }

  onDurationChanged(duration: number) {
    let clampedDuration = duration;
    if (typeof clampedDuration !== 'number' || isNaN(clampedDuration)) clampedDuration = 3;
    clampedDuration = Math.max(3, Math.min(7, clampedDuration));

    const st = this.settings();
    if (st.audioType && st.audioType !== "none" && st.audioType !== "custom") {
      // regenerate synthetic audio if duration changes
      this.generateAudioForType(st.audioType, clampedDuration);
    } else {
      this.updateSetting("duration", clampedDuration);
    }
  }

  async onAudioTypeSelected(type: string) {
    if (type === "none") {
      if (this.settings().audioUrl && this.settings().audioType !== "custom") {
        URL.revokeObjectURL(this.settings().audioUrl!);
      }
      this.settingsChanged.emit({
        ...this.settings(),
        audioType: "none",
        audioUrl: null,
        audioFile: null,
      });
    } else if (type === "custom") {
      this.settingsChanged.emit({
        ...this.settings(),
        audioType: "custom",
        audioUrl: null,
        audioFile: null,
      });
    } else {
      this.generateAudioForType(type as 'swoosh' | 'digital-spark' | 'ambient-bell', this.settings().duration);
    }
  }

  private async generateAudioForType(
    type: "swoosh" | "digital-spark" | "ambient-bell",
    duration: number,
  ) {
    const url = await this.audioGen.generateEffectBlobUrl(type, duration);
    this.settingsChanged.emit({
      ...this.settings(),
      audioType: type,
      audioUrl: url,
      audioFile: null,
      duration: duration,
    });
  }

  onAudioSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.settingsChanged.emit({
        ...this.settings(),
        audioType: "custom",
        audioFile: file,
        audioUrl: url,
      });
    }
    if (target) {
      target.value = "";
    }
  }

  removeCustomAudio() {
    if (this.settings().audioUrl) {
      URL.revokeObjectURL(this.settings().audioUrl!);
    }
    this.settingsChanged.emit({
      ...this.settings(),
      audioFile: null,
      audioUrl: null,
    });
  }
}
