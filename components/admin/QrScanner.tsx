"use client";

import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

// Le QR des billets contient une URL du type /admin/scan?t=<token>.
function extractTicketToken(data: string): string | null {
  try {
    return new URL(data).searchParams.get("t");
  } catch {
    return null;
  }
}

const QrScanner = ({
  onDetected,
  onClose,
}: {
  onDetected: (ticketToken: string) => void;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [invalidQr, setInvalidQr] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let frameId = 0;
    let stopped = false;

    const scanFrame = () => {
      if (stopped) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(image.data, image.width, image.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            const token = extractTicketToken(code.data);
            if (token) {
              stopped = true;
              onDetected(token);
              return;
            }
            setInvalidQr(true);
          }
        }
      }

      frameId = requestAnimationFrame(scanFrame);
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (stopped || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        frameId = requestAnimationFrame(scanFrame);
      } catch {
        setError(
          "Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur."
        );
      }
    };

    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Scanner un billet
        </h2>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video
              ref={videoRef}
              className="aspect-square w-full object-cover"
              playsInline
              muted
            />
            <div className="pointer-events-none absolute inset-10 rounded-xl border-4 border-white/80" />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <p className="mt-3 text-center text-sm text-slate-500">
          {invalidQr
            ? "Ce QR code n'est pas un billet de la chorale."
            : "Placez le QR code du billet dans le cadre."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
