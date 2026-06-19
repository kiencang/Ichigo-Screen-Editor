import { Injectable, signal, computed, inject } from "@angular/core";
import { Stroke, drawStrokesOnContext } from "./stroke.types";
import { drawIntroOnContext } from "./intro-drawer";
import { EditorStateService } from "../core/editor-state.service";
import { VideoSegments } from "../segments/video-segments";

import { IntroSettings } from "../intro/intro.types";

@Injectable({
  providedIn: "root",
})
export class CanvasDrawer {
  private editorState = inject(EditorStateService);
  private videoSegmentsService = inject(VideoSegments);

  private get width() {
    return this.editorState.videoWidth();
  }
  private get height() {
    return this.editorState.videoHeight();
  }
  private get time() {
    return this.editorState.currentTime();
  }
  private get duration() {
    return this.videoSegmentsService.videoDuration();
  }

  currentTool = signal<
    "pointer" | "pen" | "arrow" | "rect" | "circle" | "line" | "text"
  >("pointer");
  color = signal<string>("#ef4444"); // Tailwind red-500
  strokes = signal<Stroke[]>([]);
  activeStrokeId = signal<string | null>(null);

  currentActiveStroke = computed(() => {
    const id = this.activeStrokeId();
    if (!id) return null;
    return this.strokes().find((s) => s.id === id) || null;
  });

  ctx: CanvasRenderingContext2D | null = null;
  canvasEl: HTMLCanvasElement | null = null;

  private isPointerDown = false;
  private lastPos = { x: 0, y: 0 };
  private startPos = { x: 0, y: 0 };
  private activeStroke: Stroke | null = null;

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvasEl = canvas;
    this.ctx = ctx;
  }

  getMousePos(
    canvas: HTMLCanvasElement,
    e: MouseEvent | TouchEvent,
  ): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  redrawCanvas(intro?: { active: boolean; settings: IntroSettings; elapsed: number }) {
    if (!this.ctx || !this.canvasEl) return;
    const canvas = this.canvasEl;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (intro && intro.active) {
      drawIntroOnContext(
        this.ctx,
        intro.settings,
        intro.elapsed,
        canvas.width,
        canvas.height,
      );
    } else {
      drawStrokesOnContext(
        this.ctx,
        this.strokes(),
        this.time,
        canvas.width,
        canvas.height,
        this.width,
        this.height,
      );
    }
  }

  onPointerDown(e: MouseEvent | TouchEvent) {
    if (this.currentTool() === "pointer" || !this.ctx || !this.canvasEl) return;
    this.isPointerDown = true;
    const pos = this.getMousePos(this.canvasEl, e);
    this.startPos = pos;
    this.lastPos = pos;

    // Create new active stroke
    const strokeId =
      "stroke_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const tool = this.currentTool();
    this.activeStroke = {
      id: strokeId,
      type: tool as "pen" | "arrow" | "rect" | "circle" | "line" | "text",
      points: [pos],
      startPos: pos,
      endPos: pos,
      color: this.color(),
      lineWidth: Math.max(5, this.width * 0.005),
      startTime: this.time,
      duration: 3.0, // default 3s as requested
      text: tool === "text" ? "Văn bản / Text" : undefined,
      fontSize: tool === "text" ? 24 : undefined,
    };

    // Auto select this keyframe
    this.activeStrokeId.set(strokeId);
  }

  onPointerMove(e: MouseEvent | TouchEvent) {
    if (
      !this.isPointerDown ||
      !this.ctx ||
      this.currentTool() === "pointer" ||
      !this.activeStroke ||
      !this.canvasEl
    )
      return;

    const pos = this.getMousePos(this.canvasEl, e);

    if (this.activeStroke.type === "pen") {
      this.activeStroke.points.push(pos);
    } else {
      this.activeStroke.endPos = pos;
    }

    // Live composition render inside drawing phase:
    // 1. Draw already completed strokes
    this.redrawCanvas();

    // 2. Overlay current active live stroke
    const canvas = this.canvasEl;
    drawStrokesOnContext(
      this.ctx,
      [this.activeStroke],
      this.time,
      canvas.width,
      canvas.height,
      this.width,
      this.height,
    );
  }

  onPointerUp() {
    if (this.isPointerDown && this.activeStroke) {
      this.strokes.update((s) => [...s, this.activeStroke!]);
      this.activeStroke = null;
      this.redrawCanvas();
    }
    this.isPointerDown = false;
  }

  clearCanvas() {
    this.strokes.set([]);
    this.activeStrokeId.set(null);
    if (this.ctx && this.canvasEl) {
      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
  }

  deleteStroke(id: string) {
    this.strokes.update((all) => all.filter((s) => s.id !== id));
    if (this.activeStrokeId() === id) {
      this.activeStrokeId.set(null);
    }
    this.redrawCanvas();
  }

  updateStrokeStartTime(id: string, newTime: number) {
    const validTime = Math.max(0, Math.min(this.duration, Number(newTime)));
    this.strokes.update((all) =>
      all.map((s) => (s.id === id ? { ...s, startTime: validTime } : s)),
    );
    this.redrawCanvas();
  }

  updateStrokeDuration(id: string, newDuration: number) {
    const validDur = Math.max(0.1, Number(newDuration));
    this.strokes.update((all) =>
      all.map((s) => (s.id === id ? { ...s, duration: validDur } : s)),
    );
    this.redrawCanvas();
  }

  updateStrokeText(id: string, newText: string) {
    this.strokes.update((all) =>
      all.map((s) => (s.id === id ? { ...s, text: newText } : s)),
    );
    this.redrawCanvas();
  }

  updateStrokeFontSize(id: string, newFontSize: number) {
    const validSize = Math.max(6, Math.min(120, Number(newFontSize)));
    this.strokes.update((all) =>
      all.map((s) => (s.id === id ? { ...s, fontSize: validSize } : s)),
    );
    this.redrawCanvas();
  }
}
