"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Play, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Import Swiper styles
import "swiper/css";

interface VideoReview {
  id: number;
  title: string;
  video_url?: string;
  videoSrc?: string;
  thumbnail_url?: string;
  product_name?: string;
  product_id?: number | null;
}

export default function VideoReviewSlider() {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const tikTokConfig = {
    tiktok: {
      volume_control: false,
      fullscreen_button: true,
      progress_bar: true,
      play_button: true,
      timestamp: true,
      music_info: false,
      description: false,
      rel: false,
      native_context_menu: true,
      closed_caption: false,
    },
  };

  const playAllVideos = (swiper: any) => {
    if (!swiper || !swiper.el) return;
    const videos = swiper.el.querySelectorAll("video");
    videos.forEach((video: HTMLVideoElement) => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      setLoading(true);

      const checkConnection = () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        return !!(url && key && !url.includes("placeholder-url"));
      };

       if (!checkConnection()) {
         const saved = localStorage.getItem("yuna_admin_videos");
         if (saved && saved !== "undefined" && saved !== "null") {
           try {
             const parsed = JSON.parse(saved);
             if (isMounted) setReviews(Array.isArray(parsed) ? parsed : []);
           } catch {
             if (isMounted) setReviews([]);
           }
         } else {
           if (isMounted) setReviews([]);
         }
         if (isMounted) setLoading(false);
         return;
       }

       try {
         const tables = ["reviews_videos", "videos"];
         let data: any[] = [];
         let lastError: any = null;

         for (const table of tables) {
           try {
             const { data: rows, error } = await supabase
               .from(table)
               .select("*")
               .order("id", { ascending: true });
             
             // Handle both error and successful response
             if (error) {
               console.warn(`Table ${table} error:`, error.message);
               lastError = error;
               // Continue to next table if this one fails
               continue;
             }

             if (rows && Array.isArray(rows) && rows.length > 0) {
               data = rows;
               lastError = null;
               break; // Successfully got data, break out of loop
             }
           } catch (tableError) {
             console.warn(`Exception loading ${table}:`, tableError);
             lastError = tableError;
             // Continue to next table
             continue;
           }
         }

         // Map data safely, handle empty or undefined data
         if (isMounted) {
           const mapped = (data || [])
             .filter((item) => item && typeof item === 'object') // Filter out invalid items
             .map((item) => ({
               id: item.id || Math.random(),
               title: item.title || item.name || "Video review Yuna",
               videoSrc: item.video_url || item.url || item.link || "",
               thumbnail_url: item.thumbnail_url || item.thumbnail || "",
               product_name: item.product_name || item.product || "",
             }));
           setReviews(mapped);
         }
       } catch (err) {
         console.warn("Lỗi tải video review từ Supabase:", err);
         // Fallback: try to load from localStorage
         const saved = localStorage.getItem("yuna_admin_videos");
         if (saved) {
           try {
             const parsed = JSON.parse(saved);
             if (isMounted) {
               setReviews(Array.isArray(parsed) ? parsed : []);
             }
           } catch (parseErr) {
             console.warn("Error parsing saved videos:", parseErr);
             // Last resort: set empty array
             if (isMounted) setReviews([]);
           }
         } else {
           // No saved data, set empty array
           if (isMounted) setReviews([]);
         }
       } finally {
         if (isMounted) setLoading(false);
       }
    };

    loadVideos();

    const channel = supabase
      .channel("home-videos-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews_videos" }, () => loadVideos())
      .on("postgres_changes", { event: "*", schema: "public", table: "videos" }, () => loadVideos())
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="w-full py-8 font-sans">
      {/* Title Section */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight relative pb-3 text-center">
          VIDEO REVIEW THỰC TẾ
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#6B8E23] rounded-full" />
        </h2>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Trải nghiệm thực tế sản phẩm từ khách hàng và các reviewer uy tín
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative px-4 md:px-12 overflow-hidden">
        {/* Force Swiper wrapper to use linear transition timing for continuous smooth marquee effect */}
        <style dangerouslySetInnerHTML={{ __html: `
          .marquee-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}} />
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={6000}
          allowTouchMove={true}
          wrapperClass="swiper-wrapper ease-linear"
          onInit={playAllVideos}
          onSlideChange={playAllVideos}
          onUpdate={playAllVideos}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="marquee-swiper w-full pb-6"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`}>
                <div className="animate-pulse rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
                  <div className="aspect-16/10 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            reviews.map((video) => (
              <SwiperSlide key={video.id}>
                <div
                  onClick={() => setActiveVideoUrl(video.videoSrc || video.video_url || "")}
                  className="cursor-pointer group/card flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {/* Video Section */}
                  <div className="relative aspect-[9/16] md:aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-[#0f172a]">
                    <ReactPlayer
                      src={video.videoSrc || video.video_url || ""}
                      width="100%"
                      height="100%"
                      controls={false}
                      light={video.thumbnail_url || true}
                      muted
                      playing={false}
                      playsInline
                      className="!absolute inset-0"
                      config={tikTokConfig}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover/card:bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-black/45 border border-white/80 shadow-lg backdrop-blur-sm flex items-center justify-center text-white transition-transform duration-300 group-hover/card:scale-105">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>
                  </div>

                {/* Video Title Section */}
                <div className="p-4 md:p-5 bg-white flex flex-col flex-1 justify-center min-h-[72px] border-t border-gray-50">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 tracking-wide line-clamp-2 uppercase group-hover/card:text-[#6B8E23] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  {video.product_name ? (
                    <p className="mt-1 text-[11px] text-gray-500">Sản phẩm: {video.product_name}</p>
                  ) : null}
                </div>
              </div>
            </SwiperSlide>
            ))
          )}
        </Swiper>


      </div>

      {/* Video Modal Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black">
              <ReactPlayer
                src={activeVideoUrl}
                controls
                width="100%"
                height="100%"
                light={false}
                playing
                playsInline
                className="absolute inset-0"
                config={tikTokConfig}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
