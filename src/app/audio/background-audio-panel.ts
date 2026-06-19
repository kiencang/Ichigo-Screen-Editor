import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AudioTrack } from './background-audio';
import { AppTranslations } from '../core/translations';

@Component({
  selector: 'app-background-audio-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <!-- Background Audio Tracks -->
    <div class="p-4 rounded-2xl bg-neutral-900 border border-white/5 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-neutral-400">{{ translations().bgAudioTrack }}</span>
          <label for="bg-audio-upload" class="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-xs font-medium border border-white/10 cursor-pointer transition-colors text-neutral-300 flex items-center gap-1">
             <mat-icon style="font-size: 14px; width: 14px; height: 14px;">add</mat-icon>
             {{ translations().addBgAudio }}
          </label>
          <input id="bg-audio-upload" type="file" accept="audio/*" multiple class="hidden" (change)="onAudioSelected($event)">
        </div>
        
        @if (audioTracks().length > 0) {
          <div class="flex flex-col gap-3">
             @for (track of audioTracks(); track track.id; let idx = $index) {
                <div class="flex flex-col gap-2 p-2 rounded-xl bg-neutral-950/50 border-2 transition-colors border-emerald-500/20 hover:border-emerald-500/50"
                     [class.!border-emerald-500]="dragOverTrackIndex() === idx"
                     [class.opacity-50]="draggedTrackIndex() === idx"
                     (dragover)="onDragOver($event, idx)"
                     (drop)="onDrop($event, idx)">
                   <div class="flex items-center justify-between group">
                       <div class="flex items-center gap-2 overflow-hidden flex-1 cursor-grab active:cursor-grabbing relative py-1 rounded-lg hover:bg-neutral-900/50 transition-colors"
                            draggable="true" 
                            (dragstart)="onDragStart(idx)"
                            (dragend)="onDragEnd()">
                          <!-- Vertical indicator line for dragging -->
                          <div class="absolute left-0 inset-y-0 w-1 bg-emerald-500/30 group-hover:bg-emerald-500/70 rounded-full transition-colors pointer-events-none"></div>
                          <span class="text-[10px] bg-neutral-900 border border-emerald-500/20 text-neutral-400 font-mono px-1.5 py-0.5 rounded flex items-center justify-center ml-2">{{ idx + 1 }}</span>
                          <mat-icon class="text-emerald-500/70" style="font-size: 16px; width: 16px; height: 16px;">drag_indicator</mat-icon>
                          <span class="text-xs text-neutral-300 truncate font-medium">{{ track.file.name }}</span>
                          <span class="text-[10px] bg-neutral-900 border border-emerald-500/20 text-neutral-400 font-mono px-1.5 py-0.5 rounded">{{ formatTimeShort(track.duration) }}</span>
                       </div>
                       <div class="flex items-center gap-1 ml-2">
                          <button (click)="removeTrack.emit(track.id)" class="text-neutral-500 hover:text-red-400 bg-neutral-900 hover:bg-red-500/10 p-1 rounded-lg border border-white/5 cursor-pointer">
                             <mat-icon style="font-size: 14px; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">close</mat-icon>
                          </button>
                       </div>
                   </div>
                   <div class="flex flex-col gap-1.5 pl-[42px] pr-8 text-neutral-500">
                     
                     <!-- Volume -->
                     <div class="flex items-center gap-2">
                       <mat-icon style="font-size: 12px; width: 12px; height: 12px;">volume_up</mat-icon>
                       <input type="range" 
                              [ngModel]="track.volume" 
                              (ngModelChange)="onVolumeChange(track.id, $event)" 
                              min="0" 
                              max="100" 
                              class="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500">
                       <span class="text-[10px] w-6 text-right">{{ track.volume }}%</span>
                     </div>
                     
                     <!-- Trim Section -->
                     <div class="flex items-center gap-2 relative mt-2 mb-1">
                       <mat-icon style="font-size: 12px; width: 12px; height: 12px;">content_cut</mat-icon>
                       <div class="relative w-full h-8 bg-neutral-900 border border-white/5 rounded-lg overflow-hidden group">
                           <!-- Waveform inside -->
                           <div class="absolute inset-0 flex items-center justify-between px-1 gap-[1px] opacity-100 z-0 pointer-events-none">
                             @for (amp of track.waveform; track $index) {
                               <div [style.height.%]="amp * 100" 
                                    class="flex-1 min-w-[1px] max-w-[3px] rounded-full transition-all duration-300 bg-emerald-500/80 group-hover:bg-emerald-400">
                               </div>
                             }
                           </div>

                           <!-- Inactive/Trimmed Out start area (grayed out) -->
                           <div class="absolute top-0 bottom-0 left-0 bg-neutral-950/80 border-r border-white/5 pointer-events-none z-10"
                                [style.width.%]="(track.trimStart / track.duration) * 100">
                           </div>

                           <!-- Active (Trimmed in) Highlighted Zone -->
                           <div class="absolute top-0 bottom-0 bg-emerald-500/10 border-y border-emerald-500/30 pointer-events-none z-10"
                                [style.left.%]="(track.trimStart / track.duration) * 100"
                                [style.width.%]="((track.trimEnd - track.trimStart) / track.duration) * 100">
                           </div>

                           <!-- Inactive/Trimmed Out end area (grayed out) -->
                           <div class="absolute top-0 bottom-0 right-0 bg-neutral-950/80 border-l border-white/5 pointer-events-none z-10"
                                [style.left.%]="(track.trimEnd / track.duration) * 100"
                                [style.right.%]="0">
                           </div>
                           
                           @if (playingTrackId() === track.id) {
                             <!-- Playhead for isolated preview -->
                             <div class="absolute top-0 bottom-0 w-[2px] bg-yellow-400 z-30 pointer-events-none shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                                  [style.left.%]="(isolatedPreviewTime() / track.duration) * 100">
                             </div>
                           }

                           <!-- Inputs for trimming -->
                           <input type="range" [min]="0" [max]="track.duration" step="0.1" 
                                  [ngModel]="track.trimStart" 
                                  (ngModelChange)="onTrimStartChange(track.id, $event)"
                                  class="trim-slider">
                           
                           <input type="range" [min]="0" [max]="track.duration" step="0.1" 
                                  [ngModel]="track.trimEnd" 
                                  (ngModelChange)="onTrimEndChange(track.id, $event)"
                                  class="trim-slider">
                        </div>
                        <span class="text-[10px] font-mono whitespace-nowrap">{{ formatTimeShort(track.trimEnd - track.trimStart) }}</span>
                      </div>
                      
                      <!-- Play Control Below Waveform -->
                      <div class="flex justify-center mt-1">
                        <button (click)="previewSpecificTrack.emit(track.id)" class="text-emerald-500 hover:text-emerald-400 bg-neutral-900 hover:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 cursor-pointer flex items-center gap-1 transition-colors">
                           <mat-icon style="font-size: 16px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                              {{ playingTrackId() === track.id ? 'stop' : 'play_arrow' }}
                           </mat-icon>
                           <span class="text-xs font-medium">{{ playingTrackId() === track.id ? (lang() === 'vi' ? 'Dừng phát' : 'Stop') : (lang() === 'vi' ? 'Nghe thử' : 'Play') }}</span>
                        </button>
                      </div>
                      
                   </div>
                </div>
             }
          </div>
        }
    </div>
  `,
  styles: [`
    .trim-slider {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: transparent;
      pointer-events: none;
      appearance: none;
      -webkit-appearance: none;
      margin: 0;
      outline: none;
      z-index: 20;
    }
    
    /* Webkit (Chrome, Safari, Edge) */
    .trim-slider::-webkit-slider-thumb {
      pointer-events: auto !important;
      cursor: col-resize !important;
      width: 8px !important;
      height: 32px !important;
      border-radius: 4px !important;
      background-color: #10b981 !important; /* emerald-500 */
      border: 1px solid #ffffff !important;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5) !important;
      appearance: none !important;
      -webkit-appearance: none !important;
    }

    .trim-slider::-webkit-slider-thumb:hover {
      background-color: #34d399 !important; /* emerald-400 */
    }

    /* Firefox */
    .trim-slider::-moz-range-thumb {
      pointer-events: auto !important;
      cursor: col-resize !important;
      width: 8px !important;
      height: 32px !important;
      border-radius: 4px !important;
      background-color: #10b981 !important;
      border: 1px solid #ffffff !important;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5) !important;
      appearance: none !important;
    }

    .trim-slider::-moz-range-thumb:hover {
      background-color: #34d399 !important;
    }

    /* Remove native tracks so they don't block layered clicks */
    .trim-slider::-webkit-slider-runnable-track {
      background: transparent !important;
      border: none !important;
    }
    .trim-slider::-moz-range-track {
      background: transparent !important;
      border: none !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundAudioPanel {
  lang = input<string>('vi');
  translations = input.required<AppTranslations>();
  audioTracks = input.required<AudioTrack[]>();
  playingTrackId = input<string | null>(null);
  isolatedPreviewTime = input<number>(0);

  // Outputs
  audioSelected = output<Event>();
  removeTrack = output<string>();
  trackVolumeChanged = output<{ id: string; volume: number }>();
  trackTrimStartChanged = output<{ id: string; value: number }>();
  trackTrimEndChanged = output<{ id: string; value: number }>();
  previewSpecificTrack = output<string>();
  audioTracksReordered = output<{ draggedIndex: number; targetIndex: number }>();

  // Internal drag state
  draggedTrackIndex = signal<number | null>(null);
  dragOverTrackIndex = signal<number | null>(null);

  onAudioSelected(event: Event) {
    this.audioSelected.emit(event);
  }

  onVolumeChange(id: string, value: string | number) {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(val)) {
      this.trackVolumeChanged.emit({ id, volume: val });
    }
  }

  onTrimStartChange(id: string, value: string | number) {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(val)) {
      this.trackTrimStartChanged.emit({ id, value: val });
    }
  }

  onTrimEndChange(id: string, value: string | number) {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(val)) {
      this.trackTrimEndChanged.emit({ id, value: val });
    }
  }

  onDragStart(index: number) {
    this.draggedTrackIndex.set(index);
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.dragOverTrackIndex.set(index);
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const draggedIdx = this.draggedTrackIndex();
    if (draggedIdx !== null && draggedIdx !== index) {
      this.audioTracksReordered.emit({ draggedIndex: draggedIdx, targetIndex: index });
    }
    this.draggedTrackIndex.set(null);
    this.dragOverTrackIndex.set(null);
  }

  onDragEnd() {
    this.draggedTrackIndex.set(null);
    this.dragOverTrackIndex.set(null);
  }

  formatTimeShort(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
