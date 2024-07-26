// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./QuickLinkSwiper.css";
import { links } from "./quick_links.json";
import styles from "./QuickLink.module.css";
export default function QuickLink() {
  return (
    <div>
      <Swiper
        modules={[Navigation, A11y, Pagination, Scrollbar]}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        className="imgSwiper"
      >
        {links.map((link) => (
          <SwiperSlide>
            <div className={styles.imgWrap}>
              <a href={link.url}>
                <div
                  className={styles.swiperImg}
                  style={{ backgroundImage: `url(${link.img})` }}
                ></div>
              </a>
            </div>
            <div style={{ fontWeight: "600" }}>{link.name}</div>
            <div>{link.description}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
