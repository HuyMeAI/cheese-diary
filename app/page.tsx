"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// === HÀM HỖ TRỢ HIỂN THỊ LINK NHÚNG (YOUTUBE / INSTAGRAM) ===
const RenderEmbed = ({ url }: { url: string }) => {
  if (!url) return null;

  // Xử lý link YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="mt-4 rounded-2xl overflow-hidden aspect-video border-4 border-pink-50 relative shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          title="YouTube Video"
        ></iframe>
      </div>
    );
  }

  // Xử lý link Instagram
  const igMatch = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  if (igMatch && igMatch[1]) {
    return (
      <div className="mt-4 rounded-2xl overflow-hidden bg-white border-4 border-pink-50 flex justify-center shadow-sm">
        <iframe
          src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
          className="w-full max-w-[400px] h-[480px]"
          frameBorder="0"
          scrolling="no"
          allowTransparency
          title="Instagram Post"
        ></iframe>
      </div>
    );
  }

  // Nếu không nhận diện được, hiển thị dạng Link
  return (
    <a href={url} target="_blank" rel="noreferrer" className="mt-3 block text-sm text-pink-500 underline break-all">
      {url}
    </a>
  );
};

// === HIỆU ỨNG PHÔ MAI RƠI LẤT PHẤT ===
const FallingCheese = () => {
  const [cheeses, setCheeses] = useState<{id: number, left: number, animationDuration: number, delay: number, size: number}[]>([]);
  useEffect(() => {
    const newCheeses = Array.from({ length: 12 }).map((_, i) => ({
      id: i, 
      left: Math.random() * 100, 
      animationDuration: Math.random() * 6 + 6, 
      delay: Math.random() * 5, 
      size: Math.random() * 10 + 15,
    }));
    setCheeses(newCheeses);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {cheeses.map((cheese) => (
        <motion.div
          key={cheese.id}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: cheese.animationDuration, repeat: Infinity, delay: cheese.delay, ease: "linear" }}
          style={{ position: "absolute", left: `${cheese.left}%`, fontSize: `${cheese.size}px` }}
        >
          🧀
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  const [timelines, setTimelines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStory, setActiveStory] = useState<any | null>(null);
  
  // State chứa số tháng và số ngày tuổi của bé
  const [age, setAge] = useState({ months: 0, days: 0 });

  useEffect(() => {
    // 1. Tính tuổi tự động
    const calculateAge = () => {
      const dob = new Date('2025-07-06'); // Ngày sinh của bé Cheese
      const today = new Date();
      
      let months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
      let days = today.getDate() - dob.getDate();
      
      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }
      
      if (months < 0) { months = 0; days = 0; }
      setAge({ months, days });
    };
    calculateAge();

    // 2. Kéo dữ liệu từ WordPress Admin (Đã cập nhật link admin.tranlinhchi.com)
    const fetchTimelines = async () => {
      try {
        const response = await fetch("https://admin.tranlinhchi.com/wp-json/wp/v2/timeline?_embed");
        if (!response.ok) throw new Error("Lỗi kết nối API");
        const data = await response.json();
        setTimelines(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimelines();
  }, []);

  const stories = [
    { id: 1, title: "Mới sinh", icon: "👶🏻", type: "image", media: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Đầy tháng", icon: "🍼", type: "text", content: "Hôm nay Cheese tròn 1 tháng tuổi! Trộm vía con ăn ngoan ngủ ngoan." },
    { id: 3, title: "Biết lật", icon: "🐢", type: "image", media: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Mọc răng", icon: "🦷", type: "text", content: "Chiếc răng xinh đầu tiên của con đã nhú lên rồi." },
    { id: 5, title: "Ăn dặm", icon: "🥣", type: "image", media: "https://images.unsplash.com/photo-1608107386001-c116c49c719e?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDE7] via-[#FFF5F8] to-[#FFE4E1] text-gray-700 relative overflow-hidden pb-20">
      <FallingCheese />

      {/* === MODAL POP-UP STORY TOÀN MÀN HÌNH === */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <button onClick={() => setActiveStory(null)} className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm aspect-[9/16] bg-gradient-to-b from-pink-200 to-yellow-200 rounded-3xl overflow-hidden relative flex flex-col"
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10 bg-black/30 px-3 py-1 rounded-full text-white text-sm font-bold backdrop-blur-sm">
                <span>{activeStory.icon}</span> {activeStory.title}
              </div>
              {activeStory.type === "image" && <img src={activeStory.media} alt={activeStory.title} className="w-full h-full object-cover" />}
              {activeStory.type === "text" && (
                <div className="flex-1 flex items-center justify-center p-8 text-center bg-white/80 backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-pink-500">{activeStory.content}</h2>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOX CHÍNH CỦA TRANG WEB === */}
      <main className="max-w-md mx-auto relative z-10 bg-white/50 backdrop-blur-sm min-h-screen shadow-2xl shadow-pink-100/50 border-x border-white/60">
        
        {/* HEADER: ẢNH BÌA, AVATAR, BỘ ĐẾM TUỔI */}
        <header className="border-b-[3px] border-pink-100 border-dotted flex flex-col items-center pb-6">
          
          <div className="w-full h-36 bg-pink-100 relative">
            <img 
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80" 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
          </div>

          <div className="relative -mt-16 p-1.5 rounded-full bg-gradient-to-tr from-yellow-300 via-pink-300 to-pink-400 mb-3 shadow-lg z-10">
            <div className="w-[110px] h-[110px] bg-white rounded-full p-1">
              <div className="w-full h-full bg-pink-50 rounded-full flex items-center justify-center text-4xl overflow-hidden">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Cheese&backgroundColor=ffd5dc" alt="Avatar của Cheese" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-sm border border-pink-100 text-sm">🧀</div>
          </div>
          
          <h1 className="text-[26px] font-bold text-pink-500 mb-1 leading-tight text-center px-4">Trần Linh Chi</h1>
          <p className="text-xs font-bold text-yellow-600 mb-5 tracking-wide text-center">@cheese.diary</p>
          
          {/* BỘ ĐẾM TUỔI */}
          <div className="flex justify-center items-center gap-3 mb-6 px-4">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-yellow-100 flex flex-col items-center min-w-[75px]">
              <span className="text-xl font-black text-yellow-500">{age.months}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Tháng</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-pink-100 flex flex-col items-center min-w-[75px]">
              <span className="text-xl font-black text-pink-500">{age.days}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Ngày</span>
            </div>
            <div className="bg-pink-100 px-4 py-2 rounded-2xl shadow-sm border-2 border-pink-200 flex flex-col items-center min-w-[75px]">
              <span className="text-xl font-black text-pink-600">👼🏻</span>
              <span className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">Tuổi</span>
            </div>
          </div>

          <div className="px-5 w-full mb-6">
            <div className="text-sm font-medium text-gray-700 leading-relaxed bg-white/70 p-4 rounded-2xl border border-white shadow-sm text-center">
              🎀 Thiên thần nhỏ của bố mẹ.<br/>
              🧸 Nơi lưu giữ những khoảnh khắc ngọt ngào như phô mai của con mỗi ngày.
            </div>
          </div>

          {/* CÁC NÚT MẠNG XÃ HỘI */}
          <div className="flex gap-3 w-full px-5">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-pink-600 py-2.5 rounded-xl font-bold text-sm hover:opacity-80 transition shadow-sm border border-pink-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              Instagram
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><path d="m9 9 12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              TikTok
            </button>
            <button className="w-14 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition shadow-sm border border-red-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </button>
          </div>
        </header>

        {/* HIGHLIGHT STORIES */}
        <section className="py-6 border-b-[3px] border-pink-100 border-dotted">
          <div className="flex overflow-x-auto gap-5 px-5 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stories.map((story) => (
              <div key={story.id} onClick={() => setActiveStory(story)} className="flex flex-col items-center gap-2 snap-start cursor-pointer group min-w-[70px]">
                <div className="p-[3px] rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 group-hover:from-pink-400 group-hover:to-yellow-400 transition-all duration-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl border-[3px] border-white shadow-sm transform group-hover:scale-95 transition-transform">
                    {story.icon}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-pink-500 transition-colors text-center w-full">{story.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE RENDER DỮ LIỆU */}
        <section className="relative px-5 pt-8 pb-12">
          <div className="absolute left-[36px] top-8 bottom-0 w-8 z-0 opacity-60"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='60' viewBox='0 0 20 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0 C 20 15, 0 30, 10 45 C 20 60, 0 75, 10 90' fill='transparent' stroke='%23FBCFE8' stroke-width='4' stroke-dasharray='4 4' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-y'
            }}
          ></div>

          {isLoading ? (
            <div className="text-center py-10 text-pink-400 font-bold animate-pulse">
              Đang lấy nhật ký của Cheese... 🧀
            </div>
          ) : timelines.length === 0 ? (
             <div className="text-center py-10 text-gray-500 font-medium bg-white/50 rounded-2xl border border-white">
               Bố mẹ chưa đăng bài viết nào cả!
             </div>
          ) : (
            timelines.map((post: any, index: number) => {
              const embedLink = post.acf?.link_nhung_video || post.acf?.link_nhung; 
              const dateObj = new Date(post.date);
              const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
              const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

              const dotColor = index % 2 === 0 ? 'bg-yellow-300' : 'bg-pink-300';
              const cardBg = index % 2 === 0 ? 'bg-white/95' : 'bg-gradient-to-br from-[#FFF5F8] to-white';

              return (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 80, scale: 0.95 }} 
                  whileInView={{ opacity: 1, y: 0, scale: 1 }} 
                  viewport={{ once: true, margin: "-15%" }} 
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative pl-12 mb-10"
                >
                  <div className={`absolute left-[8px] top-4 w-6 h-6 ${dotColor} border-[3px] border-white shadow-md rounded-full z-10`}></div>
                  
                  <div className={`${cardBg} backdrop-blur-md p-5 rounded-[24px_24px_24px_8px] shadow-[0_4px_20px_-5px_rgba(251,113,133,0.15)] border border-white/80`}>
                    <span className="text-[11px] font-bold text-pink-500 bg-pink-100/80 px-3 py-1.5 rounded-full mb-3 inline-block shadow-sm">
                      {formattedDate}
                    </span>
                    
                    <h3 className="font-bold text-[19px] text-gray-800 mb-2 leading-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <div 
                      className="text-[15px] text-gray-600 leading-relaxed [&>p]:mb-2"
                      dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />

                    {featuredImage && (
                      <div className="mt-4 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                        <img src={featuredImage} alt={post.title.rendered} className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {embedLink && <RenderEmbed url={embedLink} />}
                  </div>
                </motion.div>
              )
            })
          )}
        </section>
      </main>
    </div>
  );
}